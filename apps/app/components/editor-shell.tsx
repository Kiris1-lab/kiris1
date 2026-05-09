"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AIHelperButton,
  Badge,
  Banner,
  KBD,
  ProgressBar,
  TierBadge,
} from "@kiris/ui";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Mic,
  Plus,
} from "lucide-react";
import type { Module, Slide } from "@/lib/types";
import { SLIDE_TYPE_LABEL, SlideIcon } from "./slide-icon";
import { formatDuration } from "@/lib/format";

/**
 * The editor (DESIGN §10.3, §16.11). 3-column layout, collapsible rails,
 * direct manipulation. Step 2 wires reordering and field-edit state in client
 * memory only — persistence + real AI helper popovers in Step 3.
 */
export function EditorShell({ module, tier }: { module: Module; tier: "standard" | "hipaa" }) {
  const [slides, setSlides] = useState<Slide[]>(module.slides);
  const [selectedId, setSelectedId] = useState<string>(slides[0]?.id ?? "");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [tab, setTab] = useState<"slide" | "voice" | "interactions" | "ai">("slide");

  const selected = useMemo(
    () => slides.find((s) => s.id === selectedId) ?? slides[0]!,
    [slides, selectedId],
  );

  const reviewedCount = slides.filter((s) => s.reviewedByUser).length;
  const totalSeconds = slides.reduce((acc, s) => acc + s.durationSeconds, 0);

  function update(patch: Partial<Slide>) {
    setSlides((arr) =>
      arr.map((s) => (s.id === selected.id ? { ...s, ...patch, reviewedByUser: true } : s)),
    );
  }

  function move(id: string, dir: -1 | 1) {
    setSlides((arr) => {
      const idx = arr.findIndex((s) => s.id === id);
      if (idx === -1) return arr;
      const swap = idx + dir;
      if (swap < 0 || swap >= arr.length) return arr;
      const next = arr.slice();
      const a = next[idx]!;
      const b = next[swap]!;
      next[idx] = b;
      next[swap] = a;
      return next.map((s, i) => ({ ...s, position: i + 1 }));
    });
  }

  return (
    <div className="flex h-screen flex-col bg-surface-base">
      {/* Top bar */}
      <header className="flex h-14 items-center gap-3 border-b border-border-subtle bg-surface-base px-4">
        <Link
          href="/"
          aria-label="Back to dashboard"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors duration-state hover:bg-accent-soft"
        >
          <ArrowLeft size={16} aria-hidden />
        </Link>
        <span className="text-heading-sm">{module.title}</span>
        <Badge variant="outline">All changes saved</Badge>
        <TierBadge tier={tier} />
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/modules/${module.id}/preview`}
            className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface-raised px-3 text-body-sm font-medium text-text-primary transition-colors duration-state hover:border-border-strong"
          >
            <Eye size={14} aria-hidden /> Preview
          </Link>
          <a
            href={`/api/modules/${module.id}/export`}
            className="inline-flex h-8 items-center gap-2 rounded-md bg-accent px-3 text-body-sm font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
          >
            <Download size={14} aria-hidden /> Export SCORM
          </a>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left rail */}
        <aside
          className={`${leftOpen ? "w-72" : "w-12"} thin-scroll flex flex-col border-r border-border-subtle bg-surface-raised transition-[width] duration-layout`}
          aria-label="Module outline"
        >
          <div className="flex h-12 items-center justify-between px-3">
            <span
              className={`text-caption uppercase text-text-tertiary ${leftOpen ? "" : "sr-only"}`}
            >
              Outline
            </span>
            <button
              type="button"
              onClick={() => setLeftOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-accent-soft"
              aria-label={leftOpen ? "Collapse outline" : "Expand outline"}
            >
              <ChevronLeft
                size={14}
                aria-hidden
                className={`transition-transform duration-state ${leftOpen ? "" : "rotate-180"}`}
              />
            </button>
          </div>
          {leftOpen ? (
            <ol className="flex-1 overflow-y-auto p-2">
              {slides.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    className={`group flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-body-sm transition-colors duration-state ${
                      s.id === selected.id
                        ? "bg-accent-soft text-accent"
                        : "text-text-secondary hover:bg-surface-base"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-text-tertiary ${
                        s.id === selected.id ? "text-accent" : ""
                      }`}
                    >
                      <SlideIcon type={s.type} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-text-primary">{s.title}</span>
                      <span className="text-caption text-text-tertiary">
                        {SLIDE_TYPE_LABEL[s.type]} · {formatDuration(s.durationSeconds)}
                      </span>
                    </span>
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        s.reviewedByUser ? "bg-status-success" : "bg-status-warning"
                      }`}
                      aria-label={s.reviewedByUser ? "Reviewed" : "Needs review"}
                    />
                  </button>
                </li>
              ))}
              <li className="px-3 pt-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-dashed border-border text-body-sm text-text-secondary transition-colors duration-state hover:border-accent hover:text-accent"
                >
                  <Plus size={14} aria-hidden /> Add slide
                </button>
              </li>
            </ol>
          ) : null}
        </aside>

        {/* Center canvas */}
        <section className="flex min-w-0 flex-1 flex-col" aria-label="Slide canvas">
          <div className="flex h-12 items-center justify-between border-b border-border-subtle bg-surface-raised px-4 text-body-sm text-text-secondary">
            <span>
              Slide {selected.position} of {slides.length} · {SLIDE_TYPE_LABEL[selected.type]}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(selected.id, -1)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-accent-soft"
                aria-label="Move slide up"
              >
                <ChevronLeft size={14} className="rotate-90" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => move(selected.id, 1)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-accent-soft"
                aria-label="Move slide down"
              >
                <ChevronRight size={14} className="rotate-90" aria-hidden />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <SlideCanvas slide={selected} />
          </div>
          <div className="flex h-10 items-center justify-between border-t border-border-subtle bg-surface-raised px-4 text-caption text-text-tertiary">
            <span>
              {slides.length} slides · {formatDuration(totalSeconds)} total
            </span>
            <span>
              {reviewedCount} of {slides.length} slides reviewed
              {reviewedCount < slides.length ? " · ✨ unreviewed AI content remains" : " · ✓ ready"}
            </span>
            <span>
              <KBD>⌘</KBD> <KBD>\</KBD> rails
            </span>
          </div>
        </section>

        {/* Right rail */}
        <aside
          className={`${rightOpen ? "w-96" : "w-12"} thin-scroll flex flex-col border-l border-border-subtle bg-surface-raised transition-[width] duration-layout`}
          aria-label="Slide properties"
        >
          <div className="flex h-12 items-center justify-between px-3">
            <button
              type="button"
              onClick={() => setRightOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-accent-soft"
              aria-label={rightOpen ? "Collapse properties" : "Expand properties"}
            >
              <ChevronRight
                size={14}
                aria-hidden
                className={`transition-transform duration-state ${rightOpen ? "" : "rotate-180"}`}
              />
            </button>
            {rightOpen ? (
              <nav className="flex gap-1" aria-label="Properties tabs">
                {(["slide", "voice", "interactions", "ai"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-md px-2.5 py-1 text-caption uppercase transition-colors duration-state ${
                      tab === t
                        ? "bg-accent-soft text-accent"
                        : "text-text-tertiary hover:bg-surface-base"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            ) : null}
          </div>
          {rightOpen ? (
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {tab === "slide" ? <SlideTab slide={selected} onChange={update} /> : null}
              {tab === "voice" ? <VoiceTab slide={selected} /> : null}
              {tab === "interactions" ? <InteractionsTab slide={selected} /> : null}
              {tab === "ai" ? <AITab /> : null}
            </div>
          ) : null}
        </aside>
      </div>

      {/* Reviewed-progress strip across the bottom of the editor */}
      <div className="border-t border-border-subtle bg-surface-raised px-4 py-2">
        <ProgressBar
          value={reviewedCount}
          max={slides.length}
          label="Module review progress"
          variant={reviewedCount === slides.length ? "neutral" : "warning"}
        />
      </div>
    </div>
  );
}

function SlideCanvas({ slide }: { slide: Slide }) {
  return (
    <div className="mx-auto aspect-video w-full max-w-3xl rounded-xl border border-border-subtle bg-surface-raised p-10 shadow-md">
      <p className="text-caption uppercase text-text-tertiary">{SLIDE_TYPE_LABEL[slide.type]}</p>
      <h2 className="mt-2 text-heading-xl">{slide.title}</h2>
      <div className="mt-6 whitespace-pre-line text-body-md text-text-primary">
        {slide.bodyMarkdown}
      </div>
      <div className="mt-8 flex items-center gap-2 rounded-md border border-border-subtle bg-surface-base p-3 text-body-sm text-text-secondary">
        <Mic size={14} className="text-accent" aria-hidden />
        <span>Polly Neural · Joanna · {formatDuration(slide.durationSeconds)}</span>
      </div>
    </div>
  );
}

function SlideTab({ slide, onChange }: { slide: Slide; onChange: (patch: Partial<Slide>) => void }) {
  return (
    <div className="space-y-5 pt-3">
      <FieldGroup label="Slide title" helperReviewed={slide.reviewedByUser}>
        <input
          className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-body-md focus:border-accent focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          value={slide.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Body" helperReviewed={slide.reviewedByUser}>
        <textarea
          rows={6}
          className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-body-md focus:border-accent focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          value={slide.bodyMarkdown}
          onChange={(e) => onChange({ bodyMarkdown: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup
        label="Narration script"
        help="Mayer's redundancy principle: don't duplicate body text."
        helperReviewed={slide.reviewedByUser}
      >
        <textarea
          rows={6}
          className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-body-md focus:border-accent focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          value={slide.narrationScript}
          onChange={(e) => onChange({ narrationScript: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Alt text" help="WCAG 2.2 AA · required for non-decorative images.">
        <input
          className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-body-md focus:border-accent focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          value={slide.altText}
          onChange={(e) => onChange({ altText: e.target.value })}
          placeholder="Describe any image on this slide for screen readers"
        />
      </FieldGroup>
    </div>
  );
}

function VoiceTab({ slide }: { slide: Slide }) {
  return (
    <div className="space-y-5 pt-3">
      <FieldGroup label="Engine" help="Generative is more expressive but billed at a higher rate.">
        <select className="h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-body-md">
          <option>Neural</option>
          <option>Generative</option>
        </select>
      </FieldGroup>
      <FieldGroup label="Voice">
        <select className="h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-body-md">
          <option>Joanna (en-US, female)</option>
          <option>Matthew (en-US, male)</option>
          <option>Ruth (en-US, female)</option>
        </select>
      </FieldGroup>
      <div className="rounded-md border border-border-subtle bg-surface-base p-3 text-body-sm text-text-secondary">
        <p>Generated audio · {formatDuration(slide.durationSeconds)}</p>
        <div className="mt-2 h-12 rounded bg-accent-soft" aria-label="Audio waveform placeholder" />
      </div>
      <button
        type="button"
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-accent px-3 text-body-sm font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
      >
        Regenerate narration audio
      </button>
    </div>
  );
}

function InteractionsTab({ slide }: { slide: Slide }) {
  const items =
    slide.type === "knowledge_check" || slide.type === "final_check"
      ? ["Question 1 · single-choice", "Question 2 · multi-choice"]
      : slide.type === "scenario"
        ? ["Branch · 'I push the cart in'", "Branch · 'I sanitize first'"]
        : [];

  return (
    <div className="space-y-3 pt-3">
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border-subtle p-4 text-body-sm text-text-tertiary">
          No interactions on this slide. Add one to keep learners engaged every 2–3 minutes.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((label) => (
            <li
              key={label}
              className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-base px-3 py-2 text-body-sm"
            >
              <span>{label}</span>
              <button className="text-caption text-accent hover:underline">Edit</button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed border-border text-body-sm text-text-secondary hover:border-accent hover:text-accent"
      >
        <Plus size={14} aria-hidden /> Add interaction
      </button>
    </div>
  );
}

function AITab() {
  return (
    <div className="space-y-3 pt-3">
      <Banner variant="info">
        AI helpers re-run with the audience and goal you set when creating the module.
      </Banner>
      {[
        ["Regenerate this slide", "From the same source materials, with the same constraints."],
        ["Improve clarity", "Tighten language, prefer plain words, keep meaning."],
        ["Make shorter", "Trim 30% while preserving the main idea."],
        ["Apply Mayer's audit", "Check coherence, signaling, redundancy, and modality on this slide."],
        ["Translate to plain language", "Flesch reading ease ≥ 60. Preserves clinical terminology."],
      ].map(([title, body]) => (
        <button
          key={title}
          type="button"
          className="block w-full rounded-md border border-border-subtle bg-surface-base p-3 text-left transition-colors duration-state hover:border-accent"
        >
          <span className="block text-body-sm font-medium text-text-primary">{title}</span>
          <span className="text-caption text-text-tertiary">{body}</span>
        </button>
      ))}
    </div>
  );
}

function FieldGroup({
  label,
  help,
  helperReviewed = false,
  children,
}: {
  label: string;
  help?: string;
  helperReviewed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-body-sm font-medium text-text-primary">{label}</label>
        <AIHelperButton reviewed={helperReviewed} />
      </div>
      {help ? <p className="mt-1 text-caption text-text-tertiary">{help}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}
