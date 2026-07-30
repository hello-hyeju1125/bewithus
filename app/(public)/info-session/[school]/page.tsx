import Link from "next/link";
import { notFound } from "next/navigation";

import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import InfoSessionPageHero from "@/components/info-session/InfoSessionPageHero";
import { isStaffSchool, SCHOOL_LABELS } from "@/lib/constants";
import {
  formatSessionDate,
  isSessionUpcoming,
} from "@/lib/info-session/format";
import {
  siteContainerClass,
} from "@/lib/layout/spacing";
import { listInfoSessionsOrdered } from "@/lib/supabase/queries";

type InfoSessionListPageProps = {
  params: { school: string };
};

export function generateMetadata({ params }: InfoSessionListPageProps) {
  if (!isStaffSchool(params.school)) return { title: "설명회 | 대치위더스" };
  return {
    title: `${SCHOOL_LABELS[params.school]} 설명회 | 대치위더스`,
    description: `${SCHOOL_LABELS[params.school]} 입학 설명회 일정을 확인하세요.`,
  };
}

export default async function InfoSessionListPage({
  params,
}: InfoSessionListPageProps) {
  if (!isStaffSchool(params.school)) notFound();
  const school = params.school;
  const sessions = await listInfoSessionsOrdered(school);
  const total = sessions.length;

  return (
    <StaggeredPageShell
      pageKey={school}
      hero={
        <InfoSessionPageHero
          schoolLabel={SCHOOL_LABELS[school]}
          description="설명회 일정을 확인하고 상세 내용을 살펴보세요."
          showEyebrow={false}
          tiffanyHero
        />
      }
      content={
        <section
          aria-label="설명회 목록"
          className={`${siteContainerClass} py-10 sm:py-12 lg:py-14`}
        >
          {sessions.length === 0 ? (
            <div
              className={`mx-auto w-full max-w-[1680px]`}
            >
              <p className="rounded-card border border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-[20px] text-neutral-500">
                등록된 설명회가 없습니다.
              </p>
            </div>
          ) : (
            <div
              className={`mx-auto w-full max-w-[1680px]`}
            >
              <table className="hidden w-full table-fixed border-t-2 border-primary text-[20px] sm:table">
                <caption className="sr-only">전체 {total}건의 설명회</caption>
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th scope="col" className="w-36 py-5 text-center font-semibold">
                      번호
                    </th>
                    <th scope="col" className="py-5 text-left font-semibold">
                      제목
                    </th>
                    <th scope="col" className="w-48 py-5 text-center font-semibold">
                      일시
                    </th>
                    <th scope="col" className="w-32 py-5 text-center font-semibold">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s, idx) => {
                    const upcoming = isSessionUpcoming(s.session_date);
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                      >
                        <td className="py-5 text-center text-neutral-500">
                          {total - idx}
                        </td>
                        <td className="py-5 pr-4">
                          <Link
                            href={`/info-session/${school}/${s.id}`}
                            className="block truncate text-[22px] font-semibold text-neutral-800 outline-none transition-colors hover:text-primary focus-visible:text-primary"
                          >
                            {s.title}
                          </Link>
                        </td>
                        <td className="py-5 text-center text-neutral-500">
                          {formatSessionDate(s.session_date)}
                        </td>
                        <td className="py-5 text-center">
                          {upcoming ? (
                            <span className="inline-flex rounded-[3px] bg-accent-500 px-2.5 py-1 text-[15px] font-bold text-primary">
                              예정
                            </span>
                          ) : (
                            <span className="text-[17px] text-neutral-400">
                              종료
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <ul className="space-y-3 sm:hidden">
                {sessions.map((s) => {
                  const upcoming = isSessionUpcoming(s.session_date);
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/info-session/${school}/${s.id}`}
                        className="block rounded-card border border-neutral-200 bg-white px-4 py-4 outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="line-clamp-2 min-w-0 flex-1 text-[20px] font-bold text-neutral-800">
                            {s.title}
                          </h3>
                          {upcoming ? (
                            <span className="shrink-0 rounded-[3px] bg-accent-500 px-1.5 py-0.5 text-[13px] font-bold text-primary">
                              예정
                            </span>
                          ) : (
                            <span className="shrink-0 text-[13px] font-semibold text-neutral-400">
                              종료
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-[16px] text-neutral-500">
                          {formatSessionDate(s.session_date)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      }
    />
  );
}
