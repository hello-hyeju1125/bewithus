import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { getSupabaseUrl } from "@/lib/supabase/env";

import type { Database } from "@/types/database";

/**
 * 서버 컴포넌트 / Route Handler / Server Action 용 Supabase 클라이언트.
 *
 * - Next.js `cookies()` 와 연동되어 사용자 세션을 유지합니다.
 * - 익명 키를 사용하므로 RLS 정책의 보호를 받습니다.
 * - 관리자 권한이 필요한 경우 `lib/supabase/admin.ts` 를 사용하세요.
 *
 * Next.js 14 에서는 Server Component 안에서 쿠키 쓰기가 불가능하므로
 * `set` / `remove` 콜백은 try/catch 로 감싸 안전하게 무시합니다.
 * (미들웨어 또는 Route Handler 에서 호출되면 정상적으로 쓰기 동작합니다.)
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component 에서 호출된 경우: 미들웨어가 세션 갱신을 담당.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Server Component 에서 호출된 경우: 무시.
          }
        },
      },
    },
  );
}
