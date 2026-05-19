import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";

import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import InfoSessionPageHero from "@/components/info-session/InfoSessionPageHero";
import InfoSessionDescription from "@/components/info-session/InfoSessionDescription";
import PastSessions from "@/components/info-session/PastSessions";
import { isStaffSchool, SCHOOL_LABELS } from "@/lib/constants";
import {
  siteContainerClass,
  siteFloatingWidgetCenterOffsetClass,
  siteFloatingWidgetSafeClass,
} from "@/lib/layout/spacing";
import { sectionBodyClass } from "@/lib/layout/section-theme";
import { cn } from "@/lib/utils";
import { listInfoSessions } from "@/lib/supabase/queries";
import type { InfoSession } from "@/types/database";

type InfoSessionPageProps = {
  params: { school: string };
};

export function generateMetadata({ params }: InfoSessionPageProps) {
  if (!isStaffSchool(params.school)) return { title: "설명회 | W대치위더스" };
  return {
    title: `${SCHOOL_LABELS[params.school]} 설명회 | W대치위더스`,
    description: `${SCHOOL_LABELS[params.school]} 입학 설명회 일정을 확인하세요.`,
  };
}

function formatSessionSchedule(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const dow = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return {
    dateLine: `${y}.${m}.${day} (${dow})`,
    timeLine: `${hh}:${mm}`,
  };
}

const sessionCtaClass = cn(
  "flex w-full items-center justify-center gap-3 rounded-button px-8 py-4 text-[18px] font-black outline-none transition-colors focus-visible:ring-2 sm:py-5 sm:text-[20px]",
  sectionBodyClass["info-session"].cta,
);

function UpcomingCard({ session }: { session: InfoSession }) {
  const { dateLine, timeLine } = formatSessionSchedule(session.session_date);

  const cta = session.registration_url ? (
    <a
      href={session.registration_url}
      target="_blank"
      rel="noopener noreferrer"
      className={sessionCtaClass}
    >
      설명회 신청
      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} aria-hidden="true" />
    </a>
  ) : (
    <Link href="/contact" className={sessionCtaClass}>
      설명회 신청
      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} aria-hidden="true" />
    </Link>
  );

  return (
    <article className="flex flex-col gap-6 rounded-card border border-neutral-200 bg-white p-6 sm:p-8">
      <div className="space-y-5">
        <time
          dateTime={session.session_date}
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-neutral-100 pb-5"
        >
          <span className="text-[28px] font-black leading-tight tracking-tight text-primary sm:text-[36px]">
            {dateLine}
          </span>
          <span className="text-[28px] font-black leading-tight tracking-tight text-primary sm:text-[36px]">
            {timeLine}
          </span>
        </time>
        <h3 className="whitespace-pre-line text-[22px] font-black tracking-tight text-primary sm:text-[24px]">
          {session.title}
        </h3>
        <InfoSessionDescription session={session} />
        {session.location ? (
          <p className="whitespace-pre-line text-[14px] leading-relaxed text-neutral-600 sm:text-[15px] sm:leading-[1.65]">
            <MapPin
              className="mr-1.5 inline-block h-4 w-4 shrink-0 align-text-bottom text-primary"
              aria-hidden="true"
            />
            {session.location}
          </p>
        ) : null}
      </div>
      <div className="border-t border-neutral-100 pt-5">{cta}</div>
    </article>
  );
}

export default async function InfoSessionPage({ params }: InfoSessionPageProps) {
  if (!isStaffSchool(params.school)) notFound();
  const school = params.school;

  const { upcoming, past } = await listInfoSessions(school);

  return (
    <StaggeredPageShell
      pageKey={school}
      hero={
        <InfoSessionPageHero
          schoolLabel={SCHOOL_LABELS[school]}
          description="다가오는 설명회 일정을 확인하고 신청해 보세요."
        />
      }
      content={
        <>
          <section
            aria-label="예정된 설명회"
            className={`${siteContainerClass} ${siteFloatingWidgetSafeClass} py-10 sm:py-12 lg:py-14`}
          >
            <div
              className={`mx-auto w-full max-w-[960px] ${siteFloatingWidgetCenterOffsetClass}`}
            >
              {upcoming.length === 0 ? (
                <p className="rounded-card border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-[15px] text-neutral-500">
                  예정된 설명회가 없습니다. 곧 새 일정을 안내드릴 예정입니다.
                </p>
              ) : (
                <ul className="space-y-6">
                  {upcoming.map((s) => (
                    <li key={s.id}>
                      <UpcomingCard session={s} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <PastSessions sessions={past} />
        </>
      }
    />
  );
}
