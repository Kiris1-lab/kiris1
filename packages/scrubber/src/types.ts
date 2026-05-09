/**
 * Scrubber types — shared across text / image / audio variants.
 *
 * `decision`:
 *   - "allow"    Nothing concerning. Proceed.
 *   - "confirm"  Low-confidence detection. UI surfaces a modal asking the user
 *                to confirm there's no PHI; if they confirm, we proceed and
 *                log a confirm event for retraining.
 *   - "block"    High-confidence (≥ 0.85) PHI detected. Hard-block on Standard
 *                tier; the UI surfaces an upgrade-to-HIPAA CTA.
 */
export type ScrubberDecision = "allow" | "confirm" | "block";

export interface ScrubberResult {
  decision: ScrubberDecision;
  /** 0-1 confidence of the *highest* PHI entity detected. */
  confidence: number;
  /** Distinct entity types observed. Never the values themselves. */
  detectedEntityTypes: string[];
  /** SHA-256 of the input. Used as a cache key and as the audit log reference. */
  inputSha256: string;
  /** Microseconds spent in the scrubber. For ops dashboards. */
  durationUs: number;
}

export interface ScrubberOptions {
  /**
   * Below this, decision = "allow". Above HIGH_CONFIDENCE_THRESHOLD, "block".
   * Between, "confirm".
   */
  lowConfidenceThreshold?: number;
  highConfidenceThreshold?: number;
  /**
   * Default true. When false, the scrubber falls open on AWS errors. Should
   * NEVER be false on Standard tier user-input endpoints — only on internal
   * tooling.
   */
  failClosed?: boolean;
}

export const DEFAULT_LOW_THRESHOLD = 0.5;
/** DESIGN.md §6.9: hard-block threshold. */
export const DEFAULT_HIGH_THRESHOLD = 0.85;
