-- ============================================================================
-- 015_middle_school_type.sql
-- 중등관 시간표·상세 강의용 school_type enum 값 추가
-- ============================================================================

alter type public.school_type add value if not exists 'middle';
