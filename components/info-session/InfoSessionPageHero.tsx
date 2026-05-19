import { Presentation } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type InfoSessionPageHeroProps = {
  schoolLabel: string;
  description: string;
};

export default function InfoSessionPageHero({
  schoolLabel,
  description,
}: InfoSessionPageHeroProps) {
  const title = `${schoolLabel} 설명회`;

  return (
    <SubPageHero
      ariaLabel={`${title} 페이지 소개`}
      eyebrow="Info Session"
      icon={Presentation}
      title={title}
      description={description}
      section="info-session"
    />
  );
}
