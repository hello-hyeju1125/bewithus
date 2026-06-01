"use client";

import Image from "next/image";

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
      <DialogContent className="max-h-[min(90vh,900px)] overflow-y-auto sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{tuition.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pr-1">
          {tuition.images.map((image) => (
            <figure
              key={image.src}
              className="overflow-hidden rounded-card border border-neutral-200 bg-neutral-50"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={794}
                height={1123}
                sizes="(min-width: 640px) 672px, 100vw"
                className="block h-auto w-full"
              />
            </figure>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
