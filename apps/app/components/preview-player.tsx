"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mic, X } from "lucide-react";
import { ProgressBar } from "@kiris/ui";
import type { Module } from "@/lib/types";
import { SLIDE_TYPE_LABEL } from "./slide-icon";
import { formatDuration } from "@/lib/format";

/**
 * Preview player. Mimics SCORM player behavior in-app so authors can validate
 * the learner experience before exporting. Self-direction (DESIGN §17.3) is
 * enforced: learners can navigate forward, back, or jump.
 */
export function PreviewPlayer({ module }: { module: Module }) {
  const [idx, setIdx] = useState(0);
  const slide = module.slides[idx]!;
  const total = module.slides.length;

  return (
    <div className="flex h-screen flex-col bg-surface-base">
      <header className="flex h-14 items-center gap-3 border-b border-border-subtle bg-surface-base px-4">
        <span className="text-heading-sm">{module.title}</span>
        <span className="text-body-sm text-text-tertiary">Preview</span>
        <Link
          href={`/modules/${module.id}`}
          className="ml-auto inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface-raised px-3 text-body-sm font-medium text-text-primary hover:border-border-strong"
        >
          <X size={14} aria-hidden /> Close preview
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <article className="flex aspect-video w-full max-w-4xl flex-col rounded-xl border border-border-subtle bg-surface-raised p-12 shadow-lg">
          <p className="text-caption uppercase text-text-tertiary">{SLIDE_TYPE_LABEL[slide.type]}</p>
          <h1 className="mt-2 text-display-md">{slide.title}</h1>
          <div className="mt-6 flex-1 whitespace-pre-line text-body-lg text-text-primary">
            {slide.bodyMarkdown}
          </div>
          <div className="mt-6 flex items-center gap-2 text-body-sm text-text-secondary">
            <Mic size={14} className="text-accent" aria-hidden />
            Narration · {formatDuration(slide.durationSeconds)}
          </div>
        </article>
      </main>

      <footer className="border-t border-border-subtle bg-surface-raised">
        <div className="px-4 pt-3">
          <ProgressBar value={idx + 1} max={total} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface-raised px-3 text-body-sm font-medium text-text-primary hover:border-border-strong disabled:opacity-50"
          >
            <ArrowLeft size={14} aria-hidden /> Previous
          </button>
          <span className="text-body-sm text-text-secondary">
            Slide {idx + 1} of {total}
          </span>
          <button
            type="button"
            onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
            disabled={idx === total - 1}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-body-sm font-medium text-text-on-accent shadow-sm hover:bg-accent-hover disabled:opacity-50"
          >
            Next <ArrowRight size={14} aria-hidden />
          </button>
        </div>
      </footer>
    </div>
  );
}
