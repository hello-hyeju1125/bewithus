import { MapPin } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";
import { subPageTiffanyHero } from "@/lib/layout/timetable-school-theme";

type LocationPageHeroProps = {
  title?: string;
  description?: string;
  /** false: 아이콘·영문 라벨 없음 (공지사항 하위 페이지 기본) */
  showEyebrow?: boolean;
  /** true: 시간표 세부 페이지와 동일한 티파니 블루 Hero */
  tiffanyHero?: boolean;
};

export default function LocationPageHero({
  title = "대치위더스 위치 안내",
  description = "대치동 중심에 위치한 대치위더스로 오시는 길을 안내합니다.",
  showEyebrow = false,
  tiffanyHero = false,
}: LocationPageHeroProps) {
  const hero = tiffanyHero ? subPageTiffanyHero : null;

  return (
    <SubPageHero
      ariaLabel="오시는 길 페이지 소개"
      eyebrow={showEyebrow ? "Location" : undefined}
      icon={showEyebrow ? MapPin : undefined}
      title={title}
      mobileTitle="위더스 위치 안내"
      description={description}
      surfaceClass={hero?.section}
      titleClass={hero?.title}
      descriptionClass={hero?.description}
    />
  );
}
