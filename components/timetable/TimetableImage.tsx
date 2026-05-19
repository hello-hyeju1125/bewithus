import Image from "next/image";
import { CalendarClock, ImageOff } from "lucide-react";

import type { Timetable } from "@/types/database";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

type TimetableImageProps = {
  data: Timetable | null;
  alt: string;
};

/**
 * 시간표 이미지 영역.
 *
 * - 실제 이미지가 비어 있거나(`image_url === ""`) 데이터가 없으면 "준비 중"
 *   플레이스홀더를 렌더합니다.
 * - 이미지는 Supabase Storage 의 public URL 이며 `next/image` 로 최적화됩니다.
 */
export default function TimetableImage({ data, alt }: TimetableImageProps) {
  const hasImage = !!data?.image_url;

  return (
    <figure className="overflow-hidden rounded-hero border border-neutral-200 bg-neutral-50">
      {hasImage ? (
        <div className="relative w-full">
          <Image
            src={data!.image_url}
            alt={alt}
            width={1600}
            height={2200}
            sizes="(min-width: 1024px) 960px, (min-width: 640px) 90vw, 100vw"
            className="block h-auto w-full"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-neutral-50 text-neutral-500">
          <ImageOff className="h-12 w-12" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-[16px] font-semibold">
            시간표를 준비 중입니다.
          </p>
          <p className="text-[13px] text-neutral-400">
            업데이트 완료 시 이 자리에 표시됩니다.
          </p>
        </div>
      )}
      <figcaption className="flex items-center gap-1.5 border-t border-neutral-200 bg-white px-4 py-3 text-[13px] text-neutral-500">
        <CalendarClock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        <span>
          마지막 업데이트:{" "}
          <strong className="font-semibold text-neutral-700">
            {data ? formatDate(data.updated_at) : "—"}
          </strong>
        </span>
      </figcaption>
    </figure>
  );
}
