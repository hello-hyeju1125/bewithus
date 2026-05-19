/**
 * W대치위더스 (bewithus) 한국어 카피 모음
 *
 * - 모든 화면 텍스트는 이 파일을 통해 노출합니다. 컴포넌트 내 하드코딩 금지.
 * - 키 네이밍: `<영역>.<요소>` (예: `home.hero.title`)
 * - 신규 카피 추가 시, 임시 더미라도 학원 도메인 톤(프리미엄/절제)에 맞춰 작성합니다.
 */

export const ko = {
  brand: {
    short: "대치위더스",
    mark: "W",
    fullAria: "W대치위더스 홈으로 이동",
  },
  nav: {
    primary: [
      { label: "전체보기", href: "/" },
      {
        label: "시간표",
        href: "/timetable/daewon",
        children: [
          { label: "대원외고", href: "/timetable/daewon" },
          { label: "한영외고", href: "/timetable/hanyoung" },
          { label: "일반고", href: "/timetable/general" },
          { label: "개인 팀 수업", href: "/timetable/private" },
        ],
      },
      {
        label: "강사진",
        href: "/teachers/daewon",
        children: [
          { label: "대원외고", href: "/teachers/daewon" },
          { label: "한영외고", href: "/teachers/hanyoung" },
          { label: "일반고", href: "/teachers/general" },
        ],
      },
      {
        label: "설명회",
        href: "/info-session/daewon",
        children: [
          { label: "대원외고", href: "/info-session/daewon" },
          { label: "한영외고", href: "/info-session/hanyoung" },
          { label: "일반고", href: "/info-session/general" },
        ],
      },
      {
        label: "공지사항",
        href: "/notice",
        children: [
          { label: "공지게시판", href: "/notice" },
          { label: "오시는 길", href: "/location" },
          { label: "시설 안내", href: "/facility" },
        ],
      },
    ],
    cta: { label: "상담 신청", href: "/contact" },
    a11y: {
      primaryLabel: "주요 메뉴",
      openMenu: "메뉴 열기",
      closeMenu: "메뉴 닫기",
      mobileDialogLabel: "모바일 주요 메뉴",
    },
  },
  sideWidget: {
    a11y: { label: "빠른 신청 및 연락처" },
    actions: [
      { label: "문자 수신\n등록 / 신청", href: "/sms", icon: "bell" as const },
      {
        label: "설명회\n등록 / 신청",
        href: "/info-session/daewon",
        icon: "presentation" as const,
      },
    ],
    phones: [
      { name: "P관", display: "02.562.8787", tel: "02-562-8787" },
      { name: "M관", display: "02.562.5757", tel: "02-562-5757" },
      { name: "S관·입시관", display: "02.562.5759", tel: "02-562-5759" },
    ],
  },
  home: {
    hero: {
      tagline: "우수한 강사진과 수업으로 최고를!",
      ctaLabel: "시간표 보기",
      slides: [
        {
          tagline: "대원외고 부동의 1위",
          mainHeadline: "대원외고\n수업 안내",
          subtitle: "2026년 2학기",
          href: "/timetable/daewon",
        },
        {
          tagline: "한영외고 진학 1위",
          mainHeadline: "한영외고\n수업 안내",
          subtitle: "2026년 2학기",
          href: "/timetable/hanyoung",
        },
      ] as ReadonlyArray<{
        tagline?: string;
        mainHeadline: string;
        subtitle: string;
        href: string;
      }>,
      a11y: {
        region: "메인 히어로 슬라이더",
        prev: "이전 슬라이드",
        next: "다음 슬라이드",
        goTo: (n: number, total: number) => `${total}개 중 ${n}번째 슬라이드로 이동`,
      },
    },
    cards: {
      period: "2026년",
      items: [
        {
          title: "대원외고",
          subtitle: "시간표 및 강사 소개",
          href: "/timetable/daewon",
        },
        {
          title: "한영외고",
          subtitle: "시간표 및 강사 소개",
          href: "/timetable/hanyoung",
        },
        {
          title: "입시관",
          subtitle: "시간표 및 강사 소개",
          href: "/timetable/general",
        },
        {
          title: "개인 및 팀 수업",
          subtitle: "시간표 및 강사 소개",
          href: "/timetable/private",
        },
        { title: "입학 상담", href: "/contact" },
        { title: "문자 수신 등록", href: "/sms" },
        { title: "오시는 길", href: "/location" },
        { title: "학원 소개", href: "/facility" },
      ] as ReadonlyArray<{
        title: string;
        subtitle?: string;
        href: string;
      }>,
    },
  },
  footer: {
    brand: {
      name: "W대치위더스",
      tagline: "대치동에서 결과로 증명하는 프리미엄 입시 전문 학원",
    },
    quickLinks: {
      title: "빠른 메뉴",
      items: [
        { label: "개인정보처리방침", href: "#" },
        { label: "이용약관", href: "#" },
        { label: "교습비", href: "#" },
      ],
    },
    customerCenter: {
      title: "고객센터",
      phones: [
        { display: "02.562.8787", tel: "02-562-8787" },
        { display: "02.562.5757", tel: "02-562-5757" },
        { display: "02.562.5759", tel: "02-562-5759" },
      ],
      hours: "[상담 시간] 평일 14:00 ~ 22:00, 주말 09:00 ~ 22:00",
    },
    legal: {
      businessNumber: "사업자등록번호: 592-87-01265",
      academyNumber: "학원설립·운영 등록번호: 제10388호",
      reportingAuthority: "신고기관명: 서울시 강남서초교육지원청",
      copyright: "Copyright(c) 대치위더스학원 All right Reserved.",
    },
    a11y: {
      label: "사이트 푸터",
    },
  },
} as const;

export type Ko = typeof ko;
