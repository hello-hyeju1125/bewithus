"use client";

import {
  getTimetableSchoolTheme,
  type TimetableSchoolTheme,
} from "@/lib/layout/timetable-school-theme";
import type { School } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const ALL_SUBJECT = "__all__";

type SubjectFilterChipsProps = {
  subjects: string[];
  active: string;
  onChange: (subject: string) => void;
  ariaLabel?: string;
  /** 시간표 대원외고 등 학교별 강조색 (미지정 시 네이비) */
  school?: School;
  chipTheme?: TimetableSchoolTheme["chip"];
  /** 한 줄에 표시할 칩 개수 (강사진 페이지 등) */
  chipsPerRow?: number;
};

export default function SubjectFilterChips({
  subjects,
  active,
  onChange,
  ariaLabel = "과목 필터",
  school,
  chipTheme,
  chipsPerRow,
}: SubjectFilterChipsProps) {
  const chip =
    chipTheme ?? (school ? getTimetableSchoolTheme(school).chip : undefined);
  const activeChip = chip?.active ?? "border-primary bg-primary text-white";
  const inactiveChip =
    chip?.inactive ??
    "border-neutral-200 bg-white text-neutral-600 hover:border-primary hover:text-primary";

  const useSixColGrid = chipsPerRow === 6;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "gap-3",
        useSixColGrid
          ? "grid grid-cols-3 md:grid-cols-6"
          : "flex flex-wrap items-center justify-center",
      )}
    >
      <SubjectChip
        label="#전체"
        active={active === ALL_SUBJECT}
        onClick={() => onChange(ALL_SUBJECT)}
        activeClass={activeChip}
        inactiveClass={inactiveChip}
      />
      {subjects.map((s) => (
        <SubjectChip
          key={s}
          label={`#${s}`}
          active={active === s}
          onClick={() => onChange(s)}
          activeClass={activeChip}
          inactiveClass={inactiveChip}
        />
      ))}
    </div>
  );
}

function SubjectChip({
  label,
  active,
  onClick,
  activeClass,
  inactiveClass,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeClass: string;
  inactiveClass: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center rounded-full border px-3 text-[15px] font-black transition-colors sm:h-12 sm:px-4 sm:text-[16px] lg:px-5 lg:text-[18px]",
        active ? activeClass : inactiveClass,
      )}
    >
      {label}
    </button>
  );
}
