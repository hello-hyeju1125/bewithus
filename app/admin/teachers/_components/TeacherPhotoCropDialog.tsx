"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Loader2 } from "lucide-react";
import "react-easy-crop/react-easy-crop.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getCroppedImageBlob } from "@/lib/teachers/crop-image";

/** 공개 강사진 카드와 동일한 세로 비율 */
export const TEACHER_PHOTO_CROP_ASPECT = 4 / 5;

/** 1 미만이면 사진이 프레임보다 작아집니다(여백은 투명으로 저장) */
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;

type TeacherPhotoCropDialogProps = {
  open: boolean;
  imageSrc: string | null;
  onOpenChange: (open: boolean) => void;
  onComplete: (file: File, previewUrl: string) => void;
};

export default function TeacherPhotoCropDialog({
  open,
  imageSrc,
  onOpenChange,
  onComplete,
}: TeacherPhotoCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
    setBusy(false);
  }, [open, imageSrc]);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  /** 슬라이더 확대/축소는 프레임 중앙을 기준으로 동작하도록 위치도 같은 비율로 줄입니다 */
  function handleZoomInput(next: number) {
    const ratio = zoom > 0 ? next / zoom : 1;
    setCrop((prev) => ({ x: prev.x * ratio, y: prev.y * ratio }));
    setZoom(next);
  }

  function handleReset() {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function handleApply() {
    if (!imageSrc || !croppedAreaPixels) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      const file = new File([blob], `teacher-photo-${Date.now()}.png`, {
        type: "image/png",
      });
      const previewUrl = URL.createObjectURL(blob);
      onComplete(file, previewUrl);
      onOpenChange(false);
    } catch (e) {
      console.error("[TeacherPhotoCropDialog]", e);
      setError(
        e instanceof Error
          ? e.message
          : "크롭에 실패했습니다. 다른 이미지로 다시 시도해 주세요.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-4 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>프로필 사진 조정</DialogTitle>
          <DialogDescription>
            공개 강사진 카드와 같은 4:5 비율로 자릅니다. 드래그로 위치를, 슬라이더로
            확대·축소를 조절하세요. 1.0× 아래로 내리면 사진 전체가 프레임 안에 들어갑니다.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[360px] w-full overflow-hidden rounded-card bg-neutral-100 sm:h-[420px]">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={TEACHER_PHOTO_CROP_ASPECT}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              // 1.0× 미만에서는 사진이 프레임보다 작아지므로 위치 제한을 풀어야 중앙에 놓입니다
              restrictPosition={zoom >= 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
              showGrid
              classes={{
                containerClassName: "bg-neutral-100",
                mediaClassName: "",
              }}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="teacher-photo-zoom" className="shrink-0 text-[13px]">
              확대 / 축소
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-[12px] tabular-nums text-neutral-500">
                {zoom.toFixed(2)}×
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-button px-2 py-1 text-[12px] text-neutral-600 underline-offset-2 hover:underline"
              >
                초기화
              </button>
            </div>
          </div>
          <input
            id="teacher-photo-zoom"
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => handleZoomInput(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-primary"
          />
          <p className="text-[12px] text-neutral-500">
            잘린 영역이 저장됩니다. 1.0× 미만으로 축소하면 프레임의 남는 부분은 투명하게
            저장되어 카드 배경색이 비칩니다.
          </p>
        </div>

        {error ? (
          <p className="rounded-button border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {error}
          </p>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={() => void handleApply()}
            disabled={busy || !croppedAreaPixels}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            적용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
