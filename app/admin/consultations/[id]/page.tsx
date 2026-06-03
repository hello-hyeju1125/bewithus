import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  buildResponseDisplayRows,
  getConsultationDisplayTitle,
  getRequestResponses,
} from "@/lib/consultation/display";
import {
  adminGetConsultationRequest,
  adminListAllConsultationFormFields,
} from "@/lib/admin/queries";

import ConsultationRowActions from "../_components/ConsultationRowActions";
import ConsultationStatusBadge from "../_components/ConsultationStatusBadge";

type PageProps = { params: { id: string } };

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function AdminConsultationDetailPage({ params }: PageProps) {
  const [request, fieldDefs] = await Promise.all([
    adminGetConsultationRequest(params.id),
    adminListAllConsultationFormFields(),
  ]);
  if (!request) notFound();

  const responses = getRequestResponses(request);
  const rows = buildResponseDisplayRows(responses, fieldDefs);

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
        title={getConsultationDisplayTitle(responses)}
        description={`접수: ${formatDateTime(request.created_at)}`}
        actions={
          <div className="flex items-center gap-3">
            <ConsultationStatusBadge status={request.status} />
            <ConsultationRowActions id={request.id} status={request.status} />
          </div>
        }
      />

      <dl className="space-y-4 rounded-card border border-neutral-200 bg-white p-6">
        {rows.map((row) => (
          <div key={row.key}>
            <dt className="text-[12px] font-bold uppercase tracking-wide text-neutral-500">
              {row.label}
            </dt>
            <dd
              className={`mt-1 text-[15px] leading-relaxed text-neutral-800 ${
                row.key === "message" ? "whitespace-pre-line" : "font-semibold"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
