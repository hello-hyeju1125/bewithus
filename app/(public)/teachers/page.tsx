import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import TeacherCardList from "@/components/teachers/TeacherCardList";
import TeachersPageHero from "@/components/teachers/TeachersPageHero";
import { ko } from "@/content/ko";
import {
  siteContainerClass,
} from "@/lib/layout/spacing";
import { listAllTeachers, listTeacherSubjectOrder } from "@/lib/supabase/queries";

const { all: copy } = ko.teachersPage;

export const metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

export default async function AllTeachersPage() {
  const [teachers, subjectOrder] = await Promise.all([
    listAllTeachers(),
    listTeacherSubjectOrder(),
  ]);

  return (
    <StaggeredPageShell
      pageKey="all"
      hero={
        <TeachersPageHero
          title={copy.title}
          description={copy.description}
          tiffanyHero
        />
      }
      content={
        <section
          aria-label="강사 카드 그리드"
          className={`${siteContainerClass} py-10 sm:py-12 lg:py-14`}
        >
          <div className="mx-auto w-full max-w-[1080px] px-2 sm:px-4 lg:px-6">
            <TeacherCardList teachers={teachers} subjectOrder={subjectOrder} />
          </div>
        </section>
      }
    />
  );
}
