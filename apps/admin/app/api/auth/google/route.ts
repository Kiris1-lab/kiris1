import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getAdminConfig } from "@/lib/admin-config";

export const runtime = "nodejs";

/**
 * Initiates Google OAuth. Redirects the user to Google's consent screen with
 * `hd=<workspaceDomain>` so non-Workspace accounts are filtered at the IDP.
 * The callback verifies `hd` again server-side because the URL parameter is
 * advisory only.
 */
export async function GET() {
  const cfg = getAdminConfig();
  if (!cfg.googleClientId) {
    return NextResponse.redirect(`${cfg.baseUrl}/sign-in?error=oauth_failed`);
  }

  const state = randomBytes(24).toString("base64url");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", cfg.googleClientId);
  url.searchParams.set("redirect_uri", `${cfg.baseUrl}/api/auth/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("hd", cfg.googleHostedDomain);
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url.toString());
  // CSRF protection: pin the state to a short-lived cookie that the callback
  // verifies. Cookie is HttpOnly so client JS can't read or forge it.
  res.cookies.set("kiris.admin.oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 600,
  });
  return res;
}
