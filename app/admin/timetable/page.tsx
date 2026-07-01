import Link from "next/link";
import { Plus } from "lucide-react";

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
import { adminListTimetables } from "@/lib/admin/queries";
import {
  GRADE_LABELS,
  SCHOOL_LABELS,
  VIEW_TYPE_LABELS,
  type School,
} from "@/lib/constants";

import SectionTabs from "./_components/SectionTabs";
import TimetableFilters from "./_components/TimetableFilters";
import TimetableRowActions from "./_components/TimetableRowActions";

type AdminTimetablePageProps = {
  searchParams: { school?: string; grade?: string; semester?: string };
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function AdminTimetablePage({
  searchParams,
}: AdminTimetablePageProps) {
  const rows = await adminListTimetables({
    school: searchParams.school,
    grade: searchParams.grade,
    semester: searchParams.semester,
  });

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="시간표 관리"
        description="요약 시간표는 이미지로, 상세 시간표는 강의 행으로 관리합니다."
        actions={
          <Button asChild>
            <Link href="/admin/timetable/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              요약 시간표 이미지 등록
            </Link>
          </Button>
        }
      />

      <SectionTabs active="summary" />

      <TimetableFilters initial={searchParams} />

      <div className="mt-5 overflow-hidden rounded-card border border-neutral-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">학교</TableHead>
              <TableHead className="w-24">학년</TableHead>
              <TableHead className="w-24">뷰</TableHead>
              <TableHead className="w-28">학기</TableHead>
              <TableHead className="w-32">업로드일</TableHead>
              <TableHead className="w-20 text-center">활성</TableHead>
              <TableHead className="w-32 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-neutral-500">
                  등록된 시간표가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-semibold text-primary">
                    {SCHOOL_LABELS[t.school as School]}
                  </TableCell>
                  <TableCell>{GRADE_LABELS[t.grade] ?? t.grade}</TableCell>
                  <TableCell>{VIEW_TYPE_LABELS[t.view_type]}</TableCell>
                  <TableCell>
                    {t.year}년 {t.semester}
                  </TableCell>
                  <TableCell>{formatDate(t.updated_at)}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex h-6 items-center rounded-full px-2 text-[11px] font-bold ${
                        t.is_active
                          ? "bg-primary-50 text-primary"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {t.is_active ? "활성" : "비활성"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <TimetableRowActions
                      id={t.id}
                      isActive={t.is_active}
                      school={t.school as School}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
