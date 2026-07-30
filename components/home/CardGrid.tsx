import { ArrowRight, GraduationCap, School, Users, type LucideIcon } from "lucide-react";
import InfoCardItem from "@/components/home/InfoCardItem";
import WidgetActionLink from "@/components/layout/WidgetActionLink";
import { ko } from "@/content/ko";

// 시간표 카드 순서: 대원외고 / 한영외고 / 고등관 / 중등관 / 개인 및 팀 수업
const TIMETABLE_ICONS = [School, School, GraduationCap, GraduationCap, Users] as const;

const PRIMARY_CARD_CLASS =
  "group relative flex h-full min-h-[52px] min-w-0 flex-row items-center overflow-hidden rounded-card border-2 border-transparent bg-primary-50 px-3 py-2 outline-none transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-accent-500 hover:shadow-[0_12px_24px_-8px_rgba(34,41,93,0.25)] focus-visible:ring-2 focus-visible:ring-primary sm:min-h-0 sm:flex-col sm:items-stretch sm:justify-start sm:px-5 sm:py-4 xl:px-6 xl:py-5";

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
        className="hidden h-10 w-10 text-primary sm:block sm:h-11 sm:w-11 lg:h-9 lg:w-9 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16"
        strokeWidth={1.25}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 pr-1 sm:mt-3 sm:pr-12 lg:mt-2 lg:pr-10 xl:mt-3 xl:pr-12 2xl:mt-4 2xl:pr-14">
        <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-tight text-primary sm:text-[26px] lg:text-[22px] xl:text-[32px] 2xl:text-[40px]">
          {item.title}
        </h3>
        {item.subtitle ? (
          <p className="mt-0.5 truncate text-sm font-semibold text-primary/70 transition-colors group-hover:text-primary/85 sm:mt-1.5 sm:text-[15px] lg:text-[13px] xl:mt-1.5 xl:text-[17px] 2xl:mt-2 2xl:text-[20px]">
            {item.subtitle}
          </p>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white sm:absolute sm:bottom-4 sm:right-4 sm:h-11 sm:w-11 lg:bottom-3 lg:right-3 lg:h-9 lg:w-9 xl:bottom-4 xl:right-4 xl:h-14 xl:w-14 2xl:bottom-5 2xl:right-5 2xl:h-16 2xl:w-16"
      >
        <ArrowRight
          className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 2xl:h-7 2xl:w-7"
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
    <div className="grid h-full min-h-0 grid-cols-2 gap-3 sm:grid-rows-3 sm:gap-4 lg:gap-4 xl:gap-5">
      {mainTimetableItems.map((item, idx) => {
        const Icon = TIMETABLE_ICONS[idx] ?? School;
        return (
          <PrimaryCard
            key={item.title}
            item={item}
            icon={Icon}
            className="h-full min-h-0"
          />
        );
      })}

      <PrimaryCard
        item={privateTimetableItem}
        icon={privateIcon}
        className="col-span-2 h-full min-h-0 sm:col-span-1"
      />

      <div className="col-span-2 grid h-full min-h-[52px] grid-cols-2 gap-3 sm:col-span-1 sm:min-h-0 sm:grid-cols-1 sm:grid-rows-2 sm:gap-4 lg:gap-4 xl:gap-5">
        {info.map((item, idx) => (
          <InfoCardItem key={item.title} item={item} iconIndex={idx} compact />
        ))}
      </div>
    </div>
  );
}
