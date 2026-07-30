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
  /** 홈 CardGrid — 개인 및 팀 수업 카드 높이에 맞춘 2분할 */
  compact?: boolean;
};

const cardClassNameBase =
  "group flex h-full w-full min-h-0 items-center justify-between gap-1.5 overflow-hidden rounded-card border border-neutral-200 bg-white px-3 py-2 text-primary outline-none transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_10px_20px_-8px_rgba(34,41,93,0.22)] focus-visible:ring-2 focus-visible:ring-primary sm:gap-2.5 sm:px-5 sm:py-3.5 xl:gap-3 xl:px-6 xl:py-4";

function cardClassName(compact?: boolean) {
  return compact
    ? `${cardClassNameBase} min-h-0 overflow-visible`
    : `${cardClassNameBase} min-h-[108px] sm:min-h-[120px]`;
}

export default function InfoCardItem({
  item,
  iconIndex,
  compact = false,
}: InfoCardItemProps) {
  const Icon = INFO_ICONS[iconIndex] ?? MessageCircle;
  const inner = (
    <>
      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5 lg:gap-2 xl:gap-3.5">
        <Icon
          className="h-4 w-4 shrink-0 text-primary transition-colors duration-200 group-hover:text-white sm:h-6 sm:w-6 lg:h-5 lg:w-5 xl:h-8 xl:w-8 2xl:h-9 2xl:w-9"
          strokeWidth={2}
          aria-hidden="true"
        />
        <h3 className="min-w-0 truncate text-base font-black leading-snug tracking-tight text-primary transition-colors duration-200 group-hover:text-white sm:text-[20px] lg:text-[16px] xl:text-[24px] 2xl:text-[28px]">
          {item.title}
        </h3>
      </div>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-colors duration-200 group-hover:bg-white group-hover:text-primary sm:h-11 sm:w-11 lg:h-8 lg:w-8 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16"
      >
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7"
          strokeWidth={2.25}
        />
      </span>
    </>
  );

  const classes = cardClassName(compact);

  if ("openConsultation" in item && item.openConsultation) {
    return (
      <ConsultationTrigger className={classes}>{inner}</ConsultationTrigger>
    );
  }

  const linkItem = item as LinkCard;
  return (
    <WidgetActionLink href={linkItem.href} className={classes}>
      {inner}
    </WidgetActionLink>
  );
}
