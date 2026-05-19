"use client";

import { useCallback, useState } from "react";

import {
  LOCATION_CAMPUSES,
  naverMapEmbedSrc,
  type LocationCampus,
} from "@/content/location";

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
    ? "rounded-card border-[3px] border-primary bg-accent-500"
    : "rounded-card border border-neutral-200 bg-white text-neutral-800";

  const btnBase =
    "inline-flex flex-1 items-center justify-center rounded-button px-3 py-2.5 text-center text-[13px] font-bold transition-colors duration-150 sm:text-[14px]";
  const btnOnYellow = `${btnBase} bg-primary text-white hover:bg-primary-700`;
  const btnOnWhite = `${btnBase} bg-neutral-100 text-neutral-800 hover:bg-neutral-200`;

  return (
    <article className={shell}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        aria-label={`${campus.name} 위치 선택`}
        className="w-full p-5 pb-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <h3 className="text-[20px] font-black tracking-tight text-primary sm:text-[22px]">
          {campus.name}
        </h3>
        <p
          className={`mt-2 text-[14px] leading-relaxed ${
            isActive ? "text-neutral-800" : "text-neutral-600"
          }`}
        >
          {campus.address}
        </p>
        <p className="mt-1 text-[15px] font-bold text-primary">
          {campus.phone.display}
        </p>
      </button>

      <div className="flex gap-2 px-5 pb-5">
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

  const active =
    LOCATION_CAMPUSES.find((c) => c.id === activeId) ?? LOCATION_CAMPUSES[0];

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-stretch lg:gap-8">
      <ul className="flex flex-col gap-3" role="list">
        {LOCATION_CAMPUSES.map((campus) => (
          <li key={campus.id}>
            <CampusCard
              campus={campus}
              isActive={campus.id === activeId}
              onSelect={() => handleSelect(campus.id)}
            />
          </li>
        ))}
      </ul>

      <div className="min-h-[360px] overflow-hidden rounded-hero border border-neutral-200 bg-neutral-100 sm:min-h-[480px] lg:min-h-[640px]">
        <iframe
          key={active.id}
          title={`${active.name} 네이버 지도`}
          src={naverMapEmbedSrc(active)}
          className="h-full min-h-[360px] w-full border-0 sm:min-h-[480px] lg:min-h-[640px]"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}
