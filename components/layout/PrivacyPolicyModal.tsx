"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { privacyPolicy } from "@/content/privacy-policy";

type PrivacyPolicyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PrivacyPolicyModal({
  open,
  onOpenChange,
}: PrivacyPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{privacyPolicy.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pr-1 text-[13px] leading-relaxed text-neutral-700">
          {privacyPolicy.sections.map((section) => (
            <section key={section.heading} className="space-y-2.5">
              <h3 className="text-[14px] font-bold text-primary">
                {section.heading}
              </h3>

              {"paragraphs" in section &&
                section.paragraphs?.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}

              {"subsections" in section &&
                section.subsections?.map((subsection) => (
                  <div key={subsection.title} className="space-y-1 pl-1">
                    <p className="font-semibold text-neutral-800">
                      {subsection.title}
                    </p>
                    <p>{subsection.body}</p>
                    {"note" in subsection && subsection.note ? (
                      <p className="text-neutral-600">- {subsection.note}</p>
                    ) : null}
                  </div>
                ))}

              {"list" in section && section.list ? (
                <ul className="list-inside list-disc space-y-1 pl-1">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {"contact" in section && section.contact ? (
                <div className="space-y-1.5 pl-1">
                  <p className="font-semibold text-neutral-800">
                    {section.contact.heading}
                  </p>
                  <ul className="space-y-1">
                    {section.contact.items.map((item) => (
                      <li key={item.label}>
                        - {item.label}: {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
