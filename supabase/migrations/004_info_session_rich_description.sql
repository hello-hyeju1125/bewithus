-- 설명회 설명: 리치 텍스트 (Tiptap JSON + sanitize HTML)
alter table public.info_sessions
  add column if not exists description_json jsonb,
  add column if not exists description_html text;

comment on column public.info_sessions.description_json is 'Tiptap JSON (관리자 편집용)';
comment on column public.info_sessions.description_html is 'sanitize 된 HTML (공개 페이지 렌더링)';
