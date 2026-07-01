import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
} from "@/lib/site/config";
import { escapeXml, toRfc822 } from "@/lib/site/xml";
import { listPublishedPostsForFeed } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = absoluteUrl("/");
  const feedUrl = absoluteUrl("/feed.xml");
  const posts = await listPublishedPostsForFeed(50);

  const items = posts
    .map((post) => {
      const link = absoluteUrl(`/notice/${post.id}`);
      const pubDate = toRfc822(new Date(post.created_at));
      const description = post.content_html?.trim() || post.title;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} 공지사항</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${toRfc822(new Date())}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
