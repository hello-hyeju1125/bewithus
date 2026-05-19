"use server";

import { requireAdmin } from "@/lib/admin/auth";
import {
  assertImageFile,
  inferExtension,
  uploadToStorage,
  UploadValidationError,
} from "@/lib/admin/storage";
import { createAdminClient } from "@/lib/supabase/admin";

export type UploadPostImageResult =
  | { ok: true; publicUrl: string; path: string; attachmentId: string | null }
  | { ok: false; error: string };

/**
 * 게시판 에디터에서 인라인 이미지를 업로드할 때 호출하는 Server Action.
 *
 * - 인증된 관리자만 실행 가능 (`requireAdmin`).
 * - `post_id` 가 주어지면 해당 게시글 폴더에, 없으면 `draft/` 폴더에 저장합니다.
 * - 성공 시 동시에 `post_attachments` 에 레코드를 남깁니다 (post_id 가 있을 때만).
 */
export async function uploadPostImageAction(
  formData: FormData,
): Promise<UploadPostImageResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "권한이 없습니다.",
    };
  }

  const file = formData.get("file");
  const postId = (formData.get("postId") as string) || null;

  if (!(file instanceof File)) {
    return { ok: false, error: "파일이 첨부되지 않았습니다." };
  }

  try {
    assertImageFile(file);
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof UploadValidationError
          ? e.message
          : "이미지 검증에 실패했습니다.",
    };
  }

  const ext = inferExtension(file);
  const uuid = crypto.randomUUID();
  const path = postId
    ? `${postId}/${uuid}.${ext}`
    : `draft/${uuid}.${ext}`;

  try {
    const { publicUrl } = await uploadToStorage({
      bucket: "post-images",
      path,
      file,
    });

    let attachmentId: string | null = null;
    if (postId) {
      const admin = createAdminClient();
      const insertPayload = {
        post_id: postId,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      };
      const { data, error } = await admin
        .from("post_attachments")
        .insert(insertPayload as never)
        .select("id")
        .maybeSingle();
      if (error) {
        console.error("[uploadPostImageAction:attachment]", error);
      } else if (data) {
        attachmentId = (data as unknown as { id: string }).id;
      }
    }

    return { ok: true, publicUrl, path, attachmentId };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "업로드 중 오류가 발생했습니다.",
    };
  }
}
