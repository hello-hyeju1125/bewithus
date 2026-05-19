import Link from "next/link";
import { BellRing, MessageSquare, Phone, Presentation } from "lucide-react";
import { ko } from "@/content/ko";

const ACTION_ICONS = {
  message: MessageSquare,
  bell: BellRing,
  presentation: Presentation,
} as const;

const widgetButtonBase =
  "group flex w-full flex-col items-center justify-center gap-1.5 rounded-card border border-neutral-200 px-2 py-3 text-center text-primary outline-none shadow-[0_4px_12px_-6px_rgba(34,41,93,0.18)] transition-colors duration-200 ease-out hover:border-primary hover:bg-accent-500 hover:text-primary focus-visible:border-primary focus-visible:bg-accent-500 focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const widgetButtonAction = `${widgetButtonBase} bg-white`;
const widgetButtonPhone = `${widgetButtonBase} bg-accent-500 hover:bg-accent-400`;

export default function SideWidget() {
  const { a11y, actions, phones } = ko.sideWidget;

  return (
    <aside
      aria-label={a11y.label}
      className="hidden lg:flex lg:h-full lg:flex-col lg:items-stretch lg:justify-end lg:gap-2.5 lg:border-l lg:border-neutral-200 lg:pl-4"
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
  );
}
