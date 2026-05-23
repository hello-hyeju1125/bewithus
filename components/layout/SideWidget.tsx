import { BellRing, MessageSquare, Presentation } from "lucide-react";
import SideWidgetPhoneName from "@/components/layout/SideWidgetPhoneName";
import WidgetActionLink from "@/components/layout/WidgetActionLink";
import { ko } from "@/content/ko";
import {
  sideWidgetButtonAction,
  sideWidgetButtonPhone,
} from "@/lib/layout/side-widget";

const ACTION_ICONS = {
  message: MessageSquare,
  bell: BellRing,
  presentation: Presentation,
} as const;

export default function SideWidget() {
  const { a11y, actions, phones } = ko.sideWidget;

  return (
    <aside
      aria-label={a11y.label}
      className="hidden lg:flex lg:flex-col lg:items-stretch lg:gap-2.5 lg:border-l lg:border-neutral-200 lg:pl-4"
    >
      {actions.map((action) => {
        const Icon = ACTION_ICONS[action.icon];
        return (
          <WidgetActionLink
            key={action.label}
            href={action.href}
            className={sideWidgetButtonAction}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            <span className="whitespace-pre-line text-[12px] font-bold leading-tight tracking-tight">
              {action.label}
            </span>
          </WidgetActionLink>
        );
      })}

      <ul className="flex flex-col gap-2.5">
        {phones.map((phone) => (
          <li key={phone.tel}>
            <a
              href={`tel:${phone.tel}`}
              className={sideWidgetButtonPhone}
            >
              <SideWidgetPhoneName name={phone.name} />
              <span className="whitespace-nowrap text-[12px] font-black tracking-tight">
                {phone.display}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
