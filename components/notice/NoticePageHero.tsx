import { Megaphone } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";
import type { HeroDescriptionInput } from "@/lib/layout/hero-description";
import { subPageTiffanyHero } from "@/lib/layout/timetable-school-theme";

type NoticePageHeroProps = {
  title: string;
  description?: HeroDescriptionInput;
  /** false: 세부 페이지 — 아이콘·영문 라벨 없음 */
  showEyebrow?: boolean;
  /** true: 시간표 세부 페이지와 동일한 티파니 블루 Hero */
  tiffanyHero?: boolean;
};

export default function NoticePageHero({
  title,
  description,
  showEyebrow = false,
  tiffanyHero = false,
}: NoticePageHeroProps) {
  const hero = tiffanyHero ? subPageTiffanyHero : null;

  return (
    <SubPageHero
      ariaLabel={`${title} 페이지 소개`}
      eyebrow={showEyebrow ? "Notice" : undefined}
      icon={showEyebrow ? Megaphone : undefined}
      title={title}
      description={description}
      section="notice"
      surfaceClass={hero?.section}
      titleClass={hero?.title}
      descriptionClass={hero?.description}
    />
  );
}
