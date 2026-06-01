import Link from "next/link";
import { Plus } from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import {
  adminListTeacherSubjectOrder,
  adminListTeachers,
} from "@/lib/admin/queries";

import TeacherSortableList from "./_components/TeacherSortableList";
import TeacherSubjectSortableList from "./_components/TeacherSubjectSortableList";

export default async function AdminTeachersPage() {
  const [teachers, subjectOrder] = await Promise.all([
    adminListTeachers(),
    adminListTeacherSubjectOrder(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <AdminPageHeader
        title="강사진 관리"
        description="학교별 강사 순서와 과목 해시태그 순서를 드래그로 변경할 수 있습니다. 변경 내용은 홈페이지 강사진에 반영됩니다."
        actions={
          <Button asChild>
            <Link href="/admin/teachers/new">
              <Plus className="h-4 w-4" aria-hidden="true" />새 강사 등록
            </Link>
          </Button>
        }
      />

      <section className="space-y-3" aria-labelledby="teacher-subject-order-heading">
        <h2
          id="teacher-subject-order-heading"
          className="text-[16px] font-bold text-primary"
        >
          과목 노출 순서
          <span className="ml-2 text-[12px] font-semibold text-neutral-500">
            홈페이지 해시태그
          </span>
        </h2>
        <TeacherSubjectSortableList subjects={subjectOrder} />
      </section>

      <TeacherSortableList teachers={teachers} />
    </div>
  );
}
