"use client";

import {
  ArrowRight,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

import ConsultationTrigger from "@/components/consultation/ConsultationTrigger";
import WidgetActionLink from "@/components/layout/WidgetActionLink";

type LinkCard = { title: string; href: string };
type ConsultationCard = { title: string; openConsultation: true };

/** 안내 카드 순서: 입학 상담 / 오시는 길 */
const INFO_ICONS: LucideIcon[] = [MessageCircle, MapPin];

type InfoCardItemProps = {
  item: LinkCard | ConsultationCard;
  iconIndex: number;
};

const cardClassName =
  "group flex h-full min-h-[52px] w-full items-center justify-between gap-2 rounded-card border border-neutral-200 bg-white px-4 py-2 text-primary outline-none transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_10px_20px_-8px_rgba(34,41,93,0.22)] focus-visible:ring-2 focus-visible:ring-primary sm:min-h-[80px] sm:gap-3 sm:px-5 sm:py-4";

export default function InfoCardItem({ item, iconIndex }: InfoCardItemProps) {
  const Icon = INFO_ICONS[iconIndex] ?? MessageCircle;
  const inner = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          className="h-5 w-5 shrink-0 text-primary transition-colors duration-200 group-hover:text-white"
          strokeWidth={2}
          aria-hidden="true"
        />
        <h3 className="truncate text-[22px] font-black tracking-tight text-primary transition-colors duration-200 group-hover:text-white">
          {item.title}
        </h3>
      </div>
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-colors duration-200 group-hover:bg-white group-hover:text-primary sm:h-12 sm:w-12"
      >
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-5 sm:w-5"
          strokeWidth={2.25}
        />
      </span>
    </>
  );

  if ("openConsultation" in item && item.openConsultation) {
    return (
      <ConsultationTrigger className={cardClassName}>{inner}</ConsultationTrigger>
    );
  }

  const linkItem = item as LinkCard;
  return (
    <WidgetActionLink href={linkItem.href} className={cardClassName}>
      {inner}
    </WidgetActionLink>
  );
}
