"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  dismissHomeBannerPopup,
  shouldShowHomeBannerPopup,
} from "@/lib/home/banner-popup-storage";
import type { PublicHeroSlide } from "@/lib/home/hero-slides";
import { cn } from "@/lib/utils";

type HomeBannerPopupProps = {
  enabled: boolean;
  slides: PublicHeroSlide[];
  ctaLabel: string;
  settingsUpdatedAt: string;
};

function PopupBannerCard({
  slide,
  ctaLabel,
  onNavigate,
}: {
  slide: PublicHeroSlide;
  ctaLabel: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={slide.href}
      onClick={onNavigate}
      className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-hero bg-primary outline-none transition-opacity hover:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:min-h-[320px] lg:min-h-[400px]"
    >
      {slide.backgroundImageUrl ? (
        <>
          <Image
            src={slide.backgroundImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 45vw, 520px"
          />
          <div className="absolute inset-0 bg-primary/55" aria-hidden="true" />
        </>
      ) : (
        <div className="absolute inset-0 bg-primary" aria-hidden="true" />
      )}

      <span className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-7 text-center sm:px-6 sm:py-9">
        <p className="mb-2 inline-flex max-w-full rounded-leaf bg-accent-500 px-2.5 py-0.5 text-[14px] font-black leading-tight tracking-tight text-primary sm:mb-4 sm:px-3 sm:py-1 sm:text-[18px] lg:text-[22px]">
          {slide.tagline}
        </p>
        <h2 className="whitespace-pre-line text-[28px] font-black leading-[1.05] tracking-tight text-white sm:text-[40px] lg:text-[52px]">
          {slide.mainHeadline}
        </h2>
        {slide.subtitle ? (
          <p className="mt-2 text-[16px] font-medium leading-snug text-white/90 sm:mt-3 sm:text-[20px] lg:text-[24px]">
            {slide.subtitle}
          </p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-2 text-[18px] font-black text-accent sm:mt-5 sm:gap-2.5 sm:text-[24px] lg:text-[30px]">
          {ctaLabel}
          <ArrowRight
            className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
            aria-hidden="true"
          />
        </span>
      </span>
    </Link>
  );
}

export default function HomeBannerPopup({
  enabled,
  slides,
  ctaLabel,
  settingsUpdatedAt,
}: HomeBannerPopupProps) {
  const [open, setOpen] = useState(false);
  const popupSlides = slides.slice(0, 2);

  useEffect(() => {
    if (!enabled || popupSlides.length === 0) return;
    if (shouldShowHomeBannerPopup(settingsUpdatedAt)) {
      setOpen(true);
    }
  }, [enabled, popupSlides.length, settingsUpdatedAt]);

  const dismiss = useCallback(() => {
    dismissHomeBannerPopup(settingsUpdatedAt);
  }, [settingsUpdatedAt]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) dismiss();
    },
    [dismiss],
  );

  const handleNavigate = useCallback(() => {
    dismiss();
    setOpen(false);
  }, [dismiss]);

  const closePopup = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  if (!enabled || popupSlides.length === 0) return null;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/85 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-0 z-[100] border-0 bg-transparent p-0 shadow-none outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onInteractOutside={closePopup}
          onPointerDownOutside={closePopup}
        >
          <Dialog.Title className="sr-only">메인 배너 안내</Dialog.Title>
          <Dialog.Description className="sr-only">
            대치위더스 메인 배너 {popupSlides.length}개
          </Dialog.Description>

          {/* 배너 바깥(어두운 영역) 클릭 시 닫기 — Content가 전체 화면이라 명시적 백드롭 버튼 필요 */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 z-0 cursor-default"
            onClick={closePopup}
          />

          <div className="pointer-events-none relative z-10 flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-[1080px] pointer-events-auto">
              <Dialog.Close
                type="button"
                className="absolute -top-1 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-button bg-white/95 text-primary outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-accent-500 sm:-right-2 sm:-top-2"
                aria-label="배너 팝업 닫기"
              >
                <X className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
              </Dialog.Close>

              <div
                className={cn(
                  "grid gap-3 sm:gap-5",
                  popupSlides.length === 1
                    ? "mx-auto max-w-[520px] grid-cols-1"
                    : "grid-cols-2",
                )}
              >
                {popupSlides.map((slide) => (
                  <PopupBannerCard
                    key={slide.slot}
                    slide={slide}
                    ctaLabel={ctaLabel}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
