-- 메인 배너 3슬롯, 슬라이드별 팝업 노출

alter table public.home_hero_slides
  drop constraint if exists home_hero_slides_slot_check;

alter table public.home_hero_slides
  add constraint home_hero_slides_slot_check
  check (slot between 1 and 3);

alter table public.home_hero_slides
  add column if not exists show_in_popup boolean not null default false;

alter table public.home_hero_slides
  alter column tagline set default '',
  alter column main_headline set default '';

update public.home_hero_slides
set
  tagline = coalesce(tagline, ''),
  main_headline = coalesce(main_headline, '')
where tagline is null or main_headline is null;

insert into public.home_hero_slides (slot, tagline, main_headline, href, is_active)
values (3, '', '', '/', false)
on conflict (slot) do nothing;
