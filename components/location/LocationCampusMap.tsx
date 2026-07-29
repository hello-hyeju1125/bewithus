"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
    "inline-flex w-full items-center justify-center rounded-button px-3 py-2.5 text-center text-[17px] font-bold leading-snug transition-colors duration-150 sm:text-[18px] lg:py-3 lg:text-[19px]";
  const btnOnYellow = `${btnBase} bg-primary text-white hover:bg-primary-700`;
  const btnOnWhite = `${btnBase} bg-neutral-100 text-neutral-800 hover:bg-neutral-200`;

  return (
    <article
      className={`${shell} flex h-full w-full flex-col justify-center gap-2.5 px-4 py-3.5 lg:gap-2 lg:px-4 lg:py-3`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        aria-label={`${campus.name} 위치 선택`}
        className="shrink-0 px-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <h3 className="text-[26px] font-black leading-tight tracking-tight text-primary sm:text-[28px] lg:text-[30px]">
          {campus.name}
        </h3>
        <p className="mt-1.5 text-[15px] font-semibold leading-snug text-neutral-700 sm:text-[16px] lg:text-[17px]">
          {campus.address}
        </p>
        <p className="mt-1 text-[16px] font-bold tabular-nums text-primary sm:text-[17px] lg:text-[18px]">
          {campus.phone.display}
        </p>
      </button>

      <div className="flex shrink-0 flex-col gap-2">
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
  const mapColumnRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState<number | null>(null);

  const active =
    LOCATION_CAMPUSES.find((c) => c.id === activeId) ?? LOCATION_CAMPUSES[0];

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  useEffect(() => {
    const column = mapColumnRef.current;
    if (!column) return;

    const syncHeight = () => {
      const isWide = window.matchMedia("(min-width: 1024px)").matches;
      setMapHeight(isWide ? column.offsetHeight : null);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(column);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [active.id]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start lg:gap-6">
      <ul
        className="flex flex-col gap-3 lg:gap-2.5"
        style={mapHeight != null ? { height: mapHeight } : undefined}
        role="list"
      >
        {LOCATION_CAMPUSES.map((campus) => (
          <li key={campus.id} className="lg:flex lg:min-h-0 lg:flex-1">
            <CampusCard
              campus={campus}
              isActive={campus.id === activeId}
              onSelect={() => handleSelect(campus.id)}
            />
          </li>
        ))}
      </ul>

      <div
        ref={mapColumnRef}
        className="w-full overflow-hidden rounded-hero border border-neutral-200 bg-neutral-100"
      >
        <LocationCampusMapPreview key={active.id} campus={active} />
      </div>
    </div>
  );
}
