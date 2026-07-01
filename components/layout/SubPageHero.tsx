import type { LucideIcon } from "lucide-react";

import type { HeroDescriptionInput } from "@/lib/layout/hero-description";

import HeroDescription from "@/components/layout/HeroDescription";
import {
  sectionHeroEyebrowClass,
  type PublicSection,
} from "@/lib/layout/section-theme";
import { cn } from "@/lib/utils";

type SubPageHeroProps = {
  ariaLabel: string;
  /** 미지정 시 아이콘·영문 라벨(eyebrow) 행을 렌더하지 않음 */
  eyebrow?: string;
  icon?: LucideIcon;
  title: string;
  /** sm 미만 뷰포트용 짧은 제목 (미지정 시 title 사용) */
  mobileTitle?: string;
  description?: HeroDescriptionInput;
  /** Hero eyebrow·본문 액센트 구분 (배경은 기본 네이비, surfaceClass 로 덮어쓸 수 있음) */
  section?: PublicSection;
  /** 섹션 래퍼 (예: 대원외고 시간표 라이트 스카이블루 Hero) */
  surfaceClass?: string;
  titleClass?: string;
  descriptionClass?: string;
};

export default function SubPageHero({
  ariaLabel,
  eyebrow,
  icon: Icon,
  title,
  mobileTitle,
  description,
  section = "default",
  surfaceClass,
  titleClass,
  descriptionClass,
}: SubPageHeroProps) {
  const heroVariant = surfaceClass?.includes("bg-tiffany") ? "tiffany" : "navy";

  return (
    <section aria-label={ariaLabel}>
      <div className="h-12 bg-gnb lg:h-[72px]" aria-hidden="true" />
      <div className={cn(surfaceClass ?? "bg-primary text-white")}>
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-5 px-5 pb-12 pt-[72px] text-center sm:gap-6 sm:px-8 sm:pb-14 sm:pt-20 lg:gap-7 lg:px-10 lg:pb-16 lg:pt-16">
        {eyebrow && Icon ? (
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
        ) : null}
        <h1
          className={cn(
            "max-w-4xl text-balance text-[42px] font-black leading-[1.08] tracking-tight sm:text-[52px] lg:text-[64px]",
            titleClass ?? "text-white",
          )}
        >
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
          <HeroDescription
            content={description}
            variant={heroVariant}
            descriptionClass={descriptionClass ?? undefined}
          />
        ) : null}
        </div>
      </div>
    </section>
  );
}
