import "@kiris/ui/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Forces dynamic rendering so middleware's per-request nonce CSP can
  // protect Next's bootstrap scripts. Statically prerendered pages would
  // ship un-nonced inline scripts that the strict CSP blocks at request
  // time, breaking hydration.
  await headers();

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SkipLink />
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
