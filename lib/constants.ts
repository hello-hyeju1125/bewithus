/**
 * 사이트 전역에서 사용하는 학교/학년 메타데이터.
 *
 * - 페이지 라우팅(`/timetable/[school]` 등) 의 유효성 검증과
 *   서브 네비게이션(학년 탭) 노출에 함께 사용합니다.
 * - DB 의 `school_type` enum 과 1:1 대응합니다.
 */

import type { SchoolType, ViewType, Teacher } from "@/types/database";

import type { HeroDescriptionInput } from "@/lib/layout/hero-description";

export type { ViewType };

export const SCHOOLS = [
  "daewon",
  "hanyoung",
  "general",
  "middle",
  "private",
] as const;
export type School = (typeof SCHOOLS)[number];

/** 강사진/설명회는 'private' 을 사용하지 않습니다. */
export const STAFF_SCHOOLS = ["daewon", "hanyoung", "general"] as const;
export type StaffSchool = (typeof STAFF_SCHOOLS)[number];

/** 사이드 위젯·GNB 등 설명회 기본 진입 경로 */
export const DEFAULT_INFO_SESSION_PATH = "/info-session/daewon" as const;

export const SCHOOL_LABELS: Record<School, string> = {
  daewon: "대원외고",
  hanyoung: "한영외고",
  general: "고등관",
  middle: "중등관",
  private: "개인 및 팀 수업",
};

/** Hero 등에서 사용하는 학교별 짧은 소개 문구 (DB description 의 fallback). */
export const SCHOOL_DESCRIPTIONS: Record<School, HeroDescriptionInput> = {
  daewon: {
    lead: "대원외고 부동의 1위",
    body: ["검증된 압도적 강사진이 내신부터 수능까지"],
    closing: "대원외고 맞춤형 커리큘럼으로 최상의 결과를 만듭니다.",
    mobile: {
      closingLines: [
        "대원외고 맞춤형 커리큘럼으로",
        "최상의 결과를 만듭니다.",
      ],
    },
    emphasis: ["부동의 1위", "맞춤형 커리큘럼"],
  },
  hanyoung: {
    closingLines: [
      "한영외고만의 까다로운 출제경향을",
      "완벽분석한 맞춤 강사진의 빈틈없는 밀착관리로",
      "압도적 결과를 만듭니다.",
    ],
    emphasis: ["까다로운 출제경향", "압도적 결과"],
  },
  general: {
    closingLines: [
      "철저한 학교별 분석과 빈틈없는 밀착관리로 상위권 내신을 선점,",
      "내신부터 수능까지 입체적인 커리큘럼으로 최상의 결과를 만듭니다.",
    ],
    mobile: {
      closingLines: [
        "철저한 학교별 분석과 빈틈없는",
        "밀착관리로 상위권 내신을 선점,",
        "내신부터 수능까지 입체적인 커리큘럼으로",
        "최상의 결과를 만듭니다.",
      ],
    },
    emphasis: ["상위권 내신", "최상의 결과"],
  },
  middle: {
    closingLines: [
      "빈틈없는 학교별 맞춤분석과 꼼꼼한 밀착 관리로",
      "중학 내신 최상위권 안착은 물론, 특목,자사 입시까지!",
      "흔들리지 않는 탄탄한 실력으로 고등 최상위권까지 선점하는 완벽한 로드맵!",
    ],
    mobile: {
      closingLines: [
        "빈틈없는 학교별 맞춤분석과 꼼꼼한 밀착 관리로",
        "중학 내신 최상위권 안착은 물론,",
        "특목,자사 입시까지!",
        "흔들리지 않는 탄탄한 실력으로 고등 최상위권까지",
        "선점하는 완벽한 로드맵!",
      ],
    },
    emphasis: ["중학 내신 최상위권", "완벽한 로드맵"],
  },
  private: "1:1 맞춤 또는 소수 팀 단위로 진행되는 프리미엄 개인 수업.",
};

export const SCHOOL_GRADES: Record<School, readonly string[]> = {
  daewon: ["high-1", "high-2", "high-3"],
  hanyoung: ["high-1", "high-2", "high-3"],
  general: ["high-1", "high-2", "high-3"],
  middle: ["middle-1", "middle-2", "middle-3"],
  private: [
    "middle-1",
    "middle-2",
    "middle-3",
    "high-1",
    "high-2",
    "high-3",
  ],
} as const;

/** 예전 URL·DB 값(middle-*) → 고등 학년 키 (외고·고등관·개인 수업) */
const LEGACY_MIDDLE_TO_HIGH: Record<string, string> = {
  "middle-1": "high-1",
  "middle-2": "high-2",
  "middle-3": "high-3",
};

/** 예전 URL·DB 값(high-*) → 중등 학년 키 (중등관) */
const LEGACY_HIGH_TO_MIDDLE: Record<string, string> = {
  "high-1": "middle-1",
  "high-2": "middle-2",
  "high-3": "middle-3",
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
/** 개인 수업 기본 학년 — 중1이 아닌 고1 (중등 탭은 콘텐츠 있을 때만 노출) */
export function defaultGradeForSchool(school: School): string {
  if (school === "private") {
    return (
      SCHOOL_GRADES.private.find((g) => g.startsWith("high-")) ?? "high-1"
    );
  }
  return SCHOOL_GRADES[school][0];
}

export function resolveGradeForSchool(
  school: School,
  gradeParam: string | undefined,
): string {
  const defaultGrade = defaultGradeForSchool(school);
  if (!gradeParam) return defaultGrade;
  /** 개인 및 팀 수업 — 예전 단일 학년 키 `all` */
  if (school === "private" && gradeParam === "all") return defaultGrade;
  if (isGradeOfSchool(school, gradeParam)) return gradeParam;
  /** 개인 수업은 중·고 학년을 모두 쓰므로 학년 간 자동 치환하지 않음 */
  if (school === "private") return defaultGrade;
  const legacyMap =
    school === "middle" ? LEGACY_HIGH_TO_MIDDLE : LEGACY_MIDDLE_TO_HIGH;
  const mapped = legacyMap[gradeParam];
  if (mapped && isGradeOfSchool(school, mapped)) return mapped;
  return defaultGrade;
}

/**
 * 상세 시간표 등록 시 학교별 강사 선택 목록.
 * 중등관·개인 수업은 강사진 DB school(daewon/hanyoung/general)과 timetable school 이 달라
 * 활성 강사 전원을 노출합니다.
 */
export function teachersEligibleForTimetableSchool(
  school: School,
  teachers: Teacher[],
): Teacher[] {
  const active = teachers.filter((t) => t.is_active);
  if (school === "private" || school === "middle") return active;
  return active.filter((t) => t.school === school);
}

/** DB enum 으로 그대로 캐스트 가능한 타입 가드. */
export function asSchoolType(value: string): SchoolType | null {
  return isSchool(value) ? value : null;
}

/** 대치위더스학원 문자수신 신청 Google Form */
export const SMS_REGISTRATION_FORM_URL =
  "https://docs.google.com/forms/d/1Avu-t9dSlfYuGvpNOul_p6mBiqVnz2zJvp2zZhkXZ_k/viewform";
