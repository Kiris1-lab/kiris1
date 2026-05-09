import { NextResponse, type NextRequest } from "next/server";

/**
 * Authoring app — strict per-request nonce CSP. Allows Polly audio playback
 * (media-src), Anthropic responses streamed via our API (connect-src), and
 * S3 signed-URL downloads (img-src https). Never allows third-party scripts.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isProd = process.env.NODE_ENV === "production";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' ${isProd ? "" : "'unsafe-eval'"}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `media-src 'self' blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' ${apiUrl}`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
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
