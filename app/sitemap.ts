import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site/config";
import { STATIC_SITEMAP_ENTRIES } from "@/lib/site/sitemap-paths";
import { listPublishedPostsForSitemap } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_SITEMAP_ENTRIES.map(
    (entry) => ({
      url: absoluteUrl(entry.path),
      lastModified: new Date(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }),
  );

  const posts = await listPublishedPostsForSitemap();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/notice/${post.id}`),
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
