import type { Config } from "tailwindcss";

/**
 * Shared Tailwind preset for every Kiris app. Tokens are exposed as
 * CSS variables (see tokens.css); Tailwind utility classes resolve to those
 * variables so apps inherit theming consistently.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        surface: {
          base: "var(--surface-base)",
          raised: "var(--surface-raised)",
          overlay: "var(--surface-overlay)",
          sunken: "var(--surface-sunken)",
          inverse: "var(--surface-inverse)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          "on-accent": "var(--text-on-accent)",
          "on-inverse": "var(--text-on-inverse)",
        },
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        accent: {
          DEFAULT: "var(--accent-primary)",
          hover: "var(--accent-primary-hover)",
          pressed: "var(--accent-primary-pressed)",
          soft: "var(--accent-soft)",
        },
        highlight: {
          DEFAULT: "var(--highlight)",
          soft: "var(--highlight-soft)",
        },
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          danger: "var(--status-danger)",
          info: "var(--status-info)",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "system-ui",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        marketing: "1280px",
        app: "1440px",
        reading: "720px",
      },
      spacing: {
        // 4.5rem — sized for the marketing header. Default Tailwind jumps
        // straight from h-16 (4rem) to h-20 (5rem); 72px is the sweet spot.
        18: "4.5rem",
      },
      transitionTimingFunction: {
        enter: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-soft": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        micro: "120ms",
        state: "200ms",
        layout: "280ms",
        modal: "400ms",
      },
    },
  },
  plugins: [],
};

export default preset;
