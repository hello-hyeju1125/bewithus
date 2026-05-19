/**
 * GNB 하위 공개 페이지 섹션 테마.
 * Hero 배경은 항상 primary(네이비). 섹션 구분은 eyebrow pill + 본문 액센트로만 한다.
 */
export type PublicSection =
  | "timetable"
  | "teacher"
  | "info-session"
  | "notice"
  | "default";

/** 네이비 Hero 위 eyebrow 라벨 박스 */
export const sectionHeroEyebrowClass: Record<PublicSection, string> = {
  /** 시간표 — 브랜드 기본(옐로우) */
  timetable: "bg-accent-500 text-primary",
  /** 강사진(Teacher) — 브랜드 기본(옐로우 pill + 네이비 텍스트) */
  teacher: "bg-accent-500 text-primary",
  /** 설명회 — 일정·신청(옐로우, 시간표와 동일 톤) */
  "info-session": "bg-accent-500 text-primary",
  /** 공지 — 차분(흰 pill, 새 색상 추가 없음) */
  notice: "bg-white text-primary",
  default: "bg-accent-500 text-primary",
};

/** 본문 인터랙션·강조에 쓰는 클래스 조각 */
export const sectionBodyClass = {
  timetable: {
    focusRing: "focus-visible:ring-primary",
    hoverBorder: "hover:border-primary",
  },
  teacher: {
    focusRing: "focus-visible:ring-teacher",
    hoverBorder: "hover:border-teacher",
    surface: "bg-teacher-50 text-teacher",
    text: "text-teacher",
    textBold: "font-bold text-teacher",
  },
  "info-session": {
    focusRing: "focus-visible:ring-primary",
    hoverBorder: "hover:border-primary",
    chip: "bg-accent-100 text-primary",
    cta: "bg-accent-500 text-primary hover:bg-accent-400 focus-visible:ring-primary",
  },
  notice: {
    focusRing: "focus-visible:ring-primary",
    hoverBorder: "hover:border-primary",
  },
  default: {
    focusRing: "focus-visible:ring-primary",
    hoverBorder: "hover:border-primary",
  },
} as const;
