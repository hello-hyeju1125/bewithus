import { ko } from "@/content/ko";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  /** @deprecated 노란 박스 로고는 어두운 배경에서도 동일하게 표시됩니다. */
  priority?: boolean;
  /** @deprecated 노란 박스 로고는 어두운 배경에서도 동일하게 표시됩니다. */
  onDark?: boolean;
};

export default function SiteLogo({ className }: SiteLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 overflow-hidden rounded-button border-2 border-primary",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex max-w-full items-center rounded-logo-inner bg-accent-500 px-2.5 py-1 font-sans text-primary shadow-logo-plate",
          "h-8 text-[19px] lg:h-9 lg:px-3 lg:py-1 lg:text-[24px]",
        )}
      >
        <span className="truncate font-black leading-none tracking-[-0.04em]">
          {ko.brand.short}
        </span>
      </span>
    </span>
  );
}
