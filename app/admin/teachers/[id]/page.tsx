import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminGetTeacher } from "@/lib/admin/queries";

import TeacherForm from "../_components/TeacherForm";

type Props = { params: { id: string } };

export default async function EditTeacherPage({ params }: Props) {
  const existing = await adminGetTeacher(params.id);
  if (!existing) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="강사 정보 편집"
        description={`${existing.name} 강사의 정보를 수정합니다.`}
      />
      <TeacherForm key={existing.updated_at} initial={existing} />
    </div>
  );
}
