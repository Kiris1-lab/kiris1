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
 *   1. Length floor — inputs <40 chars are titles / labels; cheap regex covers
 *      the long-tail PHI that fits there.
 *   2. SHA-256-keyed in-memory cache for the prior decision. Same payload,
 *      same answer for 24h. Cuts Comprehend Medical spend on edit-loop traffic
 *      (the same field re-saved repeatedly).
 *   3. Cheap regex pre-filter — if it triggers a high-confidence rule, block
 *      without paying for Comprehend Medical.
 *   4. Comprehend Medical DetectPHI for the source of truth.
 *   5. Combine into a single decision; return distinct entity type set only
 *      (never the values themselves — those would put PHI in our logs).
 *
 * Failure mode: fail-CLOSED by default. AWS error → decision = "block" with a
 * synthetic entity type "_SCRUBBER_ERROR". Internal tooling can pass
 * `failClosed: false` to fall open; this MUST NEVER be used on customer
 * user-input endpoints (DESIGN §6.9).
 */

const COMPREHEND_LENGTH_FLOOR = 40;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 5_000;
const decisionCache = new Map<string, { result: ScrubberResult; expires: number }>();

function cacheGet(sha: string): ScrubberResult | undefined {
  const hit = decisionCache.get(sha);
  if (!hit) return undefined;
  if (hit.expires < Date.now()) {
    decisionCache.delete(sha);
    return undefined;
  }
  return hit.result;
}

function cacheSet(sha: string, result: ScrubberResult): void {
  if (decisionCache.size >= CACHE_MAX_ENTRIES) {
    // Evict the oldest 10% — Map iteration is insertion-ordered.
    const evictCount = Math.floor(CACHE_MAX_ENTRIES * 0.1);
    let i = 0;
    for (const key of decisionCache.keys()) {
      decisionCache.delete(key);
      if (++i >= evictCount) break;
    }
  }
  decisionCache.set(sha, { result, expires: Date.now() + CACHE_TTL_MS });
}

export async function scrubText(text: string, opts: ScrubberOptions = {}): Promise<ScrubberResult> {
  const start = process.hrtime.bigint();
  const low = opts.lowConfidenceThreshold ?? DEFAULT_LOW_THRESHOLD;
  const high = opts.highConfidenceThreshold ?? DEFAULT_HIGH_THRESHOLD;
  const failClosed = opts.failClosed ?? true;
  const inputSha256 = sha256(text);

  // Identical payload? Reuse the prior decision and skip the Comprehend call.
  const cached = cacheGet(inputSha256);
  if (cached) {
    return {
      ...cached,
      durationUs: elapsedUs(start),
    };
  }

  const detectedTypes = new Set<string>();
  let maxConfidence = 0;

  const regexFindings = regexScan(text);
  for (const f of regexFindings) {
    detectedTypes.add(f.type);
    maxConfidence = Math.max(maxConfidence, f.confidence);
  }

  // Skip Comprehend when the regex layer already says "block-worthy" OR the
  // input is below the length floor (titles, labels, short fields).
  const skipComprehend = maxConfidence >= high || text.length < COMPREHEND_LENGTH_FLOOR;
  if (!skipComprehend) {
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
        const result = finalize(detectedTypes, 1, inputSha256, start);
        // Don't cache scrubber errors — they're transient.
        return result;
      }
      detectedTypes.add("_SCRUBBER_ERROR_FALL_OPEN");
    }
  }

  const decision = maxConfidence >= high ? "block" : maxConfidence >= low ? "confirm" : "allow";

  const elapsed = elapsedUs(start);
  const result: ScrubberResult = {
    decision,
    confidence: maxConfidence,
    detectedEntityTypes: [...detectedTypes].sort(),
    inputSha256,
    durationUs: elapsed,
  };
  cacheSet(inputSha256, result);
  return result;
}

function recordEntity(entity: Entity, types: Set<string>, observe: (confidence: number) => void) {
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
