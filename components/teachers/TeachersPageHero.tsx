import { Users } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type TeachersPageHeroProps = {
  /** 학교별 페이지 — `title` 미지정 시 `{schoolLabel} 강사진` */
  schoolLabel?: string;
  /** 전체 강사진 등 커스텀 제목 */
  title?: string;
  description: string;
  /** false: 아이콘·영문 라벨 없음 (공지사항 하위 페이지 기본) */
  showEyebrow?: boolean;
};

export default function TeachersPageHero({
  schoolLabel,
  title,
  description,
  showEyebrow = false,
}: TeachersPageHeroProps) {
  const displayTitle =
    title ?? (schoolLabel ? `${schoolLabel} 강사진` : "강사진");

  return (
    <SubPageHero
      ariaLabel={`${displayTitle} 페이지 소개`}
      eyebrow={showEyebrow ? "Teacher" : undefined}
      icon={showEyebrow ? Users : undefined}
      title={displayTitle}
      description={description}
      section="teacher"
    />
  );
}
