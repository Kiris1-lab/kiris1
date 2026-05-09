import { NextResponse, type NextRequest } from "next/server";

/**
 * Internal admin — strictest CSP. No third-party scripts ever; the console
 * is a closed surface (DESIGN §15.1). Per-request nonce for our own scripts.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isProd = process.env.NODE_ENV === "production";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' ${isProd ? "" : "'unsafe-eval'"}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self' data:`,
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  const res = NextResponse.next({ request: { headers } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
    },
  ],
};
