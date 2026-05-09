import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getModule } from "@/lib/mock-store";
import { packageScorm12, type ScormSlide } from "@kiris/scorm";

export const runtime = "nodejs";

/**
 * Module export proxy. When USE_API=true, forwards to the API. Otherwise
 * packages SCORM inline from the mock store so the editor's Export button
 * produces a real ZIP for design demos.
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = getSession();

  if (process.env.USE_API === "true") {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const token = `dev:${session.user.id}:${session.tenant.id}:${session.tenant.tier}:${session.user.role}`;
    const res = await fetch(`${apiUrl}/v1/modules/${id}/export`, {
      method: "POST",
      headers: {
        authorization: `bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ format: "scorm12" }),
      cache: "no-store",
    });
    if (!res.ok) return new NextResponse("export failed", { status: res.status });

    // The API returns either an inline ZIP (local dev with no S3) or a JSON
    // envelope with a presigned ≤ 5-minute download URL (production).
    const ct = res.headers.get("content-type") ?? "";
    if (ct.startsWith("application/json")) {
      const body = (await res.json()) as { downloadUrl: string };
      return NextResponse.redirect(body.downloadUrl, 303);
    }
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "content-type": ct || "application/zip",
        "content-disposition":
          res.headers.get("content-disposition") ?? `attachment; filename="${id}.zip"`,
      },
    });
  }

  // Mock-store path — package directly so the demo flow works without the API.
  const mod = getModule(id);
  if (!mod) return new NextResponse("not found", { status: 404 });

  const slides: ScormSlide[] = mod.slides.map((s) => ({
    id: s.id,
    position: s.position,
    type: s.type,
    title: s.title,
    bodyMarkdown: s.bodyMarkdown,
    narrationScript: s.narrationScript,
    altText: s.altText,
    durationSeconds: s.durationSeconds,
  }));

  const zip = packageScorm12({
    id: mod.id,
    title: mod.title,
    authoringMode: mod.authoringMode,
    estimatedDurationSeconds: mod.estimatedDurationSeconds,
    learningObjectives: mod.learningObjectives,
    audience: mod.audience,
    slides,
    tier: session.tenant.tier,
  });

  return new NextResponse(Buffer.from(zip), {
    status: 200,
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${safeName(mod.title)}-scorm12.zip"`,
    },
  });
}

function safeName(s: string): string {
  return s.replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 80) || "kiris-module";
}
