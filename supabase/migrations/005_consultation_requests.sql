-- 입학 상담 신청 (공개 제출 → 관리자 조회)

create table if not exists public.consultation_requests (
  id            uuid primary key default gen_random_uuid(),
  student_name  text not null,
  parent_name   text not null,
  phone         text not null,
  school_grade  text not null,
  subject       text not null,
  message       text not null,
  status        text not null default 'new'
                check (status in ('new', 'read', 'archived')),
  created_at    timestamptz not null default timezone('utc'::text, now()),
  updated_at    timestamptz not null default timezone('utc'::text, now())
);

create index if not exists consultation_requests_created_at_idx
  on public.consultation_requests (created_at desc);

create index if not exists consultation_requests_status_idx
  on public.consultation_requests (status);

drop trigger if exists consultation_requests_set_updated_at on public.consultation_requests;
create trigger consultation_requests_set_updated_at
  before update on public.consultation_requests
  for each row execute function public.set_updated_at();

alter table public.consultation_requests enable row level security;

drop policy if exists "consultation_requests_public_insert" on public.consultation_requests;
drop policy if exists "consultation_requests_admin_select" on public.consultation_requests;
drop policy if exists "consultation_requests_admin_update" on public.consultation_requests;
drop policy if exists "consultation_requests_admin_delete" on public.consultation_requests;

-- 익명(공개 사이트) 제출만 허용
create policy "consultation_requests_public_insert"
  on public.consultation_requests for insert
  to anon, authenticated
  with check (true);

-- 조회·수정·삭제는 관리자(authenticated) 전용
create policy "consultation_requests_admin_select"
  on public.consultation_requests for select
  to authenticated
  using (true);

create policy "consultation_requests_admin_update"
  on public.consultation_requests for update
  to authenticated
  using (true)
  with check (true);

create policy "consultation_requests_admin_delete"
  on public.consultation_requests for delete
  to authenticated
  using (true);
