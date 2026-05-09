/**
 * The structural template every Kiris module follows — DESIGN §17.1.
 *
 * Hook → Objectives → 3-5 Segments (concept + demo + check) → Application
 * → Summary → Final knowledge check.
 *
 * This is the source of truth that AI generation, the editor's slide-list
 * affordances, and the SCORM packager all use.
 */

export type SlideRole =
  | "hook"
  | "objectives"
  | "concept"
  | "demonstration"
  | "knowledge_check"
  | "application"
  | "summary"
  | "final_check"
  | "scenario";

export interface TemplateSlide {
  role: SlideRole;
  /** Default seconds; overridable per-slide by the AI critic pass. */
  defaultDurationSec: number;
  /** Free-text description used in the AI prompt. */
  intent: string;
}

/**
 * Default 8-segment structure for a 7-minute module. The Express AI prompt
 * passes this to the model with instructions to expand or compress segments
 * to fit the requested target duration.
 */
export const DEFAULT_TEMPLATE: TemplateSlide[] = [
  {
    role: "hook",
    defaultDurationSec: 25,
    intent:
      "Open with a specific, situational clinical moment that establishes immediate relevance for the audience.",
  },
  {
    role: "objectives",
    defaultDurationSec: 30,
    intent:
      "2-4 observable, behavior-based objectives. Use Bloom verbs from BLOOM_PREFERRED_VERBS.",
  },
  {
    role: "concept",
    defaultDurationSec: 50,
    intent:
      "Introduce the central idea. Apply Mayer's signaling principle — bold key terms on first introduction.",
  },
  {
    role: "demonstration",
    defaultDurationSec: 50,
    intent: "Walk through a concrete example. Apply spatial contiguity for any visuals.",
  },
  {
    role: "knowledge_check",
    defaultDurationSec: 30,
    intent:
      "One question. Mix recall and application. Distractors must be plausible (what would a learner who half-understood think?).",
  },
  {
    role: "application",
    defaultDurationSec: 60,
    intent:
      "Show how the content applies to the learner's specific workflow. 'In your next shift…' framing.",
  },
  {
    role: "scenario",
    defaultDurationSec: 50,
    intent:
      "The 'in your shoes' branching scenario (DESIGN §17.6). Required on every Kiris module.",
  },
  {
    role: "summary",
    defaultDurationSec: 25,
    intent: "Synthesize the objectives. Reinforce key terms. No new content.",
  },
  {
    role: "final_check",
    defaultDurationSec: 150,
    intent:
      "3-5 questions covering the objectives proportionally. Mixed difficulty. If an objective wasn't testable in the module, flag it for the author.",
  },
];

/** Total default seconds — used by the API to estimate generation time. */
export const DEFAULT_TEMPLATE_DURATION_SEC = DEFAULT_TEMPLATE.reduce(
  (acc, s) => acc + s.defaultDurationSec,
  0,
);
