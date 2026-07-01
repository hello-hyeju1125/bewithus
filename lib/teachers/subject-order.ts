import type { TeacherSubjectOrder } from "@/types/database";

/** DB 순서 + 미등록 과목(강사 데이터 기준) 병합 */
export function mergeSubjectOrder(
  orderRows: TeacherSubjectOrder[],
  subjectsInUse: string[],
): string[] {
  const inUse = new Set(subjectsInUse.map((s) => s.trim()).filter(Boolean));
  const ordered: string[] = [];
  const seen = new Set<string>();

  for (const row of [...orderRows].sort(
    (a, b) => a.order_index - b.order_index,
  )) {
    const subject = row.subject.trim();
    if (!subject || !inUse.has(subject) || seen.has(subject)) continue;
    seen.add(subject);
    ordered.push(subject);
  }

  const trailing = [...inUse]
    .filter((s) => !seen.has(s))
    .sort((a, b) => a.localeCompare(b, "ko"));

  return [...ordered, ...trailing];
}

/** 현재 강사 목록에 맞게 과목 순서 목록 필터·보완 */
export function subjectsForTeacherList(
  subjectOrder: string[],
  teachers: Array<{ subject: string }>,
): string[] {
  const inUse = collectDistinctSubjects(teachers.map((t) => t.subject));
  const inUseSet = new Set(inUse);
  const ordered = subjectOrder.filter((s) => inUseSet.has(s));
  const seen = new Set(ordered);
  for (const subject of inUse) {
    if (!seen.has(subject)) ordered.push(subject);
  }
  return ordered;
}

export function collectDistinctSubjects(
  subjects: Iterable<string>,
): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const raw of subjects) {
    const subject = raw.trim();
    if (!subject || seen.has(subject)) continue;
    seen.add(subject);
    list.push(subject);
  }
  return list;
}
