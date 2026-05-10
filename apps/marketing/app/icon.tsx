import { ImageResponse } from "next/og";

/**
 * Favicon — matches the KirisMark glyph (three stacked strokes inside
 * a soft rounded square). Tokens are inlined here because next/og runs
 * outside the Tailwind/CSS-variable pipeline.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const ACCENT = "#0F4C46";
const ON_ACCENT = "#FFFFFF";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill={ACCENT} />
          <line x1="9" y1="11" x2="23" y2="11" stroke={ON_ACCENT} strokeWidth="2.25" strokeLinecap="round" />
          <line x1="9" y1="16" x2="20" y2="16" stroke={ON_ACCENT} strokeWidth="2.25" strokeLinecap="round" />
          <line x1="9" y1="21" x2="17" y2="21" stroke={ON_ACCENT} strokeWidth="2.25" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
