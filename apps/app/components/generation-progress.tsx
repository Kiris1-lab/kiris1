"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { Spinner } from "@kiris/ui";

const STEPS = [
  "Reading your materials…",
  "Drafting learning objectives…",
  "Structuring 8 microlearning segments…",
  "Writing slide content with Mayer's principles applied…",
  "Generating quiz questions…",
  "Generating narration scripts…",
  "Producing narration audio…",
  "Running internal critic pass for clarity and cognitive load…",
];

/**
 * Express AI progress narration (DESIGN §10.1). Cosmetic in Step 2 — the real
 * pipeline streams events from @kiris/api in Step 3. The intent is to make the
 * generation moment feel deliberate and trustworthy, not opaque.
 */
export function GenerationProgress({
  redirectToModuleId,
  cadenceMs = 800,
}: {
  redirectToModuleId: string;
  cadenceMs?: number;
}) {
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (step >= STEPS.length) {
      router.push(`/modules/${redirectToModuleId}`);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), cadenceMs);
    return () => clearTimeout(t);
  }, [step, cadenceMs, redirectToModuleId, router]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
          <Sparkles size={20} aria-hidden className="animate-pulse" />
        </div>
        <div>
          <p className="text-caption uppercase text-accent">Express AI</p>
          <h1 className="text-heading-xl">Generating your module…</h1>
        </div>
      </div>
      <p className="mt-3 text-body-md text-text-secondary">
        Most modules generate in 60–180 seconds. You can safely wait here — we'll land you in the
        editor automatically.
      </p>

      <ol
        className="mt-8 space-y-3"
        aria-live="polite"
        aria-label="Generation progress"
      >
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex items-start gap-3 text-body-md">
              <span
                className={
                  done
                    ? "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-text-on-accent"
                    : active
                      ? "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-accent text-accent"
                      : "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-border-subtle text-text-tertiary"
                }
                aria-hidden
              >
                {done ? (
                  <Check size={12} />
                ) : active ? (
                  <Spinner size={12} className="text-accent" />
                ) : null}
              </span>
              <span className={done ? "text-text-secondary line-through" : "text-text-primary"}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
