-- 상세 시간표: 강의별 '상세 보기' 버튼 URL (없으면 버튼 미노출)

alter table public.timetable_courses
  add column if not exists view_detail_url text;
