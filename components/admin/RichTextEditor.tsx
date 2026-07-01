"use client";

import * as React from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Strikethrough,
  TableIcon,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";

import { uploadPostImageAction } from "@/lib/admin/upload-actions";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import type { TiptapJSON } from "@/types/database";

const FONT_SIZES = [
  { label: "작게", value: "12px" },
  { label: "보통", value: "16px" },
  { label: "크게", value: "22px" },
] as const;

const IMAGE_WIDTHS = [
  { label: "S", value: "25%" },
  { label: "M", value: "50%" },
  { label: "L", value: "75%" },
  { label: "전체", value: "100%" },
] as const;

type RichTextEditorProps = {
  value: TiptapJSON | null;
  onChange: (json: TiptapJSON) => void;
  postId?: string | null;
  placeholder?: string;
  /** 설명회 등 짧은 본문용 — 에디터 최소 높이 축소 */
  compact?: boolean;
};

/**
 * 관리자 게시판에서 사용하는 Tiptap 기반 리치 에디터.
 *
 * 기능
 *  - 글자 크기 (작게/보통/크게) · 글자 색 · 굵게/기울임/밑줄/취소선
 *  - 정렬 (좌/중/우/양쪽) · 순서/비순서 목록 · 인용구
 *  - 링크 · 이미지 (업로드 + DnD) · 이미지 크기 조정 · 표
 *  - Undo / Redo
 *
 * 이미지 업로드는 `uploadPostImageAction` Server Action 으로 위임하며,
 * 클라이언트에는 Service Role Key 가 노출되지 않습니다.
 */
export default function RichTextEditor({
  value,
  onChange,
  postId,
  placeholder,
  compact = false,
}: RichTextEditorProps) {
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{
    current: number;
    total: number;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              parseHTML: (el) =>
                (el as HTMLElement).style.width ||
                el.getAttribute("width") ||
                null,
              renderHTML: (attrs: { width?: string | null }) =>
                attrs.width ? { style: `width: ${attrs.width}` } : {},
            },
          };
        },
      }).configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: false, HTMLAttributes: { class: "border-collapse" } }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: placeholder ?? "본문을 입력하세요…",
      }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        class: compact
          ? "tiptap focus:outline-none min-h-[180px] px-4 py-3 text-[15px] leading-relaxed text-neutral-800 [&_h2]:mt-4 [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mt-3 [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:text-primary [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-100 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-600 [&_img]:rounded-card [&_img]:my-2 [&_table]:my-3 [&_table]:w-full [&_th]:border [&_th]:border-neutral-200 [&_th]:bg-neutral-50 [&_th]:p-2 [&_td]:border [&_td]:border-neutral-200 [&_td]:p-2"
          : "tiptap focus:outline-none min-h-[360px] px-4 py-3 text-[15px] leading-relaxed text-neutral-800 [&_h2]:mt-5 [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mt-4 [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:text-primary [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-100 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-600 [&_img]:rounded-card [&_img]:my-2 [&_table]:my-3 [&_table]:w-full [&_th]:border [&_th]:border-neutral-200 [&_th]:bg-neutral-50 [&_th]:p-2 [&_td]:border [&_td]:border-neutral-200 [&_td]:p-2",
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (files.length === 0) return false;
        event.preventDefault();
        void uploadFiles(files);
        return true;
      },
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const files = items
          .filter((i) => i.kind === "file" && i.type.startsWith("image/"))
          .map((i) => i.getAsFile())
          .filter((f): f is File => !!f);
        if (files.length === 0) return false;
        event.preventDefault();
        void uploadFiles(files);
        return true;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON() as TiptapJSON);
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    // 외부에서 value 가 바뀐 경우(예: 기존 글 로드) 에디터에 반영. 사용자 입력
    // 중 onChange 로 부모 상태가 갱신될 때마다 setContent 가 호출되면 커서가
    // 깨지므로, 같은 객체 참조일 때는 무시합니다.
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(value ?? null)) {
      editor.commands.setContent(value ?? "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  async function uploadFiles(files: File[]) {
    if (!editor) return;
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    try {
      for (let i = 0; i < files.length; i += 1) {
        setUploadProgress({ current: i + 1, total: files.length });
        const file = files[i];
        const fd = new FormData();
        fd.set("file", file);
        if (postId) fd.set("postId", postId);
        const res = await uploadPostImageAction(fd);
        if (!res.ok) {
          toast.error("이미지 업로드 실패", { description: res.error });
          continue;
        }
        editor
          .chain()
          .focus()
          .setImage({ src: res.publicUrl, alt: file.name })
          .createParagraphNear()
          .run();
      }
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  function onChooseFile() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    void uploadFiles(files);
  }

  if (!editor) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-card border border-neutral-200 bg-neutral-50 text-[13px] text-neutral-400",
          compact ? "min-h-[240px]" : "min-h-[420px]",
        )}
      >
        에디터를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
      <Toolbar
        editor={editor}
        onChooseFile={onChooseFile}
        uploading={uploading}
      />

      <div className="relative">
        <EditorContent editor={editor} />

        {uploading && uploadProgress ? (
          <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-2 rounded-button bg-primary px-3 py-1.5 text-[12px] font-semibold text-white shadow-md">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            이미지 업로드 중 {uploadProgress.current}/{uploadProgress.total}
          </div>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function ToolbarButton({
  active,
  onClick,
  disabled,
  ariaLabel,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={!!active}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-[6px] px-2 text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? "bg-primary text-white"
          : "bg-white text-neutral-700 hover:bg-neutral-100 hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px bg-neutral-200" />;
}

function Toolbar({
  editor,
  onChooseFile,
  uploading,
}: {
  editor: Editor;
  onChooseFile: () => void;
  uploading: boolean;
}) {
  const [color, setColor] = React.useState<string>("#22295D");
  const currentFontSize: string | null =
    (editor.getAttributes("textStyle") as { fontSize?: string }).fontSize ??
    null;

  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt("링크 URL", previous ?? "https://");
    if (input === null) return;
    if (input.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: input.trim() })
      .run();
  }

  function setImageWidth(width: string) {
    if (!editor.isActive("image")) {
      toast("이미지 노드를 먼저 선택하세요.");
      return;
    }
    editor.chain().focus().updateAttributes("image", { width }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-2 py-2">
      <ToolbarButton
        ariaLabel="실행 취소"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="다시 실행"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarDivider />

      <select
        aria-label="글자 크기"
        value={currentFontSize ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(v).run();
          }
        }}
        className="h-8 rounded-[6px] border border-neutral-200 bg-white px-2 text-[12px] font-semibold text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option value="">크기</option>
        {FONT_SIZES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label} ({s.value})
          </option>
        ))}
      </select>

      <label className="ml-1 inline-flex h-8 items-center gap-1 rounded-[6px] border border-neutral-200 bg-white px-2 text-[12px] font-semibold text-neutral-700">
        <span aria-hidden="true">색</span>
        <input
          type="color"
          aria-label="글자 색상"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
        />
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="text-[11px] text-neutral-500 hover:text-primary"
          aria-label="색상 해제"
        >
          ×
        </button>
      </label>

      <ToolbarDivider />

      <ToolbarButton
        ariaLabel="굵게"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="기울임"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="밑줄"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="취소선"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        ariaLabel="왼쪽 정렬"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="가운데 정렬"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="오른쪽 정렬"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="양쪽 정렬"
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        ariaLabel="순서 없는 목록"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="순서 있는 목록"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="인용구"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton ariaLabel="링크 삽입" onClick={setLink}>
        <LinkIcon className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="링크 해제"
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Unlink className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarButton
        ariaLabel="이미지 업로드"
        onClick={onChooseFile}
        disabled={uploading}
      >
        <ImageIcon className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarButton
        ariaLabel="표 삽입"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      {editor.isActive("image") ? (
        <>
          <ToolbarDivider />
          <span className="text-[11px] font-semibold text-neutral-500">
            이미지 크기
          </span>
          {IMAGE_WIDTHS.map((w) => (
            <button
              key={w.value}
              type="button"
              onClick={() => setImageWidth(w.value)}
              className="h-8 rounded-[6px] border border-neutral-200 bg-white px-2 text-[12px] font-semibold text-neutral-700 outline-none transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              {w.label}
            </button>
          ))}
        </>
      ) : null}
    </div>
  );
}
