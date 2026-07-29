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
  "group flex h-full w-full items-center justify-between gap-1.5 rounded-card border border-neutral-200 bg-white px-3 py-2 text-primary outline-none transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_10px_20px_-8px_rgba(34,41,93,0.22)] focus-visible:ring-2 focus-visible:ring-primary sm:gap-3 sm:px-6 sm:py-5 xl:px-7 xl:py-6";

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
      <div className="flex min-w-0 items-center gap-2 sm:gap-3.5 xl:gap-5">
        <Icon
          className="h-4 w-4 shrink-0 text-primary transition-colors duration-200 group-hover:text-white sm:h-8 sm:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10"
          strokeWidth={2}
          aria-hidden="true"
        />
        <h3 className="text-base font-black leading-snug tracking-tight text-primary transition-colors duration-200 group-hover:text-white sm:text-[24px] lg:text-[28px] xl:text-[32px]">
          {item.title}
        </h3>
      </div>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-colors duration-200 group-hover:bg-white group-hover:text-primary sm:h-14 sm:w-14 lg:h-16 lg:w-16 xl:h-[4.5rem] xl:w-[4.5rem]"
      >
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8"
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
