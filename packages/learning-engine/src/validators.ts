/**
 * Validators that run before and after the model. These are pure functions —
 * they don't call out. The API uses them to decide whether to accept the
 * output or kick off a retry / critic pass.
 */

import {
  BLOOM_DISCOURAGED_VERBS,
  KNOWLEDGE_CHECK_INTERVAL_SEC,
  MAX_ITEMS_PER_SLIDE,
  MIN_FLESCH_READING_EASE,
} from "./constants.js";

export interface ValidationFinding {
  severity: "error" | "warning";
  code: string;
  slideId?: string;
  message: string;
}

export interface ModuleForValidation {
  estimatedDurationSeconds: number;
  learningObjectives: { id: string; text: string; bloom?: string }[];
  slides: {
    id: string;
    type: string;
    bodyMarkdown: string;
    narrationScript: string;
    altText: string;
    durationSeconds: number;
  }[];
}

export function validateModule(mod: ModuleForValidation): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  // Objectives must use observable verbs.
  for (const obj of mod.learningObjectives) {
    const lc = obj.text.toLowerCase();
    if (BLOOM_DISCOURAGED_VERBS.some((v) => lc.startsWith(v))) {
      findings.push({
        severity: "warning",
        code: "objective_verb_weak",
        message: `Objective begins with a non-observable verb: "${obj.text}"`,
      });
    }
  }

  // Knowledge check density.
  let secSinceCheck = 0;
  for (const slide of mod.slides) {
    if (slide.type === "knowledge_check" || slide.type === "final_check") {
      secSinceCheck = 0;
    } else {
      secSinceCheck += slide.durationSeconds;
      if (secSinceCheck > KNOWLEDGE_CHECK_INTERVAL_SEC * 1.5) {
        findings.push({
          severity: "warning",
          code: "knowledge_check_gap",
          slideId: slide.id,
          message: `${Math.round(
            secSinceCheck / 60,
          )} minutes since the last knowledge check. Consider inserting one.`,
        });
        secSinceCheck = 0;
      }
    }
  }

  for (const slide of mod.slides) {
    // Cognitive load: ≤ 7 items per slide.
    const bullets = slide.bodyMarkdown.split("\n").filter((l) => /^\s*([-*+]|\d+\.)\s+/.test(l));
    if (bullets.length > MAX_ITEMS_PER_SLIDE) {
      findings.push({
        severity: "error",
        code: "too_many_items",
        slideId: slide.id,
        message: `${bullets.length} bulleted items on one slide (max ${MAX_ITEMS_PER_SLIDE}).`,
      });
    }

    // Redundancy principle: narration must not duplicate body text.
    if (slide.bodyMarkdown && slide.narrationScript) {
      const overlap = jaccardOverlap(tokenize(slide.bodyMarkdown), tokenize(slide.narrationScript));
      if (overlap > 0.7) {
        findings.push({
          severity: "warning",
          code: "narration_duplicates_body",
          slideId: slide.id,
          message: `Narration overlaps body text by ${Math.round(overlap * 100)}%. Mayer's redundancy principle.`,
        });
      }
    }

    // Plain-language target.
    if (slide.narrationScript) {
      const flesch = fleschReadingEase(slide.narrationScript);
      if (flesch < MIN_FLESCH_READING_EASE) {
        findings.push({
          severity: "warning",
          code: "flesch_low",
          slideId: slide.id,
          message: `Narration Flesch reading ease ${flesch.toFixed(0)} (target ≥ ${MIN_FLESCH_READING_EASE}).`,
        });
      }
    }

    // Accessibility: alt text required when the slide implies an image.
    const mentionsImage = /\b(image|screenshot|diagram|figure|chart|photo)\b/i.test(
      slide.bodyMarkdown,
    );
    if (mentionsImage && !slide.altText.trim()) {
      findings.push({
        severity: "error",
        code: "alt_text_missing",
        slideId: slide.id,
        message: "Slide references an image but has no alt text.",
      });
    }
  }

  return findings;
}

/** Flesch reading ease — classic formula, sufficient for plain-language gating. */
export function fleschReadingEase(text: string): number {
  const words = text.match(/\b[A-Za-z]+\b/g) ?? [];
  if (words.length === 0) return 100;
  const sentences = Math.max(1, (text.match(/[.!?]+(?=\s|$)/g) ?? []).length);
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const wordsPerSentence = words.length / sentences;
  const syllablesPerWord = syllables / words.length;
  return 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/(?:e|ed)$/, "");
  const groups = w.match(/[aeiouy]+/g);
  return Math.max(1, groups?.length ?? 1);
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4),
  );
}

function jaccardOverlap(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) if (b.has(w)) intersection++;
  return intersection / (a.size + b.size - intersection);
}
