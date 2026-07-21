"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  dismissHomeBannerPopup,
  shouldShowHomeBannerPopup,
} from "@/lib/home/banner-popup-storage";
import type { PublicPopupBanner } from "@/lib/home/hero-slides";
import { withCacheBust } from "@/lib/media/cache-bust";
import { cn } from "@/lib/utils";

type HomeBannerPopupProps = {
  slides: PublicPopupBanner[];
  settingsUpdatedAt: string;
};

function PopupBannerCard({
  slide,
  onNavigate,
}: {
  slide: PublicPopupBanner;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={slide.href}
      onClick={onNavigate}
      className="group relative block aspect-[4/5] min-h-[200px] overflow-hidden rounded-hero outline-none transition-opacity hover:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:min-h-[280px] lg:min-h-[360px]"
    >
      {slide.backgroundImageUrl ? (
        <Image
          src={withCacheBust(slide.backgroundImageUrl, slide.imageVersion)}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 90vw, 360px"
        />
      ) : (
        <div className="absolute inset-0 bg-primary" aria-hidden="true" />
      )}
    </Link>
  );
}

function popupGridClass(count: number): string {
  if (count === 1) {
    return "mx-auto max-w-[520px] grid-cols-1";
  }
  if (count === 2) {
    return "grid-cols-1 sm:grid-cols-2";
  }
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

export default function HomeBannerPopup({
  slides,
  settingsUpdatedAt,
}: HomeBannerPopupProps) {
  const [open, setOpen] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count === 0) return;
    if (shouldShowHomeBannerPopup(settingsUpdatedAt)) {
      setOpen(true);
    }
  }, [count, settingsUpdatedAt]);

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

  if (count === 0) return null;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/85 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-y-contain border-0 bg-transparent p-0 shadow-none outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onInteractOutside={closePopup}
          onPointerDownOutside={closePopup}
        >
          <Dialog.Title className="sr-only">메인 배너 안내</Dialog.Title>
          <Dialog.Description className="sr-only">
            대치위더스 메인 배너 {count}개
          </Dialog.Description>

          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed inset-0 z-0 cursor-default"
            onClick={closePopup}
          />

          <div className="relative z-10 mx-auto w-full max-w-[1080px] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-8 sm:pt-10">
            <Dialog.Close
              type="button"
              className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-[110] flex h-10 w-10 items-center justify-center rounded-button bg-white/95 text-primary outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-accent-500 sm:absolute sm:-right-2 sm:-top-2"
              aria-label="배너 팝업 닫기"
            >
              <X className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
            </Dialog.Close>

            <div className={cn("grid gap-3 sm:gap-5", popupGridClass(count))}>
              {slides.map((slide) => (
                <PopupBannerCard
                  key={slide.slot}
                  slide={slide}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
