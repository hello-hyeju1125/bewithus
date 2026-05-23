"use client";

import { useConsultation } from "@/components/consultation/ConsultationProvider";
import { cn } from "@/lib/utils";

type ConsultationTriggerProps = {
  children: React.ReactNode;
  className?: string;
  /** 기본값 button — 카드처럼 링크 스타일일 때는 `div` + role=button 대신 button 권장 */
  asChild?: boolean;
};

/**
 * 입학 상담 모달을 여는 트리거. `ConsultationProvider` 하위에서만 사용합니다.
 */
export default function ConsultationTrigger({
  children,
  className,
}: ConsultationTriggerProps) {
  const { open } = useConsultation();

  return (
    <button
      type="button"
      onClick={open}
      className={cn("text-left", className)}
    >
      {children}
    </button>
  );
}
