import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminGetConsultationRequest } from "@/lib/admin/queries";

import ConsultationRowActions from "../_components/ConsultationRowActions";
import ConsultationStatusBadge from "../_components/ConsultationStatusBadge";

type PageProps = { params: { id: string } };

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function AdminConsultationDetailPage({ params }: PageProps) {
  const request = await adminGetConsultationRequest(params.id);
  if (!request) notFound();

  const fields = [
    { label: "학생 이름", value: request.student_name },
    { label: "학부모 성함", value: request.parent_name },
    { label: "전화번호", value: request.phone },
    { label: "학교 및 학년", value: request.school_grade },
    { label: "과목", value: request.subject },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/consultations"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-600 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        목록으로
      </Link>

      <AdminPageHeader
        title={request.student_name}
        description={`접수: ${formatDateTime(request.created_at)}`}
        actions={
          <div className="flex items-center gap-3">
            <ConsultationStatusBadge status={request.status} />
            <ConsultationRowActions id={request.id} status={request.status} />
          </div>
        }
      />

      <dl className="space-y-4 rounded-card border border-neutral-200 bg-white p-6">
        {fields.map((f) => (
          <div key={f.label}>
            <dt className="text-[12px] font-bold uppercase tracking-wide text-neutral-500">
              {f.label}
            </dt>
            <dd className="mt-1 text-[16px] font-semibold text-neutral-900">
              {f.value}
            </dd>
          </div>
        ))}
        <div>
          <dt className="text-[12px] font-bold uppercase tracking-wide text-neutral-500">
            상담 내용
          </dt>
          <dd className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-neutral-800">
            {request.message}
          </dd>
        </div>
      </dl>
    </div>
  );
}
