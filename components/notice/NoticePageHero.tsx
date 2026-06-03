import { Megaphone } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type NoticePageHeroProps = {
  title: string;
  description?: string;
  /** false: 세부 페이지 — 아이콘·영문 라벨 없음 */
  showEyebrow?: boolean;
};

export default function NoticePageHero({
  title,
  description,
  showEyebrow = false,
}: NoticePageHeroProps) {
  return (
    <SubPageHero
      ariaLabel={`${title} 페이지 소개`}
      eyebrow={showEyebrow ? "Notice" : undefined}
      icon={showEyebrow ? Megaphone : undefined}
      title={title}
      description={description}
      section="notice"
    />
  );
}
