"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { tuition } from "@/content/tuition";

type TuitionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TuitionModal({ open, onOpenChange }: TuitionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,900px)] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{tuition.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pr-1">
          {tuition.documents.map((document) => (
            <section key={document.src} className="space-y-2.5">
              <h3 className="text-[14px] font-bold text-primary">
                {document.title}
              </h3>
              <div className="overflow-hidden rounded-card border border-neutral-200 bg-neutral-50">
                <iframe
                  src={document.src}
                  title={document.title}
                  className="block h-[min(70vh,560px)] w-full"
                />
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
