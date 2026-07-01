"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";

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
  SCHOOL_GRADES,
  SCHOOLS,
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
import { normalizeTimetableImageUrls } from "@/lib/timetable/image-urls";
import type { Timetable } from "@/types/database";

import {
  createTimetableAction,
  updateTimetableAction,
} from "../actions";

type Props = {
  initial?: Timetable | null;
};

type PendingPreview = {
  id: string;
  file: File;
  url: string;
};

export default function TimetableForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [keptUrls, setKeptUrls] = useState<string[]>(() =>
    initial ? normalizeTimetableImageUrls(initial) : [],
  );
  const [pendingFiles, setPendingFiles] = useState<PendingPreview[]>([]);
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
      image_urls: initial ? normalizeTimetableImageUrls(initial) : [],
      is_active: initial?.is_active ?? true,
    },
  });

  const school = form.watch("school") as School;

  useEffect(() => {
    return () => {
      pendingFiles.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [pendingFiles]);

  useEffect(() => {
    const grade = form.getValues("grade");
    const allowed = SCHOOL_GRADES[school];
    if (!allowed.includes(grade)) {
      form.setValue("grade", allowed[0], { shouldValidate: true });
    }
  }, [school, form]);

  useEffect(() => {
    if (!initial) return;
    form.reset({
      school: initial.school as School,
      grade: initial.grade,
      view_type: initial.view_type as ViewType,
      year: initial.year,
      semester: initial.semester,
      description: initial.description ?? "",
      image_urls: normalizeTimetableImageUrls(initial),
      is_active: initial.is_active,
    });
    setKeptUrls(normalizeTimetableImageUrls(initial));
    setPendingFiles((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  }, [initial?.id, initial?.updated_at, initial, form]);

  function syncImageUrls(urls: string[]) {
    setKeptUrls(urls);
    form.setValue("image_urls", urls, { shouldValidate: true });
  }

  function removeKeptUrl(url: string) {
    syncImageUrls(keptUrls.filter((u) => u !== url));
  }

  function removePendingFile(id: string) {
    setPendingFiles((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list?.length) return;

    const next: PendingPreview[] = [];
    for (const file of Array.from(list)) {
      if (!file.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드할 수 있습니다.");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("10MB 이하의 이미지만 업로드할 수 있습니다.");
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      });
    }
    if (next.length > 0) {
      setPendingFiles((prev) => [...prev, ...next]);
    }
    e.target.value = "";
  }

  const submit: SubmitHandler<TimetableFormValues> = (values) => {
    if (keptUrls.length + pendingFiles.length === 0) {
      toast.error("이미지를 1개 이상 등록하세요.");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === "is_active") {
          if (v) fd.set("is_active", "on");
        } else if (k === "image_urls") {
          fd.set("image_urls", JSON.stringify(keptUrls));
        } else {
          fd.set(k, String(v ?? ""));
        }
      });
      pendingFiles.forEach((p) => fd.append("image_files", p.file));

      const res = initial
        ? await updateTimetableAction(initial.id, fd)
        : await createTimetableAction(fd);

      if (!res.ok) {
        toast.error("저장 실패", { description: res.error });
        return;
      }
      toast.success(initial ? "수정되었습니다." : "등록되었습니다.");
      if (initial) {
        router.refresh();
      } else {
        router.push("/admin/timetable");
        router.refresh();
      }
    });
  };

  function onSubmitClick() {
    form.handleSubmit((values) => {
      if (keptUrls.length + pendingFiles.length === 0) {
        toast.error("이미지를 1개 이상 등록하세요.");
        return;
      }
      if (!initial) {
        setConfirmOpen(true);
        return;
      }
      submit(values);
    })();
  }

  const values = form.getValues();
  const totalImages = keptUrls.length + pendingFiles.length;

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
                form.setValue("grade", SCHOOL_GRADES[v as School][0], {
                  shouldValidate: true,
                });
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
              <Input
                id="semester"
                placeholder="예: 2학기, 여름방학"
                {...form.register("semester")}
              />
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
        <div className="flex items-center justify-between gap-2">
          <Label>시간표 이미지</Label>
          <span className="text-[12px] tabular-nums text-neutral-500">
            {totalImages}장
          </span>
        </div>

        <div className="space-y-3">
          {keptUrls.map((url) => (
            <div
              key={url}
              className="relative overflow-hidden rounded-card border border-neutral-200 bg-neutral-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="등록된 시간표"
                className="block max-h-[280px] w-full object-contain"
              />
              <button
                type="button"
                onClick={() => removeKeptUrl(url)}
                className="absolute right-2 top-2 rounded-button bg-primary p-1 text-white shadow-sm"
                aria-label="이미지 제거"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}

          {pendingFiles.map((p) => (
            <div
              key={p.id}
              className="relative overflow-hidden rounded-card border border-dashed border-neutral-300 bg-neutral-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt="업로드 예정 시간표"
                className="block max-h-[280px] w-full object-contain"
              />
              <button
                type="button"
                onClick={() => removePendingFile(p.id)}
                className="absolute right-2 top-2 rounded-button bg-primary p-1 text-white shadow-sm"
                aria-label="선택 취소"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-button border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-[13px] font-semibold text-neutral-600 transition-colors hover:border-primary hover:text-primary">
          <ImagePlus className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          이미지 추가 (여러 장 선택 가능)
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFiles}
          />
        </label>
        <p className="text-[11px] leading-relaxed text-neutral-400">
          PNG/JPG/WebP, 파일당 10MB 이하. 요약 시간표에 순서대로 표시됩니다. 같은
          조합의 시간표가 있으면 덮어씁니다.
        </p>
      </aside>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이대로 등록할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              {SCHOOL_LABELS[values.school as School]}{" "}
              · {GRADE_LABELS[values.grade] ?? values.grade} ·{" "}
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
