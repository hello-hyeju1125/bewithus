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
import { SCHOOLS, SCHOOL_LABELS, GRADE_LABELS } from "@/lib/constants";

const SEMESTERS = ["1학기", "2학기", "여름학기", "봄학기"] as const;
const ALL_GRADES = ["middle-1", "middle-2", "middle-3", "high-1", "high-2", "high-3", "all"];

const ALL = "__all__";

export default function TimetableFilters({
  initial,
}: {
  initial: { school?: string; grade?: string; semester?: string };
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: "school" | "grade" | "semester", value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === ALL) next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `/admin/timetable?${qs}` : "/admin/timetable");
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

      <Select
        value={initial.semester ?? ALL}
        onValueChange={(v) => update("semester", v)}
      >
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="학기 전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>학기 전체</SelectItem>
          {SEMESTERS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
