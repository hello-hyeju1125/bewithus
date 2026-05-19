"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import SubjectFilterChips, {
  ALL_SUBJECT,
} from "@/components/filters/SubjectFilterChips";
import type { CourseSession } from "@/types/database";
import type { TimetableCourseWithTeacher } from "@/lib/supabase/queries";

type TimetableDetailTableProps = {
  courses: TimetableCourseWithTeacher[];
};

export default function TimetableDetailTable({
  courses,
}: TimetableDetailTableProps) {
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
      />

      {/* 과목별 그룹 */}
      <div className="space-y-12">
        {Array.from(grouped.entries()).map(([subject, rows]) => (
          <section key={subject} aria-labelledby={`subject-${subject}`}>
            <h2
              id={`subject-${subject}`}
              className="mb-4 text-[24px] font-black tracking-tight text-primary sm:text-[28px]"
            >
              {subject}
            </h2>

            {/* 데스크탑: 테이블 — 좌우 세로선 없음, 가로선만 */}
            <div className="hidden border-y border-neutral-900 bg-white md:block">
              <table className="w-full border-collapse text-left text-[16px]">
                <thead className="bg-white text-[14px] font-bold text-neutral-900 sm:text-[15px]">
                  <tr className="border-b border-neutral-900">
                    <th className="w-[168px] px-5 py-4 text-center">강사</th>
                    <th className="px-5 py-4 text-center">강의</th>
                    <th className="w-[260px] px-5 py-4 text-center">요일 / 시간</th>
                    <th className="w-[140px] px-5 py-4 text-center">개강</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <CourseRow key={c.id} course={c} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일: 카드 */}
            <ul className="space-y-3 md:hidden">
              {rows.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function SessionList({ sessions }: { sessions: CourseSession[] }) {
  if (sessions.length === 0) return null;
  return (
    <ul className="space-y-0.5">
      {sessions.map((s, i) => (
        <li
          key={i}
          className="flex items-center gap-2 whitespace-nowrap text-[15px] text-neutral-700 sm:text-[16px]"
        >
          <span>{s.day_time}</span>
          {s.is_full ? (
            <span className="inline-flex h-[22px] items-center rounded-[3px] bg-red-50 px-2 text-[11px] font-black tracking-wider text-red-600">
              마감
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function StartDateList({ dates }: { dates: string[] }) {
  if (dates.length === 0) return <span className="text-neutral-400">—</span>;
  return (
    <ul className="space-y-0.5 text-[15px] text-neutral-700 sm:text-[16px]">
      {dates.map((d, i) => (
        <li key={`${d}-${i}`}>{d}</li>
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
      className="inline-flex h-11 items-center gap-2 rounded-button border border-primary bg-white px-4 text-[15px] font-black text-primary transition-colors hover:bg-primary hover:text-white sm:h-12 sm:px-5 sm:text-[16px]"
    >
      설명회 영상 보기
      <ArrowUpRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
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
      <div className="relative h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 sm:h-24 sm:w-24">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[14px] font-black text-neutral-400 sm:text-[16px]">
            {name.slice(0, 1)}
          </div>
        )}
      </div>
      <span className="text-[17px] font-black text-neutral-900 sm:text-[18px]">{name}</span>
    </div>
  );
}

function CourseTitleCell({
  course,
}: {
  course: TimetableCourseWithTeacher;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <p className="text-[17px] font-black leading-snug text-neutral-900 sm:text-[18px]">
          {course.course_title}
        </p>
        {course.tag ? (
          <span className="inline-flex h-[24px] shrink-0 items-center rounded-[3px] bg-accent-500 px-2 text-[11px] font-black tracking-wider text-primary sm:text-[12px]">
            {course.tag}
          </span>
        ) : null}
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
      {course.detail_url ? (
        <div className="mt-5 pt-1">
          <DetailVideoLink url={course.detail_url} />
        </div>
      ) : null}
    </div>
  );
}

function CourseRow({ course }: { course: TimetableCourseWithTeacher }) {
  return (
    <tr className="border-b border-neutral-900 align-top last:border-b-0">
      <td className="px-5 py-5">
        <TeacherCell course={course} />
      </td>
      <td className="px-5 py-5">
        <CourseTitleCell course={course} />
      </td>
      <td className="px-5 py-5">
        <SessionList sessions={course.sessions} />
      </td>
      <td className="px-5 py-5">
        <StartDateList dates={course.start_dates} />
      </td>
    </tr>
  );
}

function CourseCard({ course }: { course: TimetableCourseWithTeacher }) {
  return (
    <li className="rounded-card border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
          {course.teacher?.photo_url ? (
            <Image
              src={course.teacher.photo_url}
              alt={course.teacher.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[14px] font-black text-neutral-400">
              {course.teacher?.name?.slice(0, 1) ?? ""}
            </div>
          )}
        </div>
        <div>
          <p className="text-[14px] font-bold uppercase tracking-wider text-neutral-400">
            {course.teacher?.name ?? ""}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[17px] font-black text-neutral-900">
              {course.course_title}
            </p>
            {course.tag ? (
              <span className="inline-flex h-[24px] items-center rounded-[3px] bg-accent-500 px-2 text-[11px] font-black tracking-wider text-primary">
                {course.tag}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {course.course_subtitle ? (
        <p className="mt-2 text-[15px] font-bold text-neutral-900">
          {course.course_subtitle}
        </p>
      ) : null}
      {course.course_note ? (
        <p className="mt-1 whitespace-pre-line text-[14px] font-normal leading-[1.85] text-neutral-900">
          {course.course_note}
        </p>
      ) : null}

      {course.detail_url ? (
        <div className="mt-5 pt-1">
          <DetailVideoLink url={course.detail_url} />
        </div>
      ) : null}

      <dl className="mt-4 grid grid-cols-[72px_1fr] gap-y-2.5 border-t border-neutral-100 pt-4 text-[15px]">
        <dt className="font-bold text-neutral-500">요일·시간</dt>
        <dd>
          <SessionList sessions={course.sessions} />
        </dd>
        <dt className="font-bold text-neutral-500">개강</dt>
        <dd>
          <StartDateList dates={course.start_dates} />
        </dd>
      </dl>
    </li>
  );
}
