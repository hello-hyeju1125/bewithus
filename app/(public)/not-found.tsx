import Link from "next/link";
import { Compass } from "lucide-react";

export default function PublicNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 pt-[120px]">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <Compass
          className="h-12 w-12 text-primary"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <p className="text-[13px] font-bold uppercase tracking-wider text-accent-700">
          404
        </p>
        <h1 className="text-[24px] font-black tracking-tight text-primary">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="text-[14px] leading-relaxed text-neutral-600">
          주소가 정확한지 다시 한 번 확인해 주세요.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-1.5 rounded-button bg-primary px-5 py-2.5 text-[14px] font-bold text-white outline-none transition-colors hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary"
        >
          홈으로 가기
        </Link>
      </div>
    </main>
  );
}
