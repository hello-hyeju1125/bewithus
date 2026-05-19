import Link from "next/link";
import { Phone } from "lucide-react";
import { ko } from "@/content/ko";
import { LOCATION_CAMPUSES } from "@/content/location";
import {
  siteContainerClass,
  siteGapBeforeFooterClass,
} from "@/lib/layout/spacing";

export default function Footer() {
  const { brand, quickLinks, customerCenter, legal, a11y } = ko.footer;

  return (
    <footer
      aria-label={a11y.label}
      className={`${siteGapBeforeFooterClass} bg-primary text-white`}
    >
      {/* 빠른 메뉴 띠 — 라이트 블루 배경, 우측 정렬 */}
      <div className="bg-primary-100">
        <nav
          aria-label={quickLinks.title}
          className={siteContainerClass}
        >
          <ul className="flex min-h-[52px] flex-wrap items-center justify-end gap-x-5 gap-y-2 py-2 sm:gap-x-7">
            {quickLinks.items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[14px] font-semibold text-primary/80 transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`${siteContainerClass} py-8 sm:py-9 lg:py-10`}>
        {/* 핵심 정보 영역 — 브랜드 + 전화번호 한 줄, 그 아래 상담시간 */}
        <div className="border-b border-white/15 pb-6">
          <div className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
            <Link
              href="/"
              className="inline-flex rounded-button outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <span className="font-logo text-[32px] font-black leading-none tracking-[-0.03em] text-accent">
                {brand.name}
              </span>
            </Link>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {customerCenter.phones.map((phone) => (
                <li key={phone.tel}>
                  <a
                    href={`tel:${phone.tel}`}
                    className="group/phone relative inline-flex items-center gap-2 pb-0.5 text-[26px] font-bold tracking-tight text-white transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-[width] after:duration-200 after:ease-out hover:text-accent hover:after:w-full focus-visible:text-accent focus-visible:outline-none sm:text-[28px]"
                  >
                    <Phone
                      className="h-6 w-6 shrink-0 transition-colors duration-200 group-hover/phone:text-accent"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-[20px] font-bold leading-relaxed text-white sm:text-[24px]">
            {customerCenter.hours}
          </p>
        </div>

        {/* 관 소개 카드 — 흰 배경, 어두운 텍스트, 글자 키움 + 여백 최소 */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATION_CAMPUSES.map((campus) => (
            <a
              key={campus.id}
              href={campus.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[3px] border border-neutral-200 bg-white px-3.5 py-3 outline-none transition-colors duration-200 ease-out hover:border-accent-500 hover:bg-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <p className="text-[22px] font-black leading-tight tracking-tight text-primary">
                {campus.footerName}
              </p>
              <p className="mt-1.5 text-[14px] leading-snug text-neutral-700">
                {campus.address}
              </p>
              <p className="mt-1.5 text-[17px] font-bold leading-tight tracking-tight text-neutral-900">
                {campus.phone.display.replace(/-/g, ".")}
              </p>
            </a>
          ))}
        </div>

        {/* 사업자 정보 + 카피라이트 — 한 줄, 카피라이트는 우측 정렬 */}
        <div className="mt-5 border-t border-white/15 pt-4 text-[12.5px] leading-relaxed text-white">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              <li>{legal.businessNumber}</li>
              <li>{legal.academyNumber}</li>
              <li>{legal.reportingAuthority}</li>
            </ul>
            <p>{legal.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
