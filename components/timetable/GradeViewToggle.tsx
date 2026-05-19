import Link from "next/link";

import {
  GRADE_LABELS,
  type School,
  SCHOOL_GRADES,
  type ViewType,
  VIEW_TYPES,
  TIMETABLE_VIEW_TYPE_LABELS,
} from "@/lib/constants";
import { siteContainerClass } from "@/lib/layout/spacing";

type GradeViewToggleProps = {
  school: School;
  grade: string;
  view: ViewType;
};

function buildHref(
  school: School,
  grade: string,
  view: ViewType,
): string {
  const params = new URLSearchParams({ grade, view });
  return `/timetable/${school}?${params.toString()}`;
}

const gradeLinkClass = (isActive: boolean) =>
  `inline-flex min-w-[108px] items-center justify-center rounded-button border-[3px] px-8 py-3.5 text-[18px] font-black transition-colors duration-150 sm:min-w-[120px] sm:px-9 sm:py-4 sm:text-[19px] ${
    isActive
      ? "border-primary bg-accent-500 text-primary"
      : "border-neutral-200 bg-white text-neutral-700 hover:border-primary hover:text-primary"
  }`;

const viewLinkClass = (isActive: boolean) =>
  `flex flex-1 items-center justify-center rounded-[3px] border-[3px] px-4 py-2.5 text-center text-[16px] font-black transition-colors duration-150 sm:py-3 sm:text-[17px] ${
    isActive
      ? "border-primary bg-accent-500 text-primary"
      : "border-transparent text-neutral-600 hover:text-primary"
  }`;

/**
 * 시간표 페이지의 학년 + 뷰 토글 (서버 컴포넌트).
 * 보기 형식 영역 너비는 학년 버튼 행(고1~3) 전체 너비와 동일하게 맞춥니다.
 */
export default function GradeViewToggle({
  school,
  grade,
  view,
}: GradeViewToggleProps) {
  const grades = SCHOOL_GRADES[school];
  const showGradeTabs = grades.length > 1;

  const viewTablist = (
    <div
      role="tablist"
      aria-label="뷰 선택"
      className={`flex rounded-[4px] border border-neutral-300 bg-neutral-100 p-1 ${
        showGradeTabs ? "w-full" : "inline-flex"
      }`}
    >
      {VIEW_TYPES.map((v) => {
        const isActive = v === view;
        return (
          <Link
            key={v}
            role="tab"
            aria-selected={isActive}
            href={buildHref(school, grade, v)}
            className={
              showGradeTabs
                ? viewLinkClass(isActive)
                : `inline-flex min-w-[124px] items-center justify-center rounded-[3px] border-[3px] px-5 py-2.5 text-[16px] font-black transition-colors duration-150 sm:min-w-[132px] sm:text-[17px] ${
                    isActive
                      ? "border-primary bg-accent-500 text-primary"
                      : "border-transparent text-neutral-600 hover:text-primary"
                  }`
            }
          >
            {TIMETABLE_VIEW_TYPE_LABELS[v]}
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav
      aria-label="학년 및 뷰 선택"
      className="bg-white"
    >
      <div
        className={`${siteContainerClass} flex justify-center py-5 sm:py-6`}
      >
        {showGradeTabs ? (
          <div className="inline-flex flex-col items-stretch gap-6">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-neutral-500 sm:text-[15px]">
                학년 선택
              </span>
              <ul
                className="flex flex-wrap items-center justify-center gap-5 sm:gap-6"
                aria-label="학년 탭"
              >
                {grades.map((g) => {
                  const isActive = g === grade;
                  return (
                    <li key={g}>
                      <Link
                        href={buildHref(school, g, view)}
                        aria-current={isActive ? "page" : undefined}
                        className={gradeLinkClass(isActive)}
                      >
                        {GRADE_LABELS[g] ?? g}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-neutral-500 sm:text-[15px]">
                보기 형식
              </span>
              {viewTablist}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-neutral-500 sm:text-[15px]">
              보기 형식
            </span>
            {viewTablist}
          </div>
        )}
      </div>
    </nav>
  );
}
