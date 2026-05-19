import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminListCourseSubjects,
  adminListTeachers,
} from "@/lib/admin/queries";

import CourseForm from "../_components/CourseForm";

export default async function NewCoursePage() {
  const [teachers, subjects] = await Promise.all([
    adminListTeachers(),
    adminListCourseSubjects(),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="새 강의 등록"
        description="상세 시간표 표에 추가될 강의 한 행을 입력합니다."
      />
      <CourseForm teachers={teachers} subjectSuggestions={subjects} />
    </div>
  );
}
