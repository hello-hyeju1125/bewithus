import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  GraduationCap,
  Megaphone,
  Newspaper,
} from "lucide-react";

const SECTIONS = [
  {
    href: "/admin/timetable",
    label: "시간표 관리",
    description: "학교/학년/뷰별 시간표 이미지를 업로드하고 활성화합니다.",
    icon: CalendarRange,
  },
  {
    href: "/admin/teachers",
    label: "강사진 관리",
    description: "강사 프로필과 노출 순서를 관리합니다.",
    icon: GraduationCap,
  },
  {
    href: "/admin/info-session",
    label: "설명회 관리",
    description: "다가오는 설명회 일정과 신청 링크를 등록합니다.",
    icon: Megaphone,
  },
  {
    href: "/admin/notice",
    label: "공지사항 관리",
    description: "공지 게시물 작성, 수정, 고정, 게시 여부를 관리합니다.",
    icon: Newspaper,
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-[26px] font-black tracking-tight text-primary sm:text-[30px]">
          대시보드
        </h1>
        <p className="mt-1 text-[14px] text-neutral-500">
          관리할 영역을 선택하세요. 각 섹션의 CRUD 기능은 Phase 3 에서 활성화됩니다.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex h-full flex-col gap-2 rounded-card border border-neutral-200 bg-white p-6 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_12px_24px_-12px_rgba(34,41,93,0.2)] focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className="h-7 w-7 text-primary"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <ArrowRight
                    className="h-5 w-5 text-neutral-300 transition-colors group-hover:text-primary"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-2 text-[18px] font-black tracking-tight text-primary">
                  {s.label}
                </h2>
                <p className="text-[13px] leading-relaxed text-neutral-600">
                  {s.description}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
