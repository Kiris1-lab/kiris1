/**
 * Kiris brand mark — abstract glyph evoking a paginated module + a soft "K".
 * Single weight; renders cleanly at any size.
 */
export function KirisMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Kiris"
      fill="none"
    >
      <rect
        x="2.5"
        y="2.5"
        width="27"
        height="27"
        rx="7"
        fill="var(--accent-primary)"
      />
      <path
        d="M11 9v14"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M21 9 11 16l10 7"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
