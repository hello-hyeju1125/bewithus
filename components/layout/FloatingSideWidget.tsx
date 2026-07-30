"use client";

import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import SideWidgetActions from "@/components/layout/SideWidgetActions";
import SideWidgetPhoneName from "@/components/layout/SideWidgetPhoneName";
import { ko } from "@/content/ko";
import {
  sideWidgetButtonPhoneCompact,
} from "@/lib/layout/side-widget";
import { cn } from "@/lib/utils";

/**
 * 메인 외 공개 페이지 — 우측 하단 원형 CTA.
 * 클릭 시에만 신청·연락처 패널을 펼친다.
 */
export default function FloatingSideWidget() {
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  if (pathname === "/") return null;

  const { a11y, phones } = ko.sideWidget;

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6"
    >
      {open ? (
        <aside
          id={panelId}
          aria-label={a11y.label}
          className={cn(
            "flex w-[148px] flex-col gap-1.5 overflow-visible bg-transparent p-0",
            "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200",
          )}
        >
          <SideWidgetActions compact />

          <ul className="flex flex-col gap-1.5">
            {phones.map((phone) => (
              <li key={phone.tel}>
                <a
                  href={`tel:${phone.tel}`}
                  className={sideWidgetButtonPhoneCompact}
                >
                  <SideWidgetPhoneName name={phone.name} compact />
                  <span className="whitespace-nowrap text-[15px] font-black tracking-tight">
                    {phone.display}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? a11y.closeFab : a11y.openFab}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full",
          "bg-accent-500 text-primary",
          "outline-none transition-transform duration-200 ease-out",
          "hover:scale-105 hover:bg-accent-400",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "shadow-[0_10px_28px_-8px_rgba(34,41,93,0.45)]",
          !open && "animate-float-cta",
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary/15"
        />
        {open ? (
          <X className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <span className="flex flex-col items-center justify-center gap-0.5">
            <MessageCircle
              className="h-5 w-5"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span className="text-[10px] font-black leading-none tracking-tight">
              {a11y.fabLabel}
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
