import {
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  absoluteUrl,
} from "@/lib/site/config";

export default function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    alternateName: "대치위더스학원",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/asset/logo.png"),
    description: SITE_DESCRIPTION,
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "서울특별시 강남구",
      addressRegion: "서울특별시",
      addressCountry: "KR",
      streetAddress: SITE_ADDRESS,
    },
    areaServed: "KR",
    inLanguage: "ko-KR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
