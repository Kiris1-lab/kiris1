import Link from "next/link";
import { TierBadge, KBD } from "@kiris/ui";
import { Search } from "lucide-react";
import { getSession } from "@/lib/session";
import { UsagePopover } from "./usage-popover";

export function TopNav() {
  const session = getSession();
  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface-base/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-app items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="Dashboard">
          <BrandMark />
          <span className="text-heading-sm">Kiris</span>
        </Link>

        <span className="text-body-sm text-text-tertiary">{session.tenant.name}</span>
        <TierBadge tier={session.tenant.tier} />
        {session.tenant.tier === "standard" ? (
          <Link
            href="/upgrade/hipaa"
            className="text-caption uppercase text-accent hover:underline"
          >
            Upgrade to HIPAA
          </Link>
        ) : null}

        <div className="hidden flex-1 justify-center md:flex">
          <button
            type="button"
            className="inline-flex h-8 w-72 items-center gap-2 rounded-md border border-border-subtle bg-surface-raised px-3 text-body-sm text-text-tertiary transition-colors duration-state hover:border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            aria-label="Open command palette"
          >
            <Search size={14} aria-hidden />
            <span>Search modules, slides, actions…</span>
            <span className="ml-auto flex items-center gap-1">
              <KBD>⌘</KBD>
              <KBD>K</KBD>
            </span>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <UsagePopover usage={session.usage} />
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-body-sm font-medium text-accent"
            aria-label={`Logged in as ${session.user.name}`}
          >
            {initials(session.user.name)}
          </Link>
        </div>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      role="img"
      aria-label="Kiris"
      fill="none"
    >
      <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="var(--accent-primary)" />
      <path d="M11 9v14" stroke="white" strokeWidth="2.25" strokeLinecap="round" />
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

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
