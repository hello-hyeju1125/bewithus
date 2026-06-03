import { Building2 } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type FacilityPageHeroProps = {
  title?: string;
  description?: string;
  /** false: 아이콘·영문 라벨 없음 (공지사항 하위 페이지 기본) */
  showEyebrow?: boolean;
};

export default function FacilityPageHero({
  title = "학습 공간",
  description = "집중을 위한 최적의 환경을 안내해 드립니다.",
  showEyebrow = false,
}: FacilityPageHeroProps) {
  return (
    <SubPageHero
      ariaLabel="시설 안내 페이지 소개"
      eyebrow={showEyebrow ? "Facility" : undefined}
      icon={showEyebrow ? Building2 : undefined}
      title={title}
      description={description}
    />
  );
}
