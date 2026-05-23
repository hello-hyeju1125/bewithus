import type { LucideIcon } from "lucide-react";

import {
  sectionHeroEyebrowClass,
  type PublicSection,
} from "@/lib/layout/section-theme";
import { cn } from "@/lib/utils";

type SubPageHeroProps = {
  ariaLabel: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  /** sm 미만 뷰포트용 짧은 제목 (미지정 시 title 사용) */
  mobileTitle?: string;
  description?: string;
  /** Hero eyebrow·본문 액센트 구분 (배경은 항상 네이비) */
  section?: PublicSection;
};

export default function SubPageHero({
  ariaLabel,
  eyebrow,
  icon: Icon,
  title,
  mobileTitle,
  description,
  section = "default",
}: SubPageHeroProps) {
  return (
    <section aria-label={ariaLabel} className="bg-primary text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-5 px-5 pb-12 pt-[120px] text-center sm:gap-6 sm:px-8 sm:pb-14 sm:pt-[128px] lg:gap-7 lg:px-10 lg:pb-16 lg:pt-[136px]">
        <p
          className={cn(
            "inline-flex items-center gap-3 text-[18px] font-black leading-none tracking-tight sm:gap-3.5 sm:text-[20px] lg:text-[24px]",
            sectionHeroEyebrowClass[section],
          )}
        >
          <Icon
            className="h-7 w-7 shrink-0 sm:h-8 sm:w-8 lg:h-9 lg:w-9"
            strokeWidth={2.25}
            aria-hidden="true"
          />
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-balance text-[42px] font-black leading-[1.08] tracking-tight text-white sm:text-[52px] lg:text-[64px]">
          {mobileTitle ? (
            <>
              <span className="sm:hidden">{mobileTitle}</span>
              <span className="hidden sm:inline">{title}</span>
            </>
          ) : (
            title
          )}
        </h1>
        {description ? (
          <p className="max-w-2xl text-[17px] leading-relaxed text-white/85 sm:text-[19px] lg:text-[22px]">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
