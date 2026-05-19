import type { TiptapJSON } from "@/types/database";

/** 기존 plain text 설명 → Tiptap 문서 */
export function plainTextToTiptap(text: string): TiptapJSON {
  const trimmed = text.trim();
  if (!trimmed) return { type: "doc", content: [] };

  const lines = trimmed.split(/\r?\n/);
  return {
    type: "doc",
    content: lines.map((line) => ({
      type: "paragraph",
      content: line
        ? [{ type: "text", text: line }]
        : [],
    })),
  };
}

function collectText(node: TiptapJSON): string {
  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }
  if (!node.content?.length) return "";
  return node.content.map(collectText).join("");
}

/** Tiptap JSON → plain text (목록·검색용 `description` 컬럼) */
export function tiptapToPlainText(json: TiptapJSON | null | undefined): string {
  if (!json?.content?.length) return "";
  const blocks = json.content.map((block) => collectText(block).trim());
  return blocks.filter(Boolean).join("\n").trim();
}

export function isEmptyTiptapDoc(json: TiptapJSON | null | undefined): boolean {
  return !json?.content?.length || tiptapToPlainText(json).length === 0;
}

/** DB 레코드 → 에디터 초기값 */
export function infoSessionDescriptionToTiptap(session: {
  description_json?: TiptapJSON | null;
  description?: string | null;
}): TiptapJSON | null {
  const json = session.description_json;
  if (json && !isEmptyTiptapDoc(json)) return json;
  if (session.description?.trim()) {
    return plainTextToTiptap(session.description);
  }
  return null;
}
