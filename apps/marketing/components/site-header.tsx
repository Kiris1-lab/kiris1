import Link from "next/link";
import { Container } from "@kiris/ui";
import { KirisMark } from "./kiris-mark";

const NAV = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: "/integrations", label: "Integrations" },
  { href: "/trust", label: "Trust" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-surface-base/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-text-primary"
            aria-label="Kiris home"
          >
            <KirisMark />
            <span className="text-heading-md">Kiris</span>
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7 text-body-sm text-text-secondary">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors duration-state hover:text-text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-body-sm text-text-secondary transition-colors duration-state hover:text-text-primary sm:block"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-8 items-center justify-center rounded-md bg-accent px-3 text-body-sm font-medium text-text-on-accent shadow-sm transition-colors duration-state hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
