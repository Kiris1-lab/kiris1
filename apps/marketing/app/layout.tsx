import "@kiris/ui/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SkipLink } from "@kiris/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://kiris.ai"),
  title: {
    default: "Kiris — narrated e-learning for hospitals",
    template: "%s · Kiris",
  },
  description:
    "Drop in screenshots and bullet points. Get back a polished, narrated SCORM module in under 10 minutes. Export to HealthStream, Cornerstone, Relias, or any LMS.",
  openGraph: {
    type: "website",
    siteName: "Kiris",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
