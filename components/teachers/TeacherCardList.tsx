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
 * 강사 카드 그리드 — 과목 필터 칩, 가나다순.
 * 모바일: 1열 가로 카드(사진 + 프로필 항상 노출). md+: 그리드 + 호버 시 bio 오버레이.
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
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
          {visibleTeachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TeacherCardMobile({ teacher: t }: { teacher: Teacher }) {
  const displayName = formatTeacherName(t.name);
  const bio = t.bio?.trim() ?? "";

  return (
    <article
      className="flex gap-4 rounded-card border border-neutral-200 bg-white p-4 md:hidden"
      aria-label={`${t.subject} ${displayName}`}
    >
      <div className="relative h-[132px] w-[100px] shrink-0 overflow-hidden rounded-button bg-neutral-100">
        {t.photo_url ? (
          <Image
            src={t.photo_url}
            alt=""
            fill
            sizes="100px"
            className="object-contain object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User
              className={cn("h-10 w-10", sectionBodyClass.teacher.text)}
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-black tracking-tight text-primary">
          {t.subject}
        </p>
        <h3 className="mt-0.5 text-[18px] font-black tracking-tight text-primary">
          {displayName}
        </h3>
        <p className="mt-2.5 whitespace-pre-line text-[14px] font-normal leading-[1.85] text-neutral-800">
          {bio || "소개가 준비 중입니다."}
        </p>
      </div>
    </article>
  );
}

function TeacherCardDesktop({ teacher: t }: { teacher: Teacher }) {
  const displayName = formatTeacherName(t.name);
  const bio = t.bio?.trim() ?? "";

  return (
    <article
      tabIndex={0}
      className={cn(
        "group hidden aspect-[4/5] flex-col overflow-hidden rounded-card border border-neutral-200 bg-white outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(42,145,133,0.25)] focus-visible:ring-2 md:flex",
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

        <div className="relative min-h-0 w-full flex-1 bg-neutral-100 transition-colors duration-200 group-hover:bg-primary group-focus-within:bg-primary">
          <div className="absolute inset-3 transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0 sm:inset-4">
            {t.photo_url ? (
              <div className="relative h-full w-full">
                <Image
                  src={t.photo_url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain object-top"
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
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
  );
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <li>
      <TeacherCardMobile teacher={teacher} />
      <TeacherCardDesktop teacher={teacher} />
    </li>
  );
}
