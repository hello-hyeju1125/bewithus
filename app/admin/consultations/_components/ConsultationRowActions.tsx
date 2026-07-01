"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  deleteConsultationAction,
  updateConsultationStatusAction,
} from "@/app/admin/consultations/actions";
import { Button } from "@/components/ui/button";
import type { ConsultationStatus } from "@/types/database";

type ConsultationRowActionsProps = {
  id: string;
  status: ConsultationStatus;
};

export default function ConsultationRowActions({
  id,
  status,
}: ConsultationRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setStatus = (next: ConsultationStatus) => {
    startTransition(async () => {
      const result = await updateConsultationStatusAction(id, next);
      if (result.ok) {
        toast.success("상태가 변경되었습니다.");
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  };

  const onDelete = () => {
    if (!window.confirm("이 상담 신청을 삭제할까요?")) return;
    startTransition(async () => {
      const result = await deleteConsultationAction(id);
      if (result.ok) {
        toast.success("삭제되었습니다.");
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {status === "new" ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => setStatus("read")}
        >
          확인
        </Button>
      ) : null}
      {status !== "archived" ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => setStatus("archived")}
        >
          보관
        </Button>
      ) : null}
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={onDelete}
      >
        삭제
      </Button>
    </div>
  );
}
