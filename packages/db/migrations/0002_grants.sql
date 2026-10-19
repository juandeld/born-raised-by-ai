-- Grants for the server-side role. Some projects (SQL-editor-created tables) do not carry the default
-- privileges, so the service key gets "permission denied" (42501). Idempotent.
grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to service_role;
