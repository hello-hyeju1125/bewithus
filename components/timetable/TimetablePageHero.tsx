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
  const title = `${schoolLabel} 시간표`;

  return (
    <SubPageHero
      ariaLabel={`${title} 페이지 소개`}
      eyebrow="Timetable"
      icon={CalendarDays}
      title={title}
      description={description}
      section="timetable"
    />
  );
}
