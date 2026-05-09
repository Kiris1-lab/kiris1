# @kiris/ui

The Kiris design system. See `DESIGN.md` §16 for the philosophy and tokens.

## What's here

- `src/tokens.ts` — design tokens as TypeScript constants.
- `src/tokens.css` — same tokens as CSS custom properties (`--accent-primary`,
  `--surface-base`, etc.). All apps `@import` this.
- `src/globals.css` — base styles + Tailwind directives + typography utilities.
- `src/tailwind-preset.ts` — Tailwind preset every app extends. Token-backed
  utility classes (`bg-surface-base`, `text-text-primary`, `border-border`,
  `bg-accent`, etc.).
- `src/components/` — primitives (Button, Card, Badge, TierBadge, Input,
  Textarea, Banner, Container, SkipLink). More land in Step 2.

## How apps consume it

```ts
// next.config — none needed; this is a source package.

// tailwind.config.ts
import preset from "@kiris/ui/tailwind-preset";
export default {
  presets: [preset],
  content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
};

// app/layout.tsx
import "@kiris/ui/globals.css";
```

## Design principles (DESIGN §16.1)

Apple HIG-inspired: **clarity, deference, depth, calm**.

- Clarity — every interactive element is unambiguous.
- Deference — UI defers to content.
- Depth — hierarchy via layering and motion, not heavy color.
- Calm — restrained, composed; no gratuitous animation.

## Accessibility (non-negotiable, DESIGN §16.9)

- WCAG 2.2 AA on every surface.
- Focus rings rendered globally via `:focus-visible` in `globals.css`.
- Skip link primitive shipped (`<SkipLink />`).
- `prefers-reduced-motion: reduce` honored globally in `tokens.css`.
