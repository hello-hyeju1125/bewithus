import { MapPin } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type LocationPageHeroProps = {
  title?: string;
  description?: string;
  /** false: 아이콘·영문 라벨 없음 (공지사항 하위 페이지 기본) */
  showEyebrow?: boolean;
};

export default function LocationPageHero({
  title = "대치위더스 위치 안내",
  description = "대치동 중심에 위치한 대치위더스로 오시는 길을 안내합니다.",
  showEyebrow = false,
}: LocationPageHeroProps) {
  return (
    <SubPageHero
      ariaLabel="오시는 길 페이지 소개"
      eyebrow={showEyebrow ? "Location" : undefined}
      icon={showEyebrow ? MapPin : undefined}
      title={title}
      mobileTitle="위더스 위치 안내"
      description={description}
    />
  );
}
