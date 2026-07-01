"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { useState } from "react";

import type { LocationCampus } from "@/content/location";

/** 관별 지도 PNG 공통 해상도 (1858×1216) */
const MAP_IMAGE_WIDTH = 1858;
const MAP_IMAGE_HEIGHT = 1216;

type LocationCampusMapPreviewProps = {
  campus: LocationCampus;
};

export default function LocationCampusMapPreview({
  campus,
}: LocationCampusMapPreviewProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href={campus.naverMapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`${campus.name} — 네이버 지도에서 위치 보기`}
    >
      {!imageError ? (
        <Image
          src={campus.mapImageSrc}
          alt={`${campus.name} 위치 지도`}
          width={MAP_IMAGE_WIDTH}
          height={MAP_IMAGE_HEIGHT}
          unoptimized
          sizes="(min-width: 1024px) min(100%, 960px), 100vw"
          className="block h-auto w-full transition-opacity duration-200 group-hover:opacity-95"
          onError={() => setImageError(true)}
          priority
        />
      ) : (
        <div className="flex aspect-[1858/1216] w-full flex-col items-center justify-center gap-3 bg-neutral-100 px-6 text-center">
          <MapPin
            className="h-12 w-12 text-primary/40"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-[15px] font-bold text-primary">{campus.name}</p>
          <p className="text-[13px] text-neutral-600">{campus.address}</p>
          <p className="text-[12px] text-neutral-500">
            지도 이미지를 불러오지 못했습니다.
          </p>
        </div>
      )}
    </a>
  );
}
