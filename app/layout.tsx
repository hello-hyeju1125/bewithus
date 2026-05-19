import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "W대치위더스 | 대치동 프리미엄 입시학원",
  description:
    "W대치위더스는 대치동에서 결과로 증명하는 프리미엄 입시 전문 학원입니다.",
  icons: {
    icon: "/asset/WITHUS_symbol.svg",
    apple: "/asset/WITHUS_symbol.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard bg-white text-neutral-800 antialiased">
        {children}
      </body>
    </html>
  );
}
