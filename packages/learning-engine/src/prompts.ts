/**
 * Prompt builders. Pure functions — never call the model directly. The API
 * (apps/api) routes the result through the Anthropic two-key router.
 *
 * Each builder returns:
 *   - `system`: the system prompt
 *   - `user`: the user-turn content
 *
 * Hard rule: no PHI in prompts. The scrubber gates inputs before this layer
 * is reached.
 */

import {
  BLOOM_DISCOURAGED_VERBS,
  BLOOM_PREFERRED_VERBS,
  KNOWLEDGE_CHECK_INTERVAL_SEC,
  MAX_ITEMS_PER_SLIDE,
  MIN_FLESCH_READING_EASE,
  MODULE_TARGET_DURATION_SEC,
  SEGMENT_TARGET_DURATION_SEC,
} from "./constants.js";
import { DEFAULT_TEMPLATE } from "./template.js";

const SHARED_PRINCIPLES = `
You are the generation engine inside Kiris, an authoring tool for hospital
training. Every module you produce must satisfy:

CONTENT PRINCIPLES (from Mayer's Cognitive Theory of Multimedia Learning):
- Coherence: exclude extraneous material. No decorative anecdotes; no
  tangents; no verbose introductions that delay substantive content.
- Signaling: bold key terms on first introduction; use callouts for
  "remember:" and "in practice:".
- Redundancy: narration scripts must NOT duplicate on-screen body text. On
  on-screen text use brief lists, key terms, and labels. Spoken narration
  carries the explanatory weight.
- Modality: prefer narration for explanation; on-screen text for terminology
  and reference.
- Spatial contiguity: place captions adjacent to the relevant visual; use
  callouts/pointers, not legends.
- Personalization: conversational tone, second person ("you'll see…"),
  contractions are fine. Do not be patronizing.
- Pretraining: when a topic introduces 5+ new terms, generate a short
  vocabulary segment first.
- Segmenting: chunked, learner-paced; ${SEGMENT_TARGET_DURATION_SEC.min}-${SEGMENT_TARGET_DURATION_SEC.max}s per segment.

COGNITIVE LOAD:
- No more than ${MAX_ITEMS_PER_SLIDE} discrete items per slide (working memory limit).
- One main idea per slide.
- Bullet points on slides; paragraphs only in narration.
- Target ~50% whitespace on slides.

ADULT LEARNING (Knowles):
- Reference the audience's specific workflow throughout.
- Acknowledge baseline competence; don't over-explain the obvious.
- End with an "in your next shift" / "tomorrow morning" application.

ASSESSMENT:
- Knowledge check every ~${KNOWLEDGE_CHECK_INTERVAL_SEC / 60} minutes.
- Distractors must be plausible — generate them by asking what a
  half-understanding learner would believe.
- Final knowledge check covers the objectives proportionally.

LANGUAGE:
- Flesch reading ease ≥ ${MIN_FLESCH_READING_EASE} (8th-10th grade) for narration and on-screen text.
- Preserve clinical terminology; keep surrounding language plain.
- Bloom verbs: prefer ${BLOOM_PREFERRED_VERBS.join(", ")}.
  Avoid ${BLOOM_DISCOURAGED_VERBS.join(", ")} in objectives.

ACCESSIBILITY:
- Generate alt text for every image suggestion.
- Color is never the only indicator of meaning.
- Captions must be exportable for narration.

CONSTRAINTS:
- No PHI. The audience's name and the org's name are the only identifying
  info you'll see; use them sparingly.
- Output VALID JSON only, matching the schema below.
`.trim();

const MODULE_OUTPUT_SCHEMA = `
{
  "title": string,
  "audience": string,
  "learningObjectives": [{ "id": string, "text": string, "bloom": string }],
  "estimatedDurationSeconds": number,
  "slides": [
    {
      "id": string,
      "position": number,
      "type": "hook"|"objectives"|"concept"|"demonstration"|"knowledge_check"|"application"|"scenario"|"summary"|"final_check",
      "title": string,
      "bodyMarkdown": string,
      "narrationScript": string,
      "altText": string,
      "durationSeconds": number,
      "interaction": object|null
    }
  ],
  "scenario": {
    "stem": string,
    "branches": [{ "id": string, "label": string, "feedback": string }]
  },
  "finalCheck": {
    "questions": [{ "id": string, "stem": string, "type": "single"|"multi"|"true_false", "options": [{"id":string,"text":string,"correct":boolean,"feedback":string}] }]
  }
}
`.trim();

export interface ExpressInputs {
  title: string;
  audience: string;
  goal: string;
  targetDurationSec: number | null;
  /** Sanitized text extracted from uploaded materials. PHI scrubbed already. */
  materialsText?: string;
}

export function buildExpressPrompt(inp: ExpressInputs): { system: string; user: string } {
  const targetSec = inp.targetDurationSec ?? null;
  const targetDescriptor = targetSec
    ? `${Math.round(targetSec / 60)} minutes`
    : `between ${Math.round(MODULE_TARGET_DURATION_SEC.min / 60)} and ${Math.round(
        MODULE_TARGET_DURATION_SEC.max / 60,
      )} minutes (let the content drive)`;

  const templateOutline = DEFAULT_TEMPLATE.map(
    (t, i) => `  ${i + 1}. ${t.role} — ${t.intent}`,
  ).join("\n");

  return {
    system: SHARED_PRINCIPLES,
    user: `
Generate a complete, narrated, accessible e-learning module.

TITLE OR TOPIC: ${inp.title}

AUDIENCE AND GOAL: ${inp.audience} ${inp.goal}

TARGET DURATION: ${targetDescriptor}

STRUCTURAL TEMPLATE (use this; expand/compress to fit the target duration):
${templateOutline}

${inp.materialsText ? `MATERIALS (PHI-scrubbed, may be empty):\n---\n${inp.materialsText}\n---\n` : ""}

Return ONLY valid JSON matching this schema:
${MODULE_OUTPUT_SCHEMA}
`.trim(),
  };
}

export interface SlideHelperInputs {
  audience: string;
  helper:
    | "polish"
    | "improve_clarity"
    | "shorten"
    | "mayer_audit"
    | "translate_plain"
    | "regenerate";
  field: "title" | "bodyMarkdown" | "narrationScript" | "altText";
  fieldValue: string;
  slideTitle: string;
  slideType: string;
}

export function buildSlideHelperPrompt(inp: SlideHelperInputs): { system: string; user: string } {
  return {
    system: SHARED_PRINCIPLES,
    user: `
You are editing a single field on one slide. Return ONLY the new field value
(plain text or markdown — no JSON envelope, no commentary).

AUDIENCE: ${inp.audience}
SLIDE TITLE: ${inp.slideTitle}
SLIDE TYPE: ${inp.slideType}
FIELD: ${inp.field}
HELPER: ${inp.helper}

CURRENT VALUE:
---
${inp.fieldValue}
---

Apply the helper:
- polish: tighten language, fix awkwardness, preserve meaning.
- improve_clarity: prefer plain words, drop jargon when possible.
- shorten: trim ~30% while preserving meaning.
- mayer_audit: rewrite to satisfy coherence + signaling + redundancy.
- translate_plain: Flesch reading ease ≥ ${MIN_FLESCH_READING_EASE}; preserve clinical terms.
- regenerate: produce a fresh value from scratch for this slide.
`.trim(),
  };
}

/** Internal critic pass — DESIGN §17.4. */
export function buildCriticPrompt(moduleJson: string): { system: string; user: string } {
  return {
    system: `
You are a strict editorial critic. Reject slides that violate the cognitive
load or Mayer's principles defined below. Return JSON only.
`.trim(),
    user: `
Review the following generated module. For each slide, decide:
  - "accept" — meets every constraint
  - "rewrite" — same idea, but the slide must be regenerated to fit
  - "split"  — two main ideas; split into two slides
  - "drop"   — extraneous; coherence violation

Constraints:
- One main idea per slide.
- ≤ ${MAX_ITEMS_PER_SLIDE} discrete items per slide.
- narration does NOT duplicate body text.
- Bullet points only — no paragraphs on slides.
- Knowledge checks at most every ${KNOWLEDGE_CHECK_INTERVAL_SEC / 60} minutes.

Output:
{
  "slides": [{ "id": string, "decision": "accept"|"rewrite"|"split"|"drop", "reason": string }],
  "moduleNotes": string[]
}

MODULE JSON:
---
${moduleJson}
---
`.trim(),
  };
}
