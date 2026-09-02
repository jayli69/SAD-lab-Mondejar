-- ======================================================
-- 1. CREATE THE STUDENTS TABLE
-- ======================================================
create table students (
  student_id text primary key,
  full_name text not null,
  program text not null,
  year_level text not null,
  email text not null,
  created_at timestamp with time zone default now()
);

-- ======================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ======================================================
alter table students enable row level security;

-- ======================================================
-- 3. POLICIES FOR CREATE, READ, UPDATE, DELETE
-- These policies allow anyone using the anon key to perform
-- CRUD operations. This is fine for learning/demo projects,
-- but for production you should restrict access (e.g. to
-- authenticated users only).
-- ======================================================

-- READ (SELECT)
create policy "Allow read access"
on students for select
using (true);

-- CREATE (INSERT)
create policy "Allow insert access"
on students for insert
with check (true);

-- UPDATE
create policy "Allow update access"
on students for update
using (true)
with check (true);

-- DELETE
create policy "Allow delete access"
on students for delete
using (true);
