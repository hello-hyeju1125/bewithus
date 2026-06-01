"use client";

import { useState } from "react";
import Link from "next/link";

import PrivacyPolicyModal from "@/components/layout/PrivacyPolicyModal";
import TermsOfServiceModal from "@/components/layout/TermsOfServiceModal";
import TuitionModal from "@/components/layout/TuitionModal";
import { ko } from "@/content/ko";
import { siteContainerClass } from "@/lib/layout/spacing";

const linkClassName =
  "text-[14px] font-semibold text-primary/80 transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none";

type QuickLinkAction = "privacy-policy" | "terms-of-service" | "tuition";

type FooterQuickLinkItem =
  | { label: string; action: QuickLinkAction }
  | { label: string; href: string };

export default function FooterQuickLinks() {
  const { quickLinks } = ko.footer;
  const items = quickLinks.items as readonly FooterQuickLinkItem[];
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [tuitionOpen, setTuitionOpen] = useState(false);

  const openModal = (action: QuickLinkAction) => {
    if (action === "privacy-policy") setPrivacyOpen(true);
    if (action === "terms-of-service") setTermsOpen(true);
    if (action === "tuition") setTuitionOpen(true);
  };

  return (
    <>
      <div className="bg-primary-100">
        <nav aria-label={quickLinks.title} className={siteContainerClass}>
          <ul className="flex min-h-[52px] flex-wrap items-center justify-end gap-x-5 gap-y-2 py-2 sm:gap-x-7">
            {items.map((item) => (
              <li key={item.label}>
                {"action" in item ? (
                  <button
                    type="button"
                    onClick={() => openModal(item.action as QuickLinkAction)}
                    className={linkClassName}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={linkClassName}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <PrivacyPolicyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <TermsOfServiceModal open={termsOpen} onOpenChange={setTermsOpen} />
      <TuitionModal open={tuitionOpen} onOpenChange={setTuitionOpen} />
    </>
  );
}
