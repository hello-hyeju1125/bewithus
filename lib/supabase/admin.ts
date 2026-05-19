import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseUrl } from "@/lib/supabase/env";

import type { Database } from "@/types/database";

function decodeJwtRole(token: string): string | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const json = Buffer.from(segment, "base64url").toString("utf8");
    const payload = JSON.parse(json) as { role?: string };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

/**
 * 서비스 롤(Service Role) 기반 Supabase 관리자 클라이언트.
 *
 * ⚠️ 절대 클라이언트 코드에서 import 하지 마세요.
 *    - `/app/api/admin/**` 의 Route Handler
 *    - 관리자 전용 Server Action
 *    - 서버 사이드 스크립트
 *  이 세 곳에서만 사용합니다.
 *
 * `import "server-only"` 가 클라이언트 번들에 포함되는 즉시 빌드를 실패시킵니다.
 * RLS 를 우회하므로 호출자 측에서 반드시 권한 검증을 선행해야 합니다.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRoleKey) {
    throw new Error(
      "Supabase admin client 가 초기화되지 못했습니다. " +
        "SUPABASE_SERVICE_ROLE_KEY 를 확인하세요.",
    );
  }

  const role = decodeJwtRole(serviceRoleKey);
  if (role !== "service_role") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 가 올바르지 않습니다. " +
        "Supabase 대시보드 → Project Settings → API → service_role secret 을 " +
        "복사해 넣어야 합니다. (anon public 키와 동일하면 Storage 업로드가 실패합니다.)",
    );
  }

  return createClient<Database>(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
