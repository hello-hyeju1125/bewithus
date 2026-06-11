import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminGetTimetableCourse,
  adminListCourseSubjects,
  adminListTeachers,
} from "@/lib/admin/queries";

import CourseForm from "../_components/CourseForm";

type EditCoursePageProps = {
  params: { id: string };
};

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const [course, teachers, subjects] = await Promise.all([
    adminGetTimetableCourse(params.id),
    adminListTeachers(),
    adminListCourseSubjects(),
  ]);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="강의 편집"
        description={`${course.subject} · ${course.course_title}`}
      />
      <CourseForm
        key={course.updated_at}
        initial={course}
        teachers={teachers}
        subjectSuggestions={subjects}
      />
    </div>
  );
}
