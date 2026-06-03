"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import {
  consultationFieldsSaveSchema,
  slugifyFieldKey,
} from "@/lib/consultation/admin-fields";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveConsultationFormFieldsAction(
  fieldsJson: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(fieldsJson);
  } catch {
    return { ok: false, error: "저장 데이터 형식이 올바르지 않습니다." };
  }

  const parsed = consultationFieldsSaveSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  const admin = createAdminClient();
  const incoming = parsed.data.fields;
  const keptIds = new Set<string>();

  for (let i = 0; i < incoming.length; i++) {
    const item = incoming[i];
    const id = item.id?.trim() || undefined;
    let fieldKey = item.field_key?.trim() || "";

    if (!fieldKey) {
      fieldKey = slugifyFieldKey(item.label);
    }

    if (!/^[a-z][a-z0-9_]{1,63}$/.test(fieldKey)) {
      return {
        ok: false,
        error: `「${item.label}」 항목의 식별자가 올바르지 않습니다.`,
      };
    }

    const payload = {
      field_key: fieldKey,
      label: item.label.trim(),
      field_type: item.field_type,
      placeholder: item.placeholder?.trim() ? item.placeholder.trim() : null,
      is_required: item.is_required,
      order_index: i,
      is_active: true,
    };

    if (id) {
      keptIds.add(id);
      const { data: current } = await admin
        .from("consultation_form_fields")
        .select("field_key")
        .eq("id", id)
        .maybeSingle();
      const currentKey = (current as { field_key?: string } | null)?.field_key;
      const { error } = await admin
        .from("consultation_form_fields")
        .update({
          ...payload,
          field_key: currentKey ?? fieldKey,
        } as never)
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await admin
        .from("consultation_form_fields")
        .insert(payload as never)
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      const row = data as { id: string } | null;
      if (row?.id) keptIds.add(row.id);
    }
  }

  const { data: existing, error: listError } = await admin
    .from("consultation_form_fields")
    .select("id")
    .eq("is_active", true);

  if (listError) {
    return { ok: false, error: listError.message };
  }

  const toDeactivate = ((existing as { id: string }[] | null) ?? []).filter(
    (row) => !keptIds.has(row.id),
  );

  for (const row of toDeactivate) {
    const { error } = await admin
      .from("consultation_form_fields")
      .update({ is_active: false, order_index: 9999 } as never)
      .eq("id", row.id);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/consultation-form");
  revalidatePath("/", "layout");

  return { ok: true };
}
