"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Menu, X } from "lucide-react";
import { ko } from "@/content/ko";
import { headerBarTopClass } from "@/lib/layout/spacing";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 80;

/** 상단 메뉴·세부 메뉴 열 사이 간격 (값을 키울수록 메뉴 간 여백이 넓어짐) */
const NAV_COLUMN_GAP = "min-w-0 flex-[0.26]";

const logoMarkClassName =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-primary p-0.5 font-bold leading-none text-accent text-[22px] lg:h-12 lg:w-12 lg:p-1 lg:text-[24px]";

const ctaBaseClass =
  "shrink-0 rounded-button bg-accent-500 font-bold leading-tight text-primary outline-none transition-colors duration-200 hover:bg-accent-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverMenuOpen, setHoverMenuOpen] = useState(false);
  const [hoveredNavHref, setHoveredNavHref] = useState<string | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const closeMegaMenu = useCallback(() => {
    setHoverMenuOpen(false);
    setHoveredNavHref(null);
  }, []);

  const closeAllMenus = useCallback(() => {
    closeMegaMenu();
    setMenuOpen(false);
  }, [closeMegaMenu]);

  useLayoutEffect(() => {
    closeAllMenus();
    window.scrollTo(0, 0);
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, [pathname, closeAllMenus]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      hamburgerRef.current?.focus();
    };
  }, [menuOpen]);

  /** 홈 최상단만 투명 GNB — 서브 페이지·스크롤·메가메뉴 시 흰 배경 */
  const headerBg =
    !isHomePage || hoverMenuOpen || scrolled ? "bg-white" : "bg-transparent";

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-50"
        onMouseEnter={() => setHoverMenuOpen(true)}
        onMouseLeave={() => {
          setHoverMenuOpen(false);
          setHoveredNavHref(null);
        }}
      >
        {/* 메가메뉴 배경: 전체 너비 흰 패널 + 상단 구분선 */}
        <div
          className={`pointer-events-none absolute inset-x-0 ${headerBarTopClass} bottom-0 hidden border-t border-neutral-200 bg-white transition-opacity duration-200 lg:block ${
            hoverMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        <header
          className={`relative z-10 transition-[background-color,border-color] duration-300 ${headerBg} ${
            hoverMenuOpen ? "" : "border-b border-neutral-200"
          }`}
        >
          <div
            className={cn(
              "mx-auto max-w-[1400px] grid-cols-[1fr_auto] px-5 sm:px-8 lg:grid lg:grid-cols-[45fr_55fr_100px] lg:items-start lg:gap-8 lg:px-10",
            )}
          >
            <div className="flex h-[72px] items-center">
              <Link
                href="/"
                aria-label={ko.brand.fullAria}
                onClick={closeAllMenus}
                className="group/logo inline-flex w-fit items-center gap-2.5 rounded-button outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span aria-hidden="true" className={logoMarkClassName}>
                  {ko.brand.mark}
                </span>
                <span className="font-logo text-[20px] font-bold tracking-[-0.03em] text-primary lg:text-[26px]">
                  {ko.brand.short}
                </span>
              </Link>
            </div>

            <nav
              className="hidden w-full lg:block"
              aria-label={ko.nav.a11y.primaryLabel}
            >
              <div className="flex w-full items-start">
                {ko.nav.primary.map((item, index) => {
                  const isHovered = hoveredNavHref === item.href;
                  return (
                    <Fragment key={item.href}>
                      {index > 0 ? (
                        <span className={NAV_COLUMN_GAP} aria-hidden="true" />
                      ) : null}
                      <div
                        className="flex shrink-0 flex-col items-start"
                        onMouseEnter={() => setHoveredNavHref(item.href)}
                      >
                        <div className="flex h-[72px] items-center">
                          <Link
                            href={item.href}
                            onClick={closeAllMenus}
                            className={`group relative inline-flex items-center py-2 text-[20px] leading-none outline-none transition-all duration-200 focus-visible:text-primary ${
                              isHovered
                                ? "font-black text-primary"
                                : "font-semibold text-neutral-700"
                            }`}
                          >
                            {item.label}
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[3px] bg-primary transition-[width] duration-300 ease-out ${
                                isHovered
                                  ? "w-full"
                                  : "w-0 group-hover:w-full group-focus-visible:w-full"
                              }`}
                            />
                          </Link>
                        </div>
                        {"children" in item && item.children.length > 0 ? (
                          <ul
                            className={
                              hoverMenuOpen
                                ? "space-y-2 pb-5 pt-1"
                                : "hidden"
                            }
                          >
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={closeAllMenus}
                                  className="group/sub relative inline-flex whitespace-nowrap py-1 text-[16px] font-normal leading-snug text-neutral-700 outline-none transition-[color,font-weight] duration-300 ease-out hover:font-black hover:text-primary focus-visible:font-black focus-visible:text-primary"
                                >
                                  {child.label}
                                  <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-primary transition-[width] duration-300 ease-out w-0 group-hover/sub:w-full group-focus-visible/sub:w-full"
                                  />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </nav>

            <div className="flex h-[72px] items-center justify-end gap-2 lg:justify-center">
              <Link
                href={ko.nav.cta.href}
                onClick={closeAllMenus}
                className={cn(
                  ctaBaseClass,
                  "hidden px-3 py-2.5 text-[14px] lg:inline-flex lg:w-full lg:items-center lg:justify-center lg:px-2 lg:text-[13px]",
                )}
              >
                {ko.nav.cta.label}
              </Link>

              <button
                ref={hamburgerRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={ko.nav.a11y.openMenu}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-drawer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-button text-primary outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>
      </div>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label={ko.nav.a11y.closeMenu}
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 h-full w-full bg-black/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={ko.nav.a11y.mobileDialogLabel}
          className={`relative h-full w-[300px] max-w-[82%] bg-white shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-[72px] items-center justify-between border-b border-neutral-100 px-5">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className={logoMarkClassName}>
                {ko.brand.mark}
              </span>
              <span className="font-logo text-[18px] font-bold tracking-[-0.03em] text-primary">
                {ko.brand.short}
              </span>
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              aria-label={ko.nav.a11y.closeMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-button text-primary outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav
            className="px-3 py-4"
            aria-label={ko.nav.a11y.mobileDialogLabel}
          >
            <ul className="flex flex-col">
              {ko.nav.primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeAllMenus}
                    tabIndex={menuOpen ? 0 : -1}
                    className="block rounded-button px-4 py-3.5 text-[16px] font-medium text-neutral-800 outline-none transition-colors hover:bg-neutral-50 hover:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.label}
                  </Link>
                  {"children" in item && item.children.length > 0 ? (
                    <ul className="mt-1 space-y-1 pb-2 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeAllMenus}
                            tabIndex={menuOpen ? 0 : -1}
                            className="block rounded-button px-4 py-2 text-[14px] text-neutral-600 outline-none transition-colors hover:bg-neutral-50 hover:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}
