import { ArrowRight, GraduationCap, School, Users, type LucideIcon } from "lucide-react";
import InfoCardItem from "@/components/home/InfoCardItem";
import WidgetActionLink from "@/components/layout/WidgetActionLink";
import { ko } from "@/content/ko";

// 시간표 카드 순서: 대원외고 / 한영외고 / 고등관 / 중등관 / 개인 및 팀 수업
const TIMETABLE_ICONS = [School, School, GraduationCap, GraduationCap, Users] as const;

const PRIMARY_CARD_CLASS =
  "group relative flex h-full min-h-[52px] flex-row items-center rounded-card border-2 border-transparent bg-primary-50 px-3 py-2 outline-none transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-accent-500 hover:shadow-[0_12px_24px_-8px_rgba(34,41,93,0.25)] focus-visible:ring-2 focus-visible:ring-primary sm:min-h-0 sm:flex-col sm:items-stretch sm:justify-start sm:px-7 sm:py-5 xl:px-8 xl:py-6";

type PrimaryCardItem = {
  title: string;
  subtitle?: string;
  href: string;
};

function PrimaryCard({
  item,
  icon: Icon,
  className = "",
}: {
  item: PrimaryCardItem;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <WidgetActionLink
      href={item.href}
      className={`${PRIMARY_CARD_CLASS} ${className}`.trim()}
    >
      <Icon
        className="hidden h-10 w-10 text-primary sm:block sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem] xl:h-20 xl:w-20"
        strokeWidth={1.25}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 pr-1 sm:mt-4 sm:pr-16 xl:mt-5 xl:pr-20">
        <h3 className="truncate text-xl font-black leading-tight tracking-tight text-primary sm:text-[34px] lg:text-[40px] xl:text-[46px]">
          {item.title}
        </h3>
        {item.subtitle ? (
          <p className="mt-0.5 truncate text-sm font-semibold text-primary/70 transition-colors group-hover:text-primary/85 sm:mt-2 sm:text-[18px] lg:text-[20px] xl:mt-2.5 xl:text-[22px]">
            {item.subtitle}
          </p>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white sm:absolute sm:bottom-5 sm:right-5 sm:h-14 sm:w-14 lg:h-16 lg:w-16 xl:bottom-6 xl:right-6 xl:h-[4.5rem] xl:w-[4.5rem]"
      >
        <ArrowRight
          className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8"
          strokeWidth={2.25}
        />
      </span>
    </WidgetActionLink>
  );
}

export default function CardGrid() {
  const { items, info } = ko.home.cards;
  const mainTimetableItems = items.slice(0, -1);
  const privateTimetableItem = items[items.length - 1];
  const privateIcon = TIMETABLE_ICONS[items.length - 1] ?? Users;

  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-3 sm:min-h-[560px] sm:grid-rows-3 sm:gap-6 lg:min-h-0 lg:gap-7">
      {mainTimetableItems.map((item, idx) => {
        const Icon = TIMETABLE_ICONS[idx] ?? School;
        return (
          <PrimaryCard
            key={item.title}
            item={item}
            icon={Icon}
            className="h-full"
          />
        );
      })}

      <PrimaryCard
        item={privateTimetableItem}
        icon={privateIcon}
        className="col-span-2 h-full sm:col-span-1"
      />

      <div className="col-span-2 grid h-full min-h-[52px] grid-cols-2 gap-3 sm:col-span-1 sm:min-h-0 sm:grid-cols-1 sm:grid-rows-2 sm:gap-6 lg:gap-7">
        {info.map((item, idx) => (
          <InfoCardItem key={item.title} item={item} iconIndex={idx} compact />
        ))}
      </div>
    </div>
  );
}
