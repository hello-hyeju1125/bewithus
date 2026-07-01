import "server-only";

import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin/session";

/**
 * Server Action 진입부에서 호출하는 관리자 권한 게이트.
 *
 * - 미들웨어가 라우트 단위 가드를 담당하지만, Server Action 은 URL 가드를
 *   거치지 않고 직접 호출될 수 있으므로 액션 함수 본문에서 한 번 더 검증합니다.
 * - `.env.local` 의 ADMIN_PASSWORD 로 발급된 HttpOnly 세션 쿠키를 검사합니다.
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  await requireAdminSession();
  return { userId: process.env.ADMIN_AUTHOR_ID?.trim() ?? "" };
}

export async function requireAdminSession(): Promise<void> {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifyAdminSessionToken(token);
  if (!valid) {
    throw new Error("관리자 인증이 필요합니다.");
  }
}

/** 공지 `author_id` — Supabase Users 에 존재하는 UUID 1개만 등록하면 됩니다. */
export function getAdminAuthorId(): string {
  const authorId = process.env.ADMIN_AUTHOR_ID?.trim();
  if (!authorId) {
    throw new Error(
      "ADMIN_AUTHOR_ID 가 설정되지 않았습니다. Supabase Users 에서 UUID 를 복사해 .env.local 에 넣어 주세요.",
    );
  }
  return authorId;
}
