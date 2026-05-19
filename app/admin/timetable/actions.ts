"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { timetableFormSchema } from "@/lib/admin/schemas";
import {
  inferExtension,
  removeFromStorage,
  uploadToStorage,
  urlToStoragePath,
  UploadValidationError,
} from "@/lib/admin/storage";
import { buildTimetableImageStoragePath } from "@/lib/admin/timetable-storage-path";
import { adminFindTimetableByKey, adminGetTimetable } from "@/lib/admin/queries";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { data: T }))
  | { ok: false; error: string };

function parseFormCommon(formData: FormData) {
  const yearRaw = formData.get("year");
  const raw = {
    school: formData.get("school"),
    grade: formData.get("grade"),
    view_type: formData.get("view_type"),
    year: yearRaw != null ? Number(yearRaw) : NaN,
    semester: formData.get("semester"),
    description: formData.get("description") ?? "",
    image_url: formData.get("image_url") ?? "",
    is_active: formData.get("is_active") === "on",
  };
  return timetableFormSchema.safeParse(raw);
}

export async function createTimetableAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const parsed = parseFormCommon(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }
  const values = parsed.data;

  const file = formData.get("image_file");
  let imageUrl = values.image_url;

  try {
    if (file instanceof File && file.size > 0) {
      const ext = inferExtension(file);
      const path = buildTimetableImageStoragePath({
        school: values.school,
        grade: values.grade,
        view_type: values.view_type,
        year: values.year,
        semester: values.semester,
        ext,
      });
      const { publicUrl } = await uploadToStorage({
        bucket: "timetables",
        path,
        file,
        upsert: true,
      });
      imageUrl = publicUrl;
    }
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof UploadValidationError
          ? e.message
          : e instanceof Error
            ? e.message
            : "이미지 업로드 중 오류가 발생했습니다.",
    };
  }

  if (!imageUrl) {
    return { ok: false, error: "이미지를 업로드하세요." };
  }

  const admin = createAdminClient();

  // 같은 (school, grade, view_type, year, semester) 조합이 이미 있으면
  // upsert 로 덮어씁니다. 호출 측에서 확인 모달을 띄운 후 호출하는 것을
  // 전제로 합니다.
  const existing = await adminFindTimetableByKey({
    school: values.school,
    grade: values.grade,
    view_type: values.view_type,
    year: values.year,
    semester: values.semester,
  });

  if (existing) {
    const updatePayload = {
      image_url: imageUrl,
      description: values.description || null,
      is_active: values.is_active,
    };
    const { error } = await admin
      .from("timetables")
      .update(updatePayload as never)
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/timetable/${values.school}`);
    revalidatePath("/admin/timetable");
    return { ok: true, data: { id: existing.id } };
  }

  const insertPayload = {
    school: values.school,
    grade: values.grade,
    view_type: values.view_type,
    year: values.year,
    semester: values.semester,
    description: values.description || null,
    image_url: imageUrl,
    is_active: values.is_active,
  };
  const { data, error } = await admin
    .from("timetables")
    .insert(insertPayload as never)
    .select("id")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/timetable/${values.school}`);
  revalidatePath("/admin/timetable");
  return {
    ok: true,
    data: { id: (data as unknown as { id: string } | null)?.id ?? "" },
  };
}

export async function updateTimetableAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const parsed = parseFormCommon(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }
  const values = parsed.data;

  const file = formData.get("image_file");
  let imageUrl = values.image_url;

  try {
    if (file instanceof File && file.size > 0) {
      const ext = inferExtension(file);
      const path = buildTimetableImageStoragePath({
        school: values.school,
        grade: values.grade,
        view_type: values.view_type,
        year: values.year,
        semester: values.semester,
        ext,
      });
      const { publicUrl } = await uploadToStorage({
        bucket: "timetables",
        path,
        file,
        upsert: true,
      });
      imageUrl = publicUrl;
    }
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof UploadValidationError
          ? e.message
          : e instanceof Error
            ? e.message
            : "이미지 업로드 중 오류가 발생했습니다.",
    };
  }

  const admin = createAdminClient();
  const updatePayload = {
    school: values.school,
    grade: values.grade,
    view_type: values.view_type,
    year: values.year,
    semester: values.semester,
    description: values.description || null,
    image_url: imageUrl,
    is_active: values.is_active,
  };
  const { error } = await admin
    .from("timetables")
    .update(updatePayload as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/timetable/${values.school}`);
  revalidatePath("/admin/timetable");
  return { ok: true };
}

export async function deleteTimetableAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const existing = await adminGetTimetable(id);
  if (!existing) return { ok: false, error: "이미 삭제되었거나 존재하지 않는 항목입니다." };

  const admin = createAdminClient();
  const { error } = await admin.from("timetables").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  if (existing.image_url) {
    const path = urlToStoragePath(existing.image_url, "timetables");
    if (path) {
      await removeFromStorage({ bucket: "timetables", paths: [path] });
    }
  }

  revalidatePath(`/timetable/${existing.school}`);
  revalidatePath("/admin/timetable");
  return { ok: true };
}

export async function toggleTimetableActiveAction(
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
    .from("timetables")
    .update({ is_active: active } as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/timetable");
  return { ok: true };
}
