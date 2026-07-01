import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseUrl } from "@/lib/supabase/env";

import type { Database } from "@/types/database";

/**
 * 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트.
 *
 * - 익명 키(anon key)만 사용하므로 번들에 포함되어도 안전합니다.
 * - 인증 세션은 쿠키 기반으로 자동 동기화됩니다 (@supabase/ssr).
 * - 절대 이 파일에서 SERVICE_ROLE_KEY 를 참조하지 마세요.
 */
export function createClient() {
  return createBrowserClient<Database>(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
