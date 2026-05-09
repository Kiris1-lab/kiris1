/**
 * Validated environment loader. Pin all reads here so the rest of the API
 * doesn't sprinkle process.env across modules. Failures produce a clear
 * startup error rather than a runtime undefined.
 */

import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  AWS_REGION: z.string().default("us-east-1"),

  // Two Anthropic keys — DESIGN §6.7. Standard always required; HIPAA optional
  // until the HIPAA tier ships in Phase 2.
  ANTHROPIC_API_KEY_STANDARD: z.string().optional(),
  ANTHROPIC_API_KEY_HIPAA: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-6"),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  INTERNAL_SIGNING_KEY: z.string().optional(),
  CORS_ORIGINS: z.string().default("http://localhost:3001,http://localhost:3002"),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

export function loadEnv(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}
