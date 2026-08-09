"use client";

import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import SideWidgetActions from "@/components/layout/SideWidgetActions";
import SideWidgetPhoneName from "@/components/layout/SideWidgetPhoneName";
import { ko } from "@/content/ko";
import {
  sideWidgetButtonPhone,
  sideWidgetButtonPhoneCompact,
} from "@/lib/layout/side-widget";
import {
  siteContainerClass,
  siteFloatingWidgetWidthClass,
  siteSideWidgetBottomClass,
} from "@/lib/layout/spacing";
import { cn } from "@/lib/utils";

const FOOTER_SELECTOR = "footer";

function rectsIntersect(a: DOMRect, b: DOMRect) {
  return (
    a.top < b.bottom &&
    a.bottom > b.top &&
    a.left < b.right &&
    a.right > b.left
  );
}

function overlapsFooter(widget: DOMRect) {
  const footer = document.querySelector(FOOTER_SELECTOR);
  if (!footer) return false;
  return rectsIntersect(widget, footer.getBoundingClientRect());
}

/**
 * 메인 외 공개 페이지 SideWidget.
 * - lg+: 우측 세로 메뉴 항상 펼침 (홈 SideWidget 과 동일)
 * - 모바일: 원형 FAB — 클릭 시에만 패널 펼침
 */
export default function FloatingSideWidget() {
  const pathname = usePathname();
  const panelId = useId();
  const fabRootRef = useRef<HTMLDivElement>(null);
  const desktopAsideRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [obscured, setObscured] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const root = fabRootRef.current;
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

  useEffect(() => {
    if (pathname === "/") return;

    const aside = desktopAsideRef.current;
    if (!aside) return;

    const update = () => {
      const next = overlapsFooter(aside.getBoundingClientRect());
      setObscured((prev) => (prev === next ? prev : next));
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(aside);
    const footer = document.querySelector(FOOTER_SELECTOR);
    if (footer) resizeObserver.observe(footer);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
    };
  }, [pathname]);

  if (pathname === "/") return null;

  const { a11y, phones } = ko.sideWidget;

  return (
    <>
      {/* PC — 항상 펼친 세로 메뉴 */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 z-30 hidden lg:block",
          siteSideWidgetBottomClass,
        )}
      >
        <div className={siteContainerClass}>
          <aside
            ref={desktopAsideRef}
            aria-label={a11y.label}
            aria-hidden={obscured}
            className={cn(
              "pointer-events-auto ml-auto flex flex-col gap-3",
              "transition-opacity duration-200 ease-out",
              obscured && "pointer-events-none opacity-0",
              siteFloatingWidgetWidthClass,
            )}
          >
            <SideWidgetActions />

            <ul className="flex flex-col gap-3">
              {phones.map((phone) => (
                <li key={phone.tel}>
                  <a href={`tel:${phone.tel}`} className={sideWidgetButtonPhone}>
                    <SideWidgetPhoneName name={phone.name} />
                    <span className="whitespace-nowrap text-[15px] font-black tracking-tight">
                      {phone.display}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      {/* 모바일 — 원형 FAB */}
      <div
        ref={fabRootRef}
        className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 sm:bottom-5 sm:right-5 lg:hidden"
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
            "relative flex h-[72px] w-[72px] items-center justify-center rounded-full",
            "bg-accent-500 text-primary",
            "outline-none transition-transform duration-200 ease-out",
            "hover:scale-105 hover:bg-accent-400",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "shadow-[0_10px_28px_-8px_rgba(34,41,93,0.45)]",
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary/15"
          />
          {open ? (
            <X className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <span className="flex flex-col items-center justify-center gap-1 px-1">
              <MessageCircle
                className="h-5 w-5"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <span className="whitespace-nowrap text-[11px] font-black leading-none tracking-tight">
                {a11y.fabLabel}
              </span>
            </span>
          )}
        </button>
      </div>
    </>
  );
}
