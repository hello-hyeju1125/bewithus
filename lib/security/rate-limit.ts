import "server-only";

import { headers } from "next/headers";

/**
 * 외부 인프라(Redis 등) 없이 동작하는 인메모리 rate limiter.
 *
 * ⚠️ 서버리스(Vercel) 환경에서는 인스턴스마다 메모리가 분리되고 콜드스타트 시
 *    초기화되므로 "완벽한" 제한은 아닙니다. 하지만 단일 인스턴스로 쏟아지는
 *    무차별 대입/스팸을 실질적으로 늦추는 저비용 방어선입니다.
 */
type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

/** 오래된 버킷을 정리해 메모리 누수를 방지 (호출 시 기회적으로 수행). */
function pruneExpired(now: number): void {
  if (store.size < 1000) return;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

/**
 * `key` 에 대해 `windowSec` 동안 `limit` 회까지 허용.
 * 허용되면 카운트를 1 증가시키고 `allowed: true` 를 반환합니다.
 */
export function rateLimit(
  key: string,
  opts: { limit: number; windowSec: number },
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + opts.windowSec * 1000 });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (bucket.count >= opts.limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

/**
 * 프록시 헤더에서 클라이언트 IP 를 추정합니다.
 * Vercel 은 `x-forwarded-for` 첫 항목이 실제 클라이언트 IP 입니다.
 * 식별 불가 시 rate limit 이 전체를 하나로 묶지 않도록 고정 문자열을 반환합니다.
 */
export function getClientIp(): string {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}
