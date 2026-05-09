/**
 * Learning-engine constants — DESIGN §17.
 * Empirical defaults the prompts and validators reference.
 */

export const MODULE_TARGET_DURATION_SEC = { min: 5 * 60, max: 12 * 60 } as const;
export const SEGMENT_TARGET_DURATION_SEC = { min: 2 * 60, max: 4 * 60 } as const;
/** Working memory limit (Sweller / Miller). */
export const MAX_ITEMS_PER_SLIDE = 7;
/** Knowledge checks every 2-3 minutes. */
export const KNOWLEDGE_CHECK_INTERVAL_SEC = 180;
/** Plain-language target — DESIGN §17.7. */
export const MIN_FLESCH_READING_EASE = 60;
/** Modules longer than this trigger a "split into a series" suggestion. */
export const SPLIT_SUGGESTION_THRESHOLD_SEC = 15 * 60;

export const MAYER_PRINCIPLES = [
  "coherence",
  "signaling",
  "redundancy",
  "spatial-contiguity",
  "temporal-contiguity",
  "modality",
  "personalization",
  "pretraining",
  "segmenting",
  "voice",
  "image",
  "multimedia",
] as const;

export type MayerPrinciple = (typeof MAYER_PRINCIPLES)[number];

/** Bloom verbs preferred for skill-building modules. */
export const BLOOM_PREFERRED_VERBS = [
  "identify",
  "apply",
  "demonstrate",
  "perform",
  "analyze",
  "evaluate",
  "decide",
  "select",
  "respond",
] as const;

export const BLOOM_DISCOURAGED_VERBS = [
  "understand",
  "know",
  "be familiar with",
  "appreciate",
  "be aware of",
  "learn",
] as const;
