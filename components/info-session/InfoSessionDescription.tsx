"use client";

import { useEffect, useState } from "react";

import { sanitizePostHtmlWithPurify, type DomPurifyLike } from "@/lib/html-sanitize";
import { cn } from "@/lib/utils";
import type { InfoSession } from "@/types/database";

const proseClass = cn(
  "text-[15px] leading-relaxed text-neutral-600 sm:text-[16px] sm:leading-[1.7]",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_strong]:font-bold [&_em]:italic",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary-100 [&_blockquote]:pl-4",
  "[&_h2]:mt-4 [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-primary",
  "[&_h3]:mt-3 [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:text-primary",
  "[&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-card",
);

type Props = {
  session: Pick<InfoSession, "description" | "description_html">;
  className?: string;
};

function PlainDescription({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={cn("whitespace-pre-line", proseClass, className)}>{text}</p>
  );
}

export default function InfoSessionDescription({ session, className }: Props) {
  const [safeHtml, setSafeHtml] = useState<string | null>(null);

  useEffect(() => {
    const raw = session.description_html?.trim();
    if (!raw) {
      setSafeHtml(null);
      return;
    }

    let cancelled = false;

    import("isomorphic-dompurify")
      .then(({ default: DOMPurify }) => {
        if (cancelled) return;
        const sanitized = sanitizePostHtmlWithPurify(
          DOMPurify as unknown as DomPurifyLike,
          raw,
        );
        setSafeHtml(sanitized || null);
      })
      .catch((error) => {
        console.error("[InfoSessionDescription]", error);
        if (!cancelled) setSafeHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [session.description_html]);

  if (session.description_html?.trim()) {
    if (safeHtml) {
      return (
        <div
          className={cn(proseClass, className)}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      );
    }

    if (session.description?.trim()) {
      return <PlainDescription text={session.description} className={className} />;
    }

    return null;
  }

  if (session.description?.trim()) {
    return <PlainDescription text={session.description} className={className} />;
  }

  return null;
}
