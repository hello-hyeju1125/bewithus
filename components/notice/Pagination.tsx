import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
};

/** 현재 페이지 주변 번호만 노출 (양끝 + 윈도우). */
function buildPageItems(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: Array<number | "ellipsis"> = [];
  const windowStart = Math.max(2, page - 1);
  const windowEnd = Math.min(totalPages - 1, page + 1);

  items.push(1);
  if (windowStart > 2) items.push("ellipsis");
  for (let p = windowStart; p <= windowEnd; p += 1) items.push(p);
  if (windowEnd < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);

  return items;
}

/**
 * 페이지네이션 (이전/다음 + 윈도우 번호).
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
    "inline-flex h-10 min-w-10 items-center justify-center rounded-button px-2.5 text-[15px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary sm:h-12 sm:min-w-12 sm:px-3.5 sm:text-[18px]";

  const pages = buildPageItems(page, totalPages);

  return (
    <nav
      aria-label="페이지 네비게이션"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
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

      {pages.map((item, idx) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex h-10 min-w-8 items-center justify-center text-[15px] text-neutral-400 sm:h-12 sm:text-[18px]"
              aria-hidden="true"
            >
              …
            </span>
          );
        }

        const isActive = item === page;
        return (
          <Link
            key={item}
            href={buildHref(item)}
            aria-current={isActive ? "page" : undefined}
            className={`${baseLink} ${
              isActive
                ? "bg-primary text-white"
                : "border border-neutral-200 text-neutral-700 hover:border-primary hover:text-primary"
            }`}
          >
            {item}
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
