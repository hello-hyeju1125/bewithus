import SideWidgetActions from "@/components/layout/SideWidgetActions";
import SideWidgetPhoneName from "@/components/layout/SideWidgetPhoneName";
import { ko } from "@/content/ko";
import { sideWidgetButtonPhone } from "@/lib/layout/side-widget";

export default function SideWidget() {
  const { a11y, phones } = ko.sideWidget;

  return (
    <aside
      aria-label={a11y.label}
      className="hidden lg:flex lg:flex-col lg:items-stretch lg:gap-3 lg:border-l lg:border-neutral-200 lg:pl-4"
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
  );
}
