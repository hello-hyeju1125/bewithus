import Image from "next/image";
import { cn } from "@/lib/utils";

/** `public/asset/logo.svg` viewBox (185.28 × 29.7) */
const LOGO_WIDTH = 186;
const LOGO_HEIGHT = 30;

type SiteLogoProps = {
  className?: string;
  priority?: boolean;
  /** primary 등 어두운 배경 — 로고를 흰색으로 표시 */
  onDark?: boolean;
};

export default function SiteLogo({
  className,
  priority,
  onDark = false,
}: SiteLogoProps) {
  return (
    <Image
      src="/asset/logo.svg"
      alt=""
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn(
        "h-6 w-auto lg:h-8",
        onDark && "brightness-0 invert",
        className,
      )}
    />
  );
}
