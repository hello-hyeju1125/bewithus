import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

export const ALLOWED_IMAGE_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const ALLOWED_IMAGE_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

/**
 * 업로드되는 파일이 이미지 정책을 충족하는지 검증.
 * 위반 시 `UploadValidationError` 를 던집니다.
 */
export function assertImageFile(file: File): void {
  if (!file || !(file instanceof File) || file.size === 0) {
    throw new UploadValidationError("업로드된 이미지가 없습니다.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError(
      `이미지 크기는 ${MAX_UPLOAD_BYTES / 1024 / 1024}MB 이하여야 합니다.`,
    );
  }
  if (!ALLOWED_IMAGE_MIME.has(file.type)) {
    throw new UploadValidationError(
      "허용되지 않은 이미지 형식입니다. PNG/JPG/WebP/GIF/SVG 만 업로드할 수 있습니다.",
    );
  }
}

export function inferExtension(file: File): string {
  return ALLOWED_IMAGE_EXT[file.type] ?? "bin";
}

/**
 * 지정한 버킷에 파일을 업로드하고 public URL 을 반환합니다.
 *
 * - 업로드는 Service Role 클라이언트로 수행하므로 호출자는 `requireAdmin()`
 *   을 선행해야 합니다.
 * - `upsert: true` 로 같은 경로에 덮어쓰기를 허용합니다 (시간표 교체 시나리오).
 */
export async function uploadToStorage(params: {
  bucket: "timetables" | "teachers" | "post-images" | "home-heroes";
  path: string;
  file: File;
  upsert?: boolean;
}): Promise<{ path: string; publicUrl: string }> {
  assertImageFile(params.file);

  const supabase = createAdminClient();
  const arrayBuffer = await params.file.arrayBuffer();
  const { error: uploadErr } = await supabase.storage
    .from(params.bucket)
    .upload(params.path, arrayBuffer, {
      cacheControl: "3600",
      contentType: params.file.type,
      upsert: params.upsert ?? false,
    });
  if (uploadErr) {
    const hint =
      uploadErr.message.includes("Invalid key") ||
      uploadErr.message.includes("invalid")
        ? " (파일 경로에 사용할 수 없는 문자가 포함되어 있습니다.)"
        : "";
    throw new Error(`이미지 업로드에 실패했습니다: ${uploadErr.message}${hint}`);
  }
  const { data } = supabase.storage
    .from(params.bucket)
    .getPublicUrl(params.path);
  return { path: params.path, publicUrl: data.publicUrl };
}

/**
 * 버킷 내 객체를 삭제. 실패해도 호출자가 흐름을 깨지 않도록 throw 는 옵션.
 */
export async function removeFromStorage(params: {
  bucket: "timetables" | "teachers" | "post-images" | "home-heroes";
  paths: string[];
  throwOnError?: boolean;
}): Promise<void> {
  if (params.paths.length === 0) return;
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(params.bucket)
    .remove(params.paths);
  if (error) {
    console.error("[removeFromStorage]", error);
    if (params.throwOnError) throw error;
  }
}

/**
 * public URL 에서 버킷 내부 경로를 역추출합니다.
 * 형식: `<...>/storage/v1/object/public/<bucket>/<path>`
 */
export function urlToStoragePath(
  publicUrl: string,
  bucket: string,
): string | null {
  try {
    const u = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(u.pathname.slice(idx + marker.length));
  } catch {
    return null;
  }
}
