"use server";

import {
  fallbackConsultationFormFields,
  normalizeConsultationResponses,
  parseConsultationFormData,
} from "@/lib/consultation/fields";
import { getConsultationFormFields } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import type { ConsultationRequestInsert } from "@/types/database";

export type SubmitConsultationResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitConsultationAction(
  formData: FormData,
): Promise<SubmitConsultationResult> {
  const fields = await getConsultationFormFields();
  const activeFields =
    fields.length > 0 ? fields : fallbackConsultationFormFields();

  const parsed = parseConsultationFormData(formData, activeFields);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  const responses = normalizeConsultationResponses(parsed.data);

  const row: ConsultationRequestInsert = {
    responses,
    student_name: responses.student_name ?? null,
    parent_name: responses.parent_name ?? null,
    phone: responses.phone ?? null,
    school_grade: responses.school_grade ?? null,
    subject: responses.subject ?? null,
    message: responses.message ?? null,
  };

  const supabase = createClient();
  const { error } = await supabase
    .from("consultation_requests")
    .insert(row as never);

  if (error) {
    console.error("[submitConsultationAction]", error);
    return {
      ok: false,
      error: "신청 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return { ok: true };
}
