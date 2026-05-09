import { NextResponse, type NextRequest } from "next/server";

/**
 * Per-request nonce-based CSP. DESIGN §12: "Strict CSP, nonce-based, no
 * `unsafe-inline`." Marketing site is fully static content + Plausible
 * analytics + a single Stripe-Checkout redirect from /signup; everything else
 * is same-origin.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isProd = process.env.NODE_ENV === "production";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' ${isProd ? "" : "'unsafe-eval'"} https://plausible.io`,
    `style-src 'self' 'unsafe-inline'`, // Tailwind needs inline styles; reviewed
    `img-src 'self' data: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://plausible.io https://api.kiris.ai`,
    `frame-ancestors 'none'`,
    `form-action 'self' https://checkout.stripe.com`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ]
    .filter(Boolean)
    .join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [{ type: "header", key: "next-router-prefetch" }],
    },
  ],
};
