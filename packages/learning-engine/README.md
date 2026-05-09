# @kiris/learning-engine

Pedagogical engine — codifies DESIGN §17 as **prompts**, **validators**, and
**structural templates**. Pure module with no I/O. The Anthropic two-key
router lives in `apps/api`.

## What's here

- `constants.ts` — empirical defaults (Mayer principles, working memory limit,
  Flesch threshold, segment durations, Bloom verb lists).
- `template.ts` — the structural template every Kiris module follows
  (hook → objectives → segments → application → scenario → summary → final).
- `prompts.ts` — three prompt builders:
  - `buildExpressPrompt` — full-module generation
  - `buildSlideHelperPrompt` — per-field ✨ helpers
  - `buildCriticPrompt` — internal critic pass that rejects cluttered or
    off-topic slides before the user sees them (DESIGN §17.4)
- `validators.ts` — pre/post checks: cognitive load, narration-vs-body
  redundancy, Flesch reading ease, alt-text required for image-referencing
  slides, weak Bloom verbs in objectives, knowledge-check density.

## Hard rule

No I/O. No PHI in prompts. The scrubber gates inputs before this layer is
reached. The API logs Anthropic `request_id` only — never the prompt or
response body (DESIGN §6.7).

## Tests

```bash
pnpm --filter @kiris/learning-engine test
```
