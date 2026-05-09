"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AIHelperButton, Badge, Banner, KBD, ProgressBar, TierBadge } from "@kiris/ui";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Eye, Mic, Plus } from "lucide-react";
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
    <div className="bg-surface-base flex h-screen flex-col">
      {/* Top bar */}
      <header className="border-border-subtle bg-surface-base flex h-14 items-center gap-3 border-b px-4">
        <Link
          href="/"
          aria-label="Back to dashboard"
          className="text-text-secondary duration-state hover:bg-accent-soft inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        >
          <ArrowLeft size={16} aria-hidden />
        </Link>
        <span className="text-heading-sm">{module.title}</span>
        <Badge variant="outline">All changes saved</Badge>
        <TierBadge tier={tier} />
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/modules/${module.id}/preview`}
            className="border-border bg-surface-raised text-body-sm text-text-primary duration-state hover:border-border-strong inline-flex h-8 items-center gap-2 rounded-md border px-3 font-medium transition-colors"
          >
            <Eye size={14} aria-hidden /> Preview
          </Link>
          <a
            href={`/api/modules/${module.id}/export`}
            className="bg-accent text-body-sm text-text-on-accent hover:bg-accent-hover inline-flex h-8 items-center gap-2 rounded-md px-3 font-medium shadow-sm"
          >
            <Download size={14} aria-hidden /> Export SCORM
          </a>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left rail */}
        <aside
          className={`${leftOpen ? "w-72" : "w-12"} thin-scroll border-border-subtle bg-surface-raised duration-layout flex flex-col border-r transition-[width]`}
          aria-label="Module outline"
        >
          <div className="flex h-12 items-center justify-between px-3">
            <span
              className={`text-caption text-text-tertiary uppercase ${leftOpen ? "" : "sr-only"}`}
            >
              Outline
            </span>
            <button
              type="button"
              onClick={() => setLeftOpen((v) => !v)}
              className="text-text-tertiary hover:bg-accent-soft flex h-7 w-7 items-center justify-center rounded-md"
              aria-label={leftOpen ? "Collapse outline" : "Expand outline"}
            >
              <ChevronLeft
                size={14}
                aria-hidden
                className={`duration-state transition-transform ${leftOpen ? "" : "rotate-180"}`}
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
                    className={`text-body-sm duration-state group flex w-full items-start gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                      s.id === selected.id
                        ? "bg-accent-soft text-accent"
                        : "text-text-secondary hover:bg-surface-base"
                    }`}
                  >
                    <span
                      className={`text-text-tertiary mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                        s.id === selected.id ? "text-accent" : ""
                      }`}
                    >
                      <SlideIcon type={s.type} />
                    </span>
                    <span className="flex-1">
                      <span className="text-text-primary block font-medium">{s.title}</span>
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
                  className="border-border text-body-sm text-text-secondary duration-state hover:border-accent hover:text-accent inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-dashed transition-colors"
                >
                  <Plus size={14} aria-hidden /> Add slide
                </button>
              </li>
            </ol>
          ) : null}
        </aside>

        {/* Center canvas */}
        <section className="flex min-w-0 flex-1 flex-col" aria-label="Slide canvas">
          <div className="border-border-subtle bg-surface-raised text-body-sm text-text-secondary flex h-12 items-center justify-between border-b px-4">
            <span>
              Slide {selected.position} of {slides.length} · {SLIDE_TYPE_LABEL[selected.type]}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(selected.id, -1)}
                className="text-text-secondary hover:bg-accent-soft inline-flex h-7 w-7 items-center justify-center rounded-md"
                aria-label="Move slide up"
              >
                <ChevronLeft size={14} className="rotate-90" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => move(selected.id, 1)}
                className="text-text-secondary hover:bg-accent-soft inline-flex h-7 w-7 items-center justify-center rounded-md"
                aria-label="Move slide down"
              >
                <ChevronRight size={14} className="rotate-90" aria-hidden />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <SlideCanvas slide={selected} />
          </div>
          <div className="border-border-subtle bg-surface-raised text-caption text-text-tertiary flex h-10 items-center justify-between border-t px-4">
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
          className={`${rightOpen ? "w-96" : "w-12"} thin-scroll border-border-subtle bg-surface-raised duration-layout flex flex-col border-l transition-[width]`}
          aria-label="Slide properties"
        >
          <div className="flex h-12 items-center justify-between px-3">
            <button
              type="button"
              onClick={() => setRightOpen((v) => !v)}
              className="text-text-tertiary hover:bg-accent-soft flex h-7 w-7 items-center justify-center rounded-md"
              aria-label={rightOpen ? "Collapse properties" : "Expand properties"}
            >
              <ChevronRight
                size={14}
                aria-hidden
                className={`duration-state transition-transform ${rightOpen ? "" : "rotate-180"}`}
              />
            </button>
            {rightOpen ? (
              <nav className="flex gap-1" aria-label="Properties tabs">
                {(["slide", "voice", "interactions", "ai"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`text-caption duration-state rounded-md px-2.5 py-1 uppercase transition-colors ${
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
      <div className="border-border-subtle bg-surface-raised border-t px-4 py-2">
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
    <div className="border-border-subtle bg-surface-raised mx-auto aspect-video w-full max-w-3xl rounded-xl border p-10 shadow-md">
      <p className="text-caption text-text-tertiary uppercase">{SLIDE_TYPE_LABEL[slide.type]}</p>
      <h2 className="text-heading-xl mt-2">{slide.title}</h2>
      <div className="text-body-md text-text-primary mt-6 whitespace-pre-line">
        {slide.bodyMarkdown}
      </div>
      <div className="border-border-subtle bg-surface-base text-body-sm text-text-secondary mt-8 flex items-center gap-2 rounded-md border p-3">
        <Mic size={14} className="text-accent" aria-hidden />
        <span>Polly Neural · Joanna · {formatDuration(slide.durationSeconds)}</span>
      </div>
    </div>
  );
}

function SlideTab({
  slide,
  onChange,
}: {
  slide: Slide;
  onChange: (patch: Partial<Slide>) => void;
}) {
  return (
    <div className="space-y-5 pt-3">
      <FieldGroup label="Slide title" helperReviewed={slide.reviewedByUser}>
        <input
          className="border-border bg-surface-raised text-body-md focus:border-accent w-full rounded-md border px-3 py-2 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          value={slide.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Body" helperReviewed={slide.reviewedByUser}>
        <textarea
          rows={6}
          className="border-border bg-surface-raised text-body-md focus:border-accent w-full rounded-md border px-3 py-2 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
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
          className="border-border bg-surface-raised text-body-md focus:border-accent w-full rounded-md border px-3 py-2 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          value={slide.narrationScript}
          onChange={(e) => onChange({ narrationScript: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Alt text" help="WCAG 2.2 AA · required for non-decorative images.">
        <input
          className="border-border bg-surface-raised text-body-md focus:border-accent w-full rounded-md border px-3 py-2 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
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
        <select className="border-border bg-surface-raised text-body-md h-10 w-full rounded-md border px-3">
          <option>Neural</option>
          <option>Generative</option>
        </select>
      </FieldGroup>
      <FieldGroup label="Voice">
        <select className="border-border bg-surface-raised text-body-md h-10 w-full rounded-md border px-3">
          <option>Joanna (en-US, female)</option>
          <option>Matthew (en-US, male)</option>
          <option>Ruth (en-US, female)</option>
        </select>
      </FieldGroup>
      <div className="border-border-subtle bg-surface-base text-body-sm text-text-secondary rounded-md border p-3">
        <p>Generated audio · {formatDuration(slide.durationSeconds)}</p>
        <div className="bg-accent-soft mt-2 h-12 rounded" aria-label="Audio waveform placeholder" />
      </div>
      <button
        type="button"
        className="bg-accent text-body-sm text-text-on-accent hover:bg-accent-hover inline-flex h-9 w-full items-center justify-center gap-2 rounded-md px-3 font-medium shadow-sm"
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
        <p className="border-border-subtle text-body-sm text-text-tertiary rounded-md border border-dashed p-4">
          No interactions on this slide. Add one to keep learners engaged every 2–3 minutes.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((label) => (
            <li
              key={label}
              className="border-border-subtle bg-surface-base text-body-sm flex items-center justify-between rounded-md border px-3 py-2"
            >
              <span>{label}</span>
              <button className="text-caption text-accent hover:underline">Edit</button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="border-border text-body-sm text-text-secondary hover:border-accent hover:text-accent inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed"
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
        [
          "Apply Mayer's audit",
          "Check coherence, signaling, redundancy, and modality on this slide.",
        ],
        [
          "Translate to plain language",
          "Flesch reading ease ≥ 60. Preserves clinical terminology.",
        ],
      ].map(([title, body]) => (
        <button
          key={title}
          type="button"
          className="border-border-subtle bg-surface-base duration-state hover:border-accent block w-full rounded-md border p-3 text-left transition-colors"
        >
          <span className="text-body-sm text-text-primary block font-medium">{title}</span>
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
        <label className="text-body-sm text-text-primary font-medium">{label}</label>
        <AIHelperButton reviewed={helperReviewed} />
      </div>
      {help ? <p className="text-caption text-text-tertiary mt-1">{help}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}
