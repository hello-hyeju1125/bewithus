import { Users } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";
import type { HeroDescriptionInput } from "@/lib/layout/hero-description";
import { subPageTiffanyHero } from "@/lib/layout/timetable-school-theme";

type TeachersPageHeroProps = {
  /** 학교별 페이지 — `title` 미지정 시 `{schoolLabel} 강사진` */
  schoolLabel?: string;
  /** 전체 강사진 등 커스텀 제목 */
  title?: string;
  description: HeroDescriptionInput;
  /** false: 아이콘·영문 라벨 없음 (공지사항 하위 페이지 기본) */
  showEyebrow?: boolean;
  /** true: 시간표 세부 페이지와 동일한 티파니 블루 Hero */
  tiffanyHero?: boolean;
};

export default function TeachersPageHero({
  schoolLabel,
  title,
  description,
  showEyebrow = false,
  tiffanyHero = false,
}: TeachersPageHeroProps) {
  const displayTitle =
    title ?? (schoolLabel ? `${schoolLabel} 강사진` : "강사진");
  const hero = tiffanyHero ? subPageTiffanyHero : null;

  return (
    <SubPageHero
      ariaLabel={`${displayTitle} 페이지 소개`}
      eyebrow={showEyebrow ? "Teacher" : undefined}
      icon={showEyebrow ? Users : undefined}
      title={displayTitle}
      description={description}
      section="teacher"
      surfaceClass={hero?.section}
      titleClass={hero?.title}
      descriptionClass={hero?.description}
    />
  );
}
