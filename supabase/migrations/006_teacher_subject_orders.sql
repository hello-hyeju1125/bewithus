-- 강사진 페이지 과목(해시태그) 노출 순서

create table if not exists public.teacher_subject_orders (
  subject      text primary key,
  order_index  int  not null default 0,
  created_at   timestamptz not null default timezone('utc'::text, now()),
  updated_at   timestamptz not null default timezone('utc'::text, now())
);

create index if not exists teacher_subject_orders_order_idx
  on public.teacher_subject_orders (order_index);

drop trigger if exists teacher_subject_orders_set_updated_at on public.teacher_subject_orders;
create trigger teacher_subject_orders_set_updated_at
  before update on public.teacher_subject_orders
  for each row execute function public.set_updated_at();

alter table public.teacher_subject_orders enable row level security;

drop policy if exists "teacher_subject_orders_public_read" on public.teacher_subject_orders;
drop policy if exists "teacher_subject_orders_admin_insert" on public.teacher_subject_orders;
drop policy if exists "teacher_subject_orders_admin_update" on public.teacher_subject_orders;
drop policy if exists "teacher_subject_orders_admin_delete" on public.teacher_subject_orders;

create policy "teacher_subject_orders_public_read"
  on public.teacher_subject_orders for select
  to anon, authenticated
  using (true);

create policy "teacher_subject_orders_admin_insert"
  on public.teacher_subject_orders for insert
  to authenticated
  with check (true);

create policy "teacher_subject_orders_admin_update"
  on public.teacher_subject_orders for update
  to authenticated
  using (true)
  with check (true);

create policy "teacher_subject_orders_admin_delete"
  on public.teacher_subject_orders for delete
  to authenticated
  using (true);
