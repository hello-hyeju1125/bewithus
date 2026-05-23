/**
 * GNB 하위 공개 페이지 섹션 테마.
 * Hero 배경은 항상 primary(네이비). 섹션 구분은 eyebrow 텍스트 + 본문 액센트로만 한다.
 */
export type PublicSection =
  | "timetable"
  | "teacher"
  | "info-session"
  | "notice"
  | "default";

/** 네이비 Hero 위 eyebrow 아이콘·영문 라벨 텍스트 색 */
export const sectionHeroEyebrowClass: Record<PublicSection, string> = {
  timetable: "text-accent",
  teacher: "text-accent",
  "info-session": "text-accent",
  notice: "text-white",
  default: "text-accent",
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
    cta: "bg-accent-500 text-primary transition-colors duration-200 hover:bg-primary hover:text-accent-500 focus-visible:ring-primary",
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
