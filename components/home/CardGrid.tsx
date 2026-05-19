import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  GraduationCap,
  Info,
  MapPin,
  MessageCircle,
  School,
  Users,
} from "lucide-react";
import { ko } from "@/content/ko";

// 시간표 카드 순서: 대원외고 / 한영외고 / 입시관 / 개인 및 팀 수업
const TIMETABLE_ICONS = [School, School, GraduationCap, Users] as const;
// 안내 카드 순서: 입학 상담 / 문자 수신 등록 / 오시는 길 / 학원 소개
const INFO_ICONS = [MessageCircle, BellRing, MapPin, Info] as const;

export default function CardGrid() {
  const { items } = ko.home.cards;
  const timetable = items.slice(0, 4);
  const info = items.slice(4);

  return (
    <div className="flex h-full min-h-[560px] flex-col gap-5">
      {/* 시간표 그룹 — Primary (라이트 네이비, 큰 카드) */}
      <div className="grid flex-[2] grid-cols-1 gap-5 sm:grid-cols-2">
        {timetable.map((item, idx) => {
          const Icon = TIMETABLE_ICONS[idx] ?? School;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex h-full min-h-[150px] flex-col justify-start rounded-card border-2 border-transparent bg-primary-50 px-6 py-4 outline-none transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-accent-500 hover:shadow-[0_12px_24px_-8px_rgba(34,41,93,0.25)] focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon
                className="h-10 w-10 text-primary"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <div className="mt-5 pr-16">
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
                className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white"
              >
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                />
              </span>
            </Link>
          );
        })}
      </div>

      {/* 안내·신청 그룹 — Secondary (라이트 그레이, 컴팩트 카드) */}
      <div className="grid flex-[1] grid-cols-1 gap-5 sm:grid-cols-2">
        {info.map((item, idx) => {
          const Icon = INFO_ICONS[idx] ?? Info;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex h-full min-h-[80px] items-center justify-between gap-3 rounded-card border border-neutral-200 bg-white px-5 py-4 outline-none transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-accent-500 hover:shadow-[0_10px_20px_-8px_rgba(34,41,93,0.22)] focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Icon
                  className="h-5 w-5 shrink-0 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <h3 className="truncate text-[22px] font-black tracking-tight text-primary">
                  {item.title}
                </h3>
              </div>
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white"
              >
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
