/**
 * 강사 카드 프로필 사진 — 개별 프레이밍 조정.
 * 키: DB `teachers.name` (선생님 접미사 제외)
 */
export type TeacherPhotoFrameOverride = {
  /** 사진 wrapper 높이 (%). 기본 112 */
  scalePercent?: number;
  /** wrapper top offset (%). 음수 = 위로 */
  topPercent?: number;
  /** CSS object-position */
  objectPosition?: string;
};

const DEFAULT_FRAME: Required<TeacherPhotoFrameOverride> = {
  scalePercent: 112,
  topPercent: 0,
  objectPosition: "center 18%",
};

/** 확대 + 약간 위로 */
const ZOOM_UP_FRAME: TeacherPhotoFrameOverride = {
  scalePercent: 128,
  topPercent: -5,
  objectPosition: "center 10%",
};

/** 축소 — 하체·손 노출 */
const ZOOM_OUT_FRAME: TeacherPhotoFrameOverride = {
  scalePercent: 88,
  topPercent: 12,
  objectPosition: "center 50%",
};

const OVERRIDES_BY_NAME: Record<string, TeacherPhotoFrameOverride> = {
  김경숙: ZOOM_UP_FRAME,
  이치옥: ZOOM_UP_FRAME,
  홍영아: ZOOM_UP_FRAME,
  이재령: ZOOM_OUT_FRAME,
};

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
    objectPosition: override.objectPosition ?? DEFAULT_FRAME.objectPosition,
  };
}
