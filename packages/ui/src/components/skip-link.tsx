/**
 * Accessibility primitive (DESIGN §16.9). Render once at the top of every
 * page's <body>. The CSS lives in globals.css under `.skip-link`.
 */
export function SkipLink({ targetId = "main" }: { targetId?: string }) {
  return (
    <a className="skip-link" href={`#${targetId}`}>
      Skip to main content
    </a>
  );
}
