import { Presentation } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";
import { subPageTiffanyHero } from "@/lib/layout/timetable-school-theme";

type InfoSessionPageHeroProps = {
  schoolLabel: string;
  description: string;
  /** 미지정 시 `${schoolLabel} 설명회` */
  title?: string;
  /** false: 세부 페이지 — 아이콘·영문 라벨 없음 */
  showEyebrow?: boolean;
  /** true: 시간표 세부 페이지와 동일한 티파니 블루 Hero */
  tiffanyHero?: boolean;
};

export default function InfoSessionPageHero({
  schoolLabel,
  description,
  title,
  showEyebrow = true,
  tiffanyHero = false,
}: InfoSessionPageHeroProps) {
  const heroTitle = title ?? `${schoolLabel} 설명회`;
  const hero = tiffanyHero ? subPageTiffanyHero : null;

  return (
    <SubPageHero
      ariaLabel={`${heroTitle} 페이지 소개`}
      eyebrow={showEyebrow ? "Info Session" : undefined}
      icon={showEyebrow ? Presentation : undefined}
      title={heroTitle}
      description={description}
      section="info-session"
      surfaceClass={hero?.section}
      titleClass={hero?.title}
      descriptionClass={hero?.description}
    />
  );
}
