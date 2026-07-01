"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { termsOfService } from "@/content/terms-of-service";

type TermsOfServiceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TermsOfServiceModal({
  open,
  onOpenChange,
}: TermsOfServiceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{termsOfService.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pr-1 text-[13px] leading-relaxed text-neutral-700">
          {termsOfService.sections.map((section) => (
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
                  <div key={subsection.title + subsection.body.slice(0, 16)} className="space-y-1 pl-1">
                    <p className="font-semibold text-neutral-800">
                      {subsection.title}
                    </p>
                    <p>{subsection.body}</p>
                  </div>
                ))}

              {"list" in section && section.list ? (
                <ul className="list-inside space-y-1 pl-1">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
