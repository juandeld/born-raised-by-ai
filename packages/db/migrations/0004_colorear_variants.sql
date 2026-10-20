-- Colorear: Trio (bundle3), "otra aventura" (add1) and free Trio credits (credit) are orders too.
-- A child order points to the order whose character drawings it reuses.
alter table orders drop constraint if exists orders_variant_check;
alter table orders add constraint orders_variant_check check (variant in ('single','bundle','bundle3','add1','credit'));
alter table orders add column if not exists parent_order_id uuid references orders(id) on delete set null;
create index if not exists orders_parent_idx on orders (parent_order_id) where parent_order_id is not null;
-- One Trio credit per slot: two simultaneous clicks cannot create the same adventure twice (checkout_id = 'credit:<parent>:<slot>').
create unique index if not exists orders_credit_slot_uq on orders (checkout_id) where variant = 'credit';
