import { test } from "node:test";
import assert from "node:assert/strict";
import { fleschReadingEase, validateModule } from "./validators.js";

test("Flesch reading ease is plausible for plain text", () => {
  const score = fleschReadingEase(
    "Wash your hands for at least twenty seconds. Use enough soap to cover all surfaces.",
  );
  assert.ok(score > 60, `expected ≥ 60, got ${score}`);
});

test("Flesch reading ease drops for dense text", () => {
  const score = fleschReadingEase(
    "Postoperative anticoagulation regimens necessitate scrupulous documentation of pharmacological administration parameters.",
  );
  assert.ok(score < 60, `expected < 60, got ${score}`);
});

test("Validator flags a slide with too many bullets", () => {
  const findings = validateModule({
    estimatedDurationSeconds: 300,
    learningObjectives: [],
    slides: [
      {
        id: "s1",
        type: "concept",
        bodyMarkdown: ["- a", "- b", "- c", "- d", "- e", "- f", "- g", "- h"].join("\n"),
        narrationScript: "",
        altText: "",
        durationSeconds: 60,
      },
    ],
  });
  assert.ok(findings.some((f) => f.code === "too_many_items"));
});

test("Validator flags weak Bloom verbs in objectives", () => {
  const findings = validateModule({
    estimatedDurationSeconds: 60,
    learningObjectives: [{ id: "o1", text: "Understand the policy." }],
    slides: [],
  });
  assert.ok(findings.some((f) => f.code === "objective_verb_weak"));
});

test("Validator flags missing alt text when an image is mentioned", () => {
  const findings = validateModule({
    estimatedDurationSeconds: 60,
    learningObjectives: [],
    slides: [
      {
        id: "s1",
        type: "concept",
        bodyMarkdown: "See the screenshot of the EHR header bar.",
        narrationScript: "",
        altText: "",
        durationSeconds: 30,
      },
    ],
  });
  assert.ok(findings.some((f) => f.code === "alt_text_missing"));
});
