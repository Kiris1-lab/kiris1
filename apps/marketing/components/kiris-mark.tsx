/**
 * Kiris brand mark — three short horizontal strokes of decreasing length
 * inside a soft rounded square, evoking stacked slides + a narration line.
 * Wordmark-led brand: the mark supports the wordmark, not the other way
 * around. Render crisply at 16px → 96px.
 */
export function KirisMark({
  size = 28,
  variant = "filled",
}: {
  size?: number;
  /** "filled" — solid teal square, ivory strokes (used at small sizes,
   *  favicons, the wordmark lockup). "outlined" — transparent square,
   *  teal strokes (rare, used inside dark surfaces). */
  variant?: "filled" | "outlined";
}) {
  const strokeColor = variant === "filled" ? "var(--text-on-accent)" : "var(--accent-primary)";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Kiris" fill="none">
      {variant === "filled" ? (
        <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="var(--accent-primary)" />
      ) : (
        <rect
          x="2.5"
          y="2.5"
          width="27"
          height="27"
          rx="7"
          stroke="var(--accent-primary)"
          strokeWidth="1.5"
        />
      )}
      {/* Three strokes, decreasing length, evenly stacked.
          Top:    11..23  (length 12)
          Middle:  9..20  (length 11)
          Bottom:  9..17  (length  8)
          Centered vertically across y=10..22 with 6px gaps. */}
      <line
        x1="9"
        y1="11"
        x2="23"
        y2="11"
        stroke={strokeColor}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="16"
        x2="20"
        y2="16"
        stroke={strokeColor}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="21"
        x2="17"
        y2="21"
        stroke={strokeColor}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Wordmark lockup — glyph + "kiris" in lowercase Inter. The default
 * brand presentation in headers, footers, and email templates.
 */
export function KirisWordmark({
  size = 24,
  className,
}: {
  /** Height of the glyph in px; wordmark scales with it. */
  size?: number;
  className?: string;
}) {
  // Wordmark sits roughly 1.05× the glyph height for optical balance.
  const wordmarkSize = Math.round(size * 1.05);
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <KirisMark size={size} />
      <span
        aria-hidden
        style={{
          fontSize: wordmarkSize,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "var(--text-primary)",
        }}
      >
        kiris
      </span>
      <span className="sr-only">Kiris</span>
    </span>
  );
}
