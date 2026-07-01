import type { Metadata } from "next";

import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/site/config";

function buildVerification(): Metadata["verification"] {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const naver = process.env.NAVER_SITE_VERIFICATION?.trim();
  const daum = process.env.DAUM_SITE_VERIFICATION?.trim();

  if (!google && !naver && !daum) return undefined;

  return {
    ...(google ? { google } : {}),
    other: {
      ...(naver ? { "naver-site-verification": naver } : {}),
      ...(daum ? { "daum-site-verification": daum } : {}),
    },
  };
}

/** 루트 레이아웃 및 페이지에서 재사용하는 기본 메타데이터 */
export function createSiteMetadata(overrides?: Metadata): Metadata {
  const siteUrl = getSiteUrl();
  const ogImage = absoluteUrl(SITE_OG_IMAGE_PATH);

  const base: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      url: siteUrl,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: ogImage,
          alt: `${SITE_NAME} 로고`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: buildVerification(),
  };

  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    openGraph: { ...base.openGraph, ...overrides.openGraph },
    twitter: { ...base.twitter, ...overrides.twitter },
    alternates: { ...base.alternates, ...overrides.alternates },
    robots: overrides.robots ?? base.robots,
    verification: overrides.verification ?? base.verification,
  };
}
