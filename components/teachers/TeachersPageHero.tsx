import { Users } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type TeachersPageHeroProps = {
  schoolLabel: string;
  description: string;
};

export default function TeachersPageHero({
  schoolLabel,
  description,
}: TeachersPageHeroProps) {
  const title = `${schoolLabel} 강사진`;

  return (
    <SubPageHero
      ariaLabel={`${title} 페이지 소개`}
      eyebrow="Teacher"
      icon={Users}
      title={title}
      description={description}
      section="teacher"
    />
  );
}
