import { ko } from "@/content/ko";
import { cn } from "@/lib/utils";

const W_MARK_PATH =
  "M41.93.06v1.48s-.58,0-.58,0h-.87c-.77-.02-1.43.28-1.82.94-.11.19-.19.37-.27.59l-1.37,3.57-1.56,4.07-4.11,10.96-3.01,8.04h-1.85s-.26-.53-.26-.53l-3.96-9.81-1.73-4.28L15.87,3.48c-.18-.44-.42-.85-.68-1.24-.27-.41-.72-.67-1.2-.67l-1.41-.02-3.18.04c-.15,0-.29.03-.43.08-.3.11-.26.47-.14.77l1.59,4.18,1.68,4.2,4.52,11.28.03.04s.01.01.02,0l.02-.06,2.23-5.82,1.34,2.89-.39,1.07-3.56,9.47h-1.84s-.24-.45-.24-.45l-2.26-5.62L5.46,7.48l-1.61-3.97c-.12-.29-.25-.54-.38-.81-.39-.8-1.08-1.18-1.97-1.18H0s0-1.52,0-1.52l.35.02h23.87s0,1.5,0,1.5h-2.25c-.37.05-1.03.04-1.15.34-.05.13-.04.29,0,.43.2.63.39,1.25.64,1.87l3.29,8.21,3.82,9.51.13.26,4.32-11.26,1.59-4.16,1.23-3.22c.15-.4.24-.81.28-1.24.01-.13-.01-.28-.07-.39-.1-.17-.27-.22-.45-.26l-1.81-.08-1.66-.02V.04s9.81.02,9.81.02Z";

type SiteLogoProps = {
  className?: string;
  /** @deprecated 노란 박스 로고는 어두운 배경에서도 동일하게 표시됩니다. */
  priority?: boolean;
  /** @deprecated 노란 박스 로고는 어두운 배경에서도 동일하게 표시됩니다. */
  onDark?: boolean;
};

function BrandWMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 30"
      className={cn("w-auto shrink-0 text-primary", className)}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        paintOrder="stroke fill"
        d={W_MARK_PATH}
      />
    </svg>
  );
}

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
          "inline-flex max-w-full items-center gap-1 rounded-logo-inner bg-accent-500 px-2.5 py-1 font-sans text-primary shadow-logo-plate",
          "h-8 text-[19px] lg:h-9 lg:px-3 lg:py-1 lg:text-[24px]",
        )}
      >
        <BrandWMark className="h-[1em]" />
        <span className="truncate font-black leading-none tracking-[-0.04em]">
          {ko.brand.short}
        </span>
      </span>
    </span>
  );
}
