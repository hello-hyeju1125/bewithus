"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

import {
  deletePostAction,
  togglePostPinnedAction,
  togglePostPublishedAction,
} from "../actions";

type Props = {
  id: string;
  pinned: boolean;
  published: boolean;
};

export default function PostRowActions({ id, pinned, published }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optPinned, setOptPinned] = useState(pinned);
  const [optPublished, setOptPublished] = useState(published);
  const [open, setOpen] = useState(false);

  function togglePinned(v: boolean) {
    setOptPinned(v);
    startTransition(async () => {
      const res = await togglePostPinnedAction(id, v);
      if (!res.ok) {
        toast.error("상태 변경 실패", { description: res.error });
        setOptPinned(!v);
      } else {
        router.refresh();
      }
    });
  }

  function togglePublished(v: boolean) {
    setOptPublished(v);
    startTransition(async () => {
      const res = await togglePostPublishedAction(id, v);
      if (!res.ok) {
        toast.error("상태 변경 실패", { description: res.error });
        setOptPublished(!v);
      } else {
        router.refresh();
      }
    });
  }

  function onDelete() {
    startTransition(async () => {
      const res = await deletePostAction(id);
      if (!res.ok) {
        toast.error("삭제 실패", { description: res.error });
      } else {
        toast.success("게시글이 삭제되었습니다.");
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <div className="flex items-center gap-1" title="고정">
        <Switch
          aria-label="상단 고정 토글"
          checked={optPinned}
          onCheckedChange={togglePinned}
          disabled={pending}
        />
      </div>
      <div className="flex items-center gap-1" title="발행">
        <Switch
          aria-label="발행 토글"
          checked={optPublished}
          onCheckedChange={togglePublished}
          disabled={pending}
        />
      </div>
      <Button asChild size="sm" variant="ghost">
        <Link href={`/admin/notice/${id}`}>편집</Link>
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-red-600">
            삭제
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이 게시글을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              본문에 포함된 이미지도 Storage 에서 함께 삭제됩니다. 이 작업은
              되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
