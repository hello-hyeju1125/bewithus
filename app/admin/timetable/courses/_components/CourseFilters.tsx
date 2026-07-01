"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SCHOOLS, SCHOOL_LABELS, GRADE_LABELS } from "@/lib/constants";

const ALL_GRADES = ["high-1", "high-2", "high-3", "all"] as const;
const ALL = "__all__";

export default function CourseFilters({
  initial,
  subjects,
}: {
  initial: { school?: string; grade?: string; subject?: string };
  subjects: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: "school" | "grade" | "subject", value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === ALL) next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(
        qs ? `/admin/timetable/courses?${qs}` : "/admin/timetable/courses",
      );
    },
    [params, router],
  );

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border border-neutral-200 bg-white px-4 py-3">
      <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">
        필터
      </span>

      <Select
        value={initial.school ?? ALL}
        onValueChange={(v) => update("school", v)}
      >
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="학교 전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>학교 전체</SelectItem>
          {SCHOOLS.map((s) => (
            <SelectItem key={s} value={s}>
              {SCHOOL_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={initial.grade ?? ALL}
        onValueChange={(v) => update("grade", v)}
      >
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="학년 전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>학년 전체</SelectItem>
          {ALL_GRADES.map((g) => (
            <SelectItem key={g} value={g}>
              {GRADE_LABELS[g] ?? g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        list="course-filter-subjects"
        className="h-9 w-[160px]"
        placeholder="과목"
        defaultValue={initial.subject ?? ""}
        onBlur={(e) => update("subject", e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") update("subject", e.currentTarget.value);
        }}
      />
      <datalist id="course-filter-subjects">
        {subjects.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}
