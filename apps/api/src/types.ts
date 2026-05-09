/**
 * Augment Fastify's request object with the authenticated context that every
 * request middleware attaches. Centralized so route handlers can rely on it.
 */
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    auth: {
      userId: string;
      tenantId: string;
      tier: "standard" | "hipaa";
      role: "org_admin" | "team_admin" | "editor" | "viewer";
      hipaaSession: boolean;
    };
    requestId: string;
  }

  interface FastifyContextConfig {
    audit?: boolean | { action?: string };
  }
}
