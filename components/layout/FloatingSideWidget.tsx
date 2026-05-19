"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, MessageSquare, Phone, Presentation } from "lucide-react";
import { ko } from "@/content/ko";
import {
  siteContainerClass,
  siteFloatingWidgetTopClass,
  siteFloatingWidgetWidthClass,
} from "@/lib/layout/spacing";

const ACTION_ICONS = {
  message: MessageSquare,
  bell: BellRing,
  presentation: Presentation,
} as const;

const widgetButtonBase =
  "group flex w-full flex-col items-center justify-center gap-1 rounded-card border border-neutral-200 px-2 py-3 text-center text-primary outline-none shadow-[0_4px_12px_-6px_rgba(34,41,93,0.18)] transition-colors duration-200 ease-out hover:border-primary hover:bg-accent-500 hover:text-primary focus-visible:border-primary focus-visible:bg-accent-500 focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const widgetButtonAction = `${widgetButtonBase} bg-white`;
const widgetButtonPhone = `${widgetButtonBase} bg-accent-500 hover:bg-accent-400`;

/**
 * 메인 페이지가 아닌 모든 공개 페이지에서 우측에 고정 노출되는 SideWidget.
 *
 * 위치는 메인 페이지 grid (`lg:grid-cols-[45fr_55fr_100px]`) 의 3번째 컬럼과
 * 정확히 동일하다. 1400px 컨테이너 안에서 `ml-auto w-[100px]` 로 우측 끝에
 * 100px 박스를 잡고, 본문은 `siteFloatingWidgetSafeClass` 로 그 자리를 비운다.
 */
export default function FloatingSideWidget() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const { a11y, actions, phones } = ko.sideWidget;

  return (
    <div
      aria-hidden="false"
      className={`pointer-events-none fixed inset-x-0 z-30 hidden lg:block ${siteFloatingWidgetTopClass}`}
    >
      <div className={siteContainerClass}>
        <aside
          aria-label={a11y.label}
          className={`pointer-events-auto ml-auto flex flex-col gap-2.5 ${siteFloatingWidgetWidthClass}`}
        >
          {actions.map((action) => {
            const Icon = ACTION_ICONS[action.icon];
            return (
              <Link
                key={action.label}
                href={action.href}
                className={widgetButtonAction}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                <span className="whitespace-pre-line text-[12px] font-bold leading-tight tracking-tight">
                  {action.label}
                </span>
              </Link>
            );
          })}

          <ul className="flex flex-col gap-2.5">
            {phones.map((phone) => (
              <li key={phone.tel}>
                <a
                  href={`tel:${phone.tel}`}
                  className={widgetButtonPhone}
                >
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-tight">
                    <Phone className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
                    {phone.name}
                  </span>
                  <span className="whitespace-nowrap text-[12px] font-black tracking-tight">
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
