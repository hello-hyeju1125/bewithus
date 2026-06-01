import { ko } from "@/content/ko";
import type { HomeHeroSlide } from "@/types/database";

export type PublicHeroSlide = {
  slot: 1 | 2;
  tagline: string;
  mainHeadline: string;
  subtitle?: string;
  href: string;
  backgroundImageUrl?: string;
};

export const FALLBACK_HERO_SETTINGS_VERSION = "static-fallback";

export type PublicHeroContent = {
  slides: PublicHeroSlide[];
  ctaLabel: string;
  popupEnabled: boolean;
  settingsUpdatedAt: string;
};

export function fallbackHeroCtaLabel(): string {
  return ko.home.hero.ctaLabel;
}

export function fallbackHeroSlides(): PublicHeroSlide[] {
  return ko.home.hero.slides.map((slide, idx) => ({
    slot: (idx + 1) as 1 | 2,
    tagline: slide.tagline ?? ko.home.hero.tagline,
    mainHeadline: slide.mainHeadline,
    subtitle: slide.subtitle,
    href: slide.href,
  }));
}

export function fallbackHeroContent(): PublicHeroContent {
  return {
    slides: fallbackHeroSlides(),
    ctaLabel: fallbackHeroCtaLabel(),
    popupEnabled: false,
    settingsUpdatedAt: FALLBACK_HERO_SETTINGS_VERSION,
  };
}

export function mapHomeHeroSlideRow(row: HomeHeroSlide): PublicHeroSlide {
  return {
    slot: row.slot,
    tagline: row.tagline,
    mainHeadline: row.main_headline,
    subtitle: row.subtitle ?? undefined,
    href: row.href,
    backgroundImageUrl: row.background_image_url ?? undefined,
  };
}
