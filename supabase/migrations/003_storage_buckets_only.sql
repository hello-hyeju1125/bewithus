-- Storage 버킷만 누락된 경우 실행 (001_initial.sql 의 §6 만 발췌)
-- Supabase SQL Editor → New query → 붙여넣기 → Run

insert into storage.buckets (id, name, public)
values
  ('timetables',  'timetables',  true),
  ('teachers',    'teachers',    true),
  ('post-images', 'post-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "storage_timetables_public_read"  on storage.objects;
drop policy if exists "storage_timetables_admin_insert" on storage.objects;
drop policy if exists "storage_timetables_admin_update" on storage.objects;
drop policy if exists "storage_timetables_admin_delete" on storage.objects;

create policy "storage_timetables_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'timetables');

create policy "storage_timetables_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'timetables');

create policy "storage_timetables_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'timetables')
  with check (bucket_id = 'timetables');

create policy "storage_timetables_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'timetables');

drop policy if exists "storage_teachers_public_read"  on storage.objects;
drop policy if exists "storage_teachers_admin_insert" on storage.objects;
drop policy if exists "storage_teachers_admin_update" on storage.objects;
drop policy if exists "storage_teachers_admin_delete" on storage.objects;

create policy "storage_teachers_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'teachers');

create policy "storage_teachers_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'teachers');

create policy "storage_teachers_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'teachers')
  with check (bucket_id = 'teachers');

create policy "storage_teachers_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'teachers');

drop policy if exists "storage_post_images_public_read"  on storage.objects;
drop policy if exists "storage_post_images_admin_insert" on storage.objects;
drop policy if exists "storage_post_images_admin_update" on storage.objects;
drop policy if exists "storage_post_images_admin_delete" on storage.objects;

create policy "storage_post_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'post-images');

create policy "storage_post_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

create policy "storage_post_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images')
  with check (bucket_id = 'post-images');

create policy "storage_post_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');
