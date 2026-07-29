/**
 * 강사 카드 프로필 사진 — 개별 프레이밍 조정.
 * 키: DB `teachers.name` (선생님 접미사 제외)
 *
 * 기본: object-contain + 하단 정렬
 * → Admin 원본 비율을 유지하고 어깨·팔이 잘리지 않음.
 * 남는 여백은 카드 배경색으로 통일.
 *
 * 이름별 오버라이드는 정말 필요한 경우만 추가.
 */
export type TeacherPhotoFrameOverride = {
  /** 사진 wrapper 높이 (%). 100 = 프레임과 동일, 클수록 확대(크롭) */
  scalePercent?: number;
  /** wrapper top offset (%). 음수 = 위로 */
  topPercent?: number;
  /**
   * wrapper 좌우 inset (%). 세로형 원본은 가로 기준으로 스케일되므로
   * 인물을 작게 보이려면 가로를 줄여야 함. 0 = 프레임 가로 꽉 참
   */
  insetXPercent?: number;
  /** CSS object-position — contain 기본은 center bottom */
  objectPosition?: string;
  /**
   * cover: 프레임 채움(넘치면 크롭) / contain: 원본 비율 유지(잘림 없음, 여백 가능)
   */
  objectFit?: "cover" | "contain";
};

const DEFAULT_FRAME: Required<TeacherPhotoFrameOverride> = {
  scalePercent: 100,
  topPercent: 0,
  insetXPercent: 0,
  objectPosition: "center bottom",
  objectFit: "contain",
};

/** 이름별 예외 — 기본 contain 하단 정렬로 부족한 경우만 */
const OVERRIDES_BY_NAME: Record<string, TeacherPhotoFrameOverride> = {};

export function normalizeTeacherNameKey(name: string): string {
  return name.replace(/선생님/g, "").trim();
}

export function resolveTeacherPhotoFrame(
  name: string,
): Required<TeacherPhotoFrameOverride> {
  const key = normalizeTeacherNameKey(name);
  const override = OVERRIDES_BY_NAME[key];
  if (!override) return DEFAULT_FRAME;
  return {
    scalePercent: override.scalePercent ?? DEFAULT_FRAME.scalePercent,
    topPercent: override.topPercent ?? DEFAULT_FRAME.topPercent,
    insetXPercent: override.insetXPercent ?? DEFAULT_FRAME.insetXPercent,
    objectPosition: override.objectPosition ?? DEFAULT_FRAME.objectPosition,
    objectFit: override.objectFit ?? DEFAULT_FRAME.objectFit,
  };
}
