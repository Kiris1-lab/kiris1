import { NextResponse } from "next/server";
import { getAdminConfig, SESSION_COOKIE_NAME } from "@/lib/admin-config";

export const runtime = "nodejs";

export async function POST() {
  const cfg = getAdminConfig();
  const res = NextResponse.redirect(`${cfg.baseUrl}/sign-in`);
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
