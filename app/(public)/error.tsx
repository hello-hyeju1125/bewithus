"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 운영 단계에서는 Sentry 등 외부 로거로 전송합니다.
    console.error("[public route error]", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 pt-[120px]">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <AlertTriangle
          className="h-12 w-12 text-accent-700"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h1 className="text-[24px] font-black tracking-tight text-primary">
          페이지를 불러오지 못했습니다.
        </h1>
        <p className="text-[14px] leading-relaxed text-neutral-600">
          잠시 후 다시 시도해 주세요. 문제가 계속되면 학원 대표 번호로
          문의해 주시기 바랍니다.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-button bg-primary px-5 py-2.5 text-[14px] font-bold text-white outline-none transition-colors hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="rounded-button border border-neutral-200 px-5 py-2.5 text-[14px] font-bold text-neutral-700 outline-none transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
