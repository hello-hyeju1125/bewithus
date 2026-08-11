"use server";

import {
  CONSULTATION_HONEYPOT_FIELD,
  fallbackConsultationFormFields,
  normalizeConsultationResponses,
  parseConsultationFormData,
} from "@/lib/consultation/fields";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { getConsultationFormFields } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import type { ConsultationRequestInsert } from "@/types/database";

export type SubmitConsultationResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitConsultationAction(
  formData: FormData,
): Promise<SubmitConsultationResult> {
  // 봇 트랩: 숨김 필드가 채워졌으면 조용히 성공 처리(봇에게 실패를 알리지 않음).
  const honeypot = formData.get(CONSULTATION_HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }

  // 스팸 방지: IP 당 10분에 5회까지만 접수 허용.
  const limit = rateLimit(`consultation:${getClientIp()}`, {
    limit: 5,
    windowSec: 10 * 60,
  });
  if (!limit.allowed) {
    return {
      ok: false,
      error: `신청이 너무 잦습니다. ${limit.retryAfterSec}초 후 다시 시도해 주세요.`,
    };
  }

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
