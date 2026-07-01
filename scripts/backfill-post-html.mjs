/**
 * posts.content_html / info_sessions.description_html 백필 스크립트.
 * `@tiptap/html` (browser) → `@tiptap/html/server` 수정 전 저장된 빈 HTML 을 복구합니다.
 *
 * Usage: export $(grep -v '^#' .env.local | xargs) && node scripts/backfill-post-html.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import DOMPurify from "isomorphic-dompurify";

const extensions = [
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

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "code", "pre", "blockquote",
  "h1", "h2", "h3", "h4", "ul", "ol", "li", "a", "img", "table",
  "thead", "tbody", "tr", "th", "td", "span", "div", "hr",
];
const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "rel", "target", "style", "class",
  "colspan", "rowspan", "data-text-align",
];

function buildSafeHtml(json) {
  if (!json) return "";
  const raw = generateHTML(json, extensions);
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    ALLOW_DATA_ATTR: false,
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const { data: posts, error: postsErr } = await supabase
  .from("posts")
  .select("id, title, content, content_html");
if (postsErr) throw postsErr;

let postUpdates = 0;
for (const post of posts ?? []) {
  if (post.content_html?.trim()) continue;
  const html = buildSafeHtml(post.content);
  if (!html) {
    console.warn(`[posts] skip empty: ${post.id} ${post.title}`);
    continue;
  }
  const { error } = await supabase
    .from("posts")
    .update({ content_html: html })
    .eq("id", post.id);
  if (error) throw error;
  postUpdates += 1;
  console.log(`[posts] updated ${post.id} (${html.length} chars)`);
}

const { data: sessions, error: sessionsErr } = await supabase
  .from("info_sessions")
  .select("id, title, description_json, description_html");
if (sessionsErr) throw sessionsErr;

let sessionUpdates = 0;
for (const session of sessions ?? []) {
  if (session.description_html?.trim()) continue;
  if (!session.description_json) continue;
  let html = "";
  try {
    html = buildSafeHtml(session.description_json);
  } catch (error) {
    console.warn(`[info_sessions] skip ${session.id}:`, error);
    continue;
  }
  if (!html) continue;
  const { error } = await supabase
    .from("info_sessions")
    .update({ description_html: html })
    .eq("id", session.id);
  if (error) throw error;
  sessionUpdates += 1;
  console.log(`[info_sessions] updated ${session.id} (${html.length} chars)`);
}

console.log(`Done. posts=${postUpdates}, info_sessions=${sessionUpdates}`);
