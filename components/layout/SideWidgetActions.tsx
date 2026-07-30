"use client";

import { BellRing, MessageSquare, Presentation } from "lucide-react";
import { usePathname } from "next/navigation";

import WidgetActionLink from "@/components/layout/WidgetActionLink";
import { ko } from "@/content/ko";
import {
  resolveSideWidgetActionHref,
  sideWidgetButtonAction,
  sideWidgetButtonActionCompact,
} from "@/lib/layout/side-widget";

const ACTION_ICONS = {
  message: MessageSquare,
  bell: BellRing,
  presentation: Presentation,
} as const;

type SideWidgetActionsProps = {
  /** FAB 패널 — 패딩·아이콘만 축소, 글자 크기는 유지 */
  compact?: boolean;
};

export default function SideWidgetActions({
  compact = false,
}: SideWidgetActionsProps) {
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
            className={
              compact ? sideWidgetButtonActionCompact : sideWidgetButtonAction
            }
          >
            <Icon
              className={compact ? "h-5 w-5" : "h-7 w-7"}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="whitespace-pre-line text-[15px] font-bold leading-snug tracking-tight">
              {action.label}
            </span>
          </WidgetActionLink>
        );
      })}
    </>
  );
}
