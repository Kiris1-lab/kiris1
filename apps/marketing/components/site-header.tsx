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
    <header className="border-border-subtle bg-surface-base/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="text-text-primary flex items-center gap-2 font-semibold"
            aria-label="Kiris home"
          >
            <KirisMark />
            <span className="text-heading-md">Kiris</span>
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="text-body-sm text-text-secondary flex items-center gap-7">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="duration-state hover:text-text-primary transition-colors"
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
              className="text-body-sm text-text-secondary duration-state hover:text-text-primary hidden transition-colors sm:block"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-accent text-body-sm text-text-on-accent duration-state hover:bg-accent-hover inline-flex h-8 items-center justify-center rounded-md px-3 font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
