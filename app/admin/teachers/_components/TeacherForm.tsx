"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, User } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { STAFF_SCHOOLS, SCHOOL_LABELS, type StaffSchool } from "@/lib/constants";
import { teacherFormSchema, type TeacherFormValues } from "@/lib/admin/schemas";
import type { Teacher } from "@/types/database";

import { createTeacherAction, updateTeacherAction } from "../actions";

type Props = { initial?: Teacher | null };

function toFormValues(initial?: Teacher | null): TeacherFormValues {
  return {
    name: initial?.name ?? "",
    school: (initial?.school as StaffSchool) ?? "daewon",
    subject: initial?.subject ?? "",
    bio: initial?.bio ?? "",
    photo_url: initial?.photo_url ?? "",
    order_index: initial?.order_index ?? 0,
    is_active: initial?.is_active ?? true,
  };
}

export default function TeacherForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initial?.photo_url ?? null,
  );

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: toFormValues(initial),
  });

  useEffect(() => {
    form.reset(toFormValues(initial));
    setPhotoFile(null);
    setPhotoPreview(initial?.photo_url ?? null);
  }, [initial?.id, initial?.updated_at, initial, form]);

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("10MB 이하의 이미지만 업로드할 수 있습니다.");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  const submit: SubmitHandler<TeacherFormValues> = (values) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", values.name);
      fd.set("school", values.school);
      fd.set("subject", values.subject);
      fd.set("bio", values.bio ?? "");
      fd.set("photo_url", values.photo_url ?? "");
      fd.set("order_index", String(values.order_index));
      if (values.is_active) fd.set("is_active", "on");
      if (photoFile) fd.set("photo_file", photoFile);

      const res = initial
        ? await updateTeacherAction(initial.id, fd)
        : await createTeacherAction(fd);
      if (!res.ok) {
        toast.error("저장 실패", { description: res.error });
        return;
      }
      toast.success(initial ? "수정되었습니다." : "등록되었습니다.");
      if (initial) {
        router.push(`/admin/teachers/${initial.id}`);
      } else {
        router.push("/admin/teachers");
      }
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5 rounded-card border border-neutral-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">이름</Label>
            <Input id="name" {...form.register("name")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject">과목</Label>
            <Input id="subject" placeholder="예: 영어" {...form.register("subject")} />
          </div>
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
            <Label htmlFor="order_index">노출 순서</Label>
            <Input
              id="order_index"
              type="number"
              min={0}
              {...form.register("order_index", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">소개</Label>
          <Textarea id="bio" rows={5} {...form.register("bio")} />
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
      </div>

      <aside className="space-y-3 rounded-card border border-neutral-200 bg-white p-6">
        <Label>프로필 사진</Label>
        <label className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-card border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 transition-colors hover:border-primary">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="프로필 미리보기"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[12px]">
              <User className="h-8 w-8" strokeWidth={1.25} aria-hidden="true" />
              <ImagePlus className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              클릭하여 사진 선택
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
        </label>
        <p className="text-[11px] text-neutral-400">
          정사각형 권장. PNG/JPG/WebP, 10MB 이하.
        </p>
      </aside>
    </form>
  );
}
