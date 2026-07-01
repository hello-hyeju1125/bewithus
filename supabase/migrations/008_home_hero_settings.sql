-- 메인 히어로 슬라이더 공통 설정 (CTA 문구 등)

create table if not exists public.home_hero_settings (
  id          smallint primary key default 1 check (id = 1),
  cta_label   text not null default '시간표 보기',
  updated_at  timestamptz not null default timezone('utc'::text, now())
);

drop trigger if exists home_hero_settings_set_updated_at on public.home_hero_settings;
create trigger home_hero_settings_set_updated_at
  before update on public.home_hero_settings
  for each row execute function public.set_updated_at();

insert into public.home_hero_settings (id, cta_label)
values (1, '시간표 보기')
on conflict (id) do nothing;

alter table public.home_hero_settings enable row level security;

drop policy if exists "home_hero_settings_public_read" on public.home_hero_settings;
drop policy if exists "home_hero_settings_admin_insert" on public.home_hero_settings;
drop policy if exists "home_hero_settings_admin_update" on public.home_hero_settings;
drop policy if exists "home_hero_settings_admin_delete" on public.home_hero_settings;
drop policy if exists "home_hero_settings_admin_select" on public.home_hero_settings;

create policy "home_hero_settings_public_read"
  on public.home_hero_settings for select
  to anon, authenticated
  using (true);

create policy "home_hero_settings_admin_insert"
  on public.home_hero_settings for insert
  to authenticated
  with check (true);

create policy "home_hero_settings_admin_update"
  on public.home_hero_settings for update
  to authenticated
  using (true)
  with check (true);

create policy "home_hero_settings_admin_delete"
  on public.home_hero_settings for delete
  to authenticated
  using (true);

create policy "home_hero_settings_admin_select"
  on public.home_hero_settings for select
  to authenticated
  using (true);
