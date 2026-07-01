import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { createSiteMetadata } from "@/lib/site/metadata";
import "./globals.css";

export const metadata = createSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard bg-white text-neutral-800 antialiased">
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
