import "server-only";

import { timingSafeEqual } from "node:crypto";

/** HttpOnly 관리자 세션 쿠키 이름 */
export const ADMIN_SESSION_COOKIE = "bewithus_admin";

/** 세션 유효 기간 (7일) */
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function isAdminPasswordConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD?.length &&
      process.env.ADMIN_SESSION_SECRET?.length,
  );
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET 이 설정되지 않았습니다.");
  }
  return secret;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

async function hmacSign(payloadB64: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  return Buffer.from(sig).toString("base64url");
}

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Edge(미들웨어) · Node(서버) 공통 — Web Crypto 만 사용 */
export async function createAdminSessionToken(): Promise<string> {
  const secret = getSessionSecret();
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SEC;
  const payloadB64 = base64UrlEncode(JSON.stringify({ exp }));
  const signature = await hmacSign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const payloadB64 = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!payloadB64 || !signature) return false;

  const expected = await hmacSign(payloadB64, process.env.ADMIN_SESSION_SECRET);
  if (!timingSafeEqualString(signature, expected)) return false;

  try {
    const { exp } = JSON.parse(base64UrlDecode(payloadB64)) as { exp: number };
    return typeof exp === "number" && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
