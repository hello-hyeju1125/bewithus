import { Phone } from "lucide-react";

type SideWidgetPhoneNameProps = {
  name: string;
};

/** P관/M관 등 — 아이콘을 위에 두어 라벨이 시각적으로 가운데 맞도록 */
export default function SideWidgetPhoneName({ name }: SideWidgetPhoneNameProps) {
  return (
    <span className="flex flex-col items-center gap-1 text-[16px] font-bold leading-snug tracking-tight">
      <Phone className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden="true" />
      {name}
    </span>
  );
}
