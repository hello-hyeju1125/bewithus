import type { ConsultationStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const LABELS: Record<ConsultationStatus, string> = {
  new: "신규",
  read: "확인함",
  archived: "보관",
};

const STYLES: Record<ConsultationStatus, string> = {
  new: "bg-accent-500 text-primary",
  read: "bg-primary-50 text-primary",
  archived: "bg-neutral-100 text-neutral-600",
};

export default function ConsultationStatusBadge({
  status,
}: {
  status: ConsultationStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-black tracking-tight",
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}
