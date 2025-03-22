import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
// const notoSansKr = Noto_Sans_KR({
//   variable: "--font-noto-sans-kr",
//   subsets: ["latin"],
// });

const notoSansKr = Noto_Sans_KR({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "fallback",
  subsets: ["latin"],
  style: "normal",
  variable: "--noto-sans_KR-medium",
  fallback: ["system-ui"],
});

export const metadata: Metadata = {
  title: "My Token Dashboard",
  description: "FE assignment for Dunamu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansKr.className} centered-body`}>
        {children}
      </body>
    </html>
  );
}
