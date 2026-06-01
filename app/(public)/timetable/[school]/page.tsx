import { notFound } from "next/navigation";

import GradeViewToggle from "@/components/timetable/GradeViewToggle";
import TimetableDetailTable from "@/components/timetable/TimetableDetailTable";
import TimetableImage from "@/components/timetable/TimetableImage";
import TimetablePageHero from "@/components/timetable/TimetablePageHero";
import TimetablePageShell from "@/components/timetable/TimetablePageShell";
import {
  GRADE_LABELS,
  isSchool,
  isViewType,
  resolveGradeForSchool,
  SCHOOL_DESCRIPTIONS,
  SCHOOL_LABELS,
  TIMETABLE_VIEW_TYPE_LABELS,
} from "@/lib/constants";
import {
  siteContainerClass,
  siteFloatingWidgetCenterOffsetClass,
  siteFloatingWidgetSafeClass,
} from "@/lib/layout/spacing";
import { getTimetable, listTimetableCourses } from "@/lib/supabase/queries";

type TimetablePageProps = {
  params: { school: string };
  searchParams: { grade?: string; view?: string };
};

export function generateMetadata({ params }: TimetablePageProps) {
  if (!isSchool(params.school)) return { title: "시간표 | W대치위더스" };
  return {
    title: `${SCHOOL_LABELS[params.school]} 시간표 | W대치위더스`,
    description: SCHOOL_DESCRIPTIONS[params.school],
  };
}

export default async function TimetablePage({
  params,
  searchParams,
}: TimetablePageProps) {
  if (!isSchool(params.school)) notFound();
  const school = params.school;

  const grade = resolveGradeForSchool(school, searchParams.grade);
  const view = isViewType(searchParams.view) ? searchParams.view : "summary";

  const [timetable, courses] = await Promise.all([
    getTimetable(school, grade, view),
    view === "detail" ? listTimetableCourses(school, grade) : Promise.resolve([]),
  ]);

  const pageKey = `${school}-${grade}-${view}`;

  return (
    <TimetablePageShell
      pageKey={pageKey}
      hero={
        <TimetablePageHero
          school={school}
          schoolLabel={SCHOOL_LABELS[school]}
          description={timetable?.description ?? SCHOOL_DESCRIPTIONS[school]}
        />
      }
      controls={<GradeViewToggle school={school} grade={grade} view={view} />}
      content={
        view === "detail" ? (
          <section
            aria-label="상세 시간표"
            className={`${siteContainerClass} ${siteFloatingWidgetSafeClass} pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-14 lg:pt-12`}
          >
            <TimetableDetailTable school={school} courses={courses} />
          </section>
        ) : (
          <section
            aria-label="요약 시간표 이미지"
            className={`${siteContainerClass} ${siteFloatingWidgetSafeClass} pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-14 lg:pt-12`}
          >
            <div
              className={`mx-auto w-full max-w-[960px] ${siteFloatingWidgetCenterOffsetClass}`}
            >
              <TimetableImage
                data={timetable}
                alt={`${SCHOOL_LABELS[school]} ${GRADE_LABELS[grade] ?? grade} ${TIMETABLE_VIEW_TYPE_LABELS[view]}`}
              />
            </div>
          </section>
        )
      }
    />
  );
}
