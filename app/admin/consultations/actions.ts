"use server";

import { revalidateAdminRoutes } from "@/lib/admin/revalidate";
import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ConsultationStatus } from "@/types/database";

import type { ActionResult } from "../timetable/actions";

const STATUSES: ConsultationStatus[] = ["new", "read", "archived"];

export async function updateConsultationStatusAction(
  id: string,
  status: ConsultationStatus,
): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  if (!STATUSES.includes(status)) {
    return { ok: false, error: "잘못된 상태값입니다." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("consultation_requests")
    .update({ status } as never)
    .eq("id", id);

  if (error) {
    console.error("[updateConsultationStatusAction]", error);
    return { ok: false, error: "상태 변경에 실패했습니다." };
  }

  revalidateAdminRoutes("/admin/consultations", `/admin/consultations/${id}`);
  return { ok: true };
}

export async function deleteConsultationAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("consultation_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteConsultationAction]", error);
    return { ok: false, error: "삭제에 실패했습니다." };
  }

  revalidateAdminRoutes("/admin/consultations", `/admin/consultations/${id}`);
  return { ok: true };
}
