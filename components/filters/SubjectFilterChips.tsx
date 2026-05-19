"use client";

export const ALL_SUBJECT = "__all__";

type SubjectFilterChipsProps = {
  subjects: string[];
  active: string;
  onChange: (subject: string) => void;
  ariaLabel?: string;
};

export default function SubjectFilterChips({
  subjects,
  active,
  onChange,
  ariaLabel = "과목 필터",
}: SubjectFilterChipsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <SubjectChip
        label="#전체"
        active={active === ALL_SUBJECT}
        onClick={() => onChange(ALL_SUBJECT)}
      />
      {subjects.map((s) => (
        <SubjectChip
          key={s}
          label={`#${s}`}
          active={active === s}
          onClick={() => onChange(s)}
        />
      ))}
    </div>
  );
}

function SubjectChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex h-11 items-center rounded-full border px-5 text-[16px] font-black transition-colors sm:h-12 sm:px-6 sm:text-[18px] ${
        active
          ? "border-primary bg-primary text-white"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-primary hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}
