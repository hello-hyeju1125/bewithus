"use server";

import { revalidatePath } from "next/cache";

import { getAdminAuthorId, requireAdminSession } from "@/lib/admin/auth";
import { postFormSchema } from "@/lib/admin/schemas";
import { buildSafePostHtml } from "@/lib/admin/sanitize";
import { adminGetPost } from "@/lib/admin/queries";
import {
  removeFromStorage,
  urlToStoragePath,
} from "@/lib/admin/storage";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TiptapJSON } from "@/types/database";

import type { ActionResult } from "../timetable/actions";

function parseForm(formData: FormData) {
  return postFormSchema.safeParse({
    title: formData.get("title"),
    contentJson: formData.get("contentJson"),
    is_pinned: formData.get("is_pinned") === "on",
    is_published: formData.get("is_published") === "on",
  });
}

export async function createPostAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdminSession();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  let authorId: string;
  try {
    authorId = getAdminAuthorId();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  let contentJson: TiptapJSON;
  try {
    contentJson = JSON.parse(parsed.data.contentJson) as TiptapJSON;
  } catch {
    return { ok: false, error: "에디터 본문을 해석할 수 없습니다." };
  }
  const contentHtml = buildSafePostHtml(contentJson);

  const admin = createAdminClient();
  const insertPayload = {
    title: parsed.data.title,
    content: contentJson,
    content_html: contentHtml,
    author_id: authorId,
    is_pinned: parsed.data.is_pinned,
    is_published: parsed.data.is_published,
  };
  const { data, error } = await admin
    .from("posts")
    .insert(insertPayload as never)
    .select("id")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  revalidatePath("/notice");
  revalidatePath("/admin/notice");
  return {
    ok: true,
    data: { id: (data as unknown as { id: string } | null)?.id ?? "" },
  };
}

export async function updatePostAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const existing = await adminGetPost(id);
  if (!existing) return { ok: false, error: "게시글이 존재하지 않습니다." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  let contentJson: TiptapJSON;
  try {
    contentJson = JSON.parse(parsed.data.contentJson) as TiptapJSON;
  } catch {
    return { ok: false, error: "에디터 본문을 해석할 수 없습니다." };
  }
  const contentHtml = buildSafePostHtml(contentJson);

  const admin = createAdminClient();
  const updatePayload = {
    title: parsed.data.title,
    content: contentJson,
    content_html: contentHtml,
    is_pinned: parsed.data.is_pinned,
    is_published: parsed.data.is_published,
  };
  const { error } = await admin
    .from("posts")
    .update(updatePayload as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/notice");
  revalidatePath(`/notice/${id}`);
  revalidatePath("/admin/notice");
  return { ok: true };
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const existing = await adminGetPost(id);
  if (!existing) return { ok: false, error: "이미 삭제되었습니다." };

  const admin = createAdminClient();

  // 1) 첨부 이미지 목록을 미리 조회.
  const { data: attachments } = await admin
    .from("post_attachments")
    .select("file_url")
    .eq("post_id", id);
  const paths =
    ((attachments as unknown as { file_url: string }[] | null) ?? [])
      .map((a) => urlToStoragePath(a.file_url, "post-images"))
      .filter((p): p is string => !!p);

  // 2) 게시글 삭제 (cascade 로 post_attachments 도 함께 삭제됨).
  const { error } = await admin.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  // 3) Storage 파일 정리.
  if (paths.length > 0) {
    await removeFromStorage({ bucket: "post-images", paths });
  }

  revalidatePath("/notice");
  revalidatePath("/admin/notice");
  return { ok: true };
}

export async function togglePostPublishedAction(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("posts")
    .update({ is_published: published } as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/notice");
  revalidatePath("/admin/notice");
  return { ok: true };
}

export async function togglePostPinnedAction(
  id: string,
  pinned: boolean,
): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("posts")
    .update({ is_pinned: pinned } as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/notice");
  revalidatePath("/admin/notice");
  return { ok: true };
}
