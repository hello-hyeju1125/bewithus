import ConsultationProvider from "@/components/consultation/ConsultationProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingSideWidget from "@/components/layout/FloatingSideWidget";
import { getConsultationFormFields } from "@/lib/supabase/queries";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const consultationFields = await getConsultationFormFields();

  return (
    <ConsultationProvider fields={consultationFields}>
      <Header />
      {children}
      <FloatingSideWidget />
      <Footer />
    </ConsultationProvider>
  );
}
