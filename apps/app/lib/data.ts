/**
 * Data layer abstraction for `apps/app`.
 *
 * Set USE_API=true (server-side env) to read/write through @kiris/api.
 * Otherwise the in-memory mock store drives the UI — useful for design
 * iteration without bringing up Postgres.
 *
 * The cutover is one boolean: when Cognito + RDS are provisioned, set
 * USE_API=true in the deploy environment and remove the mock branch.
 */

import { listModules as mockListModules, getModule as mockGetModule } from "./mock-store.js";
import { apiClient } from "./api-client.js";
import { getSession } from "./session.js";
import type { Module, ModuleSummary } from "./types.js";

const USE_API = process.env.USE_API === "true";

/** Build the bearer token for an authenticated server-side fetch. */
function devToken(): string {
  const s = getSession();
  return `dev:${s.user.id}:${s.tenant.id}:${s.tenant.tier}:${s.user.role}`;
}

export async function listModules(): Promise<ModuleSummary[]> {
  if (!USE_API) return mockListModules();
  const client = apiClient({ token: devToken() });
  const res = await client.listModules();
  return res.modules.map((m) => ({
    id: m.id,
    title: m.title,
    status: m.status as ModuleSummary["status"],
    authoringMode: m.authoringMode as ModuleSummary["authoringMode"],
    updatedAt: m.updatedAt,
    estimatedDurationSeconds: m.estimatedDurationSeconds,
    audience: "",
    slideCount: 0,
    reviewedSlideCount: 0,
  }));
}

export async function getModule(id: string): Promise<Module | undefined> {
  if (!USE_API) return mockGetModule(id);
  const client = apiClient({ token: devToken() });
  const res = await client.getModule(id);
  // The API returns module + slides separately; downstream code wants them
  // joined. Step 5 expands this once the editor's persistence is wired.
  const mod = res.module as Module | null;
  if (!mod) return undefined;
  return mod;
}
