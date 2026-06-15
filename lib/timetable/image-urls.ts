import { withCacheBustUrls } from "@/lib/media/cache-bust";
import type { Timetable } from "@/types/database";

/** timetables.image_urls 우선, 없으면 레거시 image_url 단일 값 */
export function normalizeTimetableImageUrls(row: {
  image_url?: string | null;
  image_urls?: string[] | null;
}): string[] {
  const fromArray = (row.image_urls ?? []).filter(
    (u) => typeof u === "string" && u.trim().length > 0,
  );
  if (fromArray.length > 0) return fromArray;
  const single = row.image_url?.trim();
  return single ? [single] : [];
}

/** 공개 페이지 표시용 — updated_at 기준 캐시 버스터 부착 */
export function timetableImageUrlsForDisplay(row: Timetable): string[] {
  return withCacheBustUrls(normalizeTimetableImageUrls(row), row.updated_at);
}
