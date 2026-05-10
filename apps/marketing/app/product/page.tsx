import {
  Brain,
  Edit3,
  GraduationCap,
  Layers,
  ListChecks,
  Mic,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Card, CardBody } from "@kiris/ui";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { CtaLink } from "@/components/cta-link";
import { ProductModeTabs } from "@/components/product-mode-tabs";

export const metadata = { title: "Product" };

export default function ProductPage() {
  return (
    <>
      <Section tone="base" density="spacious">
        <div className="max-w-3xl">
          <SectionEyebrow>Product</SectionEyebrow>
          <h1 className="text-display-lg text-text-primary mt-3">
            Two ways to build. One polished result
          </h1>
          <p className="text-body-lg text-text-secondary mt-5">
            Pick the workflow that fits the task. Express writes the whole module from a topic and a
            handful of materials. Guided gives you a blank outline and a ✨ helper on every field.
            Both produce the same export-ready output.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink href="/signup" size="lg" withArrow>
              Build my first module
            </CtaLink>
            <CtaLink href="/pricing" size="lg" variant="secondary">
              See pricing
            </CtaLink>
          </div>
        </div>

        <div className="mt-16">
          <ProductModeTabs
            expressLabel="Express AI"
            guidedLabel="Guided AI"
            express={<ExpressPanel />}
            guided={<GuidedPanel />}
          />
        </div>
      </Section>

      <Section tone="raised">
        <SectionEyebrow>Editor</SectionEyebrow>
        <SectionHeading sub="Both modes converge in the same editor — direct manipulation, keyboard-first, accessible by default.">
          Where the work actually happens.
        </SectionHeading>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
          <EditorMockup />
          <ol className="text-body-md text-text-secondary space-y-6">
            <NumberedFeature
              n={1}
              title="3-column workspace"
              body="Outline on the left, slide canvas in the middle, properties + AI helpers on the right. Collapsible rails for focus."
            />
            <NumberedFeature
              n={2}
              title="Direct-manipulation editing"
              body="Click any text to edit. Drag any block to reorder. Cmd/Ctrl-Z everywhere. No modal forms."
            />
            <NumberedFeature
              n={3}
              title="Studio-quality narration"
              body="AWS Polly Neural and Generative voices. Regenerate per slide; preview audio with timestamps."
            />
            <NumberedFeature
              n={4}
              title="Knowledge checks + scenarios"
              body="Single-choice, multi-choice, true/false, drag-match, and branching scenarios. Plausible distractors generated automatically."
            />
            <NumberedFeature
              n={5}
              title="WCAG 2.2 AA, every export"
              body="Authoring app and exported modules both meet AA. Captions, alt text, color-independent meaning."
            />
          </ol>
        </div>
      </Section>

      <Section tone="base" id="learning-science">
        <SectionEyebrow>Pedagogy</SectionEyebrow>
        <SectionHeading sub="Every Kiris module follows a structure grounded in research: hook, objectives, microlearning segments, application, summary, final knowledge check.">
          Built on learning science (so you don&apos;t have to think about it).
        </SectionHeading>
        <ul className="border-border-subtle mx-auto mt-12 max-w-3xl divide-y border-y">
          <PrincipleRow
            icon={<GraduationCap aria-hidden size={20} />}
            title="Microlearning structure"
            body="3–5 segments of 2–4 minutes each. Working memory holds about 7 items at a time; modules respect that limit."
          />
          <PrincipleRow
            icon={<Brain aria-hidden size={20} />}
            title="Mayer's 12 multimedia principles"
            body="Coherence, signaling, redundancy, modality, contiguity, personalization. Applied automatically at generation time so the structure works without you fussing over it."
          />
          <PrincipleRow
            icon={<ListChecks aria-hidden size={20} />}
            title="Plain language by default"
            body="Flesch reading ease ≥ 60 on every block. Clinical terminology preserved where appropriate; the surrounding language stays accessible to non-clinicians."
          />
        </ul>
      </Section>

      <Section tone="inverse" density="spacious">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-md text-on-inverse">A polished module, before lunch.</h2>
          <p className="text-body-lg text-on-inverse/80 mt-4">
            Pay per seat. No contracts. Cancel anytime.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaLink href="/signup" size="lg" withArrow>
              Build my first module
            </CtaLink>
            <CtaLink href="/pricing" size="lg" variant="secondary">
              See pricing
            </CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ---------------- Mode panels ---------------- */

function ExpressPanel() {
  return (
    <Card>
      <CardBody className="p-8 md:p-10">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-accent-soft text-accent inline-flex h-9 w-9 items-center justify-center rounded-md">
                <Sparkles aria-hidden size={20} />
              </span>
              <span className="text-caption text-accent uppercase tracking-wider">Express AI</span>
            </div>
            <h2 className="text-heading-xl mt-4">Drop in materials, get a complete module.</h2>
            <p className="text-body-md text-text-secondary mt-3">
              Title, materials, audience, goal. Click generate. Kiris builds the outline, slides,
              narration script, knowledge checks, and an in-your-shoes scenario in 60–180 seconds.
            </p>
            <ul className="text-body-md text-text-secondary mt-6 space-y-2">
              <Bullet>Bloom&apos;s-taxonomy-aware learning objectives</Bullet>
              <Bullet>Knowledge checks every 2–3 minutes</Bullet>
              <Bullet>Branching scenario in every module</Bullet>
              <Bullet>AI critic pass rejects cluttered or off-topic slides</Bullet>
            </ul>
          </div>
          <ExpressPreview />
        </div>
      </CardBody>
    </Card>
  );
}

function GuidedPanel() {
  return (
    <Card>
      <CardBody className="p-8 md:p-10">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-accent-soft text-accent inline-flex h-9 w-9 items-center justify-center rounded-md">
                <Workflow aria-hidden size={20} />
              </span>
              <span className="text-caption text-accent uppercase tracking-wider">Guided AI</span>
            </div>
            <h2 className="text-heading-xl mt-4">
              Build the outline yourself. AI polishes on demand.
            </h2>
            <p className="text-body-md text-text-secondary mt-3">
              A blank outline tree, drag-to-reorder, inline ✨ helpers on every field. Click
              &ldquo;Polish all&rdquo; when you want a full pass for consistency, transitions, and
              accessibility.
            </p>
            <ul className="text-body-md text-text-secondary mt-6 space-y-2">
              <Bullet>Outline tree with sections, slides, drag-to-reorder</Bullet>
              <Bullet>
                Per-field helpers: polish, regenerate, shorten, plain-language, translate
              </Bullet>
              <Bullet>Asset library with crop, annotate, hotspots</Bullet>
              <Bullet>Add interactive moments anywhere</Bullet>
            </ul>
          </div>
          <GuidedPreview />
        </div>
      </CardBody>
    </Card>
  );
}

function ExpressPreview() {
  return (
    <div className="border-border-subtle bg-surface-sunken rounded-lg border p-5">
      <p className="text-caption text-text-tertiary uppercase tracking-wider">You type</p>
      <ul className="mt-3 space-y-2">
        {[
          { k: "Topic", v: "Hand hygiene refresher" },
          { k: "Audience", v: "Med-surg nurses" },
          { k: "Goal", v: "Pass annual mandate" },
          { k: "Materials", v: "2 PDFs · 1 transcript" },
        ].map((row) => (
          <li key={row.k} className="flex items-baseline gap-3">
            <span className="text-caption text-text-tertiary w-24 shrink-0 uppercase">{row.k}</span>
            <span className="text-body-sm text-text-primary">{row.v}</span>
          </li>
        ))}
      </ul>
      <p className="text-caption text-accent mt-5 uppercase tracking-wider">Kiris returns</p>
      <ul className="text-body-sm text-text-secondary mt-3 space-y-1.5">
        <li>· 12 slides · 8:14 narrated</li>
        <li>· Hook + 3 microlearning segments</li>
        <li>· 4 knowledge checks · 1 scenario</li>
        <li>· SCORM 1.2, xAPI, MP4 ready</li>
      </ul>
    </div>
  );
}

function GuidedPreview() {
  return (
    <div className="border-border-subtle bg-surface-sunken rounded-lg border p-5">
      <p className="text-caption text-text-tertiary uppercase tracking-wider">Outline</p>
      <ol className="text-body-sm text-text-primary mt-3 space-y-1.5">
        {[
          "01 · Why this matters now",
          "02 · The 5 moments",
          "03 · Demo: gloving in",
          "04 · Knowledge check",
          "05 · In-your-shoes scenario",
        ].map((line) => (
          <li
            key={line}
            className="border-border-subtle bg-surface-raised flex items-center gap-2 rounded-md border px-3 py-2"
          >
            <span aria-hidden className="text-text-tertiary">
              ⋮⋮
            </span>
            {line}
          </li>
        ))}
      </ol>
      <div className="bg-accent-soft mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5">
        <Sparkles aria-hidden size={14} className="text-accent" />
        <span className="text-caption text-accent uppercase tracking-wider">Polish all</span>
      </div>
    </div>
  );
}

/* ---------------- Editor mockup ---------------- */

function EditorMockup() {
  return (
    <div className="border-border-subtle bg-surface-raised overflow-hidden rounded-xl border shadow-lg">
      <div className="border-border-subtle text-caption text-text-tertiary flex items-center gap-2 border-b px-4 py-3">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#fca5a5]" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#86efac]" />
        <span className="ml-3">Editor · Hand hygiene refresher</span>
      </div>
      <div className="bg-border-subtle grid grid-cols-12 gap-px">
        <aside className="bg-surface-base col-span-3 p-3">
          <p className="text-caption text-text-tertiary uppercase tracking-wider">Outline</p>
          <ul className="mt-2 space-y-1">
            {["Hook", "Objectives", "5 moments", "Demo", "Quiz"].map((l, i) => (
              <li
                key={l}
                className={
                  i === 2
                    ? "bg-accent-soft text-accent rounded px-2 py-1 text-[12px] font-medium"
                    : "text-text-secondary px-2 py-1 text-[12px]"
                }
              >
                {l}
              </li>
            ))}
          </ul>
        </aside>
        <main className="bg-surface-raised col-span-6 p-5">
          <div className="bg-surface-sunken h-32 rounded-md" aria-hidden />
          <p className="text-body-sm text-text-primary mt-3 font-medium">
            The 5 moments for hand hygiene
          </p>
          <p className="text-caption text-text-tertiary mt-1">3 of 12 · ~ 0:42</p>
        </main>
        <aside className="bg-surface-base col-span-3 p-3">
          <p className="text-caption text-text-tertiary uppercase tracking-wider">Helpers</p>
          <ul className="mt-2 space-y-1.5">
            {["✨ Polish", "✨ Shorten", "✨ Plain language", "🎙 Regenerate narration"].map(
              (l) => (
                <li
                  key={l}
                  className="border-border-subtle bg-surface-raised rounded px-2 py-1.5 text-[12px]"
                >
                  {l}
                </li>
              ),
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- shared bits ---------------- */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
      <span>{children}</span>
    </li>
  );
}

function NumberedFeature({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden
        className="bg-accent-soft text-accent text-body-sm inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold"
      >
        {n}
      </span>
      <div>
        <p className="text-heading-sm text-text-primary">{title}</p>
        <p className="text-body-md text-text-secondary mt-1">{body}</p>
      </div>
    </li>
  );
}

function PrincipleRow({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li>
      <details className="group py-5">
        <summary className="flex cursor-pointer list-none items-start gap-4">
          <span className="bg-accent-soft text-accent mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            {icon}
          </span>
          <div className="flex-1">
            <p className="text-heading-sm text-text-primary">{title}</p>
          </div>
          <span
            aria-hidden
            className="text-text-tertiary border-border-subtle group-open:border-accent group-open:text-accent inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
          >
            <span className="block group-open:hidden">+</span>
            <span className="hidden group-open:block">−</span>
          </span>
        </summary>
        <p className="text-body-md text-text-secondary ml-13 mt-3 pl-1">{body}</p>
      </details>
    </li>
  );
}

// Suppressing unused-warnings for icons not currently used in this file's
// final layout but kept available if the founder wants to drop them in.
void Layers;
void Edit3;
void Mic;
void ShieldCheck;
