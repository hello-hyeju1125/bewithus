import Link from "next/link";

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
  getConsultationDisplayPhone,
  getConsultationDisplayTitle,
  getRequestResponses,
} from "@/lib/consultation/display";
import { adminListConsultationRequests } from "@/lib/admin/queries";

import ConsultationRowActions from "./_components/ConsultationRowActions";
import ConsultationStatusBadge from "./_components/ConsultationStatusBadge";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function AdminConsultationsPage() {
  const requests = await adminListConsultationRequests();
  const newCount = requests.filter((r) => r.status === "new").length;

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="입학 상담 신청"
        description={
          newCount > 0
            ? `미확인 신규 ${newCount}건이 있습니다.`
            : "사이트에서 접수된 입학 상담 신청을 확인합니다."
        }
        actions={
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/admin/consultation-form">상담 신청 양식 설정</Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">상태</TableHead>
              <TableHead>신청자</TableHead>
              <TableHead className="w-36">연락처</TableHead>
              <TableHead className="w-36">접수일</TableHead>
              <TableHead className="w-48 text-right">처리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-neutral-500"
                >
                  접수된 상담 신청이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => {
                const responses = getRequestResponses(r);
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <ConsultationStatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      <Link
                        href={`/admin/consultations/${r.id}`}
                        className="hover:underline"
                      >
                        {getConsultationDisplayTitle(responses)}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-[13px]">
                      {getConsultationDisplayPhone(responses)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-[13px] text-neutral-600">
                      {formatDateTime(r.created_at)}
                    </TableCell>
                    <TableCell>
                      <ConsultationRowActions id={r.id} status={r.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
