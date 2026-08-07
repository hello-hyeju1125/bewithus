"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import SubjectFilterChips, {
  ALL_SUBJECT,
} from "@/components/filters/SubjectFilterChips";
import type { School } from "@/lib/constants";
import {
  DEFAULT_TAG_BG_COLOR,
  DEFAULT_TAG_TEXT_COLOR,
} from "@/lib/admin/hex-color";
import {
  getTimetableSchoolTheme,
  type TimetableSchoolTheme,
} from "@/lib/layout/timetable-school-theme";
import type { CourseSession } from "@/types/database";
import { withCacheBust } from "@/lib/media/cache-bust";
import type { TimetableCourseWithTeacher } from "@/lib/supabase/queries";
import { subjectsForTeacherList } from "@/lib/teachers/subject-order";

type TimetableDetailTableProps = {
  school: School;
  courses: TimetableCourseWithTeacher[];
  /** 관리자에서 지정한 과목 노출 순서 */
  subjectOrder: string[];
};

export default function TimetableDetailTable({
  school,
  courses,
  subjectOrder,
}: TimetableDetailTableProps) {
  const theme = getTimetableSchoolTheme(school);
  const subjects = useMemo(
    () => subjectsForTeacherList(subjectOrder, courses),
    [subjectOrder, courses],
  );

  const [active, setActive] = useState<string>(ALL_SUBJECT);

  const grouped = useMemo(() => {
    const groups = new Map<string, TimetableCourseWithTeacher[]>();
    for (const subject of subjects) {
      groups.set(subject, []);
    }
    for (const c of courses) {
      if (active !== ALL_SUBJECT && c.subject !== active) continue;
      const list = groups.get(c.subject) ?? [];
      list.push(c);
      groups.set(c.subject, list);
    }
    for (const [subject, list] of groups) {
      if (list.length === 0) groups.delete(subject);
    }
    return groups;
  }, [courses, active, subjects]);

  if (courses.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-neutral-300 bg-white px-6 py-16 text-center text-neutral-500">
        등록된 상세 강의가 아직 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full space-y-14 sm:space-y-16">
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
              className="mb-4 text-[28px] font-black tracking-tight text-primary sm:text-[44px]"
            >
              {subject}
            </h2>

            {/* 모바일·태블릿 — 강사 카드 */}
            <ul className="divide-y divide-neutral-200 lg:hidden">
              {rows.map((c) => (
                <CourseCard key={c.id} course={c} theme={theme} />
              ))}
            </ul>

            {/* lg 이상 — 표 (가로 스크롤 안전장치 + 유동 열 비율) */}
            <div className="hidden overflow-x-auto border-y border-neutral-900 bg-white lg:block">
              <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-[15px] xl:text-[17px] 2xl:text-[20px]">
                <thead className="font-bold text-neutral-900">
                  <tr className="border-b border-neutral-900 bg-tiffany/70">
                    <th className="w-[22%] px-3 py-3 text-center xl:w-[18%] xl:px-4 xl:py-3.5 2xl:w-[16%] 2xl:px-5 2xl:py-4">
                      강사
                    </th>
                    <th className="w-[40%] px-3 py-3 text-center xl:px-4 xl:py-3.5 2xl:px-5 2xl:py-4">
                      강의
                    </th>
                    <th className="w-[24%] px-3 py-3 text-center xl:w-[26%] xl:px-4 xl:py-3.5 2xl:w-[28%] 2xl:px-5 2xl:py-4">
                      요일 / 시간
                    </th>
                    <th className="w-[14%] px-3 py-3 text-center xl:w-[16%] xl:px-4 xl:py-3.5 2xl:px-5 2xl:py-4">
                      개강
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <CourseRow key={c.id} course={c} />
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

/** Admin에서 지정한 색 우선, 없으면 accent/primary 기본값 */
function chipStyle(
  bg: string | null | undefined,
  text: string | null | undefined,
): CSSProperties {
  return {
    backgroundColor: bg || DEFAULT_TAG_BG_COLOR,
    color: text || DEFAULT_TAG_TEXT_COLOR,
  };
}

const statusChipClass =
  "inline-flex w-fit max-w-full shrink-0 items-center justify-center rounded-[3px] px-2 py-0.5 text-[11px] font-black leading-tight tracking-tight xl:px-2.5 xl:py-1 xl:text-[13px] 2xl:text-[14px] 2xl:tracking-wider";

const statusChipMobileClass =
  "inline-flex w-fit max-w-full shrink-0 items-center justify-center rounded-button px-2.5 py-1 text-[14px] font-black leading-none tracking-wide";

/** 과목명 옆 — 상태 배지만 노출 (해시태그는 숨김) */
function CourseStatusTag({
  course,
  mobile = false,
}: {
  course: TimetableCourseWithTeacher;
  mobile?: boolean;
}) {
  const status = course.status_tag?.trim() || "";
  if (!status) return null;

  return (
    <span
      style={chipStyle(
        course.status_tag_bg_color,
        course.status_tag_text_color,
      )}
      className={mobile ? statusChipMobileClass : statusChipClass}
    >
      {status}
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
              ? "flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[17px] font-black leading-snug text-neutral-900 sm:text-[21px]"
              : "flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-snug text-neutral-700 xl:text-[17px] 2xl:text-[21px]"
          }
        >
          <span className="min-w-0 break-words">{s.day_time}</span>
          {s.is_full ? (
            <span
              className={
                emphasized
                  ? "inline-flex w-fit shrink-0 items-center justify-center rounded-button border border-red-200 bg-red-50 px-2 py-0.5 text-[13px] font-black text-red-600"
                  : "inline-flex w-fit shrink-0 items-center justify-center rounded-[3px] bg-red-50 px-1.5 py-0.5 text-[11px] font-black leading-tight text-red-600 xl:px-2 xl:text-[13px] 2xl:text-[14px] 2xl:tracking-wider"
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
      <span className={emphasized ? "text-[17px] font-bold text-neutral-400 sm:text-[21px]" : "text-neutral-400"}>
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
              ? "text-[17px] font-black leading-snug text-neutral-900 sm:text-[21px]"
              : "text-[14px] text-neutral-700 xl:text-[17px] 2xl:text-[21px]"
          }
        >
          {d}
        </li>
      ))}
    </ul>
  );
}

function DetailVideoLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex w-fit max-w-full items-center justify-center rounded-button bg-accent-500 px-3 py-2 text-[13px] font-black leading-tight tracking-tight text-primary transition-colors duration-200 hover:bg-primary hover:text-accent sm:text-[14px] xl:px-3.5 xl:py-2.5 xl:text-[15px] 2xl:px-4 2xl:py-3 2xl:text-[16px]"
    >
      <span className="inline-flex items-center justify-center gap-1">
        <span className="text-center">설명회 영상 보기</span>
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 xl:h-4 xl:w-4"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

function ViewDetailLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex shrink-0 items-center justify-center gap-1 rounded-button border border-primary bg-white px-2.5 py-1.5 text-[12px] font-black leading-none tracking-tight text-primary transition-colors duration-200 hover:bg-primary hover:text-accent xl:px-3 xl:py-2 xl:text-[13px] 2xl:text-[14px]"
    >
      상세 보기
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 xl:h-4 xl:w-4"
        aria-hidden="true"
      />
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
  const photo = teacher?.photo_url
    ? withCacheBust(teacher.photo_url, teacher.updated_at)
    : null;
  return (
    <div className="flex flex-col items-center gap-2 text-center xl:gap-2.5">
      <div className="relative h-[120px] w-[90px] overflow-hidden bg-neutral-100 xl:h-[150px] xl:w-[114px] 2xl:h-[190px] 2xl:w-[144px]">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(min-width: 1680px) 144px, (min-width: 1280px) 114px, 90px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[16px] font-black text-neutral-400 xl:text-[20px] 2xl:text-[24px]">
            {name.slice(0, 1)}
          </div>
        )}
      </div>
      <span className="text-[18px] font-black leading-tight text-neutral-900 xl:text-[24px] 2xl:text-[32px]">
        {name}
      </span>
    </div>
  );
}

function CourseTitleCell({
  course,
}: {
  course: TimetableCourseWithTeacher;
}) {
  const viewDetailUrl = course.view_detail_url?.trim() || "";

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="min-w-0 flex-1 space-y-1.5 xl:space-y-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="min-w-0 text-[17px] font-black leading-snug text-neutral-900 xl:text-[22px] 2xl:text-[28px]">
            {course.course_title}
          </p>
          <CourseStatusTag course={course} />
          {course.detail_url ? (
            <DetailVideoLink url={course.detail_url} />
          ) : null}
        </div>
        {course.course_subtitle ? (
          <p className="text-[13px] font-bold text-neutral-900 xl:text-[16px] 2xl:text-[20px]">
            {course.course_subtitle}
          </p>
        ) : null}
        {course.course_note ? (
          <p className="whitespace-pre-line text-[11px] font-normal leading-[1.5] text-neutral-900 xl:text-[14px] xl:leading-[1.55] 2xl:text-[18px] 2xl:leading-[1.6]">
            {course.course_note}
          </p>
        ) : null}
      </div>
      {viewDetailUrl ? <ViewDetailLink url={viewDetailUrl} /> : null}
    </div>
  );
}

function CourseRow({
  course,
}: {
  course: TimetableCourseWithTeacher;
}) {
  return (
    <tr className="border-b border-neutral-900 align-top last:border-b-0">
      <td className="px-3 py-4 xl:px-4 xl:py-5 2xl:px-5">
        <TeacherCell course={course} />
      </td>
      <td className="min-w-0 px-3 py-4 xl:px-4 xl:py-5 2xl:px-5">
        <CourseTitleCell course={course} />
      </td>
      <td className="px-3 py-4 xl:px-4 xl:py-5 2xl:px-5">
        <div className="space-y-2.5 xl:space-y-3">
          <SessionList sessions={course.sessions} />
        </div>
      </td>
      <td className="px-3 py-4 xl:px-4 xl:py-5 2xl:px-5">
        <StartDateList dates={course.start_dates} />
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
  const viewDetailUrl = course.view_detail_url?.trim() || "";

  return (
    <li className="bg-white py-4 first:pt-0">
      <div className="flex items-start gap-3.5">
        <div className="flex w-[100px] shrink-0 flex-col items-center gap-1.5">
          <div className="relative h-[128px] w-[96px] overflow-hidden bg-neutral-100">
            {course.teacher?.photo_url ? (
              <Image
                src={withCacheBust(
                  course.teacher.photo_url,
                  course.teacher.updated_at,
                )}
                alt={course.teacher.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[18px] font-black text-neutral-400">
                {course.teacher?.name?.slice(0, 1) ?? ""}
              </div>
            )}
          </div>
          <p className="w-full text-center text-[18px] font-black leading-tight text-neutral-900">
            {course.teacher?.name ?? ""}
          </p>
        </div>
        <div className="flex min-w-0 flex-1 items-start gap-2 pt-0.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <p className="min-w-0 text-[20px] font-black leading-[1.25] tracking-tight text-neutral-900 sm:text-[26px]">
                {course.course_title}
              </p>
              <CourseStatusTag course={course} mobile />
              {course.detail_url ? (
                <DetailVideoLink url={course.detail_url} />
              ) : null}
            </div>
          </div>
          {viewDetailUrl ? <ViewDetailLink url={viewDetailUrl} /> : null}
        </div>
      </div>

      {/* 요일·시간 / 개강 — 카드에서 가장 먼저 눈에 들어오도록 */}
      <div
        className={`mt-4 space-y-3.5 rounded-card border-2 bg-neutral-50 px-3.5 py-3.5 ${theme.body.cardBorder}`}
      >
        <div>
          <p
            className={`text-[16px] font-black tracking-tight ${theme.body.cardLabel}`}
          >
            요일 · 시간
          </p>
          <div className="mt-2 space-y-3">
            {course.sessions.length > 0 ? (
              <SessionList sessions={course.sessions} emphasized />
            ) : (
              <span className="text-[17px] font-bold text-neutral-400 sm:text-[21px]">—</span>
            )}
          </div>
        </div>
        <div className={`border-t-2 pt-3.5 ${theme.body.cardDivider}`}>
          <p
            className={`text-[16px] font-black tracking-tight ${theme.body.cardLabel}`}
          >
            개강
          </p>
          <div className="mt-2">
            <StartDateList dates={course.start_dates} emphasized />
          </div>
        </div>
      </div>

      {hasDetails ? (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={`mt-3 flex w-full items-center justify-center gap-1 rounded-button border border-neutral-300 bg-white py-2.5 text-[17px] font-black ${theme.body.expandBtn}`}
          >
            {expanded ? "접기" : "상세보기"}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {expanded ? (
            <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
              {course.course_subtitle ? (
                <p className="text-[18px] font-bold leading-snug text-neutral-900">
                  {course.course_subtitle}
                </p>
              ) : null}
              {course.course_note ? (
                <p className="whitespace-pre-line text-[16px] font-normal leading-[1.6] text-neutral-800">
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
