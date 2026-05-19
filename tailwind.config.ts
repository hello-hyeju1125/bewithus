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
        card: "7px",
        hero: "8px",
        // 비대칭 리프 — 히어로 태그라인 박스 등
        leaf: "2.75rem 0.5rem 2.25rem 0.75rem",
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
