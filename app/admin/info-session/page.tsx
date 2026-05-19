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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminListInfoSessions } from "@/lib/admin/queries";
import { SCHOOL_LABELS, type StaffSchool } from "@/lib/constants";
import type { InfoSession } from "@/types/database";

import InfoSessionRowActions from "./_components/InfoSessionRowActions";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Section({ rows }: { rows: InfoSession[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center text-[13px] text-neutral-500">
        설명회 일정이 없습니다.
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-44">일시</TableHead>
            <TableHead className="w-28">학교</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-32">장소</TableHead>
            <TableHead className="w-32 text-right">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-semibold text-primary">
                {formatDateTime(s.session_date)}
              </TableCell>
              <TableCell>{SCHOOL_LABELS[s.school as StaffSchool]}</TableCell>
              <TableCell>{s.title}</TableCell>
              <TableCell>{s.location ?? "—"}</TableCell>
              <TableCell className="text-right">
                <InfoSessionRowActions id={s.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function AdminInfoSessionPage() {
  const all = await adminListInfoSessions();
  const now = Date.now();
  const upcoming = all
    .filter((s) => new Date(s.session_date).getTime() >= now)
    .reverse();
  const past = all.filter((s) => new Date(s.session_date).getTime() < now);

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="설명회 관리"
        description="다가오는 / 지난 설명회를 일정 기준으로 관리합니다."
        actions={
          <Button asChild>
            <Link href="/admin/info-session/new">
              <Plus className="h-4 w-4" aria-hidden="true" />새 설명회 등록
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            다가오는 설명회 ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">지난 설명회 ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Section rows={upcoming} />
        </TabsContent>
        <TabsContent value="past">
          <Section rows={past} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
