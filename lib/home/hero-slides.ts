import { ko } from "@/content/ko";
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
  tagline?: string;
  mainHeadline?: string;
  subtitle?: string;
};

export type PublicPopupBanner = {
  slot: HomeBannerSlot;
  href: string;
  backgroundImageUrl?: string;
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
      tagline: slide.tagline ?? ko.home.hero.tagline,
      mainHeadline: slide.mainHeadline,
      subtitle: slide.subtitle,
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
  return {
    slot: row.slot,
    href: row.href,
    backgroundImageUrl: row.background_image_url ?? undefined,
    tagline: row.tagline?.trim() || undefined,
    mainHeadline: row.main_headline?.trim() || undefined,
    subtitle: row.subtitle?.trim() || undefined,
  };
}

export function toPopupBanner(slide: PublicMainBanner): PublicPopupBanner {
  return {
    slot: slide.slot,
    href: slide.href,
    backgroundImageUrl: slide.backgroundImageUrl,
  };
}

/** 메인 고정 슬라이더 — `show_in_main` 이 켜진 배너 */
export function resolveMainBanners(rows: HomeHeroSlide[]): PublicMainBanner[] {
  const main = rows
    .filter((r) => r.show_in_main && hasBannerAsset(r))
    .map(mapHomeHeroSlideRow);

  const withImage = main.filter((s) =>
    isStoredBannerImageUrl(s.backgroundImageUrl),
  );
  if (withImage.length > 0) return withImage;
  if (main.length > 0) return main;

  const legacy = rows
    .filter(
      (r) =>
        (r.is_active || r.show_in_main) &&
        isStoredBannerImageUrl(r.background_image_url),
    )
    .map(mapHomeHeroSlideRow);
  if (legacy.length > 0) return legacy;

  const withCopy = rows
    .filter((r) => hasBannerAsset(r))
    .map(mapHomeHeroSlideRow)
    .filter((s) => s.mainHeadline || s.tagline);
  if (withCopy.length > 0) return withCopy;

  return fallbackMainBanners();
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
