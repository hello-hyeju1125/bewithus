import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "관리자 | W대치위더스",
  robots: { index: false, follow: false },
};

// 관리자 라우트는 모두 인증된 세션 쿠키 기반이므로 정적 prerender 대상이 아닙니다.
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
