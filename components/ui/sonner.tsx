"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

/**
 * Toast 컨테이너. 관리자 레이아웃에서 마운트되어 모든 페이지에서 사용 가능.
 * 디자인 토큰을 따르도록 커스텀 클래스로 스타일링.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group rounded-card border border-neutral-200 bg-white text-neutral-800 shadow-[0_12px_28px_-12px_rgba(15,18,24,0.2)]",
          title: "font-bold text-primary",
          description: "text-neutral-600",
          actionButton: "bg-primary text-white",
          cancelButton: "bg-neutral-100 text-neutral-700",
        },
      }}
    />
  );
}

export { toast };
