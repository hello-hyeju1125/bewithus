"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { submitConsultationAction } from "@/app/(public)/consultation/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ko } from "@/content/ko";

type ConsultationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ConsultationModal({
  open,
  onOpenChange,
}: ConsultationModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const copy = ko.consultation;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitConsultationAction(formData);
      if (result.ok) {
        toast.success(copy.success);
        formRef.current?.reset();
        onOpenChange(false);
        return;
      }
      setError(result.error);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="student_name">{copy.fields.studentName}</Label>
            <Input
              id="student_name"
              name="student_name"
              required
              autoComplete="name"
              disabled={pending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="parent_name">{copy.fields.parentName}</Label>
            <Input
              id="parent_name"
              name="parent_name"
              required
              disabled={pending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">{copy.fields.phone}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="010-0000-0000"
              disabled={pending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="school_grade">{copy.fields.schoolGrade}</Label>
            <Input
              id="school_grade"
              name="school_grade"
              required
              placeholder="예: ○○고등학교 2학년"
              disabled={pending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">{copy.fields.subject}</Label>
            <Input
              id="subject"
              name="subject"
              required
              placeholder="예: 수학, 영어"
              disabled={pending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">{copy.fields.message}</Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              disabled={pending}
            />
          </div>

          {error ? (
            <p className="text-[13px] font-semibold text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary-700"
            disabled={pending}
          >
            {pending ? copy.submitting : copy.submit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
