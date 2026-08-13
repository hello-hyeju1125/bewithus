/** Admin 강사 사진 크롭 — canvas로 4:5 결과 Blob 생성 */

export type CropAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    // 동일 출처 object URL / 허용된 원격 이미지
    if (!src.startsWith("blob:") && !src.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.src = src;
  });
}

/**
 * react-easy-crop 의 croppedAreaPixels 로 PNG Blob 을 만듭니다.
 * JPEG 는 투명을 지원하지 않아 컷아웃 배경이 검게 바뀌므로 PNG 를 기본으로 둡니다.
 * 공개 카드 4:5 영역에 맞게 최대 긴 변을 제한합니다.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  crop: CropAreaPixels,
  options?: { maxEdge?: number; mimeType?: string; quality?: number },
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const maxEdge = options?.maxEdge ?? 1500;
  const mimeType = options?.mimeType ?? "image/png";
  const quality = options?.quality ?? 0.92;
  const isJpeg = mimeType === "image/jpeg" || mimeType === "image/jpg";

  const scale = Math.min(1, maxEdge / Math.max(crop.width, crop.height));
  const outputWidth = Math.max(1, Math.round(crop.width * scale));
  const outputHeight = Math.max(1, Math.round(crop.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d", { alpha: !isJpeg });
  if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");

  // JPEG 는 투명 → 검정으로 떨어지므로 카드 배경색으로 먼저 채움
  if (isJpeg) {
    ctx.fillStyle = "#F5F5F5";
    ctx.fillRect(0, 0, outputWidth, outputHeight);
  } else {
    ctx.clearRect(0, 0, outputWidth, outputHeight);
  }

  // 1.0× 미만으로 축소하면 크롭 영역이 원본 밖으로 나갈 수 있으므로
  // 실제 겹치는 부분만 잘라 같은 비율의 위치에 그립니다(나머지는 투명/배경색).
  const sourceX = Math.max(0, crop.x);
  const sourceY = Math.max(0, crop.y);
  const sourceWidth = Math.min(image.naturalWidth, crop.x + crop.width) - sourceX;
  const sourceHeight = Math.min(image.naturalHeight, crop.y + crop.height) - sourceY;

  if (sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error("사진이 자를 영역 밖에 있습니다. 위치를 조정해 주세요.");
  }

  const scaleX = outputWidth / crop.width;
  const scaleY = outputHeight / crop.height;

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    (sourceX - crop.x) * scaleX,
    (sourceY - crop.y) * scaleY,
    sourceWidth * scaleX,
    sourceHeight * scaleY,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("이미지 변환에 실패했습니다."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      isJpeg ? quality : undefined,
    );
  });
}
