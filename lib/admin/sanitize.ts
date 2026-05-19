import "server-only";

import { generateHTML } from "@tiptap/html";
import { type Extensions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import { sanitizePostHtml } from "@/lib/html-sanitize";
import type { TiptapJSON } from "@/types/database";

export { sanitizePostHtml } from "@/lib/html-sanitize";

/**
 * 서버 측 Tiptap 직렬화. HTML sanitize 는 `@/lib/html-sanitize` 를 사용하세요.
 */

const TIPTAP_EXTENSIONS: Extensions = [
  StarterKit,
  Underline,
  TextStyle,
  Color,
  FontFamily,
  FontSize,
  TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image.configure({ inline: false, allowBase64: false }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
];

/** Tiptap JSON → 정제되지 않은 HTML. */
export function tiptapJsonToHtml(json: TiptapJSON): string {
  try {
    return generateHTML(json, TIPTAP_EXTENSIONS);
  } catch (e) {
    console.error("[tiptapJsonToHtml]", e);
    return "";
  }
}

/**
 * Tiptap JSON 을 서버에서 한 번에 HTML 로 직렬화하고 sanitize 합니다.
 * `posts.content_html` / `info_sessions.description_html` 저장 직전에 호출하세요.
 */
export function buildSafePostHtml(json: TiptapJSON): string {
  return sanitizePostHtml(tiptapJsonToHtml(json));
}
