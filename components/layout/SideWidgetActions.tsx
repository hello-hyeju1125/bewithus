"use client";

import { BellRing, MessageSquare, Presentation } from "lucide-react";
import { usePathname } from "next/navigation";

import WidgetActionLink from "@/components/layout/WidgetActionLink";
import { ko } from "@/content/ko";
import {
  resolveSideWidgetActionHref,
  sideWidgetButtonAction,
} from "@/lib/layout/side-widget";

const ACTION_ICONS = {
  message: MessageSquare,
  bell: BellRing,
  presentation: Presentation,
} as const;

export default function SideWidgetActions() {
  const pathname = usePathname();
  const { actions } = ko.sideWidget;

  return (
    <>
      {actions.map((action) => {
        const Icon = ACTION_ICONS[action.icon];
        const href = resolveSideWidgetActionHref(action, pathname);

        return (
          <WidgetActionLink
            key={action.label}
            href={href}
            className={sideWidgetButtonAction}
          >
            <Icon className="h-9 w-9" strokeWidth={1.75} aria-hidden="true" />
            <span className="whitespace-pre-line text-[17px] font-bold leading-snug tracking-tight">
              {action.label}
            </span>
          </WidgetActionLink>
        );
      })}
    </>
  );
}
