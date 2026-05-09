/**
 * @kiris/scrubber — PHI scrubber for Standard tier user inputs.
 * See DESIGN.md §6.9.
 *
 * Hard rules:
 *   - Standard-tier user content endpoints MUST call scrubText / scrubImage
 *     pre-flight. The Fastify middleware in `apps/api` enforces this.
 *   - Decision = "block" → 422 with an upgrade-to-HIPAA CTA.
 *   - Decision = "confirm" → return the result to the UI; user must
 *     explicitly confirm there is no PHI before we proceed. The confirmation
 *     is recorded in `phi_scrubber_events`.
 *   - Decision = "allow" → log the event with `decision = 'allow'` (DESIGN
 *     §6.6) and proceed.
 *   - NEVER persist the input value itself. The audit table holds the
 *     `inputSha256` and `detectedEntityTypes` only.
 */

export { scrubText } from "./text.js";
export { scrubImage } from "./image.js";
export type { ScrubberDecision, ScrubberOptions, ScrubberResult } from "./types.js";
export {
  DEFAULT_HIGH_THRESHOLD,
  DEFAULT_LOW_THRESHOLD,
} from "./types.js";
