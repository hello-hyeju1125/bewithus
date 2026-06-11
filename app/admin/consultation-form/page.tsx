import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminListConsultationFormFields } from "@/lib/admin/queries";

import ConsultationFormFieldsEditor from "./_components/ConsultationFormFieldsEditor";

export default async function AdminConsultationFormPage() {
  const fields = await adminListConsultationFormFields();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/consultations"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-600 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        입학 상담 신청 목록
      </Link>

      <AdminPageHeader
        title="상담 신청 양식"
        description="사이트 상담 신청 모달에 표시되는 입력 항목을 관리합니다."
      />

      <ConsultationFormFieldsEditor
        key={fields.map((field) => `${field.id}:${field.updated_at}`).join("|")}
        initialFields={fields}
      />
    </div>
  );
}
