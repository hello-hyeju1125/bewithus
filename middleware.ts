import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  isAdminPasswordConfigured,
  verifyAdminSessionToken,
} from "@/lib/admin/session-edge";

/**
 * /admin/* 경로 보호용 미들웨어.
 *
 * - `.env.local` 의 ADMIN_PASSWORD / ADMIN_SESSION_SECRET 으로 발급한
 *   HttpOnly 세션 쿠키로 관리자 접근을 제한합니다.
 * - `/admin/login` 은 미인증만 허용, 인증 시 `/admin` 으로 보냅니다.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginRoute = pathname === "/admin/login";
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthed = await verifyAdminSessionToken(token);

  if (!isAdminPasswordConfigured()) {
    if (!isLoginRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = `?redirectTo=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (!isLoginRoute && !isAuthed) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = `?redirectTo=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAuthed) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)).*)",
  ],
};
