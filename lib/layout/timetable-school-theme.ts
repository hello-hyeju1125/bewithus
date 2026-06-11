/**
 * 시간표 페이지(/timetable/[school]) — 학교별 구분 없이 티파니 블루(#81D8CF) 통일.
 *
 * Hex 변경이 필요하면 `tailwind.config.ts` 의 `tiffany` 스케일을 갱신할 것
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

/** 활성 버튼·칩: 티파니 배경 + 네이비 텍스트 (밝은 배경 대비) */
const TIFFANY_ACTIVE =
  "border-tiffany bg-tiffany text-primary";

const TIMETABLE_THEME: TimetableSchoolTheme = {
  hero: {
    section: "bg-tiffany text-primary",
    title: "text-primary",
    description: "text-primary/80",
  },
  grade: {
    active: TIFFANY_ACTIVE,
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-tiffany hover:text-tiffany-700",
  },
  view: {
    active: TIFFANY_ACTIVE,
    inactive:
      "border-transparent bg-transparent text-neutral-600 hover:text-tiffany-700",
  },
  chip: {
    active: TIFFANY_ACTIVE,
    inactive:
      "border-neutral-200 bg-white text-neutral-600 hover:border-tiffany hover:text-tiffany-700",
  },
  body: {
    heading: "text-tiffany-700",
    tagText: "text-tiffany-700",
    tagBorder: "border-tiffany",
    cardBorder: "border-tiffany-200",
    cardLabel: "text-tiffany-700",
    cardDivider: "border-tiffany-200",
    expandBtn: "text-tiffany-700 hover:border-tiffany",
    link: "border-tiffany-200 text-tiffany-700 hover:border-tiffany",
  },
};

export function getTimetableSchoolTheme(school: School): TimetableSchoolTheme {
  void school;
  return TIMETABLE_THEME;
}
