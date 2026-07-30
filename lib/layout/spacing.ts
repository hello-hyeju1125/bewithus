/** 사이트 공통 가로 컨테이너 (헤더·푸터·메인 섹션 정렬 기준). max-width 없이 뷰포트 전체 사용 */
export const siteContainerClass =
  "mx-auto w-full px-5 sm:px-8 lg:px-6";

/** GNB 한 줄 높이 (px) — Header·메가메뉴 구분선 위치와 동일 */
export const HEADER_BAR_HEIGHT_PX = 72;

/** GNB 하단·메가메뉴 상단 구분선 위치 (Tailwind arbitrary value) */
export const headerBarTopClass = "top-[72px]";

/** 헤더 GNB 아래·푸터 위 — 메인 콘텐츠와의 공통 세로 간격 (px) */
export const SITE_CONTENT_GAP_PX = 48;

/**
 * fixed 헤더 아래 → 메인 콘텐츠 시작.
 * 모바일: h-12 헤더(48px) + 12px 간격 = 60px
 * lg: 72px 헤더 + SITE_CONTENT_GAP_PX(48px) = 120px
 */
export const siteMainBelowHeaderClass = "pt-[60px] lg:pt-[120px]";

/** 푸터 위 여백 — 헤더↔콘텐츠 간격과 동일 (48px) */
export const siteGapBeforeFooterClass = "mt-12";

/**
 * 우측 고정 SideWidget 공통 너비.
 * 메인 페이지 grid 3번째 컬럼·세부 FAB 패널과 동일.
 */
export const siteFloatingWidgetWidthClass = "lg:w-[172px]";

/**
 * 홈·헤더 3열 그리드 — Hero | Cards | SideWidget
 * SideWidget 열을 넓혀 버튼·글자를 키우고, fr 열이 그만큼 줄어 겹침을 막는다.
 */
export const siteMainGridColsClass =
  "lg:grid-cols-[45fr_55fr_172px]";

/**
 * 우측 SideWidget — 화면 하단 inset (메인 grid 열용).
 */
export const siteSideWidgetBottomClass = "bottom-2 lg:bottom-4";

/**
 * 메인 페이지 grid 3열 — 열 높이를 채운 뒤 위젯을 하단에 맞춤.
 */
export const siteSideWidgetColumnClass =
  "hidden lg:block lg:relative lg:min-h-0 lg:self-stretch";

/** 메인 그리드 안에서 SideWidget 을 열 하단에 붙이고, 행 높이는 배너에만 맡긴다. */
export const siteSideWidgetAbsoluteClass =
  "absolute inset-0 flex flex-col justify-end overflow-y-auto overflow-x-hidden pb-1";

/**
 * @deprecated 세부 페이지는 FAB 원형 CTA 로 전환되어 본문 우측 예약 여백이 필요 없음.
 * 하위 호환을 위해 빈 문자열로 유지.
 */
export const siteFloatingWidgetSafeClass = "";

/** @deprecated FAB 전환 이후 미사용 — 빈 문자열 유지 */
export const siteFloatingWidgetCenteredSafeClass = "";

/** @deprecated FAB 전환 이후 미사용 — 빈 문자열 유지 */
export const siteFloatingWidgetCenterOffsetClass = "";
