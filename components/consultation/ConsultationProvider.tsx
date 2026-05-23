"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import ConsultationModal from "@/components/consultation/ConsultationModal";
import { Toaster } from "@/components/ui/sonner";

type ConsultationContextValue = {
  open: () => void;
  close: () => void;
};

const ConsultationContext = createContext<ConsultationContextValue | null>(
  null,
);

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) {
    throw new Error("useConsultation must be used within ConsultationProvider");
  }
  return ctx;
}

export default function ConsultationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open: openModal, close: closeModal }),
    [openModal, closeModal],
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      <ConsultationModal open={open} onOpenChange={setOpen} />
      <Toaster />
    </ConsultationContext.Provider>
  );
}
