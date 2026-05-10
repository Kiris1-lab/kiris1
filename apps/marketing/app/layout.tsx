import "@kiris/ui/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { SkipLink } from "@kiris/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Reading the request headers forces dynamic rendering, which is required
  // for the per-request nonce CSP set by middleware.ts to work. With static
  // rendering, Next's bootstrap scripts have no nonce attribute baked in,
  // so the CSP that arrives at request time blocks them and React fails to
  // hydrate (resulting in a flash of content followed by a blank page).
  // Next.js auto-applies the nonce from the x-nonce request header to its
  // own bootstrap scripts once a route is dynamic.
  await headers();

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
