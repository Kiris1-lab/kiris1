import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Container } from "@kiris/ui";
import { KirisWordmark } from "./kiris-mark";
import { HeaderShell, MobileMenuPanel, MobileMenuToggle, type NavItem } from "./site-header-client";

const NAV: NavItem[] = [
  { kind: "link", href: "/product", label: "Product" },
  { kind: "link", href: "/pricing", label: "Pricing" },
  { kind: "link", href: "/customers", label: "Customers" },
  { kind: "link", href: "/security", label: "Security" },
  {
    kind: "group",
    label: "Resources",
    items: [
      { href: "/integrations", label: "Integrations" },
      { href: "/trust", label: "Trust" },
      { href: "/blog", label: "Blog" },
    ],
  },
];

export function SiteHeader() {
  return (
    <HeaderShell>
      <Container>
        <div className="duration-state ease-in-out-soft h-18 flex items-center justify-between gap-6 transition-[height] group-data-[scrolled]/header:h-14">
          <Link href="/" className="flex items-center" aria-label="Kiris home">
            <KirisWordmark size={24} />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="text-body-sm text-text-secondary flex items-center gap-7">
              {NAV.map((item) =>
                item.kind === "link" ? (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="duration-state hover:text-text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  // CSS-only dropdown via group + group-hover/focus-within.
                  // No JS needed; works for keyboard users (focus-within
                  // shows the menu while a child has focus).
                  <li key={item.label} className="group relative">
                    <button
                      type="button"
                      className="duration-state hover:text-text-primary focus-visible:text-text-primary inline-flex items-center gap-1 rounded-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
                      aria-haspopup="menu"
                    >
                      {item.label}
                      <ChevronDown size={14} aria-hidden />
                    </button>
                    <div
                      role="menu"
                      aria-label={item.label}
                      className="bg-surface-raised border-border-subtle duration-state invisible absolute left-1/2 top-full z-50 mt-2 w-48 -translate-x-1/2 translate-y-1 rounded-md border opacity-0 shadow-md transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <ul className="p-1.5">
                        {item.items.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              role="menuitem"
                              className="text-body-sm text-text-primary hover:bg-accent-soft block rounded-sm px-3 py-2"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ),
              )}
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
              className="bg-accent text-body-md text-text-on-accent duration-state hover:bg-accent-hover hidden h-10 items-center justify-center rounded-md px-4 font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] sm:inline-flex"
            >
              Get started
            </Link>
            <MobileMenuToggle />
          </div>
        </div>
      </Container>
      <MobileMenuPanel nav={NAV} />
    </HeaderShell>
  );
}
