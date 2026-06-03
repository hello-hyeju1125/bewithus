"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useTransition } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
  type School,
} from "@/lib/constants";
import {
  DEFAULT_TAG_BG_COLOR,
  DEFAULT_TAG_TEXT_COLOR,
} from "@/lib/admin/hex-color";
import {
  timetableCourseFormSchema,
  type TimetableCourseFormValues,
} from "@/lib/admin/schemas";
import type { Teacher, TimetableCourse } from "@/types/database";

import {
  createTimetableCourseAction,
  updateTimetableCourseAction,
} from "../actions";

const APPLY_VARIANTS = [
  { value: "primary", label: "수강 신청 (옐로)" },
  { value: "secondary", label: "전반 신청 (보더)" },
  { value: "waitlist", label: "대기 신청 (네이비)" },
] as const;

type Props = {
  initial?: TimetableCourse | null;
  teachers: Teacher[];
  subjectSuggestions: string[];
};

const DEFAULT_VALUES: TimetableCourseFormValues = {
  school: "daewon",
  grade: SCHOOL_GRADES.daewon[0],
  year: new Date().getFullYear(),
  semester: "2학기",
  subject: "",
  teacher_id: "",
  course_title: "",
  course_subtitle: "",
  course_note: "",
  tag: "",
  tag_bg_color: DEFAULT_TAG_BG_COLOR,
  tag_text_color: DEFAULT_TAG_TEXT_COLOR,
  sessions: [{ day_time: "", is_full: false }],
  start_dates: [],
  apply_buttons: [],
  detail_url: "",
  order_index: 0,
  is_active: true,
};

export default function CourseForm({
  initial,
  teachers,
  subjectSuggestions,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const initialValues = useMemo<TimetableCourseFormValues>(() => {
    if (!initial) return DEFAULT_VALUES;
    return {
      school: initial.school as School,
      grade: initial.grade,
      year: initial.year,
      semester: initial.semester,
      subject: initial.subject,
      teacher_id: initial.teacher_id,
      course_title: initial.course_title,
      course_subtitle: initial.course_subtitle ?? "",
      course_note: initial.course_note ?? "",
      tag: initial.tag ?? "",
      tag_bg_color: initial.tag_bg_color ?? DEFAULT_TAG_BG_COLOR,
      tag_text_color: initial.tag_text_color ?? DEFAULT_TAG_TEXT_COLOR,
      sessions:
        initial.sessions.length > 0
          ? initial.sessions.map((s) => ({
              day_time: s.day_time,
              is_full: !!s.is_full,
            }))
          : [{ day_time: "", is_full: false }],
      start_dates: initial.start_dates,
      apply_buttons: initial.apply_buttons.map((b) => ({
        label: b.label,
        url: b.url,
        variant: b.variant ?? "primary",
      })),
      detail_url: initial.detail_url ?? "",
      order_index: initial.order_index,
      is_active: initial.is_active,
    };
  }, [initial]);

  const form = useForm<TimetableCourseFormValues>({
    resolver: zodResolver(timetableCourseFormSchema),
    defaultValues: initialValues,
  });

  const school = form.watch("school") as School;
  const sessions = useFieldArray({ control: form.control, name: "sessions" });
  const applyButtons = useFieldArray({
    control: form.control,
    name: "apply_buttons",
  });
  const startDates = form.watch("start_dates");

  useEffect(() => {
    // 학교 변경 시 grade 자동 정정
    const grade = form.getValues("grade");
    const allowed = SCHOOL_GRADES[school];
    if (!allowed.includes(grade)) {
      form.setValue("grade", allowed[0], { shouldValidate: true });
    }
    // 강사 목록 필터링 시 현재 강사가 학교에 안 맞으면 초기화
    const t = teachers.find(
      (x) => x.id === form.getValues("teacher_id"),
    );
    if (t && t.school !== school && school !== "private") {
      form.setValue("teacher_id", "", { shouldValidate: false });
    }
  }, [school, teachers, form]);

  const eligibleTeachers = useMemo(() => {
    if (school === "private")
      return teachers.filter((t) => t.is_active);
    return teachers.filter((t) => t.is_active && t.school === school);
  }, [school, teachers]);

  function addStartDate(raw: string) {
    const value = raw.trim();
    if (!value) return;
    const next = Array.from(new Set([...startDates, value]));
    form.setValue("start_dates", next, { shouldValidate: true });
  }

  function removeStartDate(index: number) {
    const next = startDates.filter((_, i) => i !== index);
    form.setValue("start_dates", next, { shouldValidate: true });
  }

  const submit: SubmitHandler<TimetableCourseFormValues> = (values) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("payload", JSON.stringify(values));
      const res = initial
        ? await updateTimetableCourseAction(initial.id, fd)
        : await createTimetableCourseAction(fd);
      if (!res.ok) {
        toast.error("저장 실패", { description: res.error });
        return;
      }
      toast.success(initial ? "수정되었습니다." : "등록되었습니다.");
      router.push("/admin/timetable/courses");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5 rounded-card border border-neutral-200 bg-white p-6">
        {/* 기본 메타 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="school">학교</Label>
            <Select
              value={school}
              onValueChange={(v) =>
                form.setValue("school", v as School, { shouldValidate: true })
              }
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
                {SCHOOL_GRADES[school].map((g: string) => (
                  <SelectItem key={g} value={g}>
                    {GRADE_LABELS[g] ?? g}
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject">과목</Label>
            <Input
              id="subject"
              list="course-subject-suggestions"
              placeholder="예: 국어, 수학, 영어, 과학탐구"
              {...form.register("subject")}
            />
            <datalist id="course-subject-suggestions">
              {subjectSuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
        </div>

        {/* 강사 + 강의명 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="teacher_id">강사</Label>
            <Select
              value={form.watch("teacher_id")}
              onValueChange={(v) =>
                form.setValue("teacher_id", v, { shouldValidate: true })
              }
            >
              <SelectTrigger id="teacher_id">
                <SelectValue placeholder="강사를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {eligibleTeachers.length === 0 ? (
                  <SelectItem value="__none__" disabled>
                    등록된 강사가 없습니다
                  </SelectItem>
                ) : (
                  eligibleTeachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} · {t.subject}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tag">태그 (선택)</Label>
            <Input
              id="tag"
              placeholder="예: 특강 / 신설 / 마감임박"
              {...form.register("tag")}
            />
            <p className="text-[12px] text-neutral-500">
              상세 시간표 강의명 옆에 표시됩니다. 색상은 아래에서 지정할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tag_bg_color">태그 배경색</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="태그 배경색 선택"
                className="h-10 w-12 cursor-pointer rounded-button border border-neutral-200 bg-white p-0.5"
                value={form.watch("tag_bg_color") || DEFAULT_TAG_BG_COLOR}
                onChange={(e) =>
                  form.setValue("tag_bg_color", e.target.value, {
                    shouldValidate: true,
                  })
                }
              />
              <Input
                id="tag_bg_color"
                placeholder="#FFF33B"
                {...form.register("tag_bg_color")}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tag_text_color">태그 글자색</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="태그 글자색 선택"
                className="h-10 w-12 cursor-pointer rounded-button border border-neutral-200 bg-white p-0.5"
                value={form.watch("tag_text_color") || DEFAULT_TAG_TEXT_COLOR}
                onChange={(e) =>
                  form.setValue("tag_text_color", e.target.value, {
                    shouldValidate: true,
                  })
                }
              />
              <Input
                id="tag_text_color"
                placeholder="#22295D"
                {...form.register("tag_text_color")}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course_title">강의명</Label>
          <Input
            id="course_title"
            placeholder="예: 국어 정규반 시즌3 심화"
            {...form.register("course_title")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course_subtitle">강의 부제 (선택)</Label>
          <Input
            id="course_subtitle"
            placeholder="예: : 결격사유 (12주) (이원화)"
            {...form.register("course_subtitle")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course_note">강의 메모 (선택)</Label>
          <Textarea
            id="course_note"
            rows={2}
            placeholder="예: ★ EBS OF LINE — E문 문학 실전 모의고사 / E문 독서 강력 훈련 (6평 대비)"
            {...form.register("course_note")}
          />
        </div>

        {/* 요일/시간 행 */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>요일 · 시간</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => sessions.append({ day_time: "", is_full: false })}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />행 추가
            </Button>
          </div>
          <ul className="space-y-2">
            {sessions.fields.map((field, idx) => (
              <li
                key={field.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-button border border-neutral-200 p-2"
              >
                <Input
                  placeholder="예: 토 AM 8:40~12:10"
                  {...form.register(`sessions.${idx}.day_time` as const)}
                />
                <label className="inline-flex items-center gap-1.5 px-2 text-[12px] font-semibold text-neutral-700">
                  <Switch
                    checked={!!form.watch(`sessions.${idx}.is_full`)}
                    onCheckedChange={(v) =>
                      form.setValue(`sessions.${idx}.is_full`, v, {
                        shouldValidate: true,
                      })
                    }
                  />
                  마감
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => sessions.remove(idx)}
                  aria-label="시간 행 삭제"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        </section>

        {/* 개강일 칩 */}
        <section className="space-y-2">
          <Label>개강일</Label>
          <div className="flex flex-wrap items-center gap-2 rounded-button border border-neutral-200 bg-white p-2">
            {startDates.map((d, idx) => (
              <span
                key={`${d}-${idx}`}
                className="inline-flex items-center gap-1 rounded-button bg-primary-50 px-2.5 py-1 text-[13px] font-semibold text-primary"
              >
                {d}
                <button
                  type="button"
                  onClick={() => removeStartDate(idx)}
                  className="text-primary/70 hover:text-primary"
                  aria-label={`${d} 삭제`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="예: 5/9(토)"
              className="min-w-[140px] flex-1 bg-transparent px-2 py-1 text-[14px] outline-none placeholder:text-neutral-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addStartDate(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.currentTarget.value) {
                  addStartDate(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Enter 또는 쉼표로 추가됩니다.
          </p>
        </section>

        {/* 신청 버튼 */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>신청 버튼</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                applyButtons.append({ label: "", url: "", variant: "primary" })
              }
            >
              <Plus className="h-4 w-4" aria-hidden="true" />버튼 추가
            </Button>
          </div>
          {applyButtons.fields.length === 0 ? (
            <p className="rounded-button border border-dashed border-neutral-300 px-3 py-3 text-[12px] text-neutral-500">
              버튼이 없으면 공개 페이지에 신청 영역이 표시되지 않습니다.
            </p>
          ) : (
            <ul className="space-y-2">
              {applyButtons.fields.map((field, idx) => (
                <li
                  key={field.id}
                  className="grid grid-cols-1 gap-2 rounded-button border border-neutral-200 p-2 sm:grid-cols-[140px_1fr_180px_auto]"
                >
                  <Input
                    placeholder="라벨"
                    {...form.register(`apply_buttons.${idx}.label` as const)}
                  />
                  <Input
                    placeholder="https://..."
                    {...form.register(`apply_buttons.${idx}.url` as const)}
                  />
                  <Select
                    value={form.watch(`apply_buttons.${idx}.variant`) ?? "primary"}
                    onValueChange={(v) =>
                      form.setValue(
                        `apply_buttons.${idx}.variant`,
                        v as "primary" | "secondary" | "waitlist",
                        { shouldValidate: true },
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLY_VARIANTS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => applyButtons.remove(idx)}
                    aria-label="버튼 삭제"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="detail_url">설명회 영상 보기 URL (선택)</Label>
          <Input
            id="detail_url"
            placeholder="https://..."
            {...form.register("detail_url")}
          />
        </div>

        {Object.values(form.formState.errors).length > 0 ? (
          <ul className="space-y-1 rounded-button border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {Object.entries(form.formState.errors).map(([k, err]) => (
              <li key={k}>
                {(err as { message?: string })?.message ?? "입력 오류"}
              </li>
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order_index">정렬 순서</Label>
          <Input
            id="order_index"
            type="number"
            min={0}
            {...form.register("order_index", { valueAsNumber: true })}
          />
          <p className="text-[11px] text-neutral-500">
            같은 과목 안에서 작은 숫자가 먼저 표시됩니다.
          </p>
        </div>

        <div className="rounded-button bg-neutral-50 px-3 py-2 text-[12px] leading-relaxed text-neutral-600">
          <p className="font-bold text-neutral-700">팁</p>
          <ul className="mt-1 list-disc pl-4">
            <li>요일/시간 한 줄당 마감 토글이 따로 동작합니다.</li>
            <li>신청 버튼은 0~6개까지 추가 가능합니다.</li>
            <li>강사 변경은 강사진 메뉴에서 먼저 등록 후 선택합니다.</li>
          </ul>
        </div>
      </aside>
    </form>
  );
}
