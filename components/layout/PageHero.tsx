import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  /** 우측에 노출할 부가 콘텐츠 (예: 학기 뱃지) */
  extra?: ReactNode;
  /** 제목·설명·뱃지를 가운데 정렬 (시간표 등) */
  centered?: boolean;
};

/**
 * 공개 페이지 상단 Hero. 디자인 토큰의 `primary` 단색 배경을 사용합니다.
 * 메인 페이지의 HeroSlider 와는 별개의 "서브 페이지용" Hero 입니다.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  extra,
  centered = false,
}: PageHeroProps) {
  const innerClassWithoutTopPad = centered
    ? "mx-auto flex w-full flex-col items-center gap-4 px-5 pb-12 pt-[72px] text-center sm:px-8 sm:pb-14 sm:pt-20 lg:px-6 lg:pb-16 lg:pt-16"
    : "mx-auto flex w-full flex-col gap-3 px-5 pb-12 pt-[72px] sm:px-8 sm:pb-14 sm:pt-20 lg:px-6 lg:pb-16 lg:pt-16";

  return (
    <section aria-label={`${title} 페이지 소개`}>
      <div className="h-12 bg-gnb lg:h-[72px]" aria-hidden="true" />
      <div className="bg-primary text-white">
        <div className={innerClassWithoutTopPad}>
        {eyebrow ? (
          <p className="inline-flex w-fit rounded-leaf bg-accent-500 px-3 py-0.5 text-[14px] font-black leading-tight tracking-tight text-primary sm:text-[16px]">
            {eyebrow}
          </p>
        ) : null}
        {centered ? (
          <>
            <h1 className="whitespace-pre-line text-[36px] font-black leading-[1.1] tracking-tight text-white sm:text-[44px] lg:text-[56px]">
              {title}
            </h1>
            {extra ? <div>{extra}</div> : null}
            {description ? (
              <p className="max-w-2xl text-[15px] leading-relaxed text-white/85 sm:text-[16px] lg:text-[18px]">
                {description}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <h1 className="whitespace-pre-line text-[36px] font-black leading-[1.1] tracking-tight text-white sm:text-[44px] lg:text-[56px]">
                {title}
              </h1>
              {extra ? <div className="shrink-0">{extra}</div> : null}
            </div>
            {description ? (
              <p className="max-w-2xl text-[15px] leading-relaxed text-white/85 sm:text-[16px] lg:text-[18px]">
                {description}
              </p>
            ) : null}
          </>
        )}
        </div>
      </div>
    </section>
  );
}
