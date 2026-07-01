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
import type { PublicConsultationFormField } from "@/lib/consultation/fields";

type ConsultationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: PublicConsultationFormField[];
};

export default function ConsultationModal({
  open,
  onOpenChange,
  fields,
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
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.fieldKey}>
                {field.label}
                {field.isRequired ? (
                  <span className="text-red-600" aria-hidden="true">
                    {" "}
                    *
                  </span>
                ) : null}
              </Label>
              {field.fieldType === "textarea" ? (
                <Textarea
                  id={field.fieldKey}
                  name={field.fieldKey}
                  required={field.isRequired}
                  rows={5}
                  placeholder={field.placeholder}
                  disabled={pending}
                />
              ) : (
                <Input
                  id={field.fieldKey}
                  name={field.fieldKey}
                  type={field.fieldType === "tel" ? "tel" : "text"}
                  required={field.isRequired}
                  autoComplete={
                    field.fieldType === "tel"
                      ? "tel"
                      : field.fieldKey === "student_name"
                        ? "name"
                        : undefined
                  }
                  placeholder={field.placeholder}
                  disabled={pending}
                />
              )}
            </div>
          ))}

          {error ? (
            <p className="text-[13px] font-semibold text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary-700"
            disabled={pending || fields.length === 0}
          >
            {pending ? copy.submitting : copy.submit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
