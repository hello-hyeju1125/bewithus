-- 배너 1장당 메인 고정 / 팝업 노출을 각각 선택

alter table public.home_hero_slides
  add column if not exists show_in_main boolean not null default false,
  add column if not exists show_in_popup boolean not null default false;

-- 기존 is_active(이미지 등록) → 메인 고정 노출로 이전
update public.home_hero_slides
set show_in_main = true
where is_active = true
  and background_image_url is not null
  and trim(background_image_url) <> '';

-- home_popup_banners 가 있으면 같은 슬롯에 팝업 노출 병합
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'home_popup_banners'
  ) then
    update public.home_hero_slides h
    set
      show_in_popup = true,
      background_image_url = coalesce(
        nullif(trim(h.background_image_url), ''),
        p.background_image_url
      ),
      href = case
        when nullif(trim(h.background_image_url), '') is not null then h.href
        else coalesce(nullif(trim(p.href), ''), h.href)
      end,
      is_active = true
    from public.home_popup_banners p
    where h.slot = p.slot
      and p.is_active = true
      and p.background_image_url is not null
      and trim(p.background_image_url) <> '';

    drop table public.home_popup_banners;
  end if;
end $$;
