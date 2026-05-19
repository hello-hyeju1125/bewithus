import { Megaphone } from "lucide-react";

import SubPageHero from "@/components/layout/SubPageHero";

type NoticePageHeroProps = {
  title: string;
  description?: string;
};

export default function NoticePageHero({
  title,
  description,
}: NoticePageHeroProps) {
  return (
    <SubPageHero
      ariaLabel={`${title} 페이지 소개`}
      eyebrow="Notice"
      icon={Megaphone}
      title={title}
      description={description}
      section="notice"
    />
  );
}
