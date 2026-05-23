"use server";

import { consultationFormSchema } from "@/lib/consultation/schema";
import { createClient } from "@/lib/supabase/server";
import type { ConsultationRequestInsert } from "@/types/database";

export type SubmitConsultationResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitConsultationAction(
  formData: FormData,
): Promise<SubmitConsultationResult> {
  const parsed = consultationFormSchema.safeParse({
    student_name: formData.get("student_name"),
    parent_name: formData.get("parent_name"),
    phone: formData.get("phone"),
    school_grade: formData.get("school_grade"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  const supabase = createClient();
  const row: ConsultationRequestInsert = parsed.data;
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
