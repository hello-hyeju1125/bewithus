"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { isExternalUrl } from "@/lib/utils";

type WidgetActionLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
};

/** 사이드 위젯·홈 카드 등 — 외부 URL은 새 탭, 내부는 Next Link */
export default function WidgetActionLink({
  href,
  className,
  children,
}: WidgetActionLinkProps) {
  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
