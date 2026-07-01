"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import RichTextEditor from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import type { Post, TiptapJSON } from "@/types/database";

import { createPostAction, updatePostAction } from "../actions";

type Props = { initial?: Post | null };

export default function PostForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState<TiptapJSON | null>(
    initial?.content ?? null,
  );
  const [isPinned, setIsPinned] = useState(initial?.is_pinned ?? false);
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setContent(initial.content);
    setIsPinned(initial.is_pinned);
    setIsPublished(initial.is_published);
    setError(null);
  }, [initial?.id, initial?.updated_at, initial]);

  function submit(publish: boolean) {
    setError(null);
    if (!title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }
    if (!content || !content.content || content.content.length === 0) {
      setError("본문을 입력하세요.");
      return;
    }
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("contentJson", JSON.stringify(content));
    if (isPinned) fd.set("is_pinned", "on");
    if (publish) fd.set("is_published", "on");

    startTransition(async () => {
      const res = initial
        ? await updatePostAction(initial.id, fd)
        : await createPostAction(fd);
      if (!res.ok) {
        setError(res.error);
        toast.error("저장 실패", { description: res.error });
        return;
      }
      toast.success(
        publish ? "게시되었습니다." : "임시저장되었습니다.",
      );
      if (initial) {
        router.refresh();
      } else {
        router.push("/admin/notice");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-card border border-neutral-200 bg-white p-5">
        <Label htmlFor="title" className="mb-1.5 block">
          제목
        </Label>
        <Input
          id="title"
          placeholder="공지사항 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-[16px]"
        />
      </div>

      <div>
        <Label className="mb-1.5 block">본문</Label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          postId={initial?.id ?? null}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-neutral-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <Switch
              id="is_pinned"
              checked={isPinned}
              onCheckedChange={setIsPinned}
            />
            <Label htmlFor="is_pinned">상단 고정</Label>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={pending}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsPublished(false);
              submit(false);
            }}
            disabled={pending}
          >
            임시 저장
          </Button>
          <Button
            type="button"
            onClick={() => {
              setIsPublished(true);
              submit(true);
            }}
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            {initial ? "수정 게시" : "발행"}
          </Button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-button border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700"
        >
          {error}
        </p>
      ) : null}

      {/* isPublished 는 toggle 상태일 뿐 실제 발행은 submit 시점에서 결정됩니다. */}
      <span className="hidden">{String(isPublished)}</span>
    </div>
  );
}
