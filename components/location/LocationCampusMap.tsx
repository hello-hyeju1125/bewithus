"use client";

import { useCallback, useState } from "react";

import LocationCampusMapPreview from "@/components/location/LocationCampusMapPreview";
import { LOCATION_CAMPUSES, type LocationCampus } from "@/content/location";

function CampusCard({
  campus,
  isActive,
  onSelect,
}: {
  campus: LocationCampus;
  isActive: boolean;
  onSelect: () => void;
}) {
  const shell = isActive
    ? "rounded-card border-2 border-primary bg-accent-500"
    : "rounded-card border-2 border-neutral-200 bg-white text-neutral-800";

  const btnBase =
    "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-button px-3 py-2 text-center text-[15px] font-bold leading-snug transition-colors duration-150 sm:text-[16px]";
  const btnOnYellow = `${btnBase} bg-primary text-white hover:bg-primary-700`;
  const btnOnWhite = `${btnBase} bg-neutral-100 text-neutral-800 hover:bg-neutral-200`;

  return (
    <article
      className={`${shell} flex w-full flex-col gap-2.5 px-4 py-3.5 sm:gap-3 sm:px-5 sm:py-4`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        aria-label={`${campus.name} 위치 선택`}
        className="shrink-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:text-center"
      >
        <h3 className="text-[22px] font-black leading-tight tracking-tight text-primary sm:text-[24px] lg:text-[26px]">
          {campus.name}
        </h3>
        <p className="mt-1 text-[14px] font-semibold leading-snug text-neutral-700 sm:text-[15px]">
          {campus.address}
        </p>
        <p className="mt-1 text-[15px] font-bold tabular-nums text-primary sm:text-[16px]">
          {campus.phone.display}
        </p>
      </button>

      <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:gap-2.5">
        <a
          href={`tel:${campus.phone.tel}`}
          className={isActive ? btnOnYellow : btnOnWhite}
        >
          전화걸기
        </a>
        <a
          href={campus.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={isActive ? btnOnYellow : btnOnWhite}
        >
          네이버 지도로 보기
        </a>
      </div>
    </article>
  );
}

export default function LocationCampusMap() {
  const [activeId, setActiveId] = useState(LOCATION_CAMPUSES[0].id);

  const active =
    LOCATION_CAMPUSES.find((c) => c.id === activeId) ?? LOCATION_CAMPUSES[0];

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-stretch lg:gap-6">
        <ul className="flex flex-col gap-3" role="list">
          {LOCATION_CAMPUSES.map((campus) => (
            <li key={campus.id} className="shrink-0">
              <CampusCard
                campus={campus}
                isActive={campus.id === activeId}
                onSelect={() => handleSelect(campus.id)}
              />
            </li>
          ))}
        </ul>

        {/* 모바일: 비율 유지 / 데스크톱: 카드 열 높이에 맞춤 */}
        <div className="relative w-full overflow-hidden rounded-hero border border-neutral-200 bg-neutral-100 max-lg:aspect-[1858/1216] lg:min-h-0">
          <LocationCampusMapPreview
            key={active.id}
            campus={active}
            fillParent
          />
        </div>
      </div>
    </div>
  );
}
