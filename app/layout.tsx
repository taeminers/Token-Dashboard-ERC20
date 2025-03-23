import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext/WalletContext";

const notoSansKr = Noto_Sans_KR({
  preload: true,
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
