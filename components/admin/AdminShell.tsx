"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarRange,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { useCallback } from "react";

import { logoutAdminAction } from "@/app/admin/login/actions";
import { Toaster } from "@/components/ui/sonner";

type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const ADMIN_NAV: readonly AdminNavItem[] = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/admin/timetable", label: "시간표", icon: CalendarRange },
  { href: "/admin/teachers", label: "강사진", icon: GraduationCap },
  { href: "/admin/info-session", label: "설명회", icon: Megaphone },
  { href: "/admin/notice", label: "공지사항", icon: Newspaper },
  { href: "/admin/consultations", label: "입학 상담", icon: MessageSquare },
];

/**
 * 관리자 페이지 셸 (헤더/푸터 제외, 좌측 사이드바 기반).
 *
 * 로그인 페이지(`/admin/login`)에서는 사이드바를 노출하지 않고
 * 중앙 정렬 카드 레이아웃만 그립니다.
 */
export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  const onLogout = useCallback(async () => {
    await logoutAdminAction();
    router.replace("/admin/login");
    router.refresh();
  }, [router]);

  if (isLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-5 py-10">
        {children}
        <Toaster />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-800">
      <aside
        aria-label="관리자 네비게이션"
        className="hidden w-[240px] shrink-0 flex-col border-r border-neutral-200 bg-white lg:flex"
      >
        <div className="flex h-[64px] items-center gap-2 border-b border-neutral-200 px-5">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-button bg-primary font-bold text-accent"
          >
            W
          </span>
          <span className="font-logo text-[18px] font-bold tracking-[-0.03em] text-primary">
            Admin
          </span>
        </div>
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-button px-3 py-2.5 text-[14px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-neutral-200 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-button px-3 py-2.5 text-[14px] font-semibold text-neutral-700 outline-none transition-colors hover:bg-neutral-100 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            로그아웃
          </button>
        </div>
      </aside>

      <div className="flex w-full flex-col">
        <header className="flex h-[64px] items-center justify-between border-b border-neutral-200 bg-white px-5">
          <p className="text-[14px] font-semibold text-neutral-500">
            대치위더스 관리자
          </p>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold text-neutral-600 underline-offset-4 hover:text-primary hover:underline"
          >
            사이트로 이동
          </Link>
        </header>
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
