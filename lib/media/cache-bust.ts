/**
 * Supabase Storage 등 동일 public URL 덮어쓰기 시 브라우저·CDN 캐시를 무효화합니다.
 */

const SUPABASE_STORAGE_PATH = "/storage/v1/object/public/";

export function isSupabasePublicStorageUrl(url: string): boolean {
  try {
    const u = new URL(url, "https://placeholder.local");
    if (!u.protocol.startsWith("http")) return false;
    return u.pathname.includes(SUPABASE_STORAGE_PATH);
  } catch {
    return false;
  }
}

/** ISO 타임스탬프·밀리초 → 쿼리 파라미터용 짧은 버전 문자열 */
export function cacheBustVersion(
  value: string | number | Date | null | undefined,
): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  if (value instanceof Date) {
    return String(value.getTime());
  }
  const trimmed = String(value).trim();
  if (!trimmed) return undefined;
  const ms = Date.parse(trimmed);
  if (Number.isFinite(ms)) return String(ms);
  const digits = trimmed.replace(/\D/g, "");
  return digits.length > 0 ? digits : trimmed;
}

/** 로컬·정적 에셋은 그대로, Supabase URL 만 `?v=` 추가 */
export function withCacheBust(
  url: string,
  version?: string | number | Date | null,
): string {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("/")) return trimmed;
  if (!isSupabasePublicStorageUrl(trimmed)) return trimmed;

  const v = cacheBustVersion(version);
  if (!v) return trimmed;

  try {
    const u = new URL(trimmed);
    u.searchParams.set("v", v);
    return u.toString();
  } catch {
    return trimmed;
  }
}

export function withCacheBustUrls(
  urls: readonly string[],
  version?: string | number | Date | null,
): string[] {
  return urls.map((url) => withCacheBust(url, version));
}

/** 공지 본문 HTML 내 Supabase 이미지 src 에 캐시 버스터 적용 */
export function bustSupabaseImagesInHtml(
  html: string,
  version: string | number | Date | null | undefined,
): string {
  if (!html) return html;
  const v = cacheBustVersion(version);
  if (!v) return html;

  return html.replace(
    /(<img\b[^>]*\ssrc=)(["'])([^"']+)\2/gi,
    (match, prefix: string, quote: string, src: string) => {
      if (!isSupabasePublicStorageUrl(src)) return match;
      return `${prefix}${quote}${withCacheBust(src, v)}${quote}`;
    },
  );
}
