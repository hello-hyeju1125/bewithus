-- 상세 시간표 태그 색상 + 요약 시간표 다중 이미지

alter table public.timetable_courses
  add column if not exists tag_bg_color text,
  add column if not exists tag_text_color text;

alter table public.timetables
  add column if not exists image_urls text[] not null default '{}';

update public.timetables
set image_urls = array[image_url]
where coalesce(image_url, '') <> ''
  and (image_urls is null or cardinality(image_urls) = 0);
