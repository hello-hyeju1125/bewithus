"use server";

import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SEC,
  createAdminSessionToken,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/admin/session";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginAdminAction(
  password: string,
): Promise<AdminLoginResult> {
  if (!isAdminPasswordConfigured()) {
    return {
      ok: false,
      error:
        "관리자 비밀번호가 서버에 설정되지 않았습니다. .env.local 의 ADMIN_PASSWORD 를 확인하세요.",
    };
  }

  // 무차별 대입 방어: IP 당 5분에 10회까지만 시도 허용.
  const limit = rateLimit(`admin-login:${getClientIp()}`, {
    limit: 10,
    windowSec: 5 * 60,
  });
  if (!limit.allowed) {
    return {
      ok: false,
      error: `로그인 시도가 너무 많습니다. ${limit.retryAfterSec}초 후 다시 시도해 주세요.`,
    };
  }

  if (!verifyAdminPassword(password)) {
    return { ok: false, error: "비밀번호가 올바르지 않습니다." };
  }

  const token = await createAdminSessionToken();
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  });

  return { ok: true };
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
