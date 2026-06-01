"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import SubjectFilterChips, {
  ALL_SUBJECT,
} from "@/components/filters/SubjectFilterChips";
import type { School } from "@/lib/constants";
import {
  getTimetableSchoolTheme,
  type TimetableSchoolTheme,
} from "@/lib/layout/timetable-school-theme";
import type { CourseSession } from "@/types/database";
import type { TimetableCourseWithTeacher } from "@/lib/supabase/queries";

type TimetableDetailTableProps = {
  school: School;
  courses: TimetableCourseWithTeacher[];
};

export default function TimetableDetailTable({
  school,
  courses,
}: TimetableDetailTableProps) {
  const theme = getTimetableSchoolTheme(school);
  const subjects = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const c of courses) {
      if (!seen.has(c.subject)) {
        seen.add(c.subject);
        order.push(c.subject);
      }
    }
    return order;
  }, [courses]);

  const [active, setActive] = useState<string>(ALL_SUBJECT);

  const grouped = useMemo(() => {
    const groups = new Map<string, TimetableCourseWithTeacher[]>();
    for (const c of courses) {
      if (active !== ALL_SUBJECT && c.subject !== active) continue;
      const list = groups.get(c.subject) ?? [];
      list.push(c);
      groups.set(c.subject, list);
    }
    return groups;
  }, [courses, active]);

  if (courses.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-neutral-300 bg-white px-6 py-16 text-center text-neutral-500">
        등록된 상세 강의가 아직 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full space-y-10">
      <SubjectFilterChips
        subjects={subjects}
        active={active}
        onChange={setActive}
        chipTheme={theme.chip}
        chipsPerRow={6}
      />

      {/* 과목별 그룹 */}
      <div className="space-y-12">
        {Array.from(grouped.entries()).map(([subject, rows]) => (
          <section key={subject} aria-labelledby={`subject-${subject}`}>
            <h2
              id={`subject-${subject}`}
              className={`mb-4 text-[24px] font-black tracking-tight sm:text-[28px] ${theme.body.heading}`}
            >
              {subject}
            </h2>

            {/* 모바일 — 강사 카드 */}
            <ul className="divide-y divide-neutral-200 md:hidden">
              {rows.map((c) => (
                <CourseCard key={c.id} course={c} theme={theme} />
              ))}
            </ul>

            {/* md 이상 — 표 */}
            <div className="hidden border-y border-neutral-900 bg-white md:block">
              <table className="w-full border-collapse text-left text-[16px]">
                <thead className="bg-white text-[15px] font-bold text-neutral-900">
                  <tr className="border-b border-neutral-900">
                    <th className="w-[168px] px-5 py-4 text-center">강사</th>
                    <th className="px-5 py-4 text-center">강의</th>
                    <th className="w-[260px] px-5 py-4 text-center">요일 / 시간</th>
                    <th className="w-[140px] px-5 py-4 text-center">개강</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <CourseRow key={c.id} course={c} theme={theme} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function CourseTag({ tag, theme }: { tag: string; theme: TimetableSchoolTheme }) {
  return (
    <span
      className={`inline-flex w-fit max-w-full items-center justify-center rounded-[3px] bg-accent-500 px-1.5 py-0.5 text-[10px] font-black leading-tight tracking-tight md:px-2 md:py-1 md:text-[11px] md:tracking-wider ${theme.body.tagText}`}
    >
      {tag}
    </span>
  );
}

/** 모바일 카드 전용 — 신설·마감임박 등 강조 태그 */
function CourseTagMobile({
  tag,
  theme,
}: {
  tag: string;
  theme: TimetableSchoolTheme;
}) {
  return (
    <span
      className={`inline-flex w-fit max-w-full shrink-0 items-center justify-center rounded-button border-2 bg-accent-500 px-2.5 py-1 text-[12px] font-black leading-none tracking-wide ${theme.body.tagBorder} ${theme.body.tagText}`}
    >
      {tag}
    </span>
  );
}

function SessionList({
  sessions,
  emphasized = false,
}: {
  sessions: CourseSession[];
  emphasized?: boolean;
}) {
  if (sessions.length === 0) return null;
  return (
    <ul className={emphasized ? "space-y-2" : "space-y-1"}>
      {sessions.map((s, i) => (
        <li
          key={i}
          className={
            emphasized
              ? "flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[17px] font-black leading-snug text-neutral-900"
              : "flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-snug text-neutral-700 md:text-[16px]"
          }
        >
          <span className="min-w-0 break-words">{s.day_time}</span>
          {s.is_full ? (
            <span
              className={
                emphasized
                  ? "inline-flex w-fit shrink-0 items-center justify-center rounded-button border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-black text-red-600"
                  : "inline-flex w-fit shrink-0 items-center justify-center rounded-[3px] bg-red-50 px-1.5 py-0.5 text-[10px] font-black leading-tight text-red-600 md:px-2 md:text-[11px] md:tracking-wider"
              }
            >
              마감
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function StartDateList({
  dates,
  emphasized = false,
}: {
  dates: string[];
  emphasized?: boolean;
}) {
  if (dates.length === 0) {
    return (
      <span className={emphasized ? "text-[17px] font-bold text-neutral-400" : "text-neutral-400"}>
        —
      </span>
    );
  }
  return (
    <ul className={emphasized ? "space-y-1.5" : "space-y-0.5"}>
      {dates.map((d, i) => (
        <li
          key={`${d}-${i}`}
          className={
            emphasized
              ? "text-[17px] font-black leading-snug text-neutral-900"
              : "text-[13px] text-neutral-700 md:text-[16px]"
          }
        >
          {d}
        </li>
      ))}
    </ul>
  );
}

function DetailVideoLink({
  url,
  theme,
}: {
  url: string;
  theme: TimetableSchoolTheme;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className={`flex w-full max-w-full items-center justify-center rounded-button border bg-white px-2 py-2 text-center text-[11px] font-black leading-tight tracking-tight sm:text-[12px] md:px-2.5 md:py-2.5 md:text-[13px] ${theme.body.link}`}
    >
      <span className="inline-flex items-center justify-center gap-1">
        <span className="text-center">설명회 영상 보기</span>
        <ArrowUpRight
          className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

function TeacherCell({
  course,
}: {
  course: TimetableCourseWithTeacher;
}) {
  const teacher = course.teacher;
  const name = teacher?.name ?? "";
  const photo = teacher?.photo_url ?? null;
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative h-14 w-14 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 md:h-24 md:w-24">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[12px] font-black text-neutral-400 md:text-[16px]">
            {name.slice(0, 1)}
          </div>
        )}
      </div>
      <span className="text-[14px] font-black text-neutral-900 md:text-[18px]">{name}</span>
    </div>
  );
}

function CourseTitleCell({
  course,
  theme,
}: {
  course: TimetableCourseWithTeacher;
  theme: TimetableSchoolTheme;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="min-w-0 text-[17px] font-black leading-snug text-neutral-900 md:text-[18px]">
          {course.course_title}
        </p>
        {course.tag ? <CourseTag tag={course.tag} theme={theme} /> : null}
      </div>
      {course.course_subtitle ? (
        <p className="text-[15px] font-bold text-neutral-900 sm:text-[16px]">
          {course.course_subtitle}
        </p>
      ) : null}
      {course.course_note ? (
        <p className="whitespace-pre-line text-[14px] font-normal leading-[1.85] text-neutral-900 sm:text-[15px] sm:leading-[1.9]">
          {course.course_note}
        </p>
      ) : null}
    </div>
  );
}

function CourseRow({
  course,
  theme,
}: {
  course: TimetableCourseWithTeacher;
  theme: TimetableSchoolTheme;
}) {
  return (
    <tr className="border-b border-neutral-900 align-top last:border-b-0">
      <td className="px-5 py-5">
        <TeacherCell course={course} />
      </td>
      <td className="px-5 py-5">
        <CourseTitleCell course={course} theme={theme} />
      </td>
      <td className="px-5 py-5">
        <SessionList sessions={course.sessions} />
      </td>
      <td className="px-5 py-5">
        <StartDateList dates={course.start_dates} />
        {course.detail_url ? (
          <div className="mt-4">
            <DetailVideoLink url={course.detail_url} theme={theme} />
          </div>
        ) : null}
      </td>
    </tr>
  );
}

function CourseCard({
  course,
  theme,
}: {
  course: TimetableCourseWithTeacher;
  theme: TimetableSchoolTheme;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = Boolean(course.course_subtitle || course.course_note);

  return (
    <li className="bg-white py-4 first:pt-0">
      <div className="flex items-start gap-3.5">
        <div className="flex w-[76px] shrink-0 flex-col items-center gap-1.5">
          <div className="relative h-[72px] w-[72px] overflow-hidden rounded-button border border-neutral-200 bg-neutral-100">
            {course.teacher?.photo_url ? (
              <Image
                src={course.teacher.photo_url}
                alt={course.teacher.name}
                fill
                sizes="72px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[14px] font-black text-neutral-400">
                {course.teacher?.name?.slice(0, 1) ?? ""}
              </div>
            )}
          </div>
          <p className="w-full text-center text-[12px] font-black leading-tight text-neutral-900">
            {course.teacher?.name ?? ""}
          </p>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-start gap-x-2 gap-y-2">
            <p className="min-w-0 flex-1 basis-full text-[20px] font-black leading-[1.25] tracking-tight text-neutral-900">
              {course.course_title}
            </p>
            {course.tag ? <CourseTagMobile tag={course.tag} theme={theme} /> : null}
          </div>
        </div>
      </div>

      {/* 요일·시간 / 개강 — 카드에서 가장 먼저 눈에 들어오도록 */}
      <div
        className={`mt-4 space-y-3.5 rounded-card border-2 bg-neutral-50 px-3.5 py-3.5 ${theme.body.cardBorder}`}
      >
        <div>
          <p
            className={`text-[13px] font-black tracking-tight ${theme.body.cardLabel}`}
          >
            요일 · 시간
          </p>
          <div className="mt-2">
            {course.sessions.length > 0 ? (
              <SessionList sessions={course.sessions} emphasized />
            ) : (
              <span className="text-[17px] font-bold text-neutral-400">—</span>
            )}
          </div>
        </div>
        <div className={`border-t-2 pt-3.5 ${theme.body.cardDivider}`}>
          <p
            className={`text-[13px] font-black tracking-tight ${theme.body.cardLabel}`}
          >
            개강
          </p>
          <div className="mt-2">
            <StartDateList dates={course.start_dates} emphasized />
          </div>
          {course.detail_url ? (
            <div className="mt-3">
              <DetailVideoLink url={course.detail_url} theme={theme} />
            </div>
          ) : null}
        </div>
      </div>

      {hasDetails ? (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={`mt-3 flex w-full items-center justify-center gap-1 rounded-button border border-neutral-300 bg-white py-2.5 text-[14px] font-black ${theme.body.expandBtn}`}
          >
            {expanded ? "접기" : "더보기"}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {expanded ? (
            <div className="mt-3 space-y-2.5 border-t border-neutral-100 pt-3">
              {course.course_subtitle ? (
                <p className="text-[15px] font-bold leading-snug text-neutral-900">
                  {course.course_subtitle}
                </p>
              ) : null}
              {course.course_note ? (
                <p className="whitespace-pre-line text-[14px] font-normal leading-[1.85] text-neutral-800">
                  {course.course_note}
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </li>
  );
}
