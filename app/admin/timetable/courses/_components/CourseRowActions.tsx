"use client";

import Link from "next/link";
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
  deleteTimetableCourseAction,
  toggleCourseActiveAction,
} from "../actions";

type Props = {
  id: string;
  isActive: boolean;
};

export default function CourseRowActions({ id, isActive }: Props) {
  const [pending, startTransition] = useTransition();
  const [optimisticActive, setOptimisticActive] = useState(isActive);
  const [open, setOpen] = useState(false);

  function onToggle(next: boolean) {
    setOptimisticActive(next);
    startTransition(async () => {
      const res = await toggleCourseActiveAction(id, next);
      if (!res.ok) {
        toast.error("상태 변경 실패", { description: res.error });
        setOptimisticActive(!next);
      } else {
        toast.success(next ? "활성화되었습니다." : "비활성화되었습니다.");
      }
    });
  }

  function onDelete() {
    startTransition(async () => {
      const res = await deleteTimetableCourseAction(id);
      if (!res.ok) {
        toast.error("삭제 실패", { description: res.error });
      } else {
        toast.success("강의를 삭제했습니다.");
        setOpen(false);
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Switch
        aria-label="활성 토글"
        checked={optimisticActive}
        onCheckedChange={onToggle}
        disabled={pending}
      />
      <Button asChild size="sm" variant="ghost">
        <Link href={`/admin/timetable/courses/${id}`}>편집</Link>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-red-600">
            삭제
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이 강의를 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              상세 시간표 표에서 즉시 사라집니다. 이 작업은 되돌릴 수 없습니다.
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
