"use client";

import type { ReactNode } from "react";

type StaggeredPageShellProps = {
  /** 라우트·필터 변경 시 순차 애니메이션 재생 */
  pageKey: string;
  hero: ReactNode;
  controls?: ReactNode;
  content: ReactNode;
};

const REVEAL_STAGGER_MS = [0, 140, 280] as const;

export default function StaggeredPageShell({
  pageKey,
  hero,
  controls,
  content,
}: StaggeredPageShellProps) {
  const blocks = controls ? [hero, controls, content] : [hero, content];
  const delays = controls ? REVEAL_STAGGER_MS : ([0, 140] as const);

  return (
    <main key={pageKey} className="bg-white">
      {blocks.map((block, index) => (
        <div
          key={`${pageKey}-${index}`}
          className="page-reveal"
          style={{ animationDelay: `${delays[index] ?? 0}ms` }}
        >
          {block}
        </div>
      ))}
    </main>
  );
}
