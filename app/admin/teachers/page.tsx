import Link from "next/link";
import { Plus } from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { adminListTeachers } from "@/lib/admin/queries";

import TeacherSortableList from "./_components/TeacherSortableList";

export default async function AdminTeachersPage() {
  const teachers = await adminListTeachers();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="강사진 관리"
        description="학교별 강사 목록과 노출 순서를 관리합니다. 드래그로 순서를 변경할 수 있습니다."
        actions={
          <Button asChild>
            <Link href="/admin/teachers/new">
              <Plus className="h-4 w-4" aria-hidden="true" />새 강사 등록
            </Link>
          </Button>
        }
      />
      <TeacherSortableList teachers={teachers} />
    </div>
  );
}
