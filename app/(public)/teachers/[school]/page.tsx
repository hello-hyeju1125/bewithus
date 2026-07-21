import { notFound } from "next/navigation";

import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import TeacherCardList from "@/components/teachers/TeacherCardList";
import TeachersPageHero from "@/components/teachers/TeachersPageHero";
import {
  isStaffSchool,
  SCHOOL_DESCRIPTIONS,
  SCHOOL_LABELS,
} from "@/lib/constants";
import {
  siteContainerClass,
  siteFloatingWidgetSafeClass,
} from "@/lib/layout/spacing";
import { listTeacherSubjectOrder, listTeachers } from "@/lib/supabase/queries";

type TeachersPageProps = {
  params: { school: string };
};

export function generateMetadata({ params }: TeachersPageProps) {
  if (!isStaffSchool(params.school)) return { title: "강사진 | 대치위더스" };
  return {
    title: `${SCHOOL_LABELS[params.school]} 강사진 | 대치위더스`,
    description: `${SCHOOL_LABELS[params.school]} 전담 강사진을 소개합니다.`,
  };
}

export default async function TeachersPage({ params }: TeachersPageProps) {
  if (!isStaffSchool(params.school)) notFound();
  const school = params.school;

  const [teachers, subjectOrder] = await Promise.all([
    listTeachers(school),
    listTeacherSubjectOrder(),
  ]);

  return (
    <StaggeredPageShell
      pageKey={school}
      hero={
        <TeachersPageHero
          schoolLabel={SCHOOL_LABELS[school]}
          description={SCHOOL_DESCRIPTIONS[school]}
          tiffanyHero
        />
      }
      content={
        <section
          aria-label="강사 카드 그리드"
          className={`${siteContainerClass} ${siteFloatingWidgetSafeClass} py-10 sm:py-12 lg:py-14`}
        >
          <TeacherCardList teachers={teachers} subjectOrder={subjectOrder} />
        </section>
      }
    />
  );
}
