"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import RichTextEditor from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import {
  STAFF_SCHOOLS,
  SCHOOL_LABELS,
  type StaffSchool,
} from "@/lib/constants";
import { infoSessionDescriptionToTiptap } from "@/lib/admin/tiptap-helpers";
import {
  infoSessionFormSchema,
  type InfoSessionFormValues,
} from "@/lib/admin/schemas";
import type { InfoSession, TiptapJSON } from "@/types/database";

import {
  createInfoSessionAction,
  updateInfoSessionAction,
} from "../actions";

type Props = { initial?: InfoSession | null };

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toFormValues(initial?: InfoSession | null): InfoSessionFormValues {
  return {
    school: (initial?.school as StaffSchool) ?? "daewon",
    title: initial?.title ?? "",
    descriptionJson: "",
    session_date: initial ? toDatetimeLocal(initial.session_date) : "",
    registration_url: initial?.registration_url ?? "",
    is_active: initial?.is_active ?? true,
  };
}

export default function InfoSessionForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [description, setDescription] = useState<TiptapJSON | null>(() =>
    initial ? infoSessionDescriptionToTiptap(initial) : null,
  );

  const form = useForm<InfoSessionFormValues>({
    resolver: zodResolver(infoSessionFormSchema),
    defaultValues: toFormValues(initial),
  });

  useEffect(() => {
    form.reset(toFormValues(initial));
    setDescription(initial ? infoSessionDescriptionToTiptap(initial) : null);
  }, [initial?.id, initial?.updated_at, initial, form]);

  const submit: SubmitHandler<InfoSessionFormValues> = (values) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("school", values.school);
      fd.set("title", values.title);
      if (description) {
        fd.set("descriptionJson", JSON.stringify(description));
      }
      fd.set("session_date", values.session_date);
      fd.set("registration_url", values.registration_url ?? "");
      if (values.is_active) fd.set("is_active", "on");

      const res = initial
        ? await updateInfoSessionAction(initial.id, fd)
        : await createInfoSessionAction(fd);
      if (!res.ok) {
        toast.error("저장 실패", { description: res.error });
        return;
      }
      toast.success(initial ? "수정되었습니다." : "등록되었습니다.");
      if (initial) {
        router.refresh();
      } else {
        router.push("/admin/info-session");
        router.refresh();
      }
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="space-y-5 rounded-card border border-neutral-200 bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="school">학교</Label>
          <Select
            value={form.watch("school")}
            onValueChange={(v) =>
              form.setValue("school", v as StaffSchool, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="school">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAFF_SCHOOLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {SCHOOL_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="session_date">일시</Label>
          <Input
            id="session_date"
            type="datetime-local"
            {...form.register("session_date")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">제목</Label>
        <Input id="title" {...form.register("title")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>설명</Label>
        <p className="text-[12px] text-neutral-500">
          글자 크기·색상·굵게·목록·링크 등 서식을 적용할 수 있습니다. 공개
          설명회 페이지에 그대로 반영됩니다.
        </p>
        <RichTextEditor
          compact
          value={description}
          onChange={setDescription}
          placeholder="설명회 안내 문구를 입력하세요…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="registration_url">외부 신청 URL (선택)</Label>
        <Input
          id="registration_url"
          type="url"
          placeholder="https://..."
          {...form.register("registration_url")}
        />
      </div>

      {Object.values(form.formState.errors).length > 0 ? (
        <ul className="space-y-1 rounded-button border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {Object.entries(form.formState.errors).map(([k, err]) => (
            <li key={k}>{(err as { message?: string })?.message ?? "입력 오류"}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
        <div className="flex items-center gap-2">
          <Switch
            id="is_active"
            checked={form.watch("is_active")}
            onCheckedChange={(v) => form.setValue("is_active", v)}
          />
          <Label htmlFor="is_active">활성화</Label>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={pending}
          >
            취소
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            {initial ? "수정 저장" : "등록"}
          </Button>
        </div>
      </div>
    </form>
  );
}
