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
    "inline-flex flex-1 items-center justify-center rounded-button px-2 py-2 text-center text-[12px] font-bold transition-colors duration-150 sm:px-3 sm:text-[13px]";
  const btnOnYellow = `${btnBase} bg-primary text-white hover:bg-primary-700`;
  const btnOnWhite = `${btnBase} bg-neutral-100 text-neutral-800 hover:bg-neutral-200`;

  return (
    <article
      className={`${shell} flex h-full w-full flex-col px-3.5 py-3 lg:px-3 lg:py-2.5`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        aria-label={`${campus.name} 위치 선택`}
        className="flex min-h-0 flex-1 items-center justify-center px-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <h3 className="text-[22px] font-black leading-tight tracking-tight text-primary sm:text-[24px] lg:text-[26px]">
          {campus.name}
        </h3>
      </button>

      <div className="mt-2 flex shrink-0 gap-1.5 sm:gap-2 lg:mt-1.5 lg:gap-1.5">
        <a
          href={campus.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={isActive ? btnOnYellow : btnOnWhite}
        >
          네이버 지도에서 보기
        </a>
        <a
          href={`tel:${campus.phone.tel}`}
          className={isActive ? btnOnYellow : btnOnWhite}
        >
          전화 걸기
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start lg:gap-6">
      <ul
        className="flex flex-col gap-3 lg:gap-2"
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
