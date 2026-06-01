import SubPageHero from "@/components/layout/SubPageHero";
import type { School } from "@/lib/constants";
import { getTimetableSchoolTheme } from "@/lib/layout/timetable-school-theme";

type TimetablePageHeroProps = {
  school: School;
  schoolLabel: string;
  description: string;
};

export default function TimetablePageHero({
  school,
  schoolLabel,
  description,
}: TimetablePageHeroProps) {
  const theme = getTimetableSchoolTheme(school);

  return (
    <SubPageHero
      ariaLabel={`${schoolLabel} 페이지 소개`}
      title={schoolLabel}
      description={description}
      surfaceClass={theme.hero.section}
      titleClass={theme.hero.title}
      descriptionClass={theme.hero.description}
    />
  );
}
