"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { User } from "lucide-react";

import SubjectFilterChips, {
  ALL_SUBJECT,
} from "@/components/filters/SubjectFilterChips";
import { SCHOOL_LABELS } from "@/lib/constants";
import { sectionBodyClass } from "@/lib/layout/section-theme";
import { resolveTeacherPhotoFrame } from "@/lib/teachers/photo-overrides";
import { subjectsForTeacherList } from "@/lib/teachers/subject-order";
import type { Teacher } from "@/types/database";
import { cn } from "@/lib/utils";

type TeacherCardListProps = {
  teachers: Teacher[];
  /** 관리자에서 지정한 과목(해시태그) 노출 순서 */
  subjectOrder: string[];
  /** 전체 강사진 페이지 — 카드에 소속 학교 표시 */
  showSchool?: boolean;
};

function formatTeacherName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "선생님";
  if (trimmed.endsWith("선생님")) return trimmed;
  return `${trimmed} 선생님`;
}

/** 모든 강사 카드에 동일한 사진 프레임·크롭 적용 */
const TEACHER_PHOTO_FRAME_CLASS =
  "relative w-full shrink-0 overflow-hidden bg-neutral-100 aspect-[3/4]";

const TEACHER_PHOTO_IMAGE_CLASS = "object-cover";

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
            className="absolute inset-x-0"
            style={{
              top: `${frame.topPercent}%`,
              height: `${frame.scalePercent}%`,
            }}
          >
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes={sizes}
              className={TEACHER_PHOTO_IMAGE_CLASS}
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

/**
 * 강사 카드 그리드 — 과목 필터 칩, 가나다순.
 * 모바일: 1열 가로 카드(사진 + 프로필 항상 노출). md+: 그리드 + 호버 시 bio 오버레이.
 */
export default function TeacherCardList({
  teachers,
  subjectOrder,
  showSchool = false,
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
    <div className="w-full space-y-10">
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
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 [&>li]:h-full">
          {visibleTeachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} showSchool={showSchool} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TeacherCardMobile({
  teacher: t,
  showSchool,
}: {
  teacher: Teacher;
  showSchool: boolean;
}) {
  const displayName = formatTeacherName(t.name);
  const bio = t.bio?.trim() ?? "";

  return (
    <article
      className="flex gap-3 rounded-card border border-neutral-200 bg-white p-3 md:hidden"
      aria-label={`${t.subject} ${displayName}`}
    >
      <div className="w-[112px] shrink-0 overflow-hidden rounded-button">
        <TeacherPhotoFrame
          teacherName={t.name}
          photoUrl={t.photo_url}
          sizes="112px"
          placeholderIconClass="h-11 w-11"
        />
      </div>

      <div className="min-w-0 flex-1">
        {showSchool ? (
          <p className="text-[12px] font-semibold leading-none text-neutral-500">
            {SCHOOL_LABELS[t.school]}
          </p>
        ) : null}
        <p
          className={cn(
            "text-[15px] font-black leading-tight tracking-tight text-primary",
            showSchool && "mt-0.5",
          )}
        >
          {t.subject}
        </p>
        <h3 className="mt-0.5 text-[20px] font-black leading-tight tracking-tight text-primary">
          {displayName}
        </h3>
        <p className="mt-1.5 whitespace-pre-line text-[15px] font-normal leading-[1.75] text-neutral-800">
          {bio || "소개가 준비 중입니다."}
        </p>
      </div>
    </article>
  );
}

function TeacherCardDesktop({
  teacher: t,
  showSchool,
}: {
  teacher: Teacher;
  showSchool: boolean;
}) {
  const displayName = formatTeacherName(t.name);
  const bio = t.bio?.trim() ?? "";

  return (
    <article
      tabIndex={0}
      className={cn(
        "group hidden h-full w-full flex-col overflow-hidden rounded-card border border-neutral-200 bg-white outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(34,41,93,0.22)] focus-visible:ring-2 md:flex",
        sectionBodyClass.teacher.hoverBorder,
        sectionBodyClass.teacher.focusRing,
      )}
      aria-label={`${t.subject} ${displayName}`}
    >
        <div
          className={cn(
            "flex shrink-0 flex-col justify-center border-b border-neutral-200 bg-accent-500 px-1.5 py-1.5 sm:px-2 sm:py-2",
            showSchool ? "min-h-[3.75rem]" : "min-h-[2.75rem]",
          )}
        >
          {showSchool ? (
            <p className="text-center text-[11px] font-semibold leading-none text-primary/75 sm:text-[12px]">
              {SCHOOL_LABELS[t.school]}
            </p>
          ) : (
            <span className="sr-only">강사 과목</span>
          )}
          <p
            className={cn(
              "text-center text-[20px] font-black leading-tight tracking-tight text-primary sm:text-[22px]",
              showSchool && "mt-0.5",
            )}
          >
            {t.subject}
          </p>
        </div>

        <div className="relative w-full shrink-0 transition-colors duration-200 group-hover:bg-primary group-focus-within:bg-primary">
          <div className="transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0">
            <TeacherPhotoFrame
              teacherName={t.name}
              photoUrl={t.photo_url}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              placeholderIconClass="h-16 w-16 sm:h-[72px] sm:w-[72px]"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 flex flex-col justify-start overflow-y-auto bg-primary p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:p-2.5"
            aria-hidden="true"
          >
            <p className="whitespace-pre-line text-left text-[15px] font-medium leading-[1.75] text-white sm:text-[16px] sm:leading-[1.85]">
              {bio || "소개가 준비 중입니다."}
            </p>
          </div>

          {bio ? <p className="sr-only">{bio}</p> : null}
        </div>

        <div className="flex min-h-[2.75rem] shrink-0 items-center justify-center border-t border-neutral-200 bg-white px-1.5 py-1.5 sm:min-h-[3rem] sm:px-2 sm:py-2">
          <h3 className="text-center text-[20px] font-black leading-tight tracking-tight text-primary sm:text-[22px]">
            {displayName}
          </h3>
        </div>
      </article>
  );
}

function TeacherCard({
  teacher,
  showSchool,
}: {
  teacher: Teacher;
  showSchool: boolean;
}) {
  return (
    <li>
      <TeacherCardMobile teacher={teacher} showSchool={showSchool} />
      <TeacherCardDesktop teacher={teacher} showSchool={showSchool} />
    </li>
  );
}
