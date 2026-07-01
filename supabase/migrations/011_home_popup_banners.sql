-- 메인 고정 배너(home_hero_slides)와 팝업 배너 분리

create table if not exists public.home_popup_banners (
  slot                  smallint primary key check (slot between 1 and 3),
  href                  text not null default '/',
  background_image_url  text,
  is_active             boolean not null default false,
  created_at            timestamptz not null default timezone('utc'::text, now()),
  updated_at            timestamptz not null default timezone('utc'::text, now())
);

drop trigger if exists home_popup_banners_set_updated_at on public.home_popup_banners;
create trigger home_popup_banners_set_updated_at
  before update on public.home_popup_banners
  for each row execute function public.set_updated_at();

insert into public.home_popup_banners (slot, href, is_active)
values
  (1, '/', false),
  (2, '/', false),
  (3, '/', false)
on conflict (slot) do nothing;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'home_hero_slides'
      and column_name = 'show_in_popup'
  ) then
    insert into public.home_popup_banners (slot, href, background_image_url, is_active)
    select
      s.slot,
      s.href,
      s.background_image_url,
      true
    from public.home_hero_slides s
    where s.show_in_popup = true
      and s.background_image_url is not null
      and trim(s.background_image_url) <> ''
    on conflict (slot) do update set
      href = excluded.href,
      background_image_url = excluded.background_image_url,
      is_active = true;

    alter table public.home_hero_slides drop column show_in_popup;
  end if;
end $$;

alter table public.home_hero_slides enable row level security;

alter table public.home_popup_banners enable row level security;

drop policy if exists "home_popup_banners_public_read" on public.home_popup_banners;
drop policy if exists "home_popup_banners_admin_insert" on public.home_popup_banners;
drop policy if exists "home_popup_banners_admin_update" on public.home_popup_banners;
drop policy if exists "home_popup_banners_admin_delete" on public.home_popup_banners;
drop policy if exists "home_popup_banners_admin_select" on public.home_popup_banners;

create policy "home_popup_banners_public_read"
  on public.home_popup_banners for select
  to anon, authenticated
  using (is_active = true);

create policy "home_popup_banners_admin_insert"
  on public.home_popup_banners for insert
  to authenticated
  with check (true);

create policy "home_popup_banners_admin_update"
  on public.home_popup_banners for update
  to authenticated
  using (true)
  with check (true);

create policy "home_popup_banners_admin_delete"
  on public.home_popup_banners for delete
  to authenticated
  using (true);

create policy "home_popup_banners_admin_select"
  on public.home_popup_banners for select
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('home-popups', 'home-popups', true)
on conflict (id) do nothing;

drop policy if exists "storage_home_popups_public_read" on storage.objects;
drop policy if exists "storage_home_popups_admin_insert" on storage.objects;
drop policy if exists "storage_home_popups_admin_update" on storage.objects;
drop policy if exists "storage_home_popups_admin_delete" on storage.objects;

create policy "storage_home_popups_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'home-popups');

create policy "storage_home_popups_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'home-popups');

create policy "storage_home_popups_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'home-popups')
  with check (bucket_id = 'home-popups');

create policy "storage_home_popups_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'home-popups');
