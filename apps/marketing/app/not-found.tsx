import Link from "next/link";
import { Container } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";

const QUICK_LINKS = [
  { href: "/", label: "Homepage", body: "Start here." },
  { href: "/pricing", label: "Pricing", body: "All plans and rates on one page." },
  { href: "/product", label: "Product overview", body: "What Kiris does, with screenshots." },
  { href: "/contact-sales", label: "Contact", body: "Talk to a human." },
];

export default function NotFound() {
  return (
    <Container>
      <div className="mx-auto max-w-2xl py-24 text-center md:py-32">
        <SlidesGlyph />
        <p className="text-caption text-accent mt-8 uppercase tracking-wider">404</p>
        <h1 className="text-display-md text-text-primary mt-3">We couldn&apos;t find that page</h1>
        <p className="text-body-md text-text-secondary mt-3">
          Looks like that link&apos;s broken — or the page moved. Here&apos;s where most people are
          headed:
        </p>
        <ul className="mt-10 grid gap-3 text-left sm:grid-cols-2">
          {QUICK_LINKS.map((q) => (
            <li key={q.href}>
              <Link
                href={q.href}
                className="border-border-subtle bg-surface-raised hover:border-accent duration-state block rounded-lg border p-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
              >
                <p className="text-heading-sm text-text-primary">{q.label}</p>
                <p className="text-body-sm text-text-secondary mt-1">{q.body}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <CtaLink href="/" variant="ghost" withArrow>
            Or back to home
          </CtaLink>
        </div>
      </div>
    </Container>
  );
}

/**
 * Three slide thumbnails with a question-mark badge over the third.
 * Brand-consistent — teal stroke + accent-soft fill, ivory background.
 */
function SlidesGlyph() {
  return (
    <svg
      role="img"
      aria-label="Three slides with a question-mark badge"
      width="120"
      height="80"
      viewBox="0 0 120 80"
      className="mx-auto"
    >
      <rect
        x="2"
        y="14"
        width="40"
        height="52"
        rx="6"
        fill="var(--accent-soft)"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
      />
      <rect
        x="40"
        y="14"
        width="40"
        height="52"
        rx="6"
        fill="var(--surface-raised)"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
      />
      <rect
        x="78"
        y="14"
        width="40"
        height="52"
        rx="6"
        fill="var(--surface-raised)"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
      />
      {/* Lines on slides 1 + 2 */}
      <line
        x1="10"
        y1="32"
        x2="34"
        y2="32"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="40"
        x2="28"
        y2="40"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="48"
        x2="22"
        y2="48"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="48"
        y1="32"
        x2="72"
        y2="32"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="48"
        y1="40"
        x2="66"
        y2="40"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Question-mark badge on third slide */}
      <circle cx="98" cy="40" r="14" fill="var(--highlight)" />
      <text
        x="98"
        y="46"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="var(--text-on-accent)"
        fontFamily="Inter, system-ui, sans-serif"
      >
        ?
      </text>
    </svg>
  );
}
