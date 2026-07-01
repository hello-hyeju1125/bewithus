/**
 * Supabase Storage 객체 키는 ASCII 권장(한글·공백 불가).
 * DB 의 `semester` 값(예: "2학기")은 그대로 두고, 파일 경로만 슬러그로 변환합니다.
 */
const SEMESTER_STORAGE_SLUGS: Record<string, string> = {
  "1학기": "sem1",
  "2학기": "sem2",
  "여름학기": "summer",
  "봄학기": "spring",
};

export function semesterToStorageSlug(semester: string): string {
  const mapped = SEMESTER_STORAGE_SLUGS[semester.trim()];
  if (mapped) return mapped;
  const fallback = semester.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
  return fallback || "unknown";
}

export function buildTimetableImageStoragePath(params: {
  school: string;
  grade: string;
  view_type: string;
  year: number;
  semester: string;
  ext: string;
  /** 다중 이미지 업로드 시 파일 인덱스 */
  index?: number;
  /** 업로드마다 고유 경로 — 동일 키 덮어쓰기 시 CDN 캐시 회피 */
  version?: number | string;
}): string {
  const semesterSlug = semesterToStorageSlug(params.semester);
  const indexSuffix =
    params.index != null && params.index > 0 ? `_${params.index}` : "";
  const versionSuffix =
    params.version != null && String(params.version).length > 0
      ? `_v${params.version}`
      : "";
  return `${params.school}/${params.grade}/${params.view_type}_${params.year}_${semesterSlug}${versionSuffix}${indexSuffix}.${params.ext}`;
}
