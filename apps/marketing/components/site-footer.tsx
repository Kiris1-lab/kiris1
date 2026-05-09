import Link from "next/link";
import { Container } from "@kiris/ui";
import { KirisMark } from "./kiris-mark";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/pricing", label: "Pricing" },
      { href: "/integrations", label: "Integrations" },
      { href: "/customers", label: "Customers" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/security", label: "Security" },
      { href: "/trust", label: "Subprocessors" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact-sales", label: "Contact sales" },
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Get started" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-border-subtle bg-surface-raised mt-24 border-t">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <KirisMark size={24} />
              <span className="text-heading-sm">Kiris</span>
            </Link>
            <p className="text-body-sm text-text-secondary mt-3">
              Narrated, editable e-learning modules for hospitals.
            </p>
            <p className="text-caption text-text-tertiary mt-6">
              © {new Date().getFullYear()} Kiris Lab, Inc. All rights reserved.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-caption text-text-tertiary uppercase">{column.title}</h2>
              <ul className="text-body-sm mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
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
        <div className="border-border-subtle text-caption text-text-tertiary border-t py-6">
          <p>
            Security questions? Email{" "}
            <a className="hover:text-text-primary underline" href="mailto:security@kiris.ai">
              security@kiris.ai
            </a>
            . See our{" "}
            <Link href="/trust" className="hover:text-text-primary underline">
              trust page
            </Link>{" "}
            for subprocessors and status.
          </p>
        </div>
      </Container>
    </footer>
  );
}
