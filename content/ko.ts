import {
  DEFAULT_INFO_SESSION_PATH,
  SMS_REGISTRATION_FORM_URL,
} from "@/lib/constants";

/**
 * 대치위더스 (bewithus) 한국어 카피 모음
 *
 * - 모든 화면 텍스트는 이 파일을 통해 노출합니다. 컴포넌트 내 하드코딩 금지.
 * - 키 네이밍: `<영역>.<요소>` (예: `home.hero.title`)
 * - 신규 카피 추가 시, 임시 더미라도 학원 도메인 톤(프리미엄/절제)에 맞춰 작성합니다.
 */

export const ko = {
  brand: {
    short: "대치위더스",
    fullAria: "대치위더스 홈으로 이동",
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
          { label: "고등관", href: "/timetable/general" },
          { label: "중등관", href: "/timetable/middle" },
          { label: "개인 팀 수업", href: "/timetable/private" },
        ],
      },
      {
        label: "강사진",
        href: "/teachers",
        children: [{ label: "전체", href: "/teachers" }],
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
    cta: { label: "상담 신청" },
    a11y: {
      primaryLabel: "주요 메뉴",
      openMenu: "메뉴 열기",
      closeMenu: "메뉴 닫기",
      mobileDialogLabel: "모바일 주요 메뉴",
    },
  },
  sideWidget: {
    a11y: {
      label: "빠른 신청 및 연락처",
      fabLabel: "상담",
      openFab: "상담 · 신청 메뉴 열기",
      closeFab: "상담 · 신청 메뉴 닫기",
    },
    actions: [
      {
        label: "문자 수신\n등록 / 신청",
        href: SMS_REGISTRATION_FORM_URL,
        icon: "bell" as const,
      },
      {
        label: "설명회\n등록 / 신청",
        href: DEFAULT_INFO_SESSION_PATH,
        icon: "presentation" as const,
      },
    ],
    phones: [
      { name: "P관·S관", display: "02.562.8787", tel: "02-562-8787" },
      { name: "M관", display: "02.562.5757", tel: "02-562-5757" },
      { name: "입시관", display: "02.562.5759", tel: "02-562-5759" },
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
          href: "/timetable/daewon",
        },
        {
          tagline: "한영외고 진학 1위",
          mainHeadline: "한영외고\n수업 안내",
          href: "/timetable/hanyoung",
        },
      ] as ReadonlyArray<{
        tagline?: string;
        mainHeadline: string;
        subtitle?: string;
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
          subtitle: "시간표",
          href: "/timetable/daewon",
        },
        {
          title: "한영외고",
          subtitle: "시간표",
          href: "/timetable/hanyoung",
        },
        {
          title: "고등관",
          subtitle: "시간표",
          href: "/timetable/general",
        },
        {
          title: "중등관",
          subtitle: "시간표",
          href: "/timetable/middle",
        },
        {
          title: "개인/팀수업",
          subtitle: "시간표",
          href: "/timetable/private",
        },
      ] as ReadonlyArray<{ title: string; subtitle?: string; href: string }>,
      info: [
        { title: "입학 상담", openConsultation: true as const },
        { title: "오시는 길", href: "/location" },
      ] as ReadonlyArray<
        | { title: string; href: string }
        | { title: string; openConsultation: true }
      >,
    },
  },
  teachersPage: {
    all: {
      title: "강사진",
      description: {
        closingLines: [
          "대원외고·한영외고·일반고",
          "전문 강사진을 한곳에서 확인하실 수 있습니다.",
        ],
      },
      metaTitle: "강사진 | 대치위더스",
      metaDescription:
        "대원외고·한영외고·일반고 전문 강사진을 소개합니다.",
    },
  },
  consultation: {
    title: "입학 상담 신청",
    description:
      "아래 내용을 작성해 주시면 담당자가 확인 후 연락드리겠습니다.",
    fields: {
      studentName: "학생 이름",
      parentName: "학부모 성함",
      phone: "전화번호",
      schoolGrade: "학교 및 학년",
      subject: "과목",
      message: "상담 내용",
    },
    submit: "상담 신청하기",
    submitting: "접수 중…",
    success: "상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.",
  },
  footer: {
    brand: {
      name: "대치위더스",
      tagline: "대치동에서 결과로 증명하는 프리미엄 입시 전문 학원",
    },
    quickLinks: {
      title: "빠른 메뉴",
      items: [
        { label: "개인정보처리방침", action: "privacy-policy" },
        { label: "이용약관", action: "terms-of-service" },
        { label: "교습비", action: "tuition" },
      ],
    },
    customerCenter: {
      title: "고객센터",
      phones: [
        { display: "02.562.8787", tel: "02-562-8787" },
        { display: "02.562.5757", tel: "02-562-5757" },
        { display: "02.562.5759", tel: "02-562-5759" },
      ],
      hours: {
        label: "[상담 시간]",
        weekday: "평일 14:00 ~ 22:00,",
        weekend: "주말 09:00 ~ 22:00",
        /** sm 이상 — 한 줄 표기 */
        desktop: "[상담 시간] 평일 14:00 ~ 22:00, 주말 09:00 ~ 22:00",
      },
    },
    legal: {
      businessEntities: [
        "(주)대치위더스학원 (사업자등록번호 592-87-01265)",
        "(주)대치위더스에듀 (사업자등록번호 584-87-02545)",
        "대치위더스 엠(M)관 학원 (사업자등록번호 620-99-51030)",
      ],
      academyNumber:
        "학원설립·운영 등록번호: 프리미엄관(제12945호), M관(제13258호), 입시관(제10388호), S관 (제 15255호)",
      reportingAuthority: "신고기관명: 서울시 강남서초교육지원청",
      copyright: "Copyright(c) 대치위더스학원 All right Reserved.",
    },
    a11y: {
      label: "사이트 푸터",
    },
  },
  admin: {
    teachers: {
      photoSpec: {
        title: "권장 프로필 사진",
        intro:
          "강사진 카드는 세로 4:5 영역으로 표시됩니다. 업로드 시 확대·축소·크롭으로 구도를 맞춘 뒤 저장하세요.",
        bullets: [
          "권장 비율 4:5 (가로 4 × 세로 5, 세로형 인물 사진)",
          "권장 800 × 1000px (고해상도는 1200 × 1500px)",
          "최소 400 × 500px",
          "형식 JPG·PNG·WebP, 파일당 10MB 이하",
          "업로드 후 확대·축소·크롭으로 얼굴·상반신(어깨·팔) 구도를 맞출 수 있습니다",
          "인물이 하단(이름 칸)에 붙도록 크롭하면 카드에서 가장 깔끔합니다",
          "정사각형·가로형도 업로드 가능하며, 크롭 단계에서 4:5로 맞춥니다",
        ],
        notes: [
          "데스크톱·미리보기: 크롭 결과(4:5)가 카드에 표시됩니다",
          "모바일 카드: 동일 비율 썸네일로 표시",
          "기존 사진도 ‘확대·축소 / 크롭’으로 다시 조정할 수 있습니다",
          "정말 필요한 경우만 lib/teachers/photo-overrides.ts 에서 이름별 예외를 추가합니다",
        ],
      },
    },
    homeBanners: {
      imageSpec: {
        title: "권장 이미지 크기",
        intro:
          "메인 고정·팝업에 같은 이미지가 쓰이며, 화면에 맞춰 가장자리가 잘릴 수 있습니다. 아래 비율·픽셀을 기준으로 제작해 주세요.",
        bullets: [
          "비율 4:5 (가로 4 × 세로 5, 세로형)",
          "권장 1200 × 1500px",
          "최소 800 × 1000px",
          "형식 JPG·PNG·WebP, 파일당 10MB 이하",
          "문구·로고 등 중요 요소는 이미지 중앙 80% 안에 배치 (모바일·PC에서 상하·좌우가 잘릴 수 있음)",
        ],
        notes: [
          "메인 고정: PC 기준 약 4:5 비율(너비에 비례)로 표시",
          "팝업: 카드당 4:5 비율, 최대 약 360×450px로 표시",
        ],
      },
    },
  },
} as const;

export type Ko = typeof ko;
