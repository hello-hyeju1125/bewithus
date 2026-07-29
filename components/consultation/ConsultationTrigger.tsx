"use client";

import { useConsultation } from "@/components/consultation/ConsultationProvider";
import { cn } from "@/lib/utils";

type ConsultationTriggerProps = {
  children: React.ReactNode;
  className?: string;
  /** 모달을 연 뒤 추가 동작 (예: 모바일 메뉴 닫기) */
  onAfterOpen?: () => void;
};

/**
 * 입학 상담 모달을 여는 트리거. `ConsultationProvider` 하위에서만 사용합니다.
 */
export default function ConsultationTrigger({
  children,
  className,
  onAfterOpen,
}: ConsultationTriggerProps) {
  const { open } = useConsultation();

  return (
    <button
      type="button"
      onClick={() => {
        open();
        onAfterOpen?.();
      }}
      className={cn("text-left", className)}
    >
      {children}
    </button>
  );
}
