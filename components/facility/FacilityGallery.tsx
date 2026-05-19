"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { FacilityGalleryImage } from "@/content/facility";

type FacilityGalleryProps = {
  images: readonly FacilityGalleryImage[];
};

export default function FacilityGallery({ images }: FacilityGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const active = activeIdx !== null ? images[activeIdx] : null;

  const close = useCallback(() => setActiveIdx(null), []);
  const prev = useCallback(
    () =>
      setActiveIdx((idx) =>
        idx === null ? idx : (idx - 1 + images.length) % images.length,
      ),
    [images.length],
  );
  const next = useCallback(
    () =>
      setActiveIdx((idx) =>
        idx === null ? idx : (idx + 1) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active, close, prev, next]);

  if (images.length === 0) {
    return (
      <p className="rounded-card border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-[15px] text-neutral-500">
        등록된 시설 사진이 없습니다.
      </p>
    );
  }

  return (
    <>
      <ul
        className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3 lg:gap-5"
        role="list"
      >
        {images.map((image, idx) => (
          <li key={image.id} className="mb-3 break-inside-avoid sm:mb-4 lg:mb-5">
            <button
              type="button"
              onClick={() => setActiveIdx(idx)}
              className="group relative block w-full overflow-hidden rounded-card bg-neutral-100 outline-none transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(34,41,93,0.12)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`${image.alt} 크게 보기`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="시설 사진 보기"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 sm:p-8"
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={close}
            className="absolute inset-0"
          />
          <button
            type="button"
            onClick={close}
            aria-label="라이트박스 닫기"
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-button bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="이전 사진"
            className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-button bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="다음 사진"
            className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-button bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white sm:right-4"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="relative z-[1] max-h-[90vh] w-full max-w-6xl">
            <Image
              src={active.src}
              alt={active.alt}
              width={1920}
              height={1280}
              sizes="100vw"
              className="mx-auto h-auto max-h-[90vh] w-auto max-w-full object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
