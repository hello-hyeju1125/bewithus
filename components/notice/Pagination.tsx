import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
};

/**
 * 간단한 페이지네이션 (1~totalPages 모두 노출 + 이전/다음).
 * 게시판이 커지면 윈도우(...) 처리를 추가합니다.
 */
export default function Pagination({
  page,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (p: number) =>
    p === 1 ? basePath : `${basePath}?page=${p}`;

  const baseLink =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-button px-3 text-[14px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <nav
      aria-label="페이지 네비게이션"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      <Link
        aria-disabled={page <= 1}
        href={buildHref(Math.max(1, page - 1))}
        className={`${baseLink} ${
          page <= 1
            ? "pointer-events-none border border-neutral-200 text-neutral-300"
            : "border border-neutral-200 text-neutral-700 hover:border-primary hover:text-primary"
        }`}
      >
        이전
      </Link>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const p = idx + 1;
        const isActive = p === page;
        return (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={isActive ? "page" : undefined}
            className={`${baseLink} ${
              isActive
                ? "bg-primary text-white"
                : "border border-neutral-200 text-neutral-700 hover:border-primary hover:text-primary"
            }`}
          >
            {p}
          </Link>
        );
      })}

      <Link
        aria-disabled={page >= totalPages}
        href={buildHref(Math.min(totalPages, page + 1))}
        className={`${baseLink} ${
          page >= totalPages
            ? "pointer-events-none border border-neutral-200 text-neutral-300"
            : "border border-neutral-200 text-neutral-700 hover:border-primary hover:text-primary"
        }`}
      >
        다음
      </Link>
    </nav>
  );
}
