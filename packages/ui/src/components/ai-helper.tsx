"use client";

import { Check, Sparkles } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils.js";

/**
 * AI helper button — the ✨ moment (DESIGN §16.11). Sits next to AI-generated
 * fields. Click to open the helper popover. Once a user has touched the field,
 * the icon flips to ✓ to signal "human-reviewed."
 */
export function AIHelperButton({
  reviewed = false,
  className,
  generating = false,
  ...props
}: { reviewed?: boolean; generating?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={reviewed ? "Reviewed by human; click to regenerate" : "AI helpers"}
      className={cn(
        "border-border-subtle bg-surface-raised text-accent duration-state hover:bg-accent-soft inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
        className,
      )}
      {...props}
    >
      {reviewed ? (
        <Check size={14} aria-hidden />
      ) : (
        <Sparkles size={14} aria-hidden className={generating ? "animate-pulse" : undefined} />
      )}
    </button>
  );
}
