import {
  isSimpleHeroDescription,
  normalizeHeroDescription,
  type HeroDescriptionInput,
} from "@/lib/layout/hero-description";
import { cn } from "@/lib/utils";

type HeroDescriptionProps = {
  content: HeroDescriptionInput;
  /** 티파니 Hero 등 배경에 따른 텍스트 톤 */
  variant?: "navy" | "tiffany";
  /** 단순 문단 모드용 기본 설명 클래스 */
  descriptionClass?: string;
};

const emphasisClass =
  "font-black text-primary bg-accent-500 box-decoration-clone px-1.5 py-0.5 rounded-[4px]";

const tierClass = {
  navy: {
    lead: "text-white",
    body: "text-white/80",
    closing: "text-white/90",
    emphasis: emphasisClass,
  },
  tiffany: {
    lead: "text-primary",
    body: "text-primary/75",
    closing: "text-primary/90",
    emphasis: emphasisClass,
  },
} as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitByEmphasis(
  text: string,
  emphasis: readonly string[] | undefined,
): Array<{ text: string; emphasized: boolean }> {
  if (!emphasis?.length) return [{ text, emphasized: false }];

  const terms = [...emphasis]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "g");
  const parts = text.split(pattern).filter((part) => part.length > 0);

  return parts.map((part) => ({
    text: part,
    emphasized: terms.includes(part),
  }));
}

function EmphasisText({
  text,
  emphasis,
  emphasisClass,
}: {
  text: string;
  emphasis?: readonly string[];
  emphasisClass: string;
}) {
  const segments = splitByEmphasis(text, emphasis);

  return (
    <>
      {segments.map((segment, index) =>
        segment.emphasized ? (
          <span key={`${segment.text}-${index}`} className={emphasisClass}>
            {segment.text}
          </span>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        ),
      )}
    </>
  );
}

function ClosingLines({
  lines,
  className,
  emphasis,
  emphasisClass,
}: {
  lines: readonly string[];
  className: string;
  emphasis?: readonly string[];
  emphasisClass: string;
}) {
  return (
    <>
      {lines.map((line) => (
        <p key={line} className={className}>
          <EmphasisText
            text={line}
            emphasis={emphasis}
            emphasisClass={emphasisClass}
          />
        </p>
      ))}
    </>
  );
}

export default function HeroDescription({
  content,
  variant = "navy",
  descriptionClass,
}: HeroDescriptionProps) {
  const normalized = normalizeHeroDescription(content);
  if (!normalized) return null;

  const palette = tierClass[variant];
  const emphasisClass = palette.emphasis;

  if (isSimpleHeroDescription(normalized)) {
    const line = normalized.body?.[0] ?? "";
    return (
      <p
        className={cn(
          "max-w-2xl text-[17px] leading-relaxed sm:text-[19px] lg:text-[22px]",
          descriptionClass ?? palette.body,
        )}
      >
        <EmphasisText
          text={line}
          emphasis={normalized.emphasis}
          emphasisClass={emphasisClass}
        />
      </p>
    );
  }

  const closingLineClass = cn(
    "text-[17px] font-semibold leading-relaxed sm:text-[18px] lg:text-[20px]",
    palette.closing,
  );

  if (normalized.closingLines?.length) {
    const mobileClosingLines = normalized.mobile?.closingLines;
    return (
      <div className="flex max-w-2xl flex-col gap-2 text-center sm:gap-2.5">
        {mobileClosingLines?.length ? (
          <div className="contents sm:hidden">
            <ClosingLines
              lines={mobileClosingLines}
              className={closingLineClass}
              emphasis={normalized.emphasis}
              emphasisClass={emphasisClass}
            />
          </div>
        ) : null}
        <div
          className={cn(
            mobileClosingLines?.length ? "hidden sm:contents" : "contents",
          )}
        >
          <ClosingLines
            lines={normalized.closingLines}
            className={closingLineClass}
            emphasis={normalized.emphasis}
            emphasisClass={emphasisClass}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-2 text-center sm:gap-2.5">
      {normalized.lead ? (
        <p
          className={cn(
            "text-[19px] font-black leading-snug tracking-tight sm:text-[21px] lg:text-[24px]",
            palette.lead,
          )}
        >
          <EmphasisText
            text={normalized.lead}
            emphasis={normalized.emphasis}
            emphasisClass={emphasisClass}
          />
        </p>
      ) : null}
      {normalized.body?.map((line) => (
        <p
          key={line}
          className={cn(
            "text-[16px] font-medium leading-relaxed sm:text-[17px] lg:text-[19px]",
            palette.body,
          )}
        >
          <EmphasisText
            text={line}
            emphasis={normalized.emphasis}
            emphasisClass={emphasisClass}
          />
        </p>
      ))}
      {normalized.closing ? (
        <>
          {normalized.mobile?.closingLines?.length ? (
            <div className="contents sm:hidden">
              <ClosingLines
                lines={normalized.mobile.closingLines}
                className={closingLineClass}
                emphasis={normalized.emphasis}
                emphasisClass={emphasisClass}
              />
            </div>
          ) : null}
          <p
            className={cn(
              closingLineClass,
              normalized.mobile?.closingLines?.length ? "hidden sm:block" : undefined,
            )}
          >
            <EmphasisText
              text={normalized.closing}
              emphasis={normalized.emphasis}
              emphasisClass={emphasisClass}
            />
          </p>
        </>
      ) : null}
    </div>
  );
}
