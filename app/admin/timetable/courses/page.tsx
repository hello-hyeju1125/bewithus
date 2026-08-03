import Link from "next/link";
import { Plus } from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminListCourseSubjects,
  adminListTimetableCourses,
  adminListTimetableSubjectOrder,
} from "@/lib/admin/queries";
import {
  GRADE_LABELS,
  SCHOOL_LABELS,
  type School,
} from "@/lib/constants";

import SectionTabs from "../_components/SectionTabs";
import CourseFilters from "./_components/CourseFilters";
import CourseRowActions from "./_components/CourseRowActions";
import CourseSubjectSortableList from "./_components/CourseSubjectSortableList";

type AdminCoursesPageProps = {
  searchParams: { school?: string; grade?: string; subject?: string };
};

export default async function AdminCoursesPage({
  searchParams,
}: AdminCoursesPageProps) {
  const [rows, subjects, subjectOrder] = await Promise.all([
    adminListTimetableCourses({
      school: searchParams.school,
      grade: searchParams.grade,
      subject: searchParams.subject,
    }),
    adminListCourseSubjects(),
    adminListTimetableSubjectOrder(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        title="시간표 관리"
        description="요약 시간표는 이미지로, 상세 시간표는 강의 행으로 관리합니다. 과목 노출 순서는 드래그로 변경할 수 있습니다."
        actions={
          <Button asChild>
            <Link href="/admin/timetable/courses/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              상세 강의 시간표 등록
            </Link>
          </Button>
        }
      />

      <SectionTabs active="courses" />

      <section
        className="space-y-3"
        aria-labelledby="course-subject-order-heading"
      >
        <h2
          id="course-subject-order-heading"
          className="text-[16px] font-bold text-primary"
        >
          과목 노출 순서
          <span className="ml-2 text-[12px] font-semibold text-neutral-500">
            상세 시간표 과목 칩·섹션
          </span>
        </h2>
        <CourseSubjectSortableList subjects={subjectOrder} />
      </section>

      <CourseFilters initial={searchParams} subjects={subjects} />

      <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">학교</TableHead>
              <TableHead className="w-20">학년</TableHead>
              <TableHead className="w-24">과목</TableHead>
              <TableHead className="w-32">강사</TableHead>
              <TableHead>강의명</TableHead>
              <TableHead className="w-24">학기</TableHead>
              <TableHead className="w-16 text-center">활성</TableHead>
              <TableHead className="w-32 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-neutral-500"
                >
                  등록된 강의가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-semibold text-primary">
                    {SCHOOL_LABELS[c.school as School]}
                  </TableCell>
                  <TableCell>{GRADE_LABELS[c.grade] ?? c.grade}</TableCell>
                  <TableCell>{c.subject}</TableCell>
                  <TableCell>{c.teacher?.name ?? "—"}</TableCell>
                  <TableCell className="max-w-[320px]">
                    <div className="truncate font-semibold text-neutral-800">
                      {c.course_title}
                    </div>
                    {c.course_subtitle ? (
                      <div className="truncate text-[12px] text-neutral-500">
                        {c.course_subtitle}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {c.year}년 {c.semester}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex h-6 items-center rounded-full px-2 text-[11px] font-bold ${
                        c.is_active
                          ? "bg-primary-50 text-primary"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {c.is_active ? "활성" : "비활성"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <CourseRowActions id={c.id} isActive={c.is_active} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
