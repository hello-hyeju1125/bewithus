/** 사이트 공통 가로 컨테이너 (헤더·푸터·메인 섹션 정렬 기준) */
export const siteContainerClass =
  "mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10";

/** GNB 한 줄 높이 (px) — Header·메가메뉴 구분선 위치와 동일 */
export const HEADER_BAR_HEIGHT_PX = 72;

/** GNB 하단·메가메뉴 상단 구분선 위치 (Tailwind arbitrary value) */
export const headerBarTopClass = "top-[72px]";

/** 헤더 GNB 아래·푸터 위 — 메인 콘텐츠와의 공통 세로 간격 (px) */
export const SITE_CONTENT_GAP_PX = 48;

/** fixed 헤더·구분선 아래 → 메인 콘텐츠 시작 (헤더 72px + SITE_CONTENT_GAP_PX) */
export const siteMainBelowHeaderClass = "pt-[120px]";

/** 푸터 위 여백 — 헤더↔콘텐츠 간격과 동일 (48px) */
export const siteGapBeforeFooterClass = "mt-12";

/**
 * 우측 고정 SideWidget 공통 너비.
 * 메인 페이지 grid 의 3번째 컬럼(100px)과 동일.
 */
export const siteFloatingWidgetWidthClass = "lg:w-[100px]";

/** 세부 페이지 우측 고정 SideWidget 상단 inset (GNB 아래 + Hero 여유) */
export const siteFloatingWidgetTopClass = "top-[400px]";

/**
 * 우측 고정 SideWidget 과 본문이 겹치지 않도록 컨테이너 우측에 두는 안전 패딩.
 * = (lg:px-10 의 right 40px) + (widget 100px) + (gap-8 32px) = 172px
 * lg:pr-[172px] 은 lg:px-10 의 right 를 덮어쓴다.
 */
export const siteFloatingWidgetSafeClass = "lg:pr-[172px]";

/**
 * `siteFloatingWidgetSafeClass` 만 쓸 때 mx-auto 블록이 왼쪽으로 치우침.
 * lg:pr-[172px] 의 절반(86px) 만큼 오른쪽으로 보정해 화면 중앙에 맞춘다.
 */
export const siteFloatingWidgetCenterOffsetClass = "lg:translate-x-[86px]";
