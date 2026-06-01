-- 메인 배너 첫 방문 팝업 on/off

alter table public.home_hero_settings
  add column if not exists popup_enabled boolean not null default false;
