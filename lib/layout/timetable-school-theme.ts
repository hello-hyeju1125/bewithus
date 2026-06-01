/**
 * 시간표 페이지(/timetable/[school]) 학교별 컬러 테마.
 *
 * Hex 변경이 필요하면 `tailwind.config.ts` 의 학교별 스케일을 갱신할 것
 * (디자인 토큰 룰: `.cursor/rules/design-tokens.mdc`).
 */

import type { School } from "@/lib/constants";

export type TimetableSchoolTheme = {
  /** Hero 영역 — bg/text 클래스 (SubPageHero 의 surfaceClass/titleClass/descriptionClass 로 전달) */
  hero: {
    section: string;
    title: string;
    description: string;
  };
  /** 학년 탭 (고1/고2/고3) */
  grade: {
    active: string;
    inactive: string;
  };
  /** 보기 형식 탭 (요약/상세) */
  view: {
    active: string;
    inactive: string;
  };
  /** 과목 필터 칩 (#전체 / #영어 …) */
  chip: {
    active: string;
    inactive: string;
  };
  /** 본문 — 과목 제목, 태그, 강사 카드 등 */
  body: {
    heading: string;
    tagText: string;
    tagBorder: string;
    cardBorder: string;
    cardLabel: string;
    cardDivider: string;
    expandBtn: string;
    link: string;
  };
};

const daewonTheme: TimetableSchoolTheme = {
  hero: {
    section: "bg-daewon-600 text-white",
    title: "text-white",
    description: "text-white/85",
  },
  grade: {
    active: "border-daewon-600 bg-daewon-600 text-white",
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-daewon-600 hover:text-daewon-700",
  },
  view: {
    active: "border-daewon-600 bg-daewon-600 text-white",
    inactive:
      "border-transparent bg-transparent text-neutral-600 hover:text-daewon-700",
  },
  chip: {
    active: "border-daewon-600 bg-daewon-600 text-white",
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-daewon-600 hover:text-daewon-700",
  },
  body: {
    heading: "text-daewon-700",
    tagText: "text-daewon-700",
    tagBorder: "border-daewon-600",
    cardBorder: "border-daewon-200",
    cardLabel: "text-daewon-700",
    cardDivider: "border-daewon-200",
    expandBtn: "text-daewon-700 hover:border-daewon-600",
    link: "border-daewon-200 text-daewon-700 hover:border-daewon-600",
  },
};

const hanyoungTheme: TimetableSchoolTheme = {
  hero: {
    section: "bg-hanyoung-600 text-white",
    title: "text-white",
    description: "text-white/85",
  },
  grade: {
    active: "border-hanyoung-600 bg-hanyoung-600 text-white",
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-hanyoung-600 hover:text-hanyoung-700",
  },
  view: {
    active: "border-hanyoung-600 bg-hanyoung-600 text-white",
    inactive:
      "border-transparent bg-transparent text-neutral-600 hover:text-hanyoung-700",
  },
  chip: {
    active: "border-hanyoung-600 bg-hanyoung-600 text-white",
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-hanyoung-600 hover:text-hanyoung-700",
  },
  body: {
    heading: "text-hanyoung-700",
    tagText: "text-hanyoung-700",
    tagBorder: "border-hanyoung-600",
    cardBorder: "border-hanyoung-200",
    cardLabel: "text-hanyoung-700",
    cardDivider: "border-hanyoung-200",
    expandBtn: "text-hanyoung-700 hover:border-hanyoung-600",
    link: "border-hanyoung-200 text-hanyoung-700 hover:border-hanyoung-600",
  },
};

const generalTheme: TimetableSchoolTheme = {
  hero: {
    section: "bg-general-600 text-white",
    title: "text-white",
    description: "text-white/85",
  },
  grade: {
    active: "border-general-600 bg-general-600 text-white",
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-general-600 hover:text-general-700",
  },
  view: {
    active: "border-general-600 bg-general-600 text-white",
    inactive:
      "border-transparent bg-transparent text-neutral-600 hover:text-general-700",
  },
  chip: {
    active: "border-general-600 bg-general-600 text-white",
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-general-600 hover:text-general-700",
  },
  body: {
    heading: "text-general-700",
    tagText: "text-general-700",
    tagBorder: "border-general-600",
    cardBorder: "border-general-200",
    cardLabel: "text-general-700",
    cardDivider: "border-general-200",
    expandBtn: "text-general-700 hover:border-general-600",
    link: "border-general-200 text-general-700 hover:border-general-600",
  },
};

const privateTheme: TimetableSchoolTheme = {
  hero: {
    section: "bg-private-600 text-white",
    title: "text-white",
    description: "text-white/85",
  },
  grade: {
    active: "border-private-600 bg-private-600 text-white",
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-private-600 hover:text-private-700",
  },
  view: {
    active: "border-private-600 bg-private-600 text-white",
    inactive:
      "border-transparent bg-transparent text-neutral-600 hover:text-private-700",
  },
  chip: {
    active: "border-private-600 bg-private-600 text-white",
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-private-600 hover:text-private-700",
  },
  body: {
    heading: "text-private-700",
    tagText: "text-private-700",
    tagBorder: "border-private-600",
    cardBorder: "border-private-200",
    cardLabel: "text-private-700",
    cardDivider: "border-private-200",
    expandBtn: "text-private-700 hover:border-private-600",
    link: "border-private-200 text-private-700 hover:border-private-600",
  },
};

const TIMETABLE_SCHOOL_THEMES: Record<School, TimetableSchoolTheme> = {
  daewon: daewonTheme,
  hanyoung: hanyoungTheme,
  general: generalTheme,
  private: privateTheme,
};

export function getTimetableSchoolTheme(school: School): TimetableSchoolTheme {
  return TIMETABLE_SCHOOL_THEMES[school];
}
