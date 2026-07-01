import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminGetTimetable } from "@/lib/admin/queries";

import TimetableForm from "../_components/TimetableForm";

type EditTimetablePageProps = { params: { id: string } };

export default async function EditTimetablePage({
  params,
}: EditTimetablePageProps) {
  const existing = await adminGetTimetable(params.id);
  if (!existing) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="시간표 편집"
        description="기존 시간표의 메타데이터와 이미지를 수정합니다."
      />
      <TimetableForm key={existing.updated_at} initial={existing} />
    </div>
  );
}
