import "@kiris/ui/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SkipLink } from "@kiris/ui";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Kiris", template: "%s · Kiris" },
  description: "Author and ship narrated e-learning modules.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
