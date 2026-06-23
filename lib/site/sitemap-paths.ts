import { SCHOOLS, STAFF_SCHOOLS } from "@/lib/constants";

export type SitemapStaticEntry = {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

/** DB 없이도 노출되는 공개 정적 경로 */
export const STATIC_SITEMAP_ENTRIES: SitemapStaticEntry[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  ...SCHOOLS.map((school) => ({
    path: `/timetable/${school}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })),
  { path: "/teachers", changeFrequency: "weekly", priority: 0.85 },
  ...STAFF_SCHOOLS.map((school) => ({
    path: `/teachers/${school}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  })),
  ...STAFF_SCHOOLS.map((school) => ({
    path: `/info-session/${school}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  })),
  { path: "/notice", changeFrequency: "daily", priority: 0.8 },
  { path: "/location", changeFrequency: "monthly", priority: 0.7 },
  { path: "/facility", changeFrequency: "monthly", priority: 0.7 },
];
