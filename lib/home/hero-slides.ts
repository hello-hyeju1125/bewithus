import { ko } from "@/content/ko";
import { cacheBustVersion } from "@/lib/media/cache-bust";
import type { HomeHeroSlide } from "@/types/database";

export const HOME_BANNER_SLOTS = [1, 2, 3] as const;

export type HomeBannerSlot = (typeof HOME_BANNER_SLOTS)[number];

/** @deprecated use HOME_BANNER_SLOTS */
export const HOME_HERO_SLOTS = HOME_BANNER_SLOTS;

/** @deprecated use HomeBannerSlot */
export type HomeHeroSlideSlot = HomeBannerSlot;

export type PublicMainBanner = {
  slot: HomeBannerSlot;
  href: string;
  backgroundImageUrl?: string;
  /** Storage 이미지 캐시 버스터 (slide.updated_at) */
  imageVersion?: string;
  tagline?: string;
  mainHeadline?: string;
  subtitle?: string;
};

export type PublicPopupBanner = {
  slot: HomeBannerSlot;
  href: string;
  backgroundImageUrl?: string;
  imageVersion?: string;
};

export const FALLBACK_HERO_SETTINGS_VERSION = "static-fallback";

const FALLBACK_MAIN_IMAGES: Record<HomeBannerSlot, string> = {
  1: "/asset/banner_01_full.svg",
  2: "/asset/banner_02_full.svg",
  3: "/asset/banner_03.svg",
};

export type PublicHeroContent = {
  mainSlides: PublicMainBanner[];
  popupSlides: PublicPopupBanner[];
  settingsUpdatedAt: string;
};

export function fallbackMainBanners(): PublicMainBanner[] {
  return ko.home.hero.slides.map((slide, idx) => {
    const slot = (idx + 1) as HomeBannerSlot;
    return {
      slot,
      href: slide.href,
      // 풀 배너 이미지 — 텍스트 오버레이 없음 (admin 이미지 배너와 동일)
      backgroundImageUrl: FALLBACK_MAIN_IMAGES[slot],
    };
  });
}

export function fallbackHeroContent(): PublicHeroContent {
  return {
    mainSlides: fallbackMainBanners(),
    popupSlides: [],
    settingsUpdatedAt: FALLBACK_HERO_SETTINGS_VERSION,
  };
}

export function isStoredBannerImageUrl(url?: string | null): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}

export function hasBannerAsset(row: HomeHeroSlide): boolean {
  return (
    isStoredBannerImageUrl(row.background_image_url) ||
    Boolean(row.main_headline?.trim()) ||
    Boolean(row.tagline?.trim())
  );
}

export function mapHomeHeroSlideRow(row: HomeHeroSlide): PublicMainBanner {
  const backgroundImageUrl = row.background_image_url ?? undefined;
  const hasImage = isStoredBannerImageUrl(backgroundImageUrl);

  return {
    slot: row.slot,
    href: row.href,
    backgroundImageUrl,
    imageVersion: cacheBustVersion(row.updated_at),
    // 이미지가 있으면 완성된 배너로 취급 — 시드/레거시 카피는 올리지 않음
    tagline: hasImage ? undefined : row.tagline?.trim() || undefined,
    mainHeadline: hasImage
      ? undefined
      : row.main_headline?.trim() || undefined,
    subtitle: hasImage ? undefined : row.subtitle?.trim() || undefined,
  };
}

export function toPopupBanner(slide: PublicMainBanner): PublicPopupBanner {
  return {
    slot: slide.slot,
    href: slide.href,
    backgroundImageUrl: slide.backgroundImageUrl,
    imageVersion: slide.imageVersion,
  };
}

/** 메인 고정 슬라이더 — `show_in_main` 이 켜진 배너만. DB에 행이 있으면 fallback 정적 배너는 쓰지 않음. */
export function resolveMainBanners(rows: HomeHeroSlide[]): PublicMainBanner[] {
  const main = rows
    .filter((r) => r.show_in_main && hasBannerAsset(r))
    .map(mapHomeHeroSlideRow);

  const withImage = main.filter((s) =>
    isStoredBannerImageUrl(s.backgroundImageUrl),
  );
  if (withImage.length > 0) return withImage;
  if (main.length > 0) return main;

  // 배치 플래그 이전 데이터 — 이미지 + is_active
  const legacy = rows
    .filter(
      (r) =>
        (r.is_active || r.show_in_main) &&
        isStoredBannerImageUrl(r.background_image_url),
    )
    .map(mapHomeHeroSlideRow);
  if (legacy.length > 0) return legacy;

  // admin에 슬롯이 있으면 정적 `/asset/banner_*.svg` 로 되돌리지 않음
  return [];
}

/** 팝업 — `show_in_popup` 이 켜진 배너 (동일 이미지·링크) */
export function resolvePopupBanners(rows: HomeHeroSlide[]): PublicPopupBanner[] {
  return rows
    .filter(
      (r) =>
        r.show_in_popup &&
        isStoredBannerImageUrl(r.background_image_url),
    )
    .map(mapHomeHeroSlideRow)
    .map(toPopupBanner);
}

/** @deprecated */
export type PublicHeroSlide = PublicMainBanner;

/** @deprecated */
export function fallbackHeroSlides(): PublicMainBanner[] {
  return fallbackMainBanners();
}
