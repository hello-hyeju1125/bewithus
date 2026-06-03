import { Presentation } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type InfoSessionPageHeroProps = {
  schoolLabel: string;
  description: string;
  /** false: 세부 페이지 — 아이콘·영문 라벨 없음 */
  showEyebrow?: boolean;
};

export default function InfoSessionPageHero({
  schoolLabel,
  description,
  showEyebrow = true,
}: InfoSessionPageHeroProps) {
  const title = `${schoolLabel} 설명회`;

  return (
    <SubPageHero
      ariaLabel={`${title} 페이지 소개`}
      eyebrow={showEyebrow ? "Info Session" : undefined}
      icon={showEyebrow ? Presentation : undefined}
      title={title}
      description={description}
      section="info-session"
    />
  );
}
