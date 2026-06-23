/**
 * 검색엔진·RSS·사이트맵 등 SEO 전역 설정.
 *
 * 배포 도메인은 `.env.local` 의 `NEXT_PUBLIC_SITE_URL` 로 지정합니다.
 * 예: https://www.example.com (끝 슬래시 없이)
 */

export const SITE_NAME = "W대치위더스";
export const SITE_SHORT_NAME = "대치위더스";
export const SITE_DESCRIPTION =
  "W대치위더스는 대치동에서 결과로 증명하는 프리미엄 입시 전문 학원입니다. 대원외고·한영외고·일반고·중등 맞춤 시간표와 강사진, 설명회 안내.";
export const SITE_KEYWORDS = [
  "대치위더스",
  "대치동 학원",
  "입시 학원",
  "대원외고 학원",
  "한영외고 학원",
  "외고 학원",
  "중등 학원",
  "고등 학원",
  "대치동 입시",
];
export const SITE_LOCALE = "ko_KR";
export const SITE_LANGUAGE = "ko";
export const SITE_EMAIL = "withus5757@naver.com";
export const SITE_PHONE = "02-562-8787";
export const SITE_ADDRESS = "서울특별시 강남구 대치동 일대";

/** OG·Twitter 카드용 대표 이미지 (절대 URL 로 변환됨) */
export const SITE_OG_IMAGE_PATH = "/asset/logo.png";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
