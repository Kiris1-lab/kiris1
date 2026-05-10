import Link from "next/link";
import { Container, Input } from "@kiris/ui";
import { KirisWordmark } from "./kiris-mark";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/pricing", label: "Pricing" },
      { href: "/customers", label: "Customers" },
      { href: "/integrations", label: "Integrations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/integrations", label: "LMS guides" },
      { href: "/contact-sales", label: "Talk to sales" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/security", label: "Security" },
      { href: "/trust", label: "Subprocessors" },
      { href: "/trust", label: "Status" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact-sales", label: "Contact" },
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Get started" },
    ],
  },
];

// Last-updated stamp pinned at build time. Refreshed automatically on the
// next deploy. Format: ISO date for machines + readable for humans.
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

export function SiteFooter() {
  return (
    <footer className="border-border-subtle bg-surface-raised mt-24 border-t">
      <Container>
        {/* Newsletter band — TODO: /api/newsletter endpoint doesn't exist yet.
            Form is intentionally a plain RSC <form> (no JS) so it works the
            moment the route lands. */}
        <div className="border-border-subtle grid gap-6 border-b py-10 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-xl">
            <p className="text-heading-sm text-text-primary">
              Get one practical post a month on hospital training.
            </p>
            <p className="text-body-sm text-text-secondary mt-1">
              No fluff. Unsubscribe in one click.
            </p>
          </div>
          <form
            method="post"
            action="/api/newsletter"
            className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
            aria-label="Newsletter signup"
          >
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="footer-newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@hospital.org"
              className="flex-1"
            />
            <button
              type="submit"
              className="bg-accent text-text-on-accent text-body-md duration-state hover:bg-accent-hover inline-flex h-10 items-center justify-center rounded-md px-4 font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Link columns + brand. */}
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-flex">
              <KirisWordmark size={22} />
            </Link>
            <p className="text-body-sm text-text-secondary mt-3 max-w-xs">
              Narrated, editable e-learning modules for hospitals.
            </p>
            <ComplianceBadges />
            <p className="text-caption text-text-tertiary mt-6">
              © {new Date().getFullYear()} Kiris Lab, Inc. All rights reserved.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-caption text-text-tertiary uppercase">{column.title}</h2>
              <ul className="text-body-sm mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-text-secondary duration-state hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Status row. */}
        <div className="border-border-subtle text-caption text-text-tertiary flex flex-wrap items-center justify-between gap-3 border-t py-6">
          <Link
            href="/trust"
            className="duration-state hover:text-text-primary inline-flex items-center gap-2 transition-colors"
            aria-label="View status page"
          >
            <span
              aria-hidden
              className="bg-status-success inline-block h-2 w-2 rounded-full"
              style={{ boxShadow: "0 0 0 3px var(--accent-soft)" }}
            />
            All systems operational
          </Link>
          <p>
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Security questions?{" "}
            <a className="hover:text-text-primary underline" href="mailto:security@kiris.ai">
              security@kiris.ai
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function ComplianceBadges() {
  // TODO: real cert images. Until then, render greyscale placeholder pills
  // so the slot exists in the layout and the founder can swap PNG/SVG in.
  const placeholders = [
    { label: "SOC 2 (in progress)" },
    { label: "HIPAA-ready" },
    { label: "WCAG 2.2 AA" },
  ];
  return (
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Compliance">
      {placeholders.map((b) => (
        <li
          key={b.label}
          className="border-border-subtle text-caption text-text-tertiary inline-flex h-7 items-center rounded-full border px-2.5"
        >
          {b.label}
        </li>
      ))}
      {/* TODO: real cert images */}
    </ul>
  );
}
