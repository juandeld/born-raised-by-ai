-- Colorear (Pintoria) is sold in Guatemala too (USD, same prices as the US): orders.country accepts 'GT'.
-- Apply in Supabase (SQL Editor) BEFORE the first Guatemala order: without it the insert of a GT order fails on the old check.
-- Safe to run twice. Existing rows are untouched.
alter table orders drop constraint if exists orders_country_check;
alter table orders add constraint orders_country_check check (country in ('US','ES','GB','MX','GT'));
