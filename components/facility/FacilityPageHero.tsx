import { Building2 } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";
import { subPageTiffanyHero } from "@/lib/layout/timetable-school-theme";

type FacilityPageHeroProps = {
  title?: string;
  description?: string;
  /** false: 아이콘·영문 라벨 없음 (공지사항 하위 페이지 기본) */
  showEyebrow?: boolean;
  /** true: 시간표 세부 페이지와 동일한 티파니 블루 Hero */
  tiffanyHero?: boolean;
};

export default function FacilityPageHero({
  title = "학습 공간",
  description = "집중을 위한 최적의 환경을 안내해 드립니다.",
  showEyebrow = false,
  tiffanyHero = false,
}: FacilityPageHeroProps) {
  const hero = tiffanyHero ? subPageTiffanyHero : null;

  return (
    <SubPageHero
      ariaLabel="시설 안내 페이지 소개"
      eyebrow={showEyebrow ? "Facility" : undefined}
      icon={showEyebrow ? Building2 : undefined}
      title={title}
      description={description}
      surfaceClass={hero?.section}
      titleClass={hero?.title}
      descriptionClass={hero?.description}
    />
  );
}
