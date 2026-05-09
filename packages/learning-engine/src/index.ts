/**
 * @kiris/learning-engine — codifies DESIGN §17 (learning science) as prompts,
 * validators, and structural templates. Single source of truth for HOW Kiris
 * generates pedagogically sound modules.
 *
 * Implemented in Step 3:
 *   - Mayer's 12 multimedia principles as prompt fragments
 *   - Cognitive load enforcement (≤7 items / slide, one main idea)
 *   - Microlearning structural template (hook → objectives → 3-5 segments → app → summary → final check)
 *   - "In your shoes" branching scenario generator (§17.6)
 *   - Plain-language Flesch ≥ 60 validator (§17.7)
 *   - Internal AI critic pass before user sees output (§17.4)
 */

export const MODULE_TARGET_DURATION_SEC = { min: 5 * 60, max: 12 * 60 };
export const SEGMENT_TARGET_DURATION_SEC = { min: 2 * 60, max: 4 * 60 };
export const MAX_ITEMS_PER_SLIDE = 7;
export const MIN_FLESCH_READING_EASE = 60;

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
