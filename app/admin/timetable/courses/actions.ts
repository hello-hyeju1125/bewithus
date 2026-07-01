"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { revalidateAdminRoutes } from "@/lib/admin/revalidate";
import { normalizeHexColor } from "@/lib/admin/hex-color";
import {
  timetableCourseFormSchema,
  type TimetableCourseFormValues,
} from "@/lib/admin/schemas";
import { adminGetTimetableCourse } from "@/lib/admin/queries";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { data: T }))
  | { ok: false; error: string };

function normalize(values: TimetableCourseFormValues) {
  return {
    school: values.school,
    grade: values.grade,
    year: values.year,
    semester: values.semester,
    subject: values.subject.trim(),
    teacher_id: values.teacher_id,
    course_title: values.course_title.trim(),
    course_subtitle: values.course_subtitle ? values.course_subtitle.trim() : null,
    course_note: values.course_note ? values.course_note.trim() : null,
    tag: values.tag ? values.tag.trim() : null,
    tag_bg_color: normalizeHexColor(values.tag_bg_color),
    tag_text_color: normalizeHexColor(values.tag_text_color),
    sessions: values.sessions.map((s) => ({
      day_time: s.day_time.trim(),
      is_full: !!s.is_full,
    })),
    start_dates: values.start_dates
      .map((d) => d.trim())
      .filter((d) => d.length > 0),
    apply_buttons: values.apply_buttons.map((b) => ({
      label: b.label.trim(),
      url: b.url.trim(),
      variant: b.variant ?? "primary",
    })),
    detail_url: values.detail_url ? values.detail_url.trim() : null,
    order_index: values.order_index,
    is_active: values.is_active,
  };
}

function parseFormData(formData: FormData) {
  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return { success: false as const, error: "잘못된 폼 페이로드" };
  }
  try {
    const parsed = JSON.parse(payloadRaw);
    const result = timetableCourseFormSchema.safeParse(parsed);
    if (!result.success) {
      return {
        success: false as const,
        error: result.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
      };
    }
    return { success: true as const, values: result.data };
  } catch {
    return { success: false as const, error: "폼 데이터를 읽을 수 없습니다." };
  }
}

export async function createTimetableCourseAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const parsed = parseFormData(formData);
  if (!parsed.success) return { ok: false, error: parsed.error };

  const admin = createAdminClient();
  const payload = normalize(parsed.values);
  const { data, error } = await admin
    .from("timetable_courses")
    .insert(payload as never)
    .select("id, school")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  const newId = (data as unknown as { id: string } | null)?.id ?? "";
  revalidatePath(`/timetable/${payload.school}`);
  revalidateAdminRoutes(
    "/admin/timetable/courses",
    newId ? `/admin/timetable/courses/${newId}` : undefined,
  );
  return {
    ok: true,
    data: { id: newId },
  };
}

export async function updateTimetableCourseAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const parsed = parseFormData(formData);
  if (!parsed.success) return { ok: false, error: parsed.error };

  const admin = createAdminClient();
  const payload = normalize(parsed.values);
  const { error } = await admin
    .from("timetable_courses")
    .update(payload as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/timetable/${payload.school}`);
  revalidateAdminRoutes("/admin/timetable/courses", `/admin/timetable/courses/${id}`);
  return { ok: true };
}

export async function deleteTimetableCourseAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const existing = await adminGetTimetableCourse(id);
  if (!existing) return { ok: false, error: "이미 삭제되었거나 존재하지 않는 항목입니다." };

  const admin = createAdminClient();
  const { error } = await admin.from("timetable_courses").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/timetable/${existing.school}`);
  revalidateAdminRoutes("/admin/timetable/courses", `/admin/timetable/courses/${id}`);
  return { ok: true };
}

export async function toggleCourseActiveAction(
  id: string,
  active: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const admin = createAdminClient();
  const { error } = await admin
    .from("timetable_courses")
    .update({ is_active: active } as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  const row = await adminGetTimetableCourse(id);
  if (row) {
    revalidatePath(`/timetable/${row.school}`);
  }
  revalidateAdminRoutes("/admin/timetable/courses", `/admin/timetable/courses/${id}`);
  return { ok: true };
}
