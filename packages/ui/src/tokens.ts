/**
 * Kiris design tokens — see DESIGN.md §16.
 *
 * Components reference TOKEN NAMES, never raw hex. Light mode only in v1
 * (DESIGN §16.2 — dark mode is a v2 feature).
 *
 * Brand accent: deep clinical blue (#1E3A5F). Decision per founder review.
 */

export const colors = {
  surface: {
    base: "#FAFAFA",
    raised: "#FFFFFF",
    overlay: "#FFFFFF",
    inverse: "#0A0A0B",
  },
  text: {
    primary: "#0A0A0B",
    secondary: "#52525B",
    tertiary: "#A1A1AA",
    onAccent: "#FFFFFF",
  },
  border: {
    subtle: "#E4E4E7",
    default: "#D4D4D8",
    strong: "#A1A1AA",
  },
  accent: {
    primary: "#1E3A5F",
    primaryHover: "#16304F",
    primaryPressed: "#0F2640",
    soft: "#E8EEF5",
  },
  status: {
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
    info: "#0EA5E9",
  },
  focusRing: "#1E3A5F",
} as const;

export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

export const radii = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
  lg: "0 20px 40px -12px rgb(0 0 0 / 0.18), 0 8px 16px -8px rgb(0 0 0 / 0.08)",
} as const;

export const motion = {
  duration: {
    micro: "120ms",
    state: "200ms",
    layout: "280ms",
    modal: "400ms",
    hero: "600ms",
  },
  easing: {
    enter: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export const typography = {
  family: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  scale: {
    "display-xl": { size: "3.5rem", weight: 600, tracking: "-0.015em", lh: "1.2" },
    "display-lg": { size: "2.75rem", weight: 600, tracking: "-0.01em", lh: "1.2" },
    "display-md": { size: "2.25rem", weight: 600, tracking: "-0.005em", lh: "1.2" },
    "heading-xl": { size: "1.875rem", weight: 600, tracking: "-0.0025em", lh: "1.3" },
    "heading-lg": { size: "1.5rem", weight: 600, tracking: "0", lh: "1.3" },
    "heading-md": { size: "1.25rem", weight: 600, tracking: "0", lh: "1.3" },
    "heading-sm": { size: "1rem", weight: 600, tracking: "0", lh: "1.3" },
    "body-lg": { size: "1.125rem", weight: 400, tracking: "0", lh: "1.5" },
    "body-md": { size: "1rem", weight: 400, tracking: "0", lh: "1.5" },
    "body-sm": { size: "0.875rem", weight: 400, tracking: "0", lh: "1.4" },
    caption: { size: "0.75rem", weight: 500, tracking: "0.01em", lh: "1.4" },
    "mono-md": { size: "0.875rem", weight: 400, tracking: "0", lh: "1.4" },
  },
} as const;
