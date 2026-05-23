import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, ListOrdered } from "lucide-react";

import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import NoticePageHero from "@/components/notice/NoticePageHero";
import {
  siteContainerClass,
  siteFloatingWidgetSafeClass,
} from "@/lib/layout/spacing";
import { getPost, incrementPostViewCount } from "@/lib/supabase/queries";
import { sanitizePostHtmlAsync } from "@/lib/html-sanitize";

type NoticeDetailPageProps = {
  params: { id: string };
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export async function generateMetadata({ params }: NoticeDetailPageProps) {
  const result = await getPost(params.id);
  if (!result) return { title: "공지사항 | W대치위더스" };
  return {
    title: `${result.post.title} | 공지사항`,
    description: result.post.title,
  };
}

export default async function NoticeDetailPage({
  params,
}: NoticeDetailPageProps) {
  const result = await getPost(params.id);
  if (!result) notFound();

  void incrementPostViewCount(result.post.id);

  const { post, prev, next } = result;
  const safeHtml = await sanitizePostHtmlAsync(post.content_html);

  return (
    <StaggeredPageShell
      pageKey={post.id}
      hero={<NoticePageHero title={post.title} />}
      content={
        <article
          className={`${siteContainerClass} ${siteFloatingWidgetSafeClass} py-10 sm:py-12 lg:py-14`}
        >
          <div className="mx-auto w-full max-w-[960px]">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-5">
              <p className="text-[14px] text-neutral-500">
                등록일{" "}
                <span className="font-semibold text-neutral-700">
                  {formatDate(post.created_at)}
                </span>
              </p>
              <p className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500">
                <Eye className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                조회 {post.view_count.toLocaleString()}
              </p>
            </header>

            <div
              className="prose-notice mt-8 space-y-4 text-[15px] leading-relaxed text-neutral-800 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-100 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-600 [&_h2]:mt-6 [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mt-5 [&_h3]:text-[17px] [&_h3]:font-bold [&_h3]:text-primary [&_img]:my-2 [&_img]:rounded-card [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-neutral-200 [&_td]:p-2 [&_th]:border [&_th]:border-neutral-200 [&_th]:bg-neutral-50 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />

            <nav
              aria-label="이전/다음 글"
              className="mt-12 flex flex-col gap-2 border-t border-neutral-200 pt-6"
            >
              {prev ? (
                <Link
                  href={`/notice/${prev.id}`}
                  className="group flex items-center justify-between gap-4 rounded-button px-2 py-3 text-[14px] outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex items-center gap-2 text-neutral-500">
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    이전 글
                  </span>
                  <span className="line-clamp-1 max-w-[60%] text-right font-semibold text-neutral-800 group-hover:text-primary">
                    {prev.title}
                  </span>
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/notice/${next.id}`}
                  className="group flex items-center justify-between gap-4 rounded-button px-2 py-3 text-[14px] outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex items-center gap-2 text-neutral-500">
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    다음 글
                  </span>
                  <span className="line-clamp-1 max-w-[60%] text-right font-semibold text-neutral-800 group-hover:text-primary">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </nav>

            <div className="mt-8 flex justify-center">
              <Link
                href="/notice"
                className="inline-flex items-center gap-2 rounded-button border border-neutral-200 px-5 py-2.5 text-[14px] font-semibold text-neutral-700 outline-none transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ListOrdered className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                목록으로
              </Link>
            </div>
          </div>
        </article>
      }
    />
  );
}
