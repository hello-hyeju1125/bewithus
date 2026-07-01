import Link from "next/link";

type SectionTabsProps = {
  active: "summary" | "courses";
};

const TABS = [
  { id: "summary", label: "요약 시간표 (이미지)", href: "/admin/timetable" },
  { id: "courses", label: "상세 강의 (표)", href: "/admin/timetable/courses" },
] as const;

export default function SectionTabs({ active }: SectionTabsProps) {
  return (
    <nav
      aria-label="시간표 섹션 탭"
      className="mb-4 flex items-center gap-2 border-b border-neutral-200"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`-mb-px inline-flex items-center border-b-2 px-3 py-2.5 text-[14px] font-semibold transition-colors ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:text-primary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
