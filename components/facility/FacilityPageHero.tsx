import { Building2 } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type FacilityPageHeroProps = {
  title?: string;
  description?: string;
};

export default function FacilityPageHero({
  title = "대치위더스의 학습 공간",
  description = "집중을 위한 최적의 환경을 카테고리별로 안내해 드립니다.",
}: FacilityPageHeroProps) {
  return (
    <SubPageHero
      ariaLabel="시설 안내 페이지 소개"
      eyebrow="Facility"
      icon={Building2}
      title={title}
      description={description}
    />
  );
}
