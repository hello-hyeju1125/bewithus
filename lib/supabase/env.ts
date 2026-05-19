/**
 * Supabase Project URL 정규화.
 *
 * `https://<ref>.supabase.co` 만 넣어야 합니다.
 * API 설정 화면의 `/rest/v1` 경로를 붙이면 PGRST125 가 발생합니다.
 */
export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL 이 설정되지 않았습니다. .env.local 을 확인하세요.",
    );
  }
  return normalizeSupabaseUrl(raw);
}

export function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim().replace(/\/+$/, "");
  url = url.replace(/\/rest\/v1\/?$/i, "");
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL 형식이 올바르지 않습니다. https://<project-ref>.supabase.co 형태여야 합니다.",
    );
  }
  return url;
}
