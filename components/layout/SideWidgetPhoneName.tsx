import { Phone } from "lucide-react";

type SideWidgetPhoneNameProps = {
  name: string;
  /** FAB 패널 — 아이콘·간격만 축소, 글자 크기는 유지 */
  compact?: boolean;
};

/** P관/M관 등 — 아이콘을 위에 두어 라벨이 시각적으로 가운데 맞도록 */
export default function SideWidgetPhoneName({
  name,
  compact = false,
}: SideWidgetPhoneNameProps) {
  return (
    <span
      className={
        compact
          ? "flex flex-col items-center gap-0.5 text-[14px] font-bold leading-snug tracking-tight"
          : "flex flex-col items-center gap-1 text-[14px] font-bold leading-snug tracking-tight"
      }
    >
      <Phone
        className={compact ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4 shrink-0"}
        strokeWidth={2.25}
        aria-hidden="true"
      />
      {name}
    </span>
  );
}
