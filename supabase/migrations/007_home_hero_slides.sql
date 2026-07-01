-- 메인 페이지 히어로 슬라이더 (고정 2슬롯)

create table if not exists public.home_hero_slides (
  slot                  smallint primary key check (slot between 1 and 2),
  tagline               text not null,
  main_headline         text not null,
  subtitle              text,
  href                  text not null,
  background_image_url  text,
  is_active             boolean not null default true,
  created_at            timestamptz not null default timezone('utc'::text, now()),
  updated_at            timestamptz not null default timezone('utc'::text, now())
);

drop trigger if exists home_hero_slides_set_updated_at on public.home_hero_slides;
create trigger home_hero_slides_set_updated_at
  before update on public.home_hero_slides
  for each row execute function public.set_updated_at();

insert into public.home_hero_slides (slot, tagline, main_headline, href)
values
  (1, '대원외고 부동의 1위', E'대원외고\n수업 안내', '/timetable/daewon'),
  (2, '한영외고 진학 1위', E'한영외고\n수업 안내', '/timetable/hanyoung')
on conflict (slot) do nothing;

alter table public.home_hero_slides enable row level security;

drop policy if exists "home_hero_slides_public_read" on public.home_hero_slides;
drop policy if exists "home_hero_slides_admin_insert" on public.home_hero_slides;
drop policy if exists "home_hero_slides_admin_update" on public.home_hero_slides;
drop policy if exists "home_hero_slides_admin_delete" on public.home_hero_slides;

create policy "home_hero_slides_public_read"
  on public.home_hero_slides for select
  to anon, authenticated
  using (is_active = true);

create policy "home_hero_slides_admin_insert"
  on public.home_hero_slides for insert
  to authenticated
  with check (true);

create policy "home_hero_slides_admin_update"
  on public.home_hero_slides for update
  to authenticated
  using (true)
  with check (true);

create policy "home_hero_slides_admin_delete"
  on public.home_hero_slides for delete
  to authenticated
  using (true);

-- 관리자용: 비활성 슬라이드 포함 전체 조회
drop policy if exists "home_hero_slides_admin_select" on public.home_hero_slides;
create policy "home_hero_slides_admin_select"
  on public.home_hero_slides for select
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('home-heroes', 'home-heroes', true)
on conflict (id) do nothing;

drop policy if exists "storage_home_heroes_public_read" on storage.objects;
drop policy if exists "storage_home_heroes_admin_insert" on storage.objects;
drop policy if exists "storage_home_heroes_admin_update" on storage.objects;
drop policy if exists "storage_home_heroes_admin_delete" on storage.objects;

create policy "storage_home_heroes_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'home-heroes');

create policy "storage_home_heroes_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'home-heroes');

create policy "storage_home_heroes_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'home-heroes')
  with check (bucket_id = 'home-heroes');

create policy "storage_home_heroes_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'home-heroes');
