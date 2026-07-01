"use client";

import { ArrowRight } from "lucide-react";

import ConsultationTrigger from "@/components/consultation/ConsultationTrigger";
import { cn } from "@/lib/utils";

type ConsultationCtaLinkProps = {
  className?: string;
  label: string;
};

/** 설명회 등 페이지의 상담/신청 CTA — 모달 오픈 */
export default function ConsultationCtaLink({
  className,
  label,
}: ConsultationCtaLinkProps) {
  return (
    <ConsultationTrigger className={cn(className)}>
      {label}
      <ArrowRight
        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-6 sm:w-6"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </ConsultationTrigger>
  );
}
