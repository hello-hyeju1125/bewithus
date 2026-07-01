import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, ListOrdered } from "lucide-react";

import ConsultationCtaLink from "@/components/consultation/ConsultationCtaLink";
import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import InfoSessionPageHero from "@/components/info-session/InfoSessionPageHero";
import { resolveInfoSessionHtml } from "@/lib/admin/sanitize";
import { isStaffSchool, SCHOOL_LABELS } from "@/lib/constants";
import { sanitizePostHtmlForDisplay } from "@/lib/html-sanitize";
import {
  formatSessionDateTime,
  isSessionUpcoming,
} from "@/lib/info-session/format";
import {
  siteContainerClass,
  siteFloatingWidgetSafeClass,
} from "@/lib/layout/spacing";
import { sectionBodyClass } from "@/lib/layout/section-theme";
import { cn } from "@/lib/utils";
import { getInfoSession } from "@/lib/supabase/queries";

type InfoSessionDetailPageProps = {
  params: { school: string; id: string };
};

const sessionCtaClass = cn(
  "inline-flex items-center justify-center gap-2 rounded-button px-6 py-3 text-[15px] font-bold outline-none transition-colors duration-200 focus-visible:ring-2 sm:text-[16px]",
  sectionBodyClass["info-session"].cta,
);

export async function generateMetadata({ params }: InfoSessionDetailPageProps) {
  if (!isStaffSchool(params.school)) return { title: "설명회 | W대치위더스" };
  const result = await getInfoSession(params.school, params.id);
  if (!result) {
    return { title: `${SCHOOL_LABELS[params.school]} 설명회 | W대치위더스` };
  }
  return {
    title: `${result.session.title} | ${SCHOOL_LABELS[params.school]} 설명회`,
    description: result.session.title,
  };
}

export default async function InfoSessionDetailPage({
  params,
}: InfoSessionDetailPageProps) {
  if (!isStaffSchool(params.school)) notFound();
  const school = params.school;

  const result = await getInfoSession(school, params.id);
  if (!result) notFound();

  const { session, prev, next } = result;
  const upcoming = isSessionUpcoming(session.session_date);
  const rawHtml = resolveInfoSessionHtml(session);
  const safeHtml = rawHtml ? await sanitizePostHtmlForDisplay(rawHtml) : "";

  const cta = upcoming ? (
    session.registration_url ? (
      <a
        href={session.registration_url}
        target="_blank"
        rel="noopener noreferrer"
        className={sessionCtaClass}
      >
        설명회 신청
      </a>
    ) : (
      <ConsultationCtaLink className={sessionCtaClass} label="설명회 신청" />
    )
  ) : null;

  return (
    <StaggeredPageShell
      pageKey={session.id}
      hero={
        <InfoSessionPageHero
          schoolLabel={SCHOOL_LABELS[school]}
          title={session.title}
          description=""
          showEyebrow={false}
          tiffanyHero
        />
      }
      content={
        <article
          className={`${siteContainerClass} ${siteFloatingWidgetSafeClass} py-10 sm:py-12 lg:py-14`}
        >
          <div className="mx-auto w-full max-w-[960px]">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-5">
              <p className="inline-flex items-center gap-1.5 text-[14px] text-neutral-500">
                <Calendar className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                <span className="font-semibold text-neutral-700">
                  {formatSessionDateTime(session.session_date)}
                </span>
              </p>
              {upcoming ? (
                <span className="inline-flex rounded-[3px] bg-accent-500 px-2 py-0.5 text-[12px] font-bold text-primary">
                  예정
                </span>
              ) : (
                <span className="text-[13px] font-semibold text-neutral-400">
                  종료된 설명회
                </span>
              )}
            </header>

            {safeHtml ? (
              <div
                className="prose-notice mt-8 space-y-4 text-[15px] leading-relaxed text-neutral-800 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-100 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-600 [&_h2]:mt-6 [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mt-5 [&_h3]:text-[17px] [&_h3]:font-bold [&_h3]:text-primary [&_img]:my-2 [&_img]:rounded-card [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-neutral-200 [&_td]:p-2 [&_th]:border [&_th]:border-neutral-200 [&_th]:bg-neutral-50 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            ) : session.description?.trim() ? (
              <p className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-neutral-800">
                {session.description}
              </p>
            ) : null}

            {cta ? <div className="mt-10 flex justify-center">{cta}</div> : null}

            <nav
              aria-label="이전/다음 설명회"
              className="mt-12 flex flex-col gap-2 border-t border-neutral-200 pt-6"
            >
              {prev ? (
                <Link
                  href={`/info-session/${school}/${prev.id}`}
                  className="group flex items-center justify-between gap-4 rounded-button px-2 py-3 text-[14px] outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex items-center gap-2 text-neutral-500">
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    이전 글
                  </span>
                  <span className="line-clamp-1 max-w-[60%] text-right font-semibold text-neutral-800 group-hover:text-primary">
                    {prev.title}
                  </span>
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/info-session/${school}/${next.id}`}
                  className="group flex items-center justify-between gap-4 rounded-button px-2 py-3 text-[14px] outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex items-center gap-2 text-neutral-500">
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    다음 글
                  </span>
                  <span className="line-clamp-1 max-w-[60%] text-right font-semibold text-neutral-800 group-hover:text-primary">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </nav>

            <div className="mt-8 flex justify-center">
              <Link
                href={`/info-session/${school}`}
                className="inline-flex items-center gap-2 rounded-button border border-neutral-200 px-5 py-2.5 text-[14px] font-semibold text-neutral-700 outline-none transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ListOrdered className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                목록으로
              </Link>
            </div>
          </div>
        </article>
      }
    />
  );
}
