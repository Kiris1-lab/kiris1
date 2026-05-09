import { createHash } from "node:crypto";
import {
  ComprehendMedicalClient,
  DetectPHICommand,
  type Entity,
} from "@aws-sdk/client-comprehendmedical";
import { regexScan } from "./regex-fallback.js";
import {
  DEFAULT_HIGH_THRESHOLD,
  DEFAULT_LOW_THRESHOLD,
  type ScrubberOptions,
  type ScrubberResult,
} from "./types.js";

/**
 * PHI scrubber for text — DESIGN.md §6.9.
 *
 * Strategy:
 *   1. Hash + cache lookup (caller's responsibility; we expose `inputSha256`).
 *   2. Cheap regex pre-filter — if it triggers a high-confidence rule, block
 *      without paying for Comprehend Medical.
 *   3. Comprehend Medical DetectPHI for the source of truth.
 *   4. Combine into a single decision; return distinct entity type set only
 *      (never the values themselves — those would put PHI in our logs).
 *
 * Failure mode: fail-CLOSED by default. AWS error → decision = "block" with a
 * synthetic entity type "_SCRUBBER_ERROR". Internal tooling can pass
 * `failClosed: false` to fall open; this MUST NEVER be used on customer
 * user-input endpoints (DESIGN §6.9).
 */
export async function scrubText(
  text: string,
  opts: ScrubberOptions = {},
): Promise<ScrubberResult> {
  const start = process.hrtime.bigint();
  const low = opts.lowConfidenceThreshold ?? DEFAULT_LOW_THRESHOLD;
  const high = opts.highConfidenceThreshold ?? DEFAULT_HIGH_THRESHOLD;
  const failClosed = opts.failClosed ?? true;
  const inputSha256 = sha256(text);

  const detectedTypes = new Set<string>();
  let maxConfidence = 0;

  const regexFindings = regexScan(text);
  for (const f of regexFindings) {
    detectedTypes.add(f.type);
    maxConfidence = Math.max(maxConfidence, f.confidence);
  }

  // If the regex layer already says "block-worthy," skip the Comprehend call.
  if (maxConfidence < high) {
    try {
      const client = getClient();
      const out = await client.send(new DetectPHICommand({ Text: text }));
      for (const entity of out.Entities ?? []) {
        recordEntity(entity, detectedTypes, (c) => {
          if (c > maxConfidence) maxConfidence = c;
        });
      }
    } catch (err) {
      if (failClosed) {
        detectedTypes.add("_SCRUBBER_ERROR");
        return finalize(detectedTypes, 1, inputSha256, start);
      }
      // fail-open path — only callable from internal tooling
      detectedTypes.add("_SCRUBBER_ERROR_FALL_OPEN");
    }
  }

  const decision =
    maxConfidence >= high ? "block" : maxConfidence >= low ? "confirm" : "allow";

  const elapsed = elapsedUs(start);
  return {
    decision,
    confidence: maxConfidence,
    detectedEntityTypes: [...detectedTypes].sort(),
    inputSha256,
    durationUs: elapsed,
  };
}

function recordEntity(
  entity: Entity,
  types: Set<string>,
  observe: (confidence: number) => void,
) {
  const typeName = entity.Type ?? entity.Category ?? "UNKNOWN";
  types.add(typeName);
  if (typeof entity.Score === "number") observe(entity.Score);
  for (const trait of entity.Traits ?? []) {
    if (typeof trait.Score === "number") observe(trait.Score);
  }
}

function finalize(
  types: Set<string>,
  confidence: number,
  inputSha256: string,
  start: bigint,
): ScrubberResult {
  return {
    decision: "block",
    confidence,
    detectedEntityTypes: [...types].sort(),
    inputSha256,
    durationUs: elapsedUs(start),
  };
}

function elapsedUs(start: bigint): number {
  return Number((process.hrtime.bigint() - start) / 1000n);
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

let _client: ComprehendMedicalClient | undefined;
function getClient(): ComprehendMedicalClient {
  if (_client) return _client;
  _client = new ComprehendMedicalClient({
    region: process.env.AWS_REGION ?? "us-east-1",
  });
  return _client;
}
