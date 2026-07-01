import { Phone } from "lucide-react";

type SideWidgetPhoneNameProps = {
  name: string;
};

/** P관/M관 등 — 아이콘을 위에 두어 라벨이 시각적으로 가운데 맞도록 */
export default function SideWidgetPhoneName({ name }: SideWidgetPhoneNameProps) {
  return (
    <span className="flex flex-col items-center gap-0.5 text-[11px] font-bold leading-tight tracking-tight">
      <Phone className="h-2.5 w-2.5 shrink-0" strokeWidth={2.25} aria-hidden="true" />
      {name}
    </span>
  );
}
