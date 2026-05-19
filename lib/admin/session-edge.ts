/**
 * 미들웨어(Edge) 전용 세션 검증.
 * `server-only` / Node crypto 에 의존하지 않습니다.
 */

export const ADMIN_SESSION_COOKIE = "bewithus_admin";

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + "=".repeat(padLen));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function bytesToBase64Url(bytes: ArrayBuffer): string {
  const u8 = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < u8.length; i++) binary += String.fromCharCode(u8[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
  return bytesToBase64Url(sig);
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!token || !secret) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const payloadB64 = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!payloadB64 || !signature) return false;

  const expected = await hmacSign(payloadB64, secret);
  if (!timingSafeEqualString(signature, expected)) return false;

  try {
    const { exp } = JSON.parse(base64UrlDecode(payloadB64)) as { exp: number };
    return typeof exp === "number" && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD?.length &&
      process.env.ADMIN_SESSION_SECRET?.length,
  );
}
