/**
 * 사이트 전역에서 사용하는 학교/학년 메타데이터.
 *
 * - 페이지 라우팅(`/timetable/[school]` 등) 의 유효성 검증과
 *   서브 네비게이션(학년 탭) 노출에 함께 사용합니다.
 * - DB 의 `school_type` enum 과 1:1 대응합니다.
 */

import type { SchoolType, ViewType } from "@/types/database";

export type { ViewType };

export const SCHOOLS = ["daewon", "hanyoung", "general", "private"] as const;
export type School = (typeof SCHOOLS)[number];

/** 강사진/설명회는 'private' 을 사용하지 않습니다. */
export const STAFF_SCHOOLS = ["daewon", "hanyoung", "general"] as const;
export type StaffSchool = (typeof STAFF_SCHOOLS)[number];

export const SCHOOL_LABELS: Record<School, string> = {
  daewon: "대원외고",
  hanyoung: "한영외고",
  general: "입시관",
  private: "개인 및 팀 수업",
};

/** Hero 등에서 사용하는 학교별 짧은 소개 문구 (DB description 의 fallback). */
export const SCHOOL_DESCRIPTIONS: Record<School, string> = {
  daewon: "대원외고 입시 전문, 합격률 1위의 노하우로 완성하는 외고 합격 로드맵.",
  hanyoung: "한영외고 진학에 최적화된 커리큘럼과 전담 강사진이 함께합니다.",
  general: "대입 전과정을 체계적으로 설계하는 입시관 통합 프로그램.",
  private: "1:1 맞춤 또는 소수 팀 단위로 진행되는 프리미엄 개인 수업.",
};

export const SCHOOL_GRADES: Record<School, readonly string[]> = {
  daewon: ["high-1", "high-2", "high-3"],
  hanyoung: ["high-1", "high-2", "high-3"],
  general: ["high-1", "high-2", "high-3"],
  private: ["all"],
} as const;

/** 예전 URL·DB 값(middle-*) → 고등 학년 키 */
const LEGACY_GRADE_ALIASES: Record<string, string> = {
  "middle-1": "high-1",
  "middle-2": "high-2",
  "middle-3": "high-3",
};

export const GRADE_LABELS: Record<string, string> = {
  "middle-1": "중1",
  "middle-2": "중2",
  "middle-3": "중3",
  "high-1": "고1",
  "high-2": "고2",
  "high-3": "고3",
  all: "전체",
};

export const VIEW_TYPES: readonly ViewType[] = ["summary", "detail"] as const;

export const VIEW_TYPE_LABELS: Record<ViewType, string> = {
  summary: "요약",
  detail: "상세",
};

/** 공개 시간표 페이지 보기 형식 탭 라벨 */
export const TIMETABLE_VIEW_TYPE_LABELS: Record<ViewType, string> = {
  summary: "요약 시간표",
  detail: "상세 시간표",
};

export function isSchool(value: string): value is School {
  return (SCHOOLS as readonly string[]).includes(value);
}

export function isStaffSchool(value: string): value is StaffSchool {
  return (STAFF_SCHOOLS as readonly string[]).includes(value);
}

export function isViewType(value: string | null | undefined): value is ViewType {
  return value === "summary" || value === "detail";
}

export function isGradeOfSchool(school: School, value: string): boolean {
  return (SCHOOL_GRADES[school] as readonly string[]).includes(value);
}

/** 쿼리 `grade` 값을 학교별 유효 학년으로 정규화 (legacy middle-* 지원) */
export function resolveGradeForSchool(
  school: School,
  gradeParam: string | undefined,
): string {
  const defaultGrade = SCHOOL_GRADES[school][0];
  if (!gradeParam) return defaultGrade;
  if (isGradeOfSchool(school, gradeParam)) return gradeParam;
  const mapped = LEGACY_GRADE_ALIASES[gradeParam];
  if (mapped && isGradeOfSchool(school, mapped)) return mapped;
  return defaultGrade;
}

/** DB enum 으로 그대로 캐스트 가능한 타입 가드. */
export function asSchoolType(value: string): SchoolType | null {
  return isSchool(value) ? value : null;
}
