/**
 * Validated environment loader. Pin all reads here so the rest of the API
 * doesn't sprinkle process.env across modules. Failures produce a clear
 * startup error rather than a runtime undefined.
 */

import { z } from "zod";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    AWS_REGION: z.string().default("us-east-1"),

    S3_EXPORTS_BUCKET: z.string().optional(),
    KMS_KEY_ID_STANDARD: z.string().optional(),
    KMS_KEY_ID_HIPAA: z.string().optional(),

    SENTRY_DSN: z.string().optional(),
    GIT_SHA: z.string().optional(),

    ANTHROPIC_API_KEY_STANDARD: z.string().optional(),
    ANTHROPIC_API_KEY_HIPAA: z.string().optional(),
    ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-6"),

    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    INTERNAL_SIGNING_KEY: z.string().optional(),
    CORS_ORIGINS: z.string().default("http://localhost:3001,http://localhost:3002"),

    // Cognito JWT verification — required when ALLOW_DEV_TOKENS=false (i.e. prod).
    COGNITO_USER_POOL_ID: z.string().optional(),
    COGNITO_REGION: z.string().optional(),
    COGNITO_CLIENT_ID: z.string().optional(),

    // Dev-token backdoor: defaults to off. Must be explicitly set; refuses to
    // start in production (see refine below). Decoupled from NODE_ENV so an
    // unset NODE_ENV cannot silently re-enable it.
    ALLOW_DEV_TOKENS: z
      .union([z.literal("true"), z.literal("false")])
      .default("false")
      .transform((v) => v === "true"),
  })
  .refine((env) => !(env.NODE_ENV === "production" && env.ALLOW_DEV_TOKENS), {
    message: "ALLOW_DEV_TOKENS=true is forbidden when NODE_ENV=production",
    path: ["ALLOW_DEV_TOKENS"],
  })
  .refine(
    (env) =>
      env.ALLOW_DEV_TOKENS ||
      (env.COGNITO_USER_POOL_ID && env.COGNITO_REGION && env.COGNITO_CLIENT_ID),
    {
      message:
        "When ALLOW_DEV_TOKENS=false, COGNITO_USER_POOL_ID, COGNITO_REGION, and COGNITO_CLIENT_ID are required",
      path: ["COGNITO_USER_POOL_ID"],
    },
  );

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
