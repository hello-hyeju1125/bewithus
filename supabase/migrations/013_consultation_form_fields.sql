-- 입학 상담 신청 양식 필드 (관리자 설정) + 응답 JSON 저장

create table if not exists public.consultation_form_fields (
  id            uuid primary key default gen_random_uuid(),
  field_key     text not null unique,
  label         text not null,
  field_type    text not null default 'text'
                check (field_type in ('text', 'tel', 'textarea')),
  placeholder   text,
  is_required   boolean not null default true,
  order_index   int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default timezone('utc'::text, now()),
  updated_at    timestamptz not null default timezone('utc'::text, now())
);

create index if not exists consultation_form_fields_order_idx
  on public.consultation_form_fields (order_index);

drop trigger if exists consultation_form_fields_set_updated_at on public.consultation_form_fields;
create trigger consultation_form_fields_set_updated_at
  before update on public.consultation_form_fields
  for each row execute function public.set_updated_at();

insert into public.consultation_form_fields (
  field_key, label, field_type, placeholder, is_required, order_index
)
values
  ('student_name', '학생 이름', 'text', null, true, 0),
  ('parent_name', '학부모 성함', 'text', null, true, 1),
  ('phone', '전화번호', 'tel', '010-0000-0000', true, 2),
  ('school_grade', '학교 및 학년', 'text', '예: ○○고등학교 2학년', true, 3),
  ('subject', '과목', 'text', '예: 수학, 영어', true, 4),
  ('message', '상담 내용', 'textarea', null, true, 5)
on conflict (field_key) do nothing;

alter table public.consultation_requests
  add column if not exists responses jsonb not null default '{}'::jsonb;

update public.consultation_requests
set responses = jsonb_build_object(
  'student_name', student_name,
  'parent_name', parent_name,
  'phone', phone,
  'school_grade', school_grade,
  'subject', subject,
  'message', message
)
where responses = '{}'::jsonb
  and student_name is not null;

alter table public.consultation_requests
  alter column student_name drop not null,
  alter column parent_name drop not null,
  alter column phone drop not null,
  alter column school_grade drop not null,
  alter column subject drop not null,
  alter column message drop not null;

alter table public.consultation_form_fields enable row level security;

drop policy if exists "consultation_form_fields_public_read" on public.consultation_form_fields;
drop policy if exists "consultation_form_fields_admin_insert" on public.consultation_form_fields;
drop policy if exists "consultation_form_fields_admin_update" on public.consultation_form_fields;
drop policy if exists "consultation_form_fields_admin_delete" on public.consultation_form_fields;
drop policy if exists "consultation_form_fields_admin_select" on public.consultation_form_fields;

create policy "consultation_form_fields_public_read"
  on public.consultation_form_fields for select
  to anon, authenticated
  using (is_active = true);

create policy "consultation_form_fields_admin_insert"
  on public.consultation_form_fields for insert
  to authenticated
  with check (true);

create policy "consultation_form_fields_admin_update"
  on public.consultation_form_fields for update
  to authenticated
  using (true)
  with check (true);

create policy "consultation_form_fields_admin_delete"
  on public.consultation_form_fields for delete
  to authenticated
  using (true);

create policy "consultation_form_fields_admin_select"
  on public.consultation_form_fields for select
  to authenticated
  using (true);
