import Anthropic from "@anthropic-ai/sdk";
import { loadEnv } from "../env.js";

/**
 * Anthropic two-key router — DESIGN §6.7.
 *
 * Standard tenant → standard org key. HIPAA tenant → BAA-covered org key with
 * Zero Data Retention. Server-side routing only; never expose either key to a
 * client.
 *
 * Hard rule: never log raw prompt or response bodies. Anthropic's `request_id`
 * is logged for support correlation; that's it.
 */

let _standard: Anthropic | undefined;
let _hipaa: Anthropic | undefined;

function getClient(pool: "standard" | "hipaa"): Anthropic {
  const env = loadEnv();
  if (pool === "standard") {
    if (_standard) return _standard;
    if (!env.ANTHROPIC_API_KEY_STANDARD) {
      throw new Error("ANTHROPIC_API_KEY_STANDARD not configured");
    }
    _standard = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY_STANDARD });
    return _standard;
  }
  if (_hipaa) return _hipaa;
  if (!env.ANTHROPIC_API_KEY_HIPAA) {
    throw new Error("ANTHROPIC_API_KEY_HIPAA not configured");
  }
  _hipaa = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY_HIPAA });
  return _hipaa;
}

export interface GenerateInput {
  tier: "standard" | "hipaa";
  system: string;
  user: string;
  /** Override per-tenant if needed. Defaults to env.ANTHROPIC_MODEL. */
  model?: string;
  maxTokens?: number;
  /**
   * Hashed user ID for Anthropic abuse-correlation. NEVER pass a raw user ID
   * or anything tenant-identifying as plaintext — Anthropic indexes this for
   * abuse detection. The API uses a stable HMAC of (tenantId,userId).
   */
  userIdHash?: string;
}

export interface GenerateOutput {
  text: string;
  requestId: string | null;
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  pool: "standard" | "hipaa";
  model: string;
}

export async function generate(input: GenerateInput): Promise<GenerateOutput> {
  const env = loadEnv();
  const pool = input.tier === "hipaa" ? "hipaa" : "standard";
  const client = getClient(pool);
  const model = input.model ?? env.ANTHROPIC_MODEL;

  // Prompt caching — every system block in this codebase repeats the
  // SHARED_PRINCIPLES preamble. Mark it ephemeral so cache reads are billed
  // at 10% of the standard input rate.
  const systemBlocks = [
    {
      type: "text" as const,
      text: input.system,
      cache_control: { type: "ephemeral" as const },
    },
  ];

  const msg = await client.messages.create({
    model,
    max_tokens: input.maxTokens ?? 4096,
    system: systemBlocks,
    messages: [{ role: "user", content: input.user }],
    // metadata.user_id helps Anthropic correlate abuse without exposing the
    // tenant. Only sent on Standard tier; HIPAA tier (BAA + ZDR) avoids
    // sending any user identifier.
    ...(pool === "standard" && input.userIdHash ? { metadata: { user_id: input.userIdHash } } : {}),
  });

  const text = msg.content
    .filter((c): c is { type: "text"; text: string } => c.type === "text")
    .map((c) => c.text)
    .join("");

  // SDK's usage type doesn't always declare cache fields; cast through unknown
  // to read them when present. Both default to 0.
  const usage = (msg.usage ?? {}) as {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };

  return {
    text,
    requestId: msg.id ?? null,
    inputTokens: usage.input_tokens ?? 0,
    outputTokens: usage.output_tokens ?? 0,
    cacheCreationInputTokens: usage.cache_creation_input_tokens ?? 0,
    cacheReadInputTokens: usage.cache_read_input_tokens ?? 0,
    pool,
    model,
  };
}
