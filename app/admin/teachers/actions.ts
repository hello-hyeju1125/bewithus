"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { teacherFormSchema, teacherOrderUpdateSchema } from "@/lib/admin/schemas";
import {
  inferExtension,
  removeFromStorage,
  uploadToStorage,
  urlToStoragePath,
  UploadValidationError,
} from "@/lib/admin/storage";
import { adminGetTeacher } from "@/lib/admin/queries";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ActionResult } from "../timetable/actions";

function parseForm(formData: FormData) {
  const orderRaw = formData.get("order_index");
  return teacherFormSchema.safeParse({
    name: formData.get("name"),
    school: formData.get("school"),
    subject: formData.get("subject"),
    bio: formData.get("bio") ?? "",
    photo_url: formData.get("photo_url") ?? "",
    order_index: orderRaw != null && orderRaw !== "" ? Number(orderRaw) : 0,
    is_active: formData.get("is_active") === "on",
  });
}

async function maybeUploadPhoto(
  formData: FormData,
  current: string | null,
): Promise<string | null> {
  const file = formData.get("photo_file");
  if (!(file instanceof File) || file.size === 0) return current;
  const ext = inferExtension(file);
  const uuid = crypto.randomUUID();
  const path = `${uuid}.${ext}`;
  const { publicUrl } = await uploadToStorage({
    bucket: "teachers",
    path,
    file,
  });
  // 기존 사진은 새 업로드 성공 후 비동기 삭제 (실패 무시).
  if (current) {
    const old = urlToStoragePath(current, "teachers");
    if (old) await removeFromStorage({ bucket: "teachers", paths: [old] });
  }
  return publicUrl;
}

export async function createTeacherAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }
  const values = parsed.data;

  let photoUrl: string | null;
  try {
    photoUrl = await maybeUploadPhoto(formData, null);
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof UploadValidationError
          ? e.message
          : "사진 업로드 중 오류가 발생했습니다.",
    };
  }

  const admin = createAdminClient();
  const insertPayload = {
    name: values.name,
    school: values.school,
    subject: values.subject,
    bio: values.bio || null,
    photo_url: photoUrl,
    career: [],
    order_index: values.order_index,
    is_active: values.is_active,
  };
  const { data, error } = await admin
    .from("teachers")
    .insert(insertPayload as never)
    .select("id")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/teachers/${values.school}`);
  revalidatePath("/admin/teachers");
  return {
    ok: true,
    data: { id: (data as unknown as { id: string } | null)?.id ?? "" },
  };
}

export async function updateTeacherAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const existing = await adminGetTeacher(id);
  if (!existing) return { ok: false, error: "강사 정보가 없습니다." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }
  const values = parsed.data;

  let photoUrl: string | null;
  try {
    photoUrl = await maybeUploadPhoto(formData, existing.photo_url);
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof UploadValidationError
          ? e.message
          : "사진 업로드 중 오류가 발생했습니다.",
    };
  }

  const admin = createAdminClient();
  const updatePayload = {
    name: values.name,
    school: values.school,
    subject: values.subject,
    bio: values.bio || null,
    photo_url: photoUrl,
    career: [],
    order_index: values.order_index,
    is_active: values.is_active,
  };
  const { error } = await admin
    .from("teachers")
    .update(updatePayload as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/teachers/${values.school}`);
  if (existing.school !== values.school) {
    revalidatePath(`/teachers/${existing.school}`);
  }
  revalidatePath("/admin/teachers");
  revalidatePath(`/admin/teachers/${id}`);
  return { ok: true };
}

export async function deleteTeacherAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const existing = await adminGetTeacher(id);
  if (!existing) return { ok: false, error: "이미 삭제된 항목입니다." };

  const admin = createAdminClient();
  const { error } = await admin.from("teachers").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  if (existing.photo_url) {
    const path = urlToStoragePath(existing.photo_url, "teachers");
    if (path) await removeFromStorage({ bucket: "teachers", paths: [path] });
  }

  revalidatePath(`/teachers/${existing.school}`);
  revalidatePath("/admin/teachers");
  return { ok: true };
}

export async function updateTeacherOrderAction(
  updates: { id: string; order_index: number }[],
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const parsed = teacherOrderUpdateSchema.safeParse({ updates });
  if (!parsed.success) {
    return { ok: false, error: "정렬 데이터가 올바르지 않습니다." };
  }

  const admin = createAdminClient();
  for (const u of parsed.data.updates) {
    const { error } = await admin
      .from("teachers")
      .update({ order_index: u.order_index } as never)
      .eq("id", u.id);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/teachers");
  revalidatePath("/teachers/daewon");
  revalidatePath("/teachers/hanyoung");
  revalidatePath("/teachers/general");
  return { ok: true };
}
