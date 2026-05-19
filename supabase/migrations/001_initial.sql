-- ============================================================================
-- 001_initial.sql
-- 대치위더스 (bewithus) 초기 스키마 마이그레이션
--
-- 포함 내용:
--   1. ENUM 타입 정의
--   2. 공용 트리거 함수 (updated_at 자동 갱신)
--   3. 도메인 테이블 5종 (timetables, teachers, info_sessions, posts,
--      post_attachments)
--   4. 인덱스
--   5. Row Level Security (RLS) 정책
--   6. Storage 버킷 3종 및 정책
--
-- 운영 정책:
--   - 인증된 사용자(auth.role() = 'authenticated') = 관리자 로 간주합니다.
--   - 일반 사용자(공개 회원가입)는 Supabase Auth 대시보드에서
--     반드시 비활성화하세요 (Authentication → Providers → Email →
--     "Enable signups" 끄기).
--   - 본 마이그레이션은 idempotent 하게 작성되어 있어 재실행이 가능합니다.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto" with schema public;

-- ----------------------------------------------------------------------------
-- 2. ENUM 타입
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'school_type') then
    create type public.school_type as enum (
      'daewon',
      'hanyoung',
      'general',
      'private'
    );
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'timetable_view_type') then
    create type public.timetable_view_type as enum (
      'summary',
      'detail'
    );
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- 3. 공용 트리거 함수: updated_at 자동 갱신
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4. 테이블 정의
-- ----------------------------------------------------------------------------

-- 4-1. timetables (시간표)
create table if not exists public.timetables (
  id            uuid primary key default gen_random_uuid(),
  school        public.school_type not null,
  grade         text not null,
  view_type     public.timetable_view_type not null,
  image_url     text not null,
  description   text,
  year          int  not null,
  semester      text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default timezone('utc'::text, now()),
  updated_at    timestamptz not null default timezone('utc'::text, now())
);

create index if not exists timetables_school_grade_idx
  on public.timetables (school, grade);
create index if not exists timetables_year_semester_idx
  on public.timetables (year, semester);
create index if not exists timetables_is_active_idx
  on public.timetables (is_active);

drop trigger if exists timetables_set_updated_at on public.timetables;
create trigger timetables_set_updated_at
  before update on public.timetables
  for each row execute function public.set_updated_at();

-- 4-2. teachers (강사진)
create table if not exists public.teachers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  school        public.school_type not null
                check (school in ('daewon', 'hanyoung', 'general')),
  subject       text not null,
  bio           text,
  photo_url     text,
  career        jsonb not null default '[]'::jsonb,
  order_index   int  not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default timezone('utc'::text, now()),
  updated_at    timestamptz not null default timezone('utc'::text, now())
);

create index if not exists teachers_school_idx
  on public.teachers (school);
create index if not exists teachers_order_idx
  on public.teachers (school, order_index);
create index if not exists teachers_is_active_idx
  on public.teachers (is_active);

drop trigger if exists teachers_set_updated_at on public.teachers;
create trigger teachers_set_updated_at
  before update on public.teachers
  for each row execute function public.set_updated_at();

-- 4-3. info_sessions (설명회)
create table if not exists public.info_sessions (
  id                uuid primary key default gen_random_uuid(),
  school            public.school_type not null
                    check (school in ('daewon', 'hanyoung', 'general')),
  title             text not null,
  description       text,
  session_date      timestamptz not null,
  location          text,
  capacity          int,
  registration_url  text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default timezone('utc'::text, now()),
  updated_at        timestamptz not null default timezone('utc'::text, now())
);

create index if not exists info_sessions_school_idx
  on public.info_sessions (school);
create index if not exists info_sessions_session_date_idx
  on public.info_sessions (session_date desc);
create index if not exists info_sessions_is_active_idx
  on public.info_sessions (is_active);

drop trigger if exists info_sessions_set_updated_at on public.info_sessions;
create trigger info_sessions_set_updated_at
  before update on public.info_sessions
  for each row execute function public.set_updated_at();

-- 4-4. posts (공지사항 게시판)
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  content       jsonb not null,
  content_html  text not null default '',
  author_id     uuid not null references auth.users(id) on delete restrict,
  view_count    int  not null default 0,
  is_pinned     boolean not null default false,
  is_published  boolean not null default true,
  created_at    timestamptz not null default timezone('utc'::text, now()),
  updated_at    timestamptz not null default timezone('utc'::text, now())
);

create index if not exists posts_is_published_idx
  on public.posts (is_published);
create index if not exists posts_is_pinned_created_idx
  on public.posts (is_pinned desc, created_at desc);
create index if not exists posts_author_idx
  on public.posts (author_id);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- 4-5. post_attachments (게시판 첨부 이미지)
create table if not exists public.post_attachments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  file_url    text not null,
  file_name   text not null,
  file_size   int  not null,
  mime_type   text not null,
  created_at  timestamptz not null default timezone('utc'::text, now())
);

create index if not exists post_attachments_post_idx
  on public.post_attachments (post_id);

-- ----------------------------------------------------------------------------
-- 5. Row Level Security
-- ----------------------------------------------------------------------------
alter table public.timetables       enable row level security;
alter table public.teachers         enable row level security;
alter table public.info_sessions    enable row level security;
alter table public.posts            enable row level security;
alter table public.post_attachments enable row level security;

-- 5-1. timetables 정책
drop policy if exists "timetables_public_read"  on public.timetables;
drop policy if exists "timetables_admin_insert" on public.timetables;
drop policy if exists "timetables_admin_update" on public.timetables;
drop policy if exists "timetables_admin_delete" on public.timetables;

create policy "timetables_public_read"
  on public.timetables for select
  to anon, authenticated
  using (true);

create policy "timetables_admin_insert"
  on public.timetables for insert
  to authenticated
  with check (true);

create policy "timetables_admin_update"
  on public.timetables for update
  to authenticated
  using (true)
  with check (true);

create policy "timetables_admin_delete"
  on public.timetables for delete
  to authenticated
  using (true);

-- 5-2. teachers 정책
drop policy if exists "teachers_public_read"  on public.teachers;
drop policy if exists "teachers_admin_insert" on public.teachers;
drop policy if exists "teachers_admin_update" on public.teachers;
drop policy if exists "teachers_admin_delete" on public.teachers;

create policy "teachers_public_read"
  on public.teachers for select
  to anon, authenticated
  using (true);

create policy "teachers_admin_insert"
  on public.teachers for insert
  to authenticated
  with check (true);

create policy "teachers_admin_update"
  on public.teachers for update
  to authenticated
  using (true)
  with check (true);

create policy "teachers_admin_delete"
  on public.teachers for delete
  to authenticated
  using (true);

-- 5-3. info_sessions 정책
drop policy if exists "info_sessions_public_read"  on public.info_sessions;
drop policy if exists "info_sessions_admin_insert" on public.info_sessions;
drop policy if exists "info_sessions_admin_update" on public.info_sessions;
drop policy if exists "info_sessions_admin_delete" on public.info_sessions;

create policy "info_sessions_public_read"
  on public.info_sessions for select
  to anon, authenticated
  using (true);

create policy "info_sessions_admin_insert"
  on public.info_sessions for insert
  to authenticated
  with check (true);

create policy "info_sessions_admin_update"
  on public.info_sessions for update
  to authenticated
  using (true)
  with check (true);

create policy "info_sessions_admin_delete"
  on public.info_sessions for delete
  to authenticated
  using (true);

-- 5-4. posts 정책 (공개는 is_published=true 인 것만)
drop policy if exists "posts_public_read"  on public.posts;
drop policy if exists "posts_admin_read"   on public.posts;
drop policy if exists "posts_admin_insert" on public.posts;
drop policy if exists "posts_admin_update" on public.posts;
drop policy if exists "posts_admin_delete" on public.posts;

create policy "posts_public_read"
  on public.posts for select
  to anon
  using (is_published = true);

create policy "posts_admin_read"
  on public.posts for select
  to authenticated
  using (true);

create policy "posts_admin_insert"
  on public.posts for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "posts_admin_update"
  on public.posts for update
  to authenticated
  using (true)
  with check (true);

create policy "posts_admin_delete"
  on public.posts for delete
  to authenticated
  using (true);

-- 5-5. post_attachments 정책
drop policy if exists "post_attachments_public_read"  on public.post_attachments;
drop policy if exists "post_attachments_admin_insert" on public.post_attachments;
drop policy if exists "post_attachments_admin_update" on public.post_attachments;
drop policy if exists "post_attachments_admin_delete" on public.post_attachments;

create policy "post_attachments_public_read"
  on public.post_attachments for select
  to anon, authenticated
  using (true);

create policy "post_attachments_admin_insert"
  on public.post_attachments for insert
  to authenticated
  with check (true);

create policy "post_attachments_admin_update"
  on public.post_attachments for update
  to authenticated
  using (true)
  with check (true);

create policy "post_attachments_admin_delete"
  on public.post_attachments for delete
  to authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- 6. Storage 버킷
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('timetables',  'timetables',  true),
  ('teachers',    'teachers',    true),
  ('post-images', 'post-images', true)
on conflict (id) do update set public = excluded.public;

-- 6-1. timetables 버킷 정책
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

-- 6-2. teachers 버킷 정책
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

-- 6-3. post-images 버킷 정책
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
