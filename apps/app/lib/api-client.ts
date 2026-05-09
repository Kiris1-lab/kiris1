/**
 * Thin client for `apps/api`. Wired in Step 4 once Cognito + Stripe are
 * provisioned. Until then `lib/mock-store.ts` remains the data source.
 *
 * Usage from server components:
 *   const client = apiClient({ token });
 *   const { modules } = await client.listModules();
 *
 * Hard rules:
 *   - Never read API_URL or auth tokens from the browser. This module is
 *     server-only — the React `"use client"` boundary stops at the route's
 *     server component.
 *   - PHI never travels through this client to a third party. Every call
 *     terminates at @kiris/api which has the scrubber + tier router.
 */

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ApiClientOptions {
  token: string;
  baseUrl?: string;
  signal?: AbortSignal;
}

export interface ListedModule {
  id: string;
  title: string;
  status: string;
  authoringMode: string;
  updatedAt: string;
  estimatedDurationSeconds: number;
}

export function apiClient(opts: ApiClientOptions) {
  const baseUrl = opts.baseUrl ?? DEFAULT_BASE_URL;
  const headers: HeadersInit = {
    authorization: `bearer ${opts.token}`,
    "content-type": "application/json",
  };

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { ...headers, ...(init?.headers ?? {}) },
      signal: opts.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`api ${path} ${res.status}: ${text}`);
    }
    return (await res.json()) as T;
  }

  return {
    listModules: () => request<{ modules: ListedModule[] }>("/v1/modules"),
    getModule: (id: string) => request<{ module: unknown; slides: unknown[] }>(`/v1/modules/${id}`),
    createModule: (body: { title: string; authoringMode: "express" | "guided" }) =>
      request<{ module: unknown }>("/v1/modules", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    scrubText: (body: { text: string; targetType: string; targetId?: string }) =>
      request<{
        decision: "allow" | "confirm" | "block";
        confidence: number;
        detectedEntityTypes: string[];
      }>("/v1/scrubber/text", { method: "POST", body: JSON.stringify(body) }),
    generateExpress: (body: {
      title: string;
      audience: string;
      goal?: string;
      targetDurationSeconds: number | null;
      materialsText?: string;
      moduleId?: string;
    }) =>
      request<{ module: unknown; validation: unknown[]; requestId: string | null }>(
        "/v1/generate/express",
        { method: "POST", body: JSON.stringify(body) },
      ),
  };
}
