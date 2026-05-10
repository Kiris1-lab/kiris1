import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Internal admin — strictest CSP plus session-cookie gate.
 *
 * Hard rules (DESIGN §15.1):
 *   - Every admin path requires a verified internal session.
 *   - No path bypasses except /sign-in and /api/auth/* (the sign-in flow).
 *   - The session cookie is HMAC-signed (HS256) by ADMIN_SESSION_SIGNING_KEY.
 *
 * Local dev: ADMIN_DEV_SESSION_ONLY=true bypasses session verification (still
 * refused in production by lib/admin-config.ts).
 */
const SESSION_COOKIE_NAME = "kiris.admin.session";
const PUBLIC_PREFIXES = ["/sign-in", "/api/auth/"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProd = process.env.NODE_ENV === "production";
  const devSessionOnly = process.env.ADMIN_DEV_SESSION_ONLY === "true";

  // CSP nonce setup (preserved from original middleware).
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
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

  const setCspAndNonce = (res: NextResponse) => {
    res.headers.set("Content-Security-Policy", csp);
    res.headers.set("x-nonce", nonce);
    return res;
  };

  // Allow the sign-in page and OAuth callback to load without a session.
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    const headers = new Headers(request.headers);
    headers.set("x-nonce", nonce);
    return setCspAndNonce(NextResponse.next({ request: { headers } }));
  }

  // Local-dev bypass — refused in prod by getAdminConfig() at boot.
  if (!isProd && devSessionOnly) {
    const headers = new Headers(request.headers);
    headers.set("x-nonce", nonce);
    return setCspAndNonce(NextResponse.next({ request: { headers } }));
  }

  const signingKeyRaw = process.env.ADMIN_SESSION_SIGNING_KEY;
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let valid = false;
  if (signingKeyRaw && cookie) {
    try {
      await jwtVerify(cookie, new TextEncoder().encode(signingKeyRaw), {
        algorithms: ["HS256"],
        issuer: "kiris.admin",
        audience: "kiris.admin",
      });
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.search = "";
    if (pathname !== "/" && pathname !== "/sign-in") {
      signInUrl.searchParams.set("next", pathname + search);
    }
    return setCspAndNonce(NextResponse.redirect(signInUrl));
  }

  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  return setCspAndNonce(NextResponse.next({ request: { headers } }));
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
    },
  ],
};
