-- Lumen Labs / calls engine: scheduler without Inngest (docs/arquitectura/cron-sin-inngest.md).
-- Two overlapping ticks must never dial the same order twice: at most one call in flight per order, and one row per attempt.
create unique index if not exists calls_one_active_per_order on calls (order_id) where status <> 'ended';
create unique index if not exists calls_order_attempt_uq on calls (order_id, attempt);
