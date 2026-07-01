import "server-only";

import { revalidatePath } from "next/cache";

/**
 * admin 저장·수정·삭제 후 공개 페이지와 admin 화면이 같은 데이터를 보도록 캐시를 갱신합니다.
 *
 * `revalidatePath("/admin/…")` 만 호출하면 `/admin/…/[id]` 같은 하위 경로는
 * Next.js 라우터 캐시에 남을 수 있어, layout 단위로 admin 전체를 함께 무효화합니다.
 */
export function revalidateAdminRoutes(...paths: (string | undefined)[]) {
  revalidatePath("/admin", "layout");

  const seen = new Set<string>();
  for (const path of paths) {
    if (!path || seen.has(path)) continue;
    seen.add(path);
    revalidatePath(path);
  }
}
