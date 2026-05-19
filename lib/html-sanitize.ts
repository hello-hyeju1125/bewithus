import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "code",
  "pre",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "span",
  "div",
  "hr",
];

const ALLOWED_ATTR = [
  "href",
  "src",
  "alt",
  "title",
  "rel",
  "target",
  "style",
  "class",
  "colspan",
  "rowspan",
  "data-text-align",
];

const ALLOWED_STYLE_PROPERTIES = new Set([
  "color",
  "background-color",
  "font-size",
  "font-family",
  "text-align",
]);

/**
 * 리치 텍스트 HTML sanitize (서버·클라이언트 공용).
 * DB 저장 전·렌더 직전 모두에서 사용 가능합니다.
 */
export function sanitizePostHtml(html: string): string {
  if (!html) return "";

  DOMPurify.removeAllHooks();
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      const href = node.getAttribute("href") || "";
      if (/^https?:/i.test(href)) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    }
    if (node.hasAttribute && node.hasAttribute("style")) {
      const style = node.getAttribute("style") || "";
      const filtered = style
        .split(";")
        .map((decl) => decl.trim())
        .filter(Boolean)
        .filter((decl) => {
          const [prop] = decl.split(":");
          return ALLOWED_STYLE_PROPERTIES.has((prop || "").trim().toLowerCase());
        })
        .join("; ");
      if (filtered) node.setAttribute("style", filtered);
      else node.removeAttribute("style");
    }
  });

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    ALLOW_DATA_ATTR: false,
  });
}
