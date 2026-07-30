-- 상세 시간표: 해시태그(tag)와 별도인 상태 뱃지 (마감 / 마감임박 등)

alter table public.timetable_courses
  add column if not exists status_tag text,
  add column if not exists status_tag_bg_color text,
  add column if not exists status_tag_text_color text;
