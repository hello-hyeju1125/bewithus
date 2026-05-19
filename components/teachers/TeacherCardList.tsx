"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { User } from "lucide-react";

import SubjectFilterChips, {
  ALL_SUBJECT,
} from "@/components/filters/SubjectFilterChips";
import { sectionBodyClass } from "@/lib/layout/section-theme";
import type { Teacher } from "@/types/database";
import { cn } from "@/lib/utils";

type TeacherCardListProps = {
  teachers: Teacher[];
};

function formatTeacherName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "선생님";
  if (trimmed.endsWith("선생님")) return trimmed;
  return `${trimmed} 선생님`;
}

/**
 * 강사 카드 그리드 — 과목 필터 칩, 가나다순 단일 그리드, 호버 시 소개(bio) 오버레이.
 */
export default function TeacherCardList({ teachers }: TeacherCardListProps) {
  const subjects = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const t of teachers) {
      if (!seen.has(t.subject)) {
        seen.add(t.subject);
        order.push(t.subject);
      }
    }
    return order.sort((a, b) => a.localeCompare(b, "ko"));
  }, [teachers]);

  const [active, setActive] = useState<string>(ALL_SUBJECT);

  const visibleTeachers = useMemo(() => {
    const list =
      active === ALL_SUBJECT
        ? teachers
        : teachers.filter((t) => t.subject === active);
    return [...list].sort((a, b) =>
      a.name.localeCompare(b.name, "ko", { sensitivity: "base" }),
    );
  }, [teachers, active]);

  if (teachers.length === 0) {
    return (
      <p className="rounded-card border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-[15px] text-neutral-500">
        등록된 강사가 없습니다. 곧 업데이트 예정입니다.
      </p>
    );
  }

  return (
    <div className="w-full space-y-10">
      <SubjectFilterChips
        subjects={subjects}
        active={active}
        onChange={setActive}
      />

      {visibleTeachers.length === 0 ? (
        <p className="rounded-card border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-[15px] text-neutral-500">
          선택한 과목에 등록된 강사가 없습니다.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
          {visibleTeachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TeacherCard({ teacher: t }: { teacher: Teacher }) {
  const displayName = formatTeacherName(t.name);
  const bio = t.bio?.trim() ?? "";

  return (
    <li>
      <article
        tabIndex={0}
        className={cn(
          "group flex aspect-[4/5] flex-col overflow-hidden rounded-card border border-neutral-200 bg-white outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(42,145,133,0.25)] focus-visible:ring-2",
          sectionBodyClass.teacher.hoverBorder,
          sectionBodyClass.teacher.focusRing,
        )}
        aria-label={`${t.subject} ${displayName}`}
      >
        <div className="shrink-0 border-b border-neutral-200 bg-white px-2 py-3 sm:py-3.5">
          <p className="text-center text-[17px] font-black tracking-tight text-primary sm:text-[19px]">
            {t.subject}
          </p>
        </div>

        <div className="relative min-h-0 flex-1 bg-neutral-100 transition-colors duration-200 group-hover:bg-primary group-focus-within:bg-primary">
          <div className="relative h-full min-h-[140px] overflow-hidden transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0">
            {t.photo_url ? (
              <Image
                src={t.photo_url}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain object-center p-2 pt-3 sm:p-2.5 sm:pt-3.5"
              />
            ) : (
              <div className="flex h-full min-h-[140px] w-full items-center justify-center">
                <User
                  className={cn(
                    "h-12 w-12 sm:h-14 sm:w-14",
                    sectionBodyClass.teacher.text,
                  )}
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <div
            className="pointer-events-none absolute inset-0 flex flex-col justify-start overflow-y-auto bg-primary p-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:p-4"
            aria-hidden="true"
          >
            <p className="whitespace-pre-line text-left text-[14px] font-medium leading-[1.9] text-white sm:text-[15px] sm:leading-[2]">
              {bio || "소개가 준비 중입니다."}
            </p>
          </div>

          {bio ? <p className="sr-only">{bio}</p> : null}
        </div>

        <div className="shrink-0 border-t border-neutral-200 bg-white px-2 py-3 sm:py-3.5">
          <h3 className="text-center text-[17px] font-black tracking-tight text-primary sm:text-[19px]">
            {displayName}
          </h3>
        </div>
      </article>
    </li>
  );
}
