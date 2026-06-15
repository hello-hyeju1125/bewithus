"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { revalidateAdminRoutes } from "@/lib/admin/revalidate";
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
import { normalizeTimetableImageUrls } from "@/lib/timetable/image-urls";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { data: T }))
  | { ok: false; error: string };

function parseImageUrlsField(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((u): u is string => typeof u === "string" && u.length > 0);
  } catch {
    return [];
  }
}

function storagePathsFromUrls(urls: string[]): string[] {
  return urls
    .map((u) => urlToStoragePath(u, "timetables"))
    .filter((p): p is string => Boolean(p));
}

function parseFormCommon(formData: FormData) {
  const yearRaw = formData.get("year");
  const raw = {
    school: formData.get("school"),
    grade: formData.get("grade"),
    view_type: formData.get("view_type"),
    year: yearRaw != null ? Number(yearRaw) : NaN,
    semester: formData.get("semester"),
    description: formData.get("description") ?? "",
    image_urls: parseImageUrlsField(formData.get("image_urls")),
    is_active: formData.get("is_active") === "on",
  };
  return timetableFormSchema.safeParse(raw);
}

async function uploadTimetableImages(
  values: {
    school: string;
    grade: string;
    view_type: string;
    year: number;
    semester: string;
  },
  keptUrls: string[],
  formData: FormData,
): Promise<{ ok: true; urls: string[] } | { ok: false; error: string }> {
  const files = formData
    .getAll("image_files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const urls = [...keptUrls];
  const uploadVersion = Date.now();

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const ext = inferExtension(file);
      const path = buildTimetableImageStoragePath({
        school: values.school,
        grade: values.grade,
        view_type: values.view_type,
        year: values.year,
        semester: values.semester,
        ext,
        index: urls.length + i,
        version: uploadVersion,
      });
      const { publicUrl } = await uploadToStorage({
        bucket: "timetables",
        path,
        file,
        upsert: true,
      });
      urls.push(publicUrl);
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

  if (urls.length === 0) {
    return { ok: false, error: "이미지를 1개 이상 등록하세요." };
  }

  return { ok: true, urls };
}

function timetablePayload(
  values: ReturnType<typeof timetableFormSchema.parse>,
  imageUrls: string[],
) {
  return {
    school: values.school,
    grade: values.grade,
    view_type: values.view_type,
    year: values.year,
    semester: values.semester.trim(),
    description: values.description || null,
    image_urls: imageUrls,
    image_url: imageUrls[0]!,
    is_active: values.is_active,
  };
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

  const uploaded = await uploadTimetableImages(values, values.image_urls, formData);
  if (!uploaded.ok) return { ok: false, error: uploaded.error };

  const admin = createAdminClient();
  const payload = timetablePayload(values, uploaded.urls);

  const existing = await adminFindTimetableByKey({
    school: values.school,
    grade: values.grade,
    view_type: values.view_type,
    year: values.year,
    semester: values.semester.trim(),
  });

  if (existing) {
    const prevUrls = normalizeTimetableImageUrls(existing);
    const removed = prevUrls.filter((u) => !uploaded.urls.includes(u));
    if (removed.length > 0) {
      await removeFromStorage({
        bucket: "timetables",
        paths: storagePathsFromUrls(removed),
      });
    }

    const { error } = await admin
      .from("timetables")
      .update(payload as never)
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/timetable/${values.school}`);
    revalidateAdminRoutes("/admin/timetable", `/admin/timetable/${existing.id}`);
    return { ok: true, data: { id: existing.id } };
  }

  const { data, error } = await admin
    .from("timetables")
    .insert(payload as never)
    .select("id")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  const newId = (data as unknown as { id: string } | null)?.id ?? "";
  revalidatePath(`/timetable/${values.school}`);
  revalidateAdminRoutes("/admin/timetable", newId ? `/admin/timetable/${newId}` : undefined);
  return {
    ok: true,
    data: { id: newId },
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

  const row = await adminGetTimetable(id);
  if (!row) return { ok: false, error: "항목을 찾을 수 없습니다." };

  const uploaded = await uploadTimetableImages(values, values.image_urls, formData);
  if (!uploaded.ok) return { ok: false, error: uploaded.error };

  const prevUrls = normalizeTimetableImageUrls(row);
  const removed = prevUrls.filter((u) => !uploaded.urls.includes(u));
  if (removed.length > 0) {
    await removeFromStorage({
      bucket: "timetables",
      paths: storagePathsFromUrls(removed),
    });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("timetables")
    .update(timetablePayload(values, uploaded.urls) as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/timetable/${values.school}`);
  revalidateAdminRoutes("/admin/timetable", `/admin/timetable/${id}`);
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

  const paths = storagePathsFromUrls(normalizeTimetableImageUrls(existing));
  if (paths.length > 0) {
    await removeFromStorage({ bucket: "timetables", paths });
  }

  revalidatePath(`/timetable/${existing.school}`);
  revalidateAdminRoutes("/admin/timetable", `/admin/timetable/${id}`);
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

  const row = await adminGetTimetable(id);
  if (row) {
    revalidatePath(`/timetable/${row.school}`);
  }
  revalidateAdminRoutes("/admin/timetable", `/admin/timetable/${id}`);
  return { ok: true };
}
