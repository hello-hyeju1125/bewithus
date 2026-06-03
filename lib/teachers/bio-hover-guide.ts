/**
 * 강사 카드 호버 소개 영역 — `TeacherCardList` 데스크톱(md+) 중간 박스 기준.
 *
 * - 사진 최대 138px × 4:5 → 중간 박스 높이 약 178px
 * - 오버레이 패딩·15px/line-height 1.65 → 세로 약 6줄
 * - lg 5열 그리드 좁은 카드 → 가로 한 줄 약 12~14자(한글)
 */
export const TEACHER_BIO_HOVER_RECOMMENDED_CHARS = 90;
export const TEACHER_BIO_HOVER_RECOMMENDED_LINES = 6;
export const TEACHER_BIO_HOVER_CHARS_PER_LINE_HINT = 14;

export function countTeacherBioLines(bio: string): number {
  const trimmed = bio.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\r?\n/).length;
}

export type TeacherBioHoverGuideStatus = {
  charCount: number;
  lineCount: number;
  withinRecommended: boolean;
};

export function getTeacherBioHoverGuideStatus(
  bio: string,
): TeacherBioHoverGuideStatus {
  const trimmed = bio.trim();
  const charCount = trimmed.length;
  const lineCount = countTeacherBioLines(bio);
  const withinRecommended =
    charCount <= TEACHER_BIO_HOVER_RECOMMENDED_CHARS &&
    lineCount <= TEACHER_BIO_HOVER_RECOMMENDED_LINES;

  return { charCount, lineCount, withinRecommended };
}

export const teacherBioHoverGuideCopy = {
  hint: `강사진 페이지(데스크톱) 카드에 마우스를 올렸을 때 소개가 스크롤 없이 보이도록, ${TEACHER_BIO_HOVER_RECOMMENDED_CHARS}자 이내·줄바꿈 ${TEACHER_BIO_HOVER_RECOMMENDED_LINES}줄 이내(한 줄 약 ${TEACHER_BIO_HOVER_CHARS_PER_LINE_HINT}자)를 권장합니다.`,
  overRecommended:
    "권장 분량을 넘었습니다. 실제 카드에서는 일부만 보이거나 스크롤이 생길 수 있습니다.",
  counter: (charCount: number, lineCount: number) =>
    `${charCount} / ${TEACHER_BIO_HOVER_RECOMMENDED_CHARS}자 · ${lineCount} / ${TEACHER_BIO_HOVER_RECOMMENDED_LINES}줄`,
} as const;
