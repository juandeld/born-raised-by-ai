-- Lumen Labs / calls engine: initial schema.
-- Access: service role only (server-side). RLS is enabled with no policies, so anon/authenticated
-- keys cannot read or write anything. Never expose the service key to the browser.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- orders
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  access_token     text not null unique,
  product          text not null,
  variant          text not null check (variant in ('single','bundle')),
  calls_included   int  not null default 1,
  country          text not null check (country in ('US','ES','GB','MX')),
  locale           text not null,                       -- es-419 | es-ES | en-US | en-GB (prelude locale)
  language         text not null,                       -- route language: es-419 | es-ES | en
  currency         text not null,
  amount_minor     int  not null,
  amount_usd_cents int  not null,
  status           text not null default 'created'
                   check (status in ('created','paid','scheduled','calling','completed','delivered','refunded','cancelled','failed','purged')),
  -- personal data: scrubbed by the retention job (pii_purged_at)
  email            text,
  phone_e164       text,
  phone_e164_hash  text,
  child_first_name text,
  child_age        int,
  details          text,
  consent_draft    jsonb,                               -- checkbox ids + server time + ip, until payment is confirmed
  -- scheduling
  timezone         text not null,
  window_start     timestamptz not null,
  window_end       timestamptz not null,
  -- payment
  payment_provider text,
  checkout_id      text,
  payment_id       text,
  test_mode        boolean not null default false,
  -- attribution (no personal data)
  creative         text not null default 'none',
  device           text not null default 'unknown',
  -- lifecycle
  created_at       timestamptz not null default now(),
  paid_at          timestamptz,
  delivered_at     timestamptz,
  refunded_at      timestamptz,
  refund_reason    text,
  refund_amount_minor int,
  purge_at         timestamptz,                         -- personal data deleted after this moment
  pii_purged_at    timestamptz
);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_purge_idx on orders (purge_at) where pii_purged_at is null;

-- -------------------------------------------------------------- consents
-- One row per checked box. Created by the server when the payment is confirmed. Kept 4 years (D8).
create table if not exists consents (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null,                       -- no FK on purpose: survives order cleanup
  payment_id       text,
  checkbox_id      text not null,                       -- C1..C6
  text_version_id  text not null,                       -- e.g. 02-C4-es-419-legal-v1
  text_sha256      text not null,
  locale           text not null,
  accepted_at      timestamptz not null,
  ip               text,
  phone_e164_hash  text not null,
  window_start     timestamptz,
  window_end       timestamptz,
  product_slug     text not null,
  purge_at         timestamptz not null
);
create index if not exists consents_order_idx on consents (order_id);
create index if not exists consents_purge_idx on consents (purge_at);

-- ------------------------------------------------------ suppression list
-- Do-not-call list: no expiry (only used to avoid calling again).
create table if not exists suppression_list (
  phone_e164_hash  text primary key,
  created_at       timestamptz not null default now(),
  source           text not null                        -- key2 | email | support
);

-- ----------------------------------------------------------------- calls
-- One row per attempt. No content (guardrail A-12): ids, results, durations, incidents.
create table if not exists calls (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null,
  attempt          int  not null,
  status           text not null default 'dialing'
                   check (status in ('dialing','prelude','in_progress','ended')),
  result           text check (result in ('completed','voicemail','no_key','opted_out','no_answer','busy','failed','technical','handoff_timeout','blocked')),
  telephony_provider text not null,
  voice_provider   text not null,
  provider_call_id text,
  conversation_id  text,
  recording_id     text,
  recording_path   text,                                -- private storage path of the MP3
  prelude_version  text not null,                       -- e.g. 03-SANTA-es-419-legal-v1
  state            jsonb not null default '{}'::jsonb,  -- prelude state machine
  key1_at          timestamptz,                         -- first key 1 (recording starts here)
  key2_at          timestamptz,                         -- second key 1 (character speaks)
  incidents        jsonb not null default '[]'::jsonb,  -- [{type, at}]
  scheduled_for    timestamptz,
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  telephony_seconds int not null default 0,
  agent_seconds    int not null default 0,
  recording_purge_at timestamptz
);
create index if not exists calls_order_idx on calls (order_id);
create index if not exists calls_active_idx on calls (status) where status <> 'ended';
create index if not exists calls_purge_idx on calls (recording_purge_at) where recording_path is not null;

-- ------------------------------------------------------------ deliveries
create table if not exists deliveries (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null,
  kind             text not null,                       -- receipt | reminder | delivery | delayed | refund | incident
  channel          text not null check (channel in ('email','whatsapp','web')),
  status           text not null check (status in ('sent','failed','stub')),
  provider         text not null,
  provider_id      text,
  mp3_path         text,
  pdf_path         text,
  link_expires_at  timestamptz,
  survey_answer    text check (survey_answer in ('loved','ok','bad')),
  survey_at        timestamptz,
  sent_at          timestamptz not null default now(),
  purge_at         timestamptz not null                 -- 13 months (D8)
);
create index if not exists deliveries_order_idx on deliveries (order_id);

-- ---------------------------------------------------------------- events
-- Analytics source of truth for `npm run costs`. No personal data.
create table if not exists events (
  id               bigint generated always as identity primary key,
  name             text not null,
  ts               timestamptz not null default now(),
  order_id         uuid,
  product          text not null,
  country          text not null,
  language         text not null,
  creative         text not null,
  device           text not null,
  test_mode        boolean not null default false,
  properties       jsonb not null default '{}'::jsonb
);
create index if not exists events_name_ts_idx on events (name, ts);
create index if not exists events_order_idx on events (order_id);

-- ------------------------------------------------------ concurrency gate
-- Atomically reserve a call slot. Returns true when fewer than p_max calls are active.
-- Calls stuck in an active status for > 15 minutes stop counting (crash safety).
create or replace function reserve_call_slot(p_call_id uuid, p_max int)
returns boolean language plpgsql as $$
declare active int;
begin
  perform pg_advisory_xact_lock(7001);
  select count(*) into active from calls
   where status in ('prelude','in_progress') and id <> p_call_id
     and started_at > now() - interval '15 minutes';
  if active >= p_max then
    return false;
  end if;
  update calls set status = 'prelude' where id = p_call_id and status = 'dialing';
  return true;
end $$;

-- -------------------------------------------------------------------- RLS
alter table orders           enable row level security;
alter table consents         enable row level security;
alter table suppression_list enable row level security;
alter table calls            enable row level security;
alter table deliveries       enable row level security;
alter table events           enable row level security;

-- Private storage bucket for MP3 and PDF (create in the Supabase dashboard or via API):
--   bucket "deliveries", public = false. Objects are served only through short-lived signed URLs.
