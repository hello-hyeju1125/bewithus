import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // 프로젝트 norm: 메인 네이비는 #22295D (`.cursor/rules/design-tokens.mdc` 참조).
        primary: {
          DEFAULT: "#22295D",
          50: "#EEEFF6",
          100: "#D5D7E8",
          200: "#A9AED1",
          300: "#7D85BA",
          400: "#515CA3",
          500: "#38428A",
          600: "#22295D",
          700: "#1B214A",
          800: "#141937",
          900: "#0D1124",
        },
        // 프로젝트 norm: 포인트 컬러는 #FFF33B (`.cursor/rules/design-tokens.mdc` 참조).
        // 임의로 hex 를 바꾸지 말 것 — 브랜드 색상 변경 시 이 스케일을 통째로 갱신한다.
        accent: {
          DEFAULT: "#FFF33B",
          50: "#FFFEEC",
          100: "#FFFBCB",
          200: "#FFF79A",
          300: "#FFF45F",
          400: "#FFF146",
          500: "#FFF33B",
          600: "#E6DA2F",
          700: "#988F0C",
          800: "#655F08",
          900: "#332F04",
        },
        // 시간표 페이지 통일 티파니 블루 (#81D8CF). hex 변경 시 스케일 통째 갱신.
        tiffany: {
          DEFAULT: "#81D8CF",
          50: "#F0FAF9",
          100: "#D9F4F1",
          200: "#B3E9E3",
          300: "#9AE1D9",
          400: "#81D8CF",
          500: "#81D8CF",
          600: "#66C4B8",
          700: "#4BA89E",
          800: "#368278",
          900: "#245C56",
        },
        // 로고 워드마크 등 (시간표 UI와 별도). hex 변경 시 스케일 통째 갱신.
        daewon: {
          DEFAULT: "#224590",
          50: "#EEF2F9",
          100: "#D5DEEA",
          200: "#ABBDD5",
          300: "#819CBF",
          400: "#577BAA",
          500: "#3D6599",
          600: "#224590",
          700: "#1C3873",
          800: "#152B56",
          900: "#0E1E39",
        },
        // 한영외고 시간표(/timetable/hanyoung) 전용. hex 변경 시 스케일 통째 갱신.
        hanyoung: {
          DEFAULT: "#2A8A7A",
          50: "#EAF7F5",
          100: "#C9EBE6",
          200: "#9AD9CF",
          300: "#6BC7B8",
          400: "#4BB5A5",
          500: "#3AA396",
          600: "#2A8A7A",
          700: "#227366",
          800: "#1A5C52",
          900: "#12453E",
        },
        // 고등관 시간표(/timetable/general) 전용. hex 변경 시 스케일 통째 갱신.
        general: {
          DEFAULT: "#E78A29",
          50: "#FDF6ED",
          100: "#FAEBD5",
          200: "#F5D4AB",
          300: "#EFBD81",
          400: "#EAA657",
          500: "#E89440",
          600: "#E78A29",
          700: "#C97522",
          800: "#9F5C1A",
          900: "#754313",
        },
        // 개인 및 팀 수업 시간표(/timetable/private) 전용. hex 변경 시 스케일 통째 갱신.
        private: {
          DEFAULT: "#7968AE",
          50: "#F3F1F8",
          100: "#E5E0EF",
          200: "#CBC1DF",
          300: "#B1A2CF",
          400: "#9783BF",
          500: "#8876B4",
          600: "#7968AE",
          700: "#655791",
          800: "#514674",
          900: "#3D3557",
        },
        // 강사진(Teacher) Hero 전용 민트 (시간표 primary 네이비와 구분). hex 변경 시 스케일 통째 갱신.
        teacher: {
          DEFAULT: "#2A9185",
          50: "#EAF7F5",
          100: "#C9EBE6",
          200: "#9AD9CF",
          300: "#6BC7B8",
          400: "#4BB5A5",
          500: "#3AA396",
          600: "#2A9185",
          700: "#227A70",
          800: "#1A635C",
          900: "#124C47",
        },
        // GNB(메뉴바) 배경. hex 변경 시 스케일 통째 갱신.
        gnb: {
          DEFAULT: "#FDFCF8",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#F7F8FA",
          100: "#EEF0F4",
          200: "#DDE1E8",
          300: "#C2C8D2",
          400: "#9AA2B1",
          500: "#6E7689",
          600: "#4A5163",
          700: "#333947",
          800: "#1F232D",
          900: "#0F1218",
        },
      },
      fontFamily: {
        pretendard: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
        // 로고 워드마크 전용 — 본문 Pretendard 와 분리
        logo: ['"Noto Serif KR"', "serif"],
      },
      borderRadius: {
        button: "8px",
        /** 로고 박스 내부 — 외곽 rounded-button(8px) 과 이중 radius */
        "logo-inner": "6px",
        card: "7px",
        hero: "8px",
        // 비대칭 리프 — 히어로 태그라인 박스 등
        leaf: "2.75rem 0.5rem 2.25rem 0.75rem",
      },
      boxShadow: {
        /** 로고 노란 면 — 상단 하이라이트·하단 딤 (accent-300 / accent-600) */
        "logo-plate": "inset 0 1px 0 0 #FFF45F, inset 0 -1px 0 0 #E6DA2F",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
