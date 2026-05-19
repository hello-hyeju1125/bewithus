import { MapPin } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type LocationPageHeroProps = {
  title?: string;
  description?: string;
};

export default function LocationPageHero({
  title = "대치위더스 위치 안내",
  description = "대치동 학원가 중심에 위치한 대치위더스로 오시는 길을 안내합니다.",
}: LocationPageHeroProps) {
  return (
    <SubPageHero
      ariaLabel="오시는 길 페이지 소개"
      eyebrow="Location"
      icon={MapPin}
      title={title}
      description={description}
    />
  );
}
