import "@kiris/ui/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SkipLink } from "@kiris/ui";
import { AdminShell } from "@/components/admin-shell";

const inter = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "Kiris admin", template: "%s · Kiris admin" },
  description: "Internal operator console.",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SkipLink />
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
