"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@kiris/ui";

export type FlatNavLink = { href: string; label: string };
export type NavItem =
  | { kind: "link"; href: string; label: string }
  | { kind: "group"; label: string; items: FlatNavLink[] };

/**
 * Sticky-shell wrapper that adds:
 *   - a compressed-height class on scroll past the hero (24px threshold)
 *   - the mobile-menu open state, exposed via context to descendant
 *     <MobileMenuToggle /> and <MobileMenuPanel />.
 *
 * Respects prefers-reduced-motion: the height transition is gated by
 * Tailwind's transition utilities, which honor the global rule in
 * tokens.css that drops transition durations to 0.01ms when the user
 * prefers reduced motion.
 */

interface Ctx {
  open: boolean;
  setOpen: (v: boolean) => void;
  scrolled: boolean;
  panelId: string;
  toggleId: string;
}

import { createContext, useContext } from "react";

const HeaderCtx = createContext<Ctx | null>(null);

function useHeaderCtx(): Ctx {
  const ctx = useContext(HeaderCtx);
  if (!ctx) throw new Error("Header subcomponents must be used inside <HeaderShell>");
  return ctx;
}

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while the panel is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <HeaderCtx.Provider
      value={{
        open,
        setOpen,
        scrolled,
        panelId: "site-mobile-menu",
        toggleId: "site-mobile-toggle",
      }}
    >
      <header
        data-scrolled={scrolled || undefined}
        className={cn(
          "group/header duration-state sticky top-0 z-40 w-full backdrop-blur transition-colors",
          scrolled
            ? "bg-surface-base/90 border-border-subtle border-b"
            : "bg-surface-base/80 border-b border-transparent",
        )}
      >
        {children}
      </header>
    </HeaderCtx.Provider>
  );
}

export function MobileMenuToggle() {
  const { open, setOpen, panelId, toggleId } = useHeaderCtx();
  return (
    <button
      id={toggleId}
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => setOpen(!open)}
      className="text-text-primary inline-flex h-10 w-10 items-center justify-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] md:hidden"
    >
      {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
    </button>
  );
}

/**
 * Slide-in mobile panel. Focus moves to the first link when opened; the
 * close button returns focus to the toggle.
 */
export function MobileMenuPanel({ nav }: { nav: NavItem[] }) {
  const { open, setOpen, panelId, toggleId } = useHeaderCtx();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      // Move focus to the first link after the open animation kicks off.
      requestAnimationFrame(() => firstLinkRef.current?.focus());
    } else {
      // Return focus to the toggle when closing.
      const toggle = document.getElementById(toggleId);
      toggle?.focus();
    }
  }, [open, toggleId]);

  // Simple focus loop: Tab from last focusable wraps to first.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  // Flatten nav (groups expand into a labeled subsection).
  const flat = nav.flatMap((item, i) =>
    item.kind === "link"
      ? [{ ...item, kind: "link" as const, key: `link-${i}` }]
      : [
          { kind: "heading" as const, label: item.label, key: `head-${i}` },
          ...item.items.map((sub, j) => ({
            kind: "link" as const,
            href: sub.href,
            label: sub.label,
            key: `sub-${i}-${j}`,
          })),
        ],
  );

  return (
    <div
      id={panelId}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="bg-surface-raised border-border-subtle absolute left-0 right-0 top-full border-b shadow-lg md:hidden"
    >
      <nav className="px-4 py-6">
        <ul className="space-y-1">
          {flat.map((item, idx) =>
            item.kind === "heading" ? (
              <li key={item.key} className="text-caption text-text-tertiary mt-4 px-3 uppercase">
                {item.label}
              </li>
            ) : (
              <li key={item.key}>
                <Link
                  ref={idx === 0 && item.kind === "link" ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-body-md text-text-primary hover:bg-accent-soft block rounded-md px-3 py-2"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="border-border-subtle mt-4 flex flex-col gap-2 border-t pt-4">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-body-md text-text-secondary hover:bg-accent-soft block rounded-md px-3 py-2"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="bg-accent text-body-md text-text-on-accent hover:bg-accent-hover inline-flex h-10 items-center justify-center rounded-md px-4 font-medium shadow-sm"
          >
            Get started
          </Link>
        </div>
      </nav>
    </div>
  );
}
