"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin route error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      <AlertTriangle
        className="h-10 w-10 text-accent-700"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h1 className="text-[20px] font-black text-primary">
        관리자 페이지 오류
      </h1>
      <p className="text-[13px] text-neutral-600">
        세션이 만료되었거나 일시적인 문제가 발생했습니다.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-2 rounded-button bg-primary px-4 py-2 text-[13px] font-bold text-white outline-none transition-colors hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary"
      >
        다시 시도
      </button>
    </div>
  );
}
