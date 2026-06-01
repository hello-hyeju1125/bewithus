import { ArrowRight, GraduationCap, School, Users, type LucideIcon } from "lucide-react";
import InfoCardItem from "@/components/home/InfoCardItem";
import WidgetActionLink from "@/components/layout/WidgetActionLink";
import { ko } from "@/content/ko";

// 시간표 카드 순서: 대원외고 / 한영외고 / 고등관 / 개인 및 팀 수업
const TIMETABLE_ICONS = [School, School, GraduationCap, Users] as const;

const PRIMARY_CARD_CLASS =
  "group relative flex h-full min-h-[108px] flex-col justify-start rounded-card border-2 border-transparent bg-primary-50 px-5 py-2.5 outline-none transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-accent-500 hover:shadow-[0_12px_24px_-8px_rgba(34,41,93,0.25)] focus-visible:ring-2 focus-visible:ring-primary sm:min-h-[150px] sm:px-6 sm:py-4";

type PrimaryCardItem = {
  title: string;
  subtitle?: string;
  href: string;
};

function PrimaryCard({
  item,
  icon: Icon,
  rowSpan = false,
}: {
  item: PrimaryCardItem;
  icon: LucideIcon;
  rowSpan?: boolean;
}) {
  return (
    <WidgetActionLink
      href={item.href}
      className={`${PRIMARY_CARD_CLASS}${rowSpan ? " sm:row-span-2" : ""}`}
    >
      <Icon
        className="h-8 w-8 text-primary sm:h-10 sm:w-10"
        strokeWidth={1.25}
        aria-hidden="true"
      />
      <div className="mt-2.5 pr-11 sm:mt-5 sm:pr-16">
        <h3 className="truncate text-[34px] font-black leading-tight tracking-tight text-primary">
          {item.title}
        </h3>
        {item.subtitle ? (
          <p className="mt-2 truncate text-[18px] font-semibold text-primary/70 transition-colors group-hover:text-primary/85">
            {item.subtitle}
          </p>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white sm:bottom-5 sm:right-5 sm:h-12 sm:w-12"
      >
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-5 sm:w-5"
          strokeWidth={2.25}
        />
      </span>
    </WidgetActionLink>
  );
}

export default function CardGrid() {
  const { items, teachers, info } = ko.home.cards;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 sm:min-h-[560px] sm:gap-5">
      {/* 시간표 그룹 — Primary (라이트 네이비, 큰 카드) */}
      <div className="grid flex-[2] grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((item, idx) => {
          const Icon = TIMETABLE_ICONS[idx] ?? School;
          return <PrimaryCard key={item.title} item={item} icon={Icon} />;
        })}
      </div>

      {/* 강사 소개 + 안내 그룹 */}
      <div className="grid flex-[1] grid-cols-1 gap-5 sm:grid-cols-2 sm:grid-rows-2">
        <PrimaryCard item={teachers} icon={GraduationCap} rowSpan />
        {info.map((item, idx) => (
          <InfoCardItem key={item.title} item={item} iconIndex={idx} />
        ))}
      </div>
    </div>
  );
}
