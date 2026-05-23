import { CalendarDays } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type TimetablePageHeroProps = {
  schoolLabel: string;
  description: string;
};

export default function TimetablePageHero({
  schoolLabel,
  description,
}: TimetablePageHeroProps) {
  return (
    <SubPageHero
      ariaLabel={`${schoolLabel} 페이지 소개`}
      eyebrow="Timetable"
      icon={CalendarDays}
      title={schoolLabel}
      description={description}
      section="timetable"
    />
  );
}
