export type DomPurifyLike = {
  sanitize: (dirty: string, config?: Record<string, unknown>) => string;
  removeAllHooks: () => void;
  addHook: (...args: unknown[]) => void;
};

type DomPurifyInstance = DomPurifyLike;

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
] as const;

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
] as const;

const ALLOWED_STYLE_PROPERTIES = new Set([
  "color",
  "background-color",
  "font-size",
  "font-family",
  "text-align",
]);

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [...ALLOWED_TAGS],
  ALLOWED_ATTR: [...ALLOWED_ATTR],
  FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  ALLOW_DATA_ATTR: false,
};

let domPurifyLoader: Promise<DomPurifyInstance | null> | undefined;

/** Vercel/Lambda 에서 jsdom 번들 오류를 피하기 위해 lazy load */
function loadDomPurify(): Promise<DomPurifyInstance | null> {
  if (!domPurifyLoader) {
    domPurifyLoader = import("isomorphic-dompurify")
      .then((mod) => mod.default as DomPurifyInstance)
      .catch((error) => {
        console.error("[sanitizePostHtml] DOMPurify load failed", error);
        return null;
      });
  }
  return domPurifyLoader;
}

function configureDomPurify(DOMPurify: DomPurifyInstance) {
  DOMPurify.removeAllHooks();
  DOMPurify.addHook("afterSanitizeAttributes", (node: Element) => {
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
}

/**
 * 리치 텍스트 HTML sanitize.
 * 동기 require 를 우선 사용하고, 실패 시 dynamic import 를 시도합니다.
 */
export async function sanitizePostHtmlAsync(html: string): Promise<string> {
  return sanitizePostHtmlForDisplay(html);
}

/**
 * 공개 SSR·저장 파이프라인용 HTML 정제.
 * Vercel Lambda 에서 DOMPurify 로드가 실패해도 본문이 비지 않도록,
 * 정제 결과가 비어 있으면 관리자가 저장한 HTML 을 그대로 사용합니다.
 */
export async function sanitizePostHtmlForDisplay(html: string): Promise<string> {
  const trimmed = html.trim();
  if (!trimmed) return "";

  const synced = sanitizePostHtml(trimmed);
  if (synced.trim()) return synced;

  const DOMPurify = await loadDomPurify();
  if (DOMPurify) {
    configureDomPurify(DOMPurify);
    const asyncSanitized = DOMPurify.sanitize(trimmed, SANITIZE_CONFIG);
    if (asyncSanitized.trim()) return asyncSanitized;
  }

  console.warn(
    "[sanitizePostHtmlForDisplay] DOMPurify unavailable, using stored HTML",
  );
  return trimmed;
}

/**
 * 동기 sanitize — 클라이언트 등 DOMPurify 가 이미 로드된 환경용.
 * 서버에서는 `sanitizePostHtmlAsync` 를 사용하세요.
 */
export function sanitizePostHtmlWithPurify(
  DOMPurify: DomPurifyInstance,
  html: string,
): string {
  if (!html) return "";
  configureDomPurify(DOMPurify);
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

/** @deprecated 서버 SSR 에서는 sanitizePostHtmlAsync 사용 권장 */
export function sanitizePostHtml(html: string): string {
  if (!html) return "";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DOMPurify = require("isomorphic-dompurify")
      .default as DomPurifyInstance;
    return sanitizePostHtmlWithPurify(DOMPurify, html);
  } catch (error) {
    console.error("[sanitizePostHtml]", error);
    return "";
  }
}
