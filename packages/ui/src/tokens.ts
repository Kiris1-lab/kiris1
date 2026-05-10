/**
 * Kiris design tokens — see DESIGN.md §16.
 *
 * Components reference TOKEN NAMES, never raw hex. Light mode only in v1
 * (DESIGN §16.2 — dark mode is a v2 feature).
 *
 * Brand accent: deep teal-ink (#0F4C46). Highlight: warm amber (#B85A1F),
 * used sparingly for AI/magic moments — icons and display-size eyebrows
 * only, never as a button fill behind body text.
 */

export const colors = {
  surface: {
    base: "#F7F5F0",
    raised: "#FFFFFF",
    overlay: "#FFFFFF",
    sunken: "#EFECE5",
    inverse: "#0E1014",
  },
  text: {
    primary: "#16181D",
    secondary: "#4A4D55",
    tertiary: "#8A8D95",
    onAccent: "#FFFFFF",
    onInverse: "#F7F5F0",
  },
  border: {
    subtle: "#E6E2D8",
    default: "#D1CCC0",
    strong: "#8A8D95",
  },
  accent: {
    primary: "#0F4C46",
    primaryHover: "#0B3D38",
    primaryPressed: "#082B27",
    soft: "#E2EDEB",
  },
  highlight: {
    DEFAULT: "#B85A1F",
    soft: "#FCEDDC",
  },
  status: {
    success: "#15803D",
    warning: "#B45309",
    danger: "#B91C1C",
    info: "#0369A1",
  },
  focusRing: "#0F4C46",
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
