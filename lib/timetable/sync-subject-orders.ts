import type { SupabaseClient } from "@supabase/supabase-js";

import { collectDistinctSubjects } from "@/lib/teachers/subject-order";
import type { Database, TimetableSubjectOrder } from "@/types/database";

type DbClient = SupabaseClient<Database>;

/** 상세 강의 과목 목록과 timetable_subject_orders 동기화 (신규 과목은 맨 뒤에 추가) */
export async function syncTimetableSubjectOrders(
  supabase: DbClient,
  subjectsInUse: string[],
): Promise<void> {
  const subjects = collectDistinctSubjects(subjectsInUse);
  if (subjects.length === 0) return;

  const { data, error } = await supabase
    .from("timetable_subject_orders")
    .select("subject, order_index")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[syncTimetableSubjectOrders]", error);
    return;
  }

  const rows =
    (data as Pick<TimetableSubjectOrder, "subject" | "order_index">[]) ?? [];
  const existing = new Set(rows.map((r) => r.subject.trim()));
  let nextIndex =
    rows.length > 0 ? Math.max(...rows.map((r) => r.order_index)) + 1 : 0;

  for (const subject of subjects) {
    if (existing.has(subject)) continue;
    const { error: insertError } = await supabase
      .from("timetable_subject_orders")
      .insert({ subject, order_index: nextIndex } as never);
    if (insertError) {
      console.error("[syncTimetableSubjectOrders] insert", insertError);
      continue;
    }
    existing.add(subject);
    nextIndex += 1;
  }
}
