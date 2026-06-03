"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { infoSessionFormSchema } from "@/lib/admin/schemas";
import { buildSafePostHtml } from "@/lib/admin/sanitize";
import {
  isEmptyTiptapDoc,
  tiptapToPlainText,
} from "@/lib/admin/tiptap-helpers";
import { adminGetInfoSession } from "@/lib/admin/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TiptapJSON } from "@/types/database";

import type { ActionResult } from "../timetable/actions";

function parseForm(formData: FormData) {
  return infoSessionFormSchema.safeParse({
    school: formData.get("school"),
    title: formData.get("title"),
    descriptionJson: formData.get("descriptionJson") ?? "",
    session_date: formData.get("session_date"),
    registration_url: formData.get("registration_url") ?? "",
    is_active: formData.get("is_active") === "on",
  });
}

function parseDescriptionFields(descriptionJsonRaw: string | undefined) {
  if (!descriptionJsonRaw?.trim()) {
    return {
      description: null,
      description_json: null,
      description_html: null,
    };
  }

  let descriptionJson: TiptapJSON;
  try {
    descriptionJson = JSON.parse(descriptionJsonRaw) as TiptapJSON;
  } catch {
    return { error: "설명 내용을 해석할 수 없습니다." as const };
  }

  if (isEmptyTiptapDoc(descriptionJson)) {
    return {
      description: null,
      description_json: null,
      description_html: null,
    };
  }

  const descriptionHtml = buildSafePostHtml(descriptionJson);
  return {
    description: tiptapToPlainText(descriptionJson) || null,
    description_json: descriptionJson,
    description_html: descriptionHtml || null,
  };
}

function buildPayload(values: ReturnType<typeof parseForm> extends infer R
  ? R extends { success: true; data: infer D }
    ? D
    : never
  : never) {
  const desc = parseDescriptionFields(values.descriptionJson);
  if ("error" in desc) throw new Error(desc.error);

  return {
    school: values.school,
    title: values.title,
    description: desc.description,
    description_json: desc.description_json,
    description_html: desc.description_html,
    session_date: new Date(values.session_date).toISOString(),
    location: null,
    capacity: null,
    registration_url: values.registration_url || null,
    is_active: values.is_active,
  };
}

export async function createInfoSessionAction(
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

  let payload;
  try {
    payload = buildPayload(parsed.data);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("info_sessions")
    .insert(payload as never)
    .select("id")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/info-session/${parsed.data.school}`);
  revalidatePath("/admin/info-session");
  return {
    ok: true,
    data: { id: (data as unknown as { id: string } | null)?.id ?? "" },
  };
}

export async function updateInfoSessionAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const existing = await adminGetInfoSession(id);
  if (!existing) return { ok: false, error: "설명회 정보가 없습니다." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  let payload;
  try {
    payload = buildPayload(parsed.data);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("info_sessions")
    .update(payload as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/info-session/${parsed.data.school}`);
  if (existing.school !== parsed.data.school) {
    revalidatePath(`/info-session/${existing.school}`);
  }
  revalidatePath("/admin/info-session");
  revalidatePath(`/admin/info-session/${id}`);
  return { ok: true };
}

export async function deleteInfoSessionAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const existing = await adminGetInfoSession(id);
  if (!existing) return { ok: false, error: "이미 삭제된 항목입니다." };

  const admin = createAdminClient();
  const { error } = await admin.from("info_sessions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/info-session/${existing.school}`);
  revalidatePath("/admin/info-session");
  return { ok: true };
}
