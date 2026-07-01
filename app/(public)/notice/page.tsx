import Link from "next/link";
import { Pin } from "lucide-react";

import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import NoticePageHero from "@/components/notice/NoticePageHero";
import Pagination from "@/components/notice/Pagination";
import {
  siteContainerClass,
  siteFloatingWidgetCenterOffsetClass,
  siteFloatingWidgetSafeClass,
} from "@/lib/layout/spacing";
import { listPosts } from "@/lib/supabase/queries";

type NoticeListPageProps = {
  searchParams: { page?: string };
};

export const metadata = {
  title: "공지사항 | W대치위더스",
  description: "대치위더스 학원의 공지사항을 확인하세요.",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default async function NoticeListPage({
  searchParams,
}: NoticeListPageProps) {
  const parsed = Number.parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  const { posts, total, page: safePage, totalPages } = await listPosts(page);

  return (
    <StaggeredPageShell
      pageKey={`notice-list-${safePage}`}
      hero={
        <NoticePageHero
          title="대치위더스 소식"
          description="학원 운영과 입시 일정에 대한 공식 안내를 가장 빠르게 전해드립니다."
          tiffanyHero
        />
      }
      content={
        <section
          aria-label="공지사항 목록"
          className={`${siteContainerClass} ${siteFloatingWidgetSafeClass} py-10 sm:py-12 lg:py-14`}
        >
          {posts.length === 0 ? (
            <div
              className={`mx-auto w-full max-w-[960px] ${siteFloatingWidgetCenterOffsetClass}`}
            >
              <p className="rounded-card border border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-[15px] text-neutral-500">
                등록된 공지가 없습니다.
              </p>
            </div>
          ) : (
            <div
              className={`mx-auto w-full max-w-[960px] ${siteFloatingWidgetCenterOffsetClass}`}
            >
              {/* PC: 테이블 */}
              <table className="hidden w-full table-fixed border-t-2 border-primary text-[14px] sm:table">
                <caption className="sr-only">
                  전체 {total}건의 공지사항 (페이지 {safePage}/{totalPages})
                </caption>
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th scope="col" className="w-20 py-3 text-center font-semibold">
                      번호
                    </th>
                    <th scope="col" className="py-3 text-left font-semibold">
                      제목
                    </th>
                    <th scope="col" className="w-32 py-3 text-center font-semibold">
                      작성일
                    </th>
                    <th scope="col" className="w-20 py-3 text-center font-semibold">
                      조회수
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p, idx) => {
                    const number = p.is_pinned
                      ? null
                      : total - ((safePage - 1) * 10 + idx);
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                      >
                        <td className="py-3.5 text-center text-neutral-500">
                          {p.is_pinned ? (
                            <span
                              aria-label="고정 공지"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-primary"
                            >
                              <Pin className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                            </span>
                          ) : (
                            number
                          )}
                        </td>
                        <td className="py-3.5 pr-4">
                          <Link
                            href={`/notice/${p.id}`}
                            className="block truncate text-[15px] font-semibold text-neutral-800 outline-none transition-colors hover:text-primary focus-visible:text-primary"
                          >
                            {p.title}
                          </Link>
                        </td>
                        <td className="py-3.5 text-center text-neutral-500">
                          {formatDate(p.created_at)}
                        </td>
                        <td className="py-3.5 text-center text-neutral-500">
                          {p.view_count.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* 모바일: 카드 */}
              <ul className="space-y-3 sm:hidden">
                {posts.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/notice/${p.id}`}
                      className="block rounded-card border border-neutral-200 bg-white px-4 py-4 outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <div className="flex items-center gap-2">
                        {p.is_pinned ? (
                          <span className="inline-flex items-center gap-1 rounded-[3px] bg-accent-500 px-1.5 py-0.5 text-[11px] font-bold text-primary">
                            <Pin className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                            고정
                          </span>
                        ) : null}
                        <h3 className="line-clamp-2 text-[15px] font-bold text-neutral-800">
                          {p.title}
                        </h3>
                      </div>
                      <div className="mt-2 flex justify-between text-[12px] text-neutral-500">
                        <span>{formatDate(p.created_at)}</span>
                        <span>조회 {p.view_count.toLocaleString()}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <Pagination
                page={safePage}
                totalPages={totalPages}
                basePath="/notice"
              />
            </div>
          )}
        </section>
      }
    />
  );
}
