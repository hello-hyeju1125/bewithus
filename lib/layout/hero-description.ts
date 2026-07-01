/**
 * SubPageHero 설명문 — 3단 계층(lead / body / closing) + 키워드 강조.
 */

export type HeroDescriptionStructured = {
  /** 1행 헤드라인 */
  lead?: string;
  /** 중간 본문 (0~n줄) */
  body?: readonly string[];
  /** 마지막 클로징 문장 */
  closing?: string;
  /** lead·body 없이 전 행을 클로징 스타일로 렌더 */
  closingLines?: readonly string[];
  /** 강조할 키워드 (1~2개 권장) */
  emphasis?: readonly string[];
  /** sm 미만 뷰포트 전용 줄바꿈 (미지정 시 데스크톱과 동일) */
  mobile?: {
    closingLines?: readonly string[];
  };
};

export type HeroDescriptionInput = string | HeroDescriptionStructured;

export function isHeroDescriptionStructured(
  value: HeroDescriptionInput,
): value is HeroDescriptionStructured {
  return typeof value === "object" && value !== null;
}

/** 문자열(\n 구분) 또는 구조화 객체를 렌더용 형태로 통일 */
export function normalizeHeroDescription(
  input: HeroDescriptionInput,
): HeroDescriptionStructured | null {
  if (typeof input === "object") {
    const closingLines = input.closingLines
      ?.map((line) => line.trim())
      .filter(Boolean);
    if (closingLines?.length) {
      return {
        closingLines,
        emphasis: input.emphasis,
        mobile: input.mobile,
      };
    }

    const lead = input.lead?.trim() ?? "";
    const body = input.body?.map((line) => line.trim()).filter(Boolean);
    const closing = input.closing?.trim();
    if (!lead && !body?.length && !closing) return null;
    return {
      lead,
      body,
      closing: closing || undefined,
      emphasis: input.emphasis,
      mobile: input.mobile,
    };
  }

  const trimmed = input.trim();
  if (!trimmed) return null;

  const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length === 1) {
    return { lead: "", body: [lines[0]] };
  }
  if (lines.length === 2) {
    return { lead: lines[0], body: [lines[1]] };
  }
  return {
    lead: lines[0],
    body: lines.slice(1, -1),
    closing: lines[lines.length - 1],
  };
}

/** SEO metadata 등 평문이 필요할 때 */
export function heroDescriptionToPlainText(input: HeroDescriptionInput): string {
  const normalized = normalizeHeroDescription(input);
  if (!normalized) return "";

  if (normalized.closingLines?.length) {
    return normalized.closingLines.join(" ");
  }

  return [normalized.lead, ...(normalized.body ?? []), normalized.closing]
    .filter(Boolean)
    .join(" ");
}

/** 단일 문단(구 계층 없음) 여부 */
export function isSimpleHeroDescription(
  normalized: HeroDescriptionStructured,
): boolean {
  if (normalized.closingLines?.length) return false;

  return (
    !normalized.lead &&
    !normalized.closing &&
    (normalized.body?.length ?? 0) === 1
  );
}
