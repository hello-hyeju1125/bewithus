import { z } from "zod";

export const optionalHexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "색상은 #RRGGBB 형식으로 입력하세요.")
  .optional()
  .or(z.literal(""));

export function normalizeHexColor(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed;
}

/** 관리자 태그 색 기본값 (accent / primary norm) */
export const DEFAULT_TAG_BG_COLOR = "#FFF33B";
export const DEFAULT_TAG_TEXT_COLOR = "#22295D";
