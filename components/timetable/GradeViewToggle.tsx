import Link from "next/link";

import {
  GRADE_LABELS,
  type School,
  type ViewType,
  VIEW_TYPES,
  TIMETABLE_VIEW_TYPE_LABELS,
} from "@/lib/constants";
import { getTimetableSchoolTheme } from "@/lib/layout/timetable-school-theme";
import { siteContainerClass } from "@/lib/layout/spacing";

type GradeViewToggleProps = {
  school: School;
  grade: string;
  view: ViewType;
  /** 콘텐츠가 있는 학년만 (비어 있으면 학년 탭 숨김) */
  visibleGrades: string[];
};

function buildHref(
  school: School,
  grade: string,
  view: ViewType,
): string {
  const params = new URLSearchParams({ grade, view });
  return `/timetable/${school}?${params.toString()}`;
}

const gradeLinkBase =
  "inline-flex min-w-[68px] items-center justify-center rounded-full border-[3px] px-3 py-2 text-[16px] font-black transition-colors duration-150 sm:min-w-[120px] sm:px-9 sm:py-4 sm:text-[22px]";

const viewLinkBase =
  "relative z-10 flex min-w-0 flex-1 items-center justify-center rounded-full border-[3px] px-2 py-2.5 text-center text-[16px] font-black transition-colors duration-150 sm:px-3 sm:py-3 sm:text-[19px]";

const viewLinkStandaloneBase =
  "relative z-10 inline-flex min-w-[124px] items-center justify-center rounded-full border-[3px] px-5 py-2.5 text-[18px] font-black transition-colors duration-150 sm:min-w-[132px] sm:text-[20px]";

/**
 * 시간표 페이지의 학년 + 뷰 토글 (서버 컴포넌트).
 * 보기 형식 영역 너비는 학년 버튼 행(고1~3) 전체 너비와 동일하게 맞춥니다.
 */
export default function GradeViewToggle({
  school,
  grade,
  view,
  visibleGrades,
}: GradeViewToggleProps) {
  const theme = getTimetableSchoolTheme(school);
  const showGradeTabs = visibleGrades.length > 1;

  const viewTablist = (
    <div
      role="tablist"
      aria-label="뷰 선택"
      className={`relative z-10 flex rounded-full border border-neutral-300 bg-neutral-100 p-1 ${
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
            className={`${
              showGradeTabs ? viewLinkBase : viewLinkStandaloneBase
            } ${isActive ? theme.view.active : theme.view.inactive}`}
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
      className="relative z-20 bg-white"
    >
      <div
        className={`${siteContainerClass} flex justify-center pt-5 pb-6 sm:pt-6 sm:pb-8`}
      >
        {showGradeTabs ? (
          <div className="inline-flex w-fit max-w-full flex-col items-stretch gap-6">
            <ul
              className="relative z-10 flex max-w-full flex-wrap items-center justify-center gap-2 sm:flex-nowrap sm:gap-6"
              aria-label="학년 탭"
            >
              {visibleGrades.map((g) => {
                const isActive = g === grade;
                return (
                  <li key={g} className="shrink-0">
                    <Link
                      href={buildHref(school, g, view)}
                      aria-current={isActive ? "page" : undefined}
                      className={`${gradeLinkBase} ${
                        isActive ? theme.grade.active : theme.grade.inactive
                      }`}
                    >
                      {GRADE_LABELS[g] ?? g}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {viewTablist}
          </div>
        ) : (
          viewTablist
        )}
      </div>
    </nav>
  );
}
