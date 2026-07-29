"use client";

import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";

import InfoSessionDescription from "@/components/info-session/InfoSessionDescription";
import type { InfoSession } from "@/types/database";

type PastSessionsProps = {
  sessions: InfoSession[];
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${hh}:${mm}`;
}

/**
 * 지난 설명회 섹션. 기본적으로 접혀 있고, 토글 버튼으로 펼칠 수 있습니다.
 */
export default function PastSessions({ sessions }: PastSessionsProps) {
  const [open, setOpen] = useState(false);

  if (sessions.length === 0) return null;

  return (
    <section
      aria-label="지난 설명회"
      className="border-t border-neutral-200 bg-neutral-50"
    >
      <div className="mx-auto w-full px-5 py-8 sm:px-8 lg:px-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 rounded-button border border-neutral-200 bg-white px-5 py-4 text-left outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-[16px] font-bold text-primary">
              지난 설명회 ({sessions.length})
            </span>
            <span className="text-[13px] text-neutral-500">
              과거에 진행된 설명회 자료
            </span>
          </span>
          <ChevronDown
            className={`h-5 w-5 text-neutral-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <ul className="mt-4 space-y-3">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="rounded-card border border-neutral-200 bg-white p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h3 className="min-w-0 flex-1 whitespace-pre-line text-left text-[18px] font-bold leading-snug text-primary">
                    {s.title}
                  </h3>
                  <p className="shrink-0 text-[13px] font-semibold text-neutral-500 sm:text-right">
                    {formatDateTime(s.session_date)}
                  </p>
                </div>
                <InfoSessionDescription
                  session={s}
                  className="mt-2 text-[14px] sm:text-[14px]"
                />
                <p className="mt-3 inline-flex items-center gap-1 text-[13px] text-neutral-500">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  종료된 설명회
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
