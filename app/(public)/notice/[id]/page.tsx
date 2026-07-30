import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ListOrdered } from "lucide-react";

import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import NoticePageHero from "@/components/notice/NoticePageHero";
import {
  siteContainerClass,
} from "@/lib/layout/spacing";
import { getPost, incrementPostViewCount } from "@/lib/supabase/queries";
import { resolvePostHtml } from "@/lib/admin/sanitize";
import { sanitizePostHtmlForDisplay } from "@/lib/html-sanitize";
import { bustSupabaseImagesInHtml } from "@/lib/media/cache-bust";

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
  if (!result) return { title: "공지사항 | 대치위더스" };
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
  const safeHtml = bustSupabaseImagesInHtml(
    await sanitizePostHtmlForDisplay(resolvePostHtml(post)),
    post.updated_at,
  );

  return (
    <StaggeredPageShell
      pageKey={post.id}
      hero={
        <NoticePageHero
          title="대치위더스 소식"
          description={{
            closingLines: [
              "학원 운영과 입시 일정에 대한",
              "공식 안내를 전해드립니다.",
            ],
          }}
          tiffanyHero
        />
      }
      content={
        <article
          className={`${siteContainerClass} py-10 sm:py-12 lg:py-14`}
        >
          <div
            className={`mx-auto w-full max-w-[1680px]`}
          >
            <h1 className="text-balance whitespace-pre-line text-[24px] font-black leading-snug tracking-tight text-primary sm:text-[38px] lg:text-[44px]">
              {post.title}
            </h1>
            <header className="mt-5 border-b border-neutral-200 pb-5">
              <p className="text-[16px] text-neutral-500 sm:text-[18px]">
                등록일{" "}
                <span className="font-semibold text-neutral-700">
                  {formatDate(post.created_at)}
                </span>
              </p>
            </header>

            <div
              className="prose-notice mt-8 space-y-4 overflow-x-auto text-[18px] leading-relaxed text-neutral-800 sm:text-[22px] [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-100 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-600 [&_h2]:mt-6 [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:text-primary sm:[&_h2]:text-[28px] [&_h3]:mt-5 [&_h3]:text-[20px] [&_h3]:font-bold [&_h3]:text-primary sm:[&_h3]:text-[24px] [&_img]:my-2 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-card [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_table]:my-4 [&_table]:w-full [&_table]:min-w-[480px] [&_table]:border-collapse [&_td]:border [&_td]:border-neutral-200 [&_td]:p-2 [&_th]:border [&_th]:border-neutral-200 [&_th]:bg-neutral-50 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />

            <nav
              aria-label="이전/다음 글"
              className="mt-12 flex flex-col gap-2 border-t border-neutral-200 pt-6"
            >
              {prev ? (
                <Link
                  href={`/notice/${prev.id}`}
                  className="group flex items-center justify-between gap-4 rounded-button px-2 py-3 text-[18px] outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex items-center gap-2 text-neutral-500">
                    <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
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
                  className="group flex items-center justify-between gap-4 rounded-button px-2 py-3 text-[18px] outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex items-center gap-2 text-neutral-500">
                    <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
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
                className="inline-flex items-center gap-2 rounded-button border border-neutral-200 px-5 py-2.5 text-[18px] font-semibold text-neutral-700 outline-none transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
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
