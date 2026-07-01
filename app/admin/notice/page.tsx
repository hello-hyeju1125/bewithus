import Link from "next/link";
import { Eye, Pin, Plus } from "lucide-react";

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
import { adminListPosts } from "@/lib/admin/queries";

import PostRowActions from "./_components/PostRowActions";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function AdminNoticePage() {
  const posts = await adminListPosts();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="공지사항 관리"
        description="공지사항 글 작성·편집·발행을 관리합니다."
        actions={
          <Button asChild>
            <Link href="/admin/notice/new">
              <Plus className="h-4 w-4" aria-hidden="true" />새 글 작성
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-28">작성일</TableHead>
              <TableHead className="w-20 text-center">조회</TableHead>
              <TableHead className="w-72 text-right">고정/발행/액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-neutral-500">
                  작성된 공지사항이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.is_pinned ? (
                      <span
                        title="상단 고정"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-primary"
                      >
                        <Pin className="h-3 w-3" aria-hidden="true" />
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    <Link href={`/admin/notice/${p.id}`} className="hover:underline">
                      {p.title}
                    </Link>
                    {!p.is_published ? (
                      <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-bold text-neutral-500">
                        임시저장
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>{formatDate(p.created_at)}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-neutral-500">
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      {p.view_count.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <PostRowActions
                      id={p.id}
                      pinned={p.is_pinned}
                      published={p.is_published}
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
