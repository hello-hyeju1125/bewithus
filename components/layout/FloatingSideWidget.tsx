"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SideWidgetActions from "@/components/layout/SideWidgetActions";
import SideWidgetPhoneName from "@/components/layout/SideWidgetPhoneName";
import { ko } from "@/content/ko";
import {
  sideWidgetButtonPhone,
} from "@/lib/layout/side-widget";
import {
  siteContainerClass,
  siteSideWidgetBottomClass,
  siteFloatingWidgetWidthClass,
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
 * 메인 페이지가 아닌 공개 페이지에서 우측에 고정 노출되는 SideWidget.
 *
 * 메인 페이지의 grid 3열(172px)·하단 inset을 그대로 따라가도록,
 * fixed + `siteSideWidgetBottomClass` 로 화면 하단에 맞추고
 * `siteContainerClass` 안에서 `ml-auto` 로 우측 정렬한다.
 * 본문은 `siteFloatingWidgetSafeClass` 로 겹침을 방지하고,
 * 푸터와 겹칠 때만 fade out 처리한다.
 */
export default function FloatingSideWidget() {
  const pathname = usePathname();
  const asideRef = useRef<HTMLElement>(null);
  const [obscured, setObscured] = useState(false);

  useEffect(() => {
    if (pathname === "/") return;

    const aside = asideRef.current;
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
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-30 hidden lg:block",
        siteSideWidgetBottomClass,
      )}
    >
      <div className={siteContainerClass}>
        <aside
          ref={asideRef}
          aria-label={a11y.label}
          aria-hidden={obscured}
          className={cn(
            "pointer-events-auto ml-auto flex flex-col gap-4",
            "transition-opacity duration-200 ease-out",
            obscured && "pointer-events-none opacity-0",
            siteFloatingWidgetWidthClass,
          )}
        >
          <SideWidgetActions />

          <ul className="flex flex-col gap-4">
            {phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`} className={sideWidgetButtonPhone}>
                  <SideWidgetPhoneName name={phone.name} />
                  <span className="whitespace-nowrap text-[16px] font-black tracking-tight">
                    {phone.display}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
