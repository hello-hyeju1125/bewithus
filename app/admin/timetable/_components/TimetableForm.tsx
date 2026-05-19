"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  GRADE_LABELS,
  SCHOOLS,
  SCHOOL_GRADES,
  SCHOOL_LABELS,
  VIEW_TYPES,
  VIEW_TYPE_LABELS,
  type School,
  type ViewType,
} from "@/lib/constants";
import {
  timetableFormSchema,
  type TimetableFormValues,
} from "@/lib/admin/schemas";
import type { Timetable } from "@/types/database";

import {
  createTimetableAction,
  updateTimetableAction,
} from "../actions";

type Props = {
  initial?: Timetable | null;
};

const SEMESTERS = ["1학기", "2학기", "여름학기", "봄학기"] as const;

export default function TimetableForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initial?.image_url || null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableFormSchema),
    defaultValues: {
      school: (initial?.school as School) ?? "daewon",
      grade: initial?.grade ?? SCHOOL_GRADES.daewon[0],
      view_type: (initial?.view_type as ViewType) ?? "summary",
      year: initial?.year ?? new Date().getFullYear(),
      semester: initial?.semester ?? "2학기",
      description: initial?.description ?? "",
      image_url: initial?.image_url ?? "",
      is_active: initial?.is_active ?? true,
    },
  });

  const school = form.watch("school") as School;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
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
    setPickedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    form.setValue("image_url", file.name, { shouldValidate: true });
  }

  const submit: SubmitHandler<TimetableFormValues> = (values) => {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === "is_active") {
          if (v) fd.set("is_active", "on");
        } else {
          fd.set(k, String(v ?? ""));
        }
      });
      if (pickedFile) fd.set("image_file", pickedFile);

      const res = initial
        ? await updateTimetableAction(initial.id, fd)
        : await createTimetableAction(fd);

      if (!res.ok) {
        toast.error("저장 실패", { description: res.error });
        return;
      }
      toast.success(initial ? "수정되었습니다." : "등록되었습니다.");
      router.push("/admin/timetable");
      router.refresh();
    });
  };

  function onSubmitClick() {
    form.handleSubmit((values) => {
      if (!initial && !pickedFile) {
        toast.error("이미지를 업로드하세요.");
        return;
      }
      // 같은 조합이 이미 있을 가능성이 있어 사용자에게 확인. 신규 등록일 때만.
      if (!initial) {
        setConfirmOpen(true);
        return;
      }
      submit(values);
    })();
  }

  const values = form.getValues();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitClick();
      }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5 rounded-card border border-neutral-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="school">학교</Label>
            <Select
              value={school}
              onValueChange={(v) => {
                form.setValue("school", v as School, { shouldValidate: true });
                form.setValue(
                  "grade",
                  SCHOOL_GRADES[v as School][0],
                  { shouldValidate: true },
                );
              }}
            >
              <SelectTrigger id="school">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHOOLS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {SCHOOL_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="grade">학년</Label>
            <Select
              value={form.watch("grade")}
              onValueChange={(v) =>
                form.setValue("grade", v, { shouldValidate: true })
              }
            >
              <SelectTrigger id="grade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHOOL_GRADES[school].map((g) => (
                  <SelectItem key={g} value={g}>
                    {GRADE_LABELS[g] ?? g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="view_type">뷰 타입</Label>
            <Select
              value={form.watch("view_type")}
              onValueChange={(v) =>
                form.setValue("view_type", v as ViewType, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="view_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIEW_TYPES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {VIEW_TYPE_LABELS[v]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="year">연도</Label>
              <Input
                id="year"
                type="number"
                min={2020}
                max={2099}
                {...form.register("year", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="semester">학기</Label>
              <Select
                value={form.watch("semester")}
                onValueChange={(v) =>
                  form.setValue("semester", v, { shouldValidate: true })
                }
              >
                <SelectTrigger id="semester">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">소개 문구 (선택)</Label>
          <Textarea
            id="description"
            placeholder="해당 학교/학년에 노출할 짧은 설명 문구"
            rows={3}
            {...form.register("description")}
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
              onCheckedChange={(v) =>
                form.setValue("is_active", v, { shouldValidate: true })
              }
            />
            <Label htmlFor="is_active">활성화</Label>
          </div>
          <div className="flex items-center gap-2">
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
        <Label>시간표 이미지</Label>
        <label className="flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden rounded-card border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 transition-colors hover:border-primary">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="시간표 미리보기"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[12px]">
              <ImagePlus className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              클릭하여 이미지 선택
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
          />
        </label>
        <p className="text-[11px] text-neutral-400">
          PNG/JPG/WebP, 10MB 이하. 같은 조합의 시간표가 있으면 덮어씁니다.
        </p>
      </aside>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이대로 등록할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              {SCHOOL_LABELS[values.school as School]} ·{" "}
              {GRADE_LABELS[values.grade] ?? values.grade} ·{" "}
              {VIEW_TYPE_LABELS[values.view_type as ViewType]} · {values.year}년{" "}
              {values.semester}
              <br />
              같은 조합의 시간표가 이미 있으면 이미지와 메타데이터가 덮어쓰기됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                submit(values);
              }}
            >
              등록하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
