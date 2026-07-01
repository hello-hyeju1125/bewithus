-- ============================================================================
-- 002_timetable_courses.sql
-- 상세 시간표(detail)용 강의 행 테이블.
--
-- 기존 public.timetables (이미지 기반)은 요약 시간표 전용으로 유지하고,
-- 상세 시간표는 본 테이블의 row 모음으로 구성한다.
-- ============================================================================

create table if not exists public.timetable_courses (
  id              uuid primary key default gen_random_uuid(),
  school          public.school_type not null,
  grade           text not null,
  year            int  not null,
  semester        text not null,

  subject         text not null,
  teacher_id      uuid not null references public.teachers(id) on delete restrict,
  course_title    text not null,
  course_subtitle text,
  course_note     text,
  tag             text,

  -- [{ day_time: text, is_full: boolean }]
  sessions        jsonb not null default '[]'::jsonb,
  -- text[] 로 "5/9(토)" 형태의 개강일 칩
  start_dates     text[] not null default '{}'::text[],
  -- [{ label, url, variant: "primary"|"secondary"|"waitlist" }]
  apply_buttons   jsonb not null default '[]'::jsonb,
  detail_url      text,

  order_index     int  not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default timezone('utc'::text, now()),
  updated_at      timestamptz not null default timezone('utc'::text, now())
);

create index if not exists timetable_courses_lookup_idx
  on public.timetable_courses (school, grade, year, semester);
create index if not exists timetable_courses_subject_idx
  on public.timetable_courses (school, grade, subject);
create index if not exists timetable_courses_teacher_idx
  on public.timetable_courses (teacher_id);
create index if not exists timetable_courses_order_idx
  on public.timetable_courses (school, grade, subject, order_index);
create index if not exists timetable_courses_is_active_idx
  on public.timetable_courses (is_active);

drop trigger if exists timetable_courses_set_updated_at on public.timetable_courses;
create trigger timetable_courses_set_updated_at
  before update on public.timetable_courses
  for each row execute function public.set_updated_at();

alter table public.timetable_courses enable row level security;

drop policy if exists "timetable_courses_public_read"  on public.timetable_courses;
drop policy if exists "timetable_courses_admin_insert" on public.timetable_courses;
drop policy if exists "timetable_courses_admin_update" on public.timetable_courses;
drop policy if exists "timetable_courses_admin_delete" on public.timetable_courses;

create policy "timetable_courses_public_read"
  on public.timetable_courses for select
  to anon, authenticated
  using (true);

create policy "timetable_courses_admin_insert"
  on public.timetable_courses for insert
  to authenticated
  with check (true);

create policy "timetable_courses_admin_update"
  on public.timetable_courses for update
  to authenticated
  using (true)
  with check (true);

create policy "timetable_courses_admin_delete"
  on public.timetable_courses for delete
  to authenticated
  using (true);
