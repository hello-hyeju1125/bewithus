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
  /**
   * 데스크톱: 부모(카드 열 높이)를 채우도록 absolute fill.
   * 모바일: 원본 비율 유지.
   */
  fillParent?: boolean;
};

export default function LocationCampusMapPreview({
  campus,
  fillParent = false,
}: LocationCampusMapPreviewProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href={campus.naverMapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        fillParent
          ? "group absolute inset-0 block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          : "group block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      }
      aria-label={`${campus.name} — 네이버 지도에서 위치 보기`}
    >
      {!imageError ? (
        fillParent ? (
          <Image
            src={campus.mapImageSrc}
            alt={`${campus.name} 위치 지도`}
            fill
            unoptimized
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-opacity duration-200 group-hover:opacity-95"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <Image
            src={campus.mapImageSrc}
            alt={`${campus.name} 위치 지도`}
            width={MAP_IMAGE_WIDTH}
            height={MAP_IMAGE_HEIGHT}
            unoptimized
            sizes="100vw"
            className="block h-auto w-full transition-opacity duration-200 group-hover:opacity-95"
            onError={() => setImageError(true)}
            priority
          />
        )
      ) : (
        <div
          className={
            fillParent
              ? "flex h-full w-full flex-col items-center justify-center gap-3 bg-neutral-100 px-6 text-center"
              : "flex aspect-[1858/1216] w-full flex-col items-center justify-center gap-3 bg-neutral-100 px-6 text-center"
          }
        >
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
