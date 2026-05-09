"use client";

import { useState } from "react";
import Link from "next/link";
import { Banner, ProgressBar } from "@kiris/ui";
import { Sparkles, Mic, AlertTriangle } from "lucide-react";
import type { Session } from "@/lib/types";

/**
 * Per-seat cap visibility (DESIGN §10.5). Soft-warn at 80%, hard-block at 100%.
 * Inline indicator + popover with the request modal entry point.
 */
export function UsagePopover({ usage }: { usage: Session["usage"] }) {
  const [open, setOpen] = useState(false);
  const aiPct = pct(usage.aiCreditsUsed, usage.aiCreditsAllowance);
  const narrPct = pct(usage.narrationMinutesUsed, usage.narrationMinutesAllowance);
  const warning = aiPct >= 80 || narrPct >= 80;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="border-border-subtle bg-surface-raised text-body-sm text-text-secondary duration-state hover:border-border inline-flex h-8 items-center gap-2 rounded-md border px-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
      >
        {warning ? (
          <AlertTriangle size={14} className="text-status-warning" aria-hidden />
        ) : (
          <Sparkles size={14} className="text-accent" aria-hidden />
        )}
        Usage
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Monthly usage"
          className="border-border-subtle bg-surface-raised absolute right-0 top-10 z-40 w-80 rounded-lg border p-4 shadow-md"
        >
          <p className="text-caption text-text-tertiary uppercase">This month</p>

          <div className="mt-3 space-y-4">
            <UsageRow
              icon={<Sparkles size={14} className="text-accent" aria-hidden />}
              label="AI credits"
              used={usage.aiCreditsUsed}
              allowance={usage.aiCreditsAllowance}
              pct={aiPct}
              unit="credits"
            />
            <UsageRow
              icon={<Mic size={14} className="text-accent" aria-hidden />}
              label="Narration minutes"
              used={usage.narrationMinutesUsed}
              allowance={usage.narrationMinutesAllowance}
              pct={narrPct}
              unit="min"
            />
          </div>

          {warning ? (
            <Banner variant="warning" className="mt-4">
              You&apos;re approaching your monthly cap. Request more from your admin to keep
              generating without interruption.
            </Banner>
          ) : null}

          <div className="mt-4 flex gap-2">
            <Link
              href="/usage/request"
              className="bg-accent text-body-sm text-text-on-accent duration-state hover:bg-accent-hover inline-flex h-8 flex-1 items-center justify-center rounded-md px-3 font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              Request more
            </Link>
            <Link
              href="/cap-requests"
              className="border-border bg-surface-raised text-body-sm text-text-primary duration-state hover:border-border-strong inline-flex h-8 items-center justify-center rounded-md border px-3 font-medium transition-colors"
            >
              Approval queue
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function UsageRow({
  icon,
  label,
  used,
  allowance,
  pct,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  used: number;
  allowance: number;
  pct: number;
  unit: string;
}) {
  return (
    <div>
      <div className="text-body-sm flex items-center justify-between">
        <span className="text-text-primary flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="text-text-secondary">
          {used} / {allowance} {unit}
        </span>
      </div>
      <ProgressBar
        className="mt-1.5"
        value={used}
        max={allowance}
        variant={pct >= 100 ? "danger" : pct >= 80 ? "warning" : "neutral"}
      />
    </div>
  );
}

function pct(used: number, allowance: number): number {
  if (allowance <= 0) return 0;
  return Math.round((used / allowance) * 100);
}
