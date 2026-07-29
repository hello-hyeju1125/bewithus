"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { User } from "lucide-react";

import SubjectFilterChips, {
  ALL_SUBJECT,
} from "@/components/filters/SubjectFilterChips";
import { sectionBodyClass } from "@/lib/layout/section-theme";
import { withCacheBust } from "@/lib/media/cache-bust";
import { resolveTeacherPhotoFrame } from "@/lib/teachers/photo-overrides";
import { subjectsForTeacherList } from "@/lib/teachers/subject-order";
import type { Teacher } from "@/types/database";
import { cn } from "@/lib/utils";

type TeacherCardListProps = {
  teachers: Teacher[];
  /** 관리자에서 지정한 과목(해시태그) 노출 순서 */
  subjectOrder: string[];
};

type TeacherDisplayName = {
  name: string;
  suffix: string;
};

function parseTeacherDisplayName(raw: string): TeacherDisplayName {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { name: "선생님", suffix: "" };
  }
  if (trimmed.endsWith("선생님")) {
    const name = trimmed.slice(0, -"선생님".length).trim();
    if (!name) return { name: "선생님", suffix: "" };
    return { name, suffix: "선생님" };
  }
  return { name: trimmed, suffix: "선생님" };
}

function teacherAriaLabel(subject: string, display: TeacherDisplayName): string {
  const fullName = display.suffix
    ? `${display.name} ${display.suffix}`
    : display.name;
  return `${subject} ${fullName}`;
}

/** 데스크톱 — 카드 가로를 가득 채워 사진↔카드 여백 최소화 */
const TEACHER_CARD_PHOTO_WRAPPER_CLASS = "w-full";

const TEACHER_PHOTO_FRAME_CLASS =
  "relative w-full shrink-0 overflow-hidden rounded-none aspect-[4/5]";

type TeacherPhotoFrameProps = {
  teacherName: string;
  photoUrl: string | null;
  sizes: string;
  placeholderIconClass?: string;
};

function TeacherPhotoFrame({
  teacherName,
  photoUrl,
  sizes,
  placeholderIconClass = "h-16 w-16",
}: TeacherPhotoFrameProps) {
  const frame = resolveTeacherPhotoFrame(teacherName);

  return (
    <div className={TEACHER_PHOTO_FRAME_CLASS}>
      {photoUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute"
            style={{
              top: `${frame.topPercent}%`,
              height: `${frame.scalePercent}%`,
              left: `${frame.insetXPercent}%`,
              right: `${frame.insetXPercent}%`,
            }}
          >
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes={sizes}
              className={
                frame.objectFit === "contain" ? "object-contain" : "object-cover"
              }
              style={{ objectPosition: frame.objectPosition }}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User
            className={cn(placeholderIconClass, sectionBodyClass.teacher.text)}
            strokeWidth={1.25}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

function TeacherSubjectTag({
  subject,
  className,
}: {
  subject: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-r-full border border-transparent bg-white shadow-sm",
        className,
      )}
    >
      <span className="w-2 shrink-0 bg-primary sm:w-2.5" aria-hidden="true" />
      <span className="px-4 py-2 text-[17px] font-semibold leading-none text-primary sm:px-5 sm:py-2.5 sm:text-[18px] lg:text-[19px]">
        {subject}
      </span>
    </span>
  );
}

function TeacherNameDisplay({
  display,
  className,
  nameClassName,
  suffixClassName,
}: {
  display: TeacherDisplayName;
  className?: string;
  nameClassName?: string;
  suffixClassName?: string;
}) {
  return (
    <h3 className={cn("leading-tight tracking-tight", className)}>
      <span className={cn("font-black text-primary", nameClassName)}>
        {display.name}
      </span>
      {display.suffix ? (
        <span
          className={cn("ml-1 font-normal text-neutral-500", suffixClassName)}
        >
          {display.suffix}
        </span>
      ) : null}
    </h3>
  );
}

/**
 * 강사 카드 그리드 — 과목 필터 칩, 가나다순.
 * 모바일: 1열 가로 카드(사진 + 프로필 항상 노출). md+: 그리드 + 호버 시 bio 오버레이.
 */
export default function TeacherCardList({
  teachers,
  subjectOrder,
}: TeacherCardListProps) {
  const subjects = useMemo(
    () => subjectsForTeacherList(subjectOrder, teachers),
    [subjectOrder, teachers],
  );

  const [active, setActive] = useState<string>(ALL_SUBJECT);

  const visibleTeachers = useMemo(() => {
    if (active === ALL_SUBJECT) return teachers;
    return teachers.filter((t) => t.subject === active);
  }, [teachers, active]);

  if (teachers.length === 0) {
    return (
      <p className="rounded-card border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-[15px] text-neutral-500">
        등록된 강사가 없습니다. 곧 업데이트 예정입니다.
      </p>
    );
  }

  return (
    <div className="w-full space-y-14 sm:space-y-16">
      <SubjectFilterChips
        subjects={subjects}
        active={active}
        onChange={setActive}
        chipsPerRow={6}
      />

      {visibleTeachers.length === 0 ? (
        <p className="rounded-card border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-[15px] text-neutral-500">
          선택한 과목에 등록된 강사가 없습니다.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 md:grid-cols-3 md:gap-x-7 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {visibleTeachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TeacherCardMobile({ teacher: t }: { teacher: Teacher }) {
  const display = parseTeacherDisplayName(t.name);
  const bio = t.bio?.trim() ?? "";

  return (
    <article
      className="flex gap-3 rounded-card border border-neutral-200 bg-white p-3 md:hidden"
      aria-label={teacherAriaLabel(t.subject, display)}
    >
      <div className="w-[88px] shrink-0 overflow-hidden rounded-none bg-neutral-100">
        <TeacherPhotoFrame
          teacherName={t.name}
          photoUrl={
            t.photo_url ? withCacheBust(t.photo_url, t.updated_at) : null
          }
          sizes="88px"
          placeholderIconClass="h-9 w-9"
        />
      </div>

      <div className="min-w-0 flex-1">
        <TeacherSubjectTag subject={t.subject} className="mb-1.5" />
        <TeacherNameDisplay
          display={display}
          className="text-left"
          nameClassName="text-[26px]"
          suffixClassName="text-[18px] font-semibold"
        />
        <p className="mt-1.5 whitespace-pre-line text-[14px] font-normal leading-[1.65] text-neutral-800">
          {bio || "소개가 준비 중입니다."}
        </p>
      </div>
    </article>
  );
}

function TeacherCardDesktop({ teacher: t }: { teacher: Teacher }) {
  const display = parseTeacherDisplayName(t.name);
  const bio = t.bio?.trim() ?? "";

  return (
    <article
      tabIndex={0}
      className={cn(
        "group hidden w-full flex-col overflow-hidden rounded-card border border-neutral-200 bg-white outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(34,41,93,0.22)] focus-visible:ring-2 md:flex",
        sectionBodyClass.teacher.hoverBorder,
        sectionBodyClass.teacher.focusRing,
      )}
      aria-label={teacherAriaLabel(t.subject, display)}
    >
      <div className="relative flex w-full shrink-0 flex-col justify-end bg-neutral-100 transition-colors duration-200 group-hover:bg-primary group-focus-within:bg-primary">
        <div className="absolute left-0 top-2.5 z-10 transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0 sm:top-3">
          <TeacherSubjectTag subject={t.subject} />
        </div>

        <div
          className={cn(
            TEACHER_CARD_PHOTO_WRAPPER_CLASS,
            "transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0",
          )}
        >
          <TeacherPhotoFrame
            teacherName={t.name}
            photoUrl={
              t.photo_url ? withCacheBust(t.photo_url, t.updated_at) : null
            }
            sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 88px"
            placeholderIconClass="h-10 w-10 sm:h-11 sm:w-11"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[1] flex flex-col justify-start overflow-y-auto p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:p-3.5"
          aria-hidden="true"
        >
          <p className="whitespace-pre-line text-left text-[16px] font-semibold leading-[1.65] text-white sm:text-[18px] sm:leading-[1.7] lg:text-[19px] lg:leading-[1.75]">
            {bio || "소개가 준비 중입니다."}
          </p>
        </div>

        {bio ? <p className="sr-only">{bio}</p> : null}
      </div>

      <div className="flex shrink-0 items-center justify-center bg-white px-3 py-4 sm:py-5 lg:py-6">
        <TeacherNameDisplay
          display={display}
          className="text-center"
          nameClassName="text-[28px] sm:text-[32px] lg:text-[34px]"
          suffixClassName="text-[18px] font-semibold sm:text-[20px] lg:text-[21px]"
        />
      </div>
    </article>
  );
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <li className="w-full">
      <TeacherCardMobile teacher={teacher} />
      <TeacherCardDesktop teacher={teacher} />
    </li>
  );
}
