import "@kiris/ui/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { SkipLink } from "@kiris/ui";

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
  title: { default: "Kiris", template: "%s · Kiris" },
  description: "Author and ship narrated e-learning modules.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Forces dynamic rendering so middleware's per-request nonce CSP can
  // protect Next's bootstrap scripts. Without this, statically-rendered
  // pages have un-nonced inline scripts that the CSP blocks → blank page
  // after a flash of content.
  await headers();

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
