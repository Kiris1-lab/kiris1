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
}

export interface GenerateOutput {
  text: string;
  requestId: string | null;
  inputTokens: number;
  outputTokens: number;
  pool: "standard" | "hipaa";
  model: string;
}

export async function generate(input: GenerateInput): Promise<GenerateOutput> {
  const env = loadEnv();
  const pool = input.tier === "hipaa" ? "hipaa" : "standard";
  const client = getClient(pool);
  const model = input.model ?? env.ANTHROPIC_MODEL;

  const msg = await client.messages.create({
    model,
    max_tokens: input.maxTokens ?? 4096,
    system: input.system,
    messages: [{ role: "user", content: input.user }],
  });

  // Extract text — assume the model returns at least one text block.
  const text = msg.content
    .filter((c): c is { type: "text"; text: string } => c.type === "text")
    .map((c) => c.text)
    .join("");

  return {
    text,
    requestId: msg.id ?? null,
    inputTokens: msg.usage?.input_tokens ?? 0,
    outputTokens: msg.usage?.output_tokens ?? 0,
    pool,
    model,
  };
}
