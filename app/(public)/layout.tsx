import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingSideWidget from "@/components/layout/FloatingSideWidget";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <FloatingSideWidget />
      <Footer />
    </>
  );
}
