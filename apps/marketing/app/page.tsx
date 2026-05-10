import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Headphones,
  Loader2,
  Mic,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Card, CardBody, Container, cn } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { SEAT_PLANS } from "@kiris/billing/plans";

/*
 * H1 options for review (one is active in the JSX, the others live here):
 *   1. "Build a finished hospital training module before your coffee gets cold"  (active)
 *   2. "Type a topic. Get a finished training module in 10 minutes"
 *   3. "The fastest way to build hospital training that actually teaches"
 */

/*
 * Headline options for review (pick one, delete the others before shipping):
 *
 *   1. "Build a finished training module in the time it takes to make coffee."
 *      — concrete, time-collapsing, human; pairs with the Coffee/timer mental
 *        image. Strongest for nurse educators.
 *
 *   2. "Type a topic. Hand your team a finished training module 10 minutes later."
 *      — most literal description of the magic moment; very plain.
 *
 *   3. "From sticky notes to a hospital training module — before lunch."
 *      — most evocative; risks reading as cute rather than serious.
 */

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatBand />
      <BeforeAfter />
      <DemoSection />
      <HowItWorks />
      <Reassurance />
      <LmsStrip />
      <PricingTeaser />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <Section tone="base" density="spacious">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <span className="border-border-subtle bg-surface-raised text-caption text-text-secondary inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Sparkles size={14} className="text-highlight" aria-hidden />
            <span className="text-highlight font-medium uppercase tracking-wider">AI-powered</span>
            <span aria-hidden className="text-text-tertiary">
              ·
            </span>
            <span>Built for hospitals</span>
          </span>
          <h1 className="text-display-xl text-text-primary mt-5">
            Build a finished hospital training module before your coffee gets cold
          </h1>
          <p className="text-body-lg text-text-secondary mt-6 max-w-xl">
            Drop in your notes, screenshots, or a topic. Kiris writes the script, narrates it,
            builds the quiz, and exports a file your hospital&apos;s training system can use.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CtaLink href="/signup" size="lg" withArrow>
              Build my first module
            </CtaLink>
            <CtaLink href="#demo" size="lg" variant="secondary">
              <Play size={14} aria-hidden />
              Watch a 60-second demo
            </CtaLink>
          </div>
          <p className="text-caption text-text-tertiary mt-4">
            Pay per seat · Cancel anytime · No long-term contracts
          </p>
        </div>
        <div className="lg:col-span-5">
          <HeroBuildPanel />
        </div>
      </div>
    </Section>
  );
}

/**
 * Faux "module being built" panel. Three layered visual cues:
 *   1. Title typing-cursor (CSS keyframes, prefers-reduced-motion gated)
 *   2. Three slide thumbnails sliding in from the right, staggered 200ms
 *   3. SVG narration waveform with a subtle pulse + visual-only Listen button
 */
function HeroBuildPanel() {
  return (
    <div className="border-border-subtle bg-surface-raised relative overflow-hidden rounded-xl border shadow-lg">
      <div className="border-border-subtle text-caption text-text-tertiary flex items-center gap-2 border-b px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#fca5a5]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#86efac]" aria-hidden />
        <span className="ml-3">kiris.ai · /modules/new</span>
      </div>
      <div className="grid gap-5 p-6">
        <div>
          <p className="text-caption text-text-tertiary uppercase">Module title</p>
          <p
            aria-label="Hand hygiene refresher"
            className="text-heading-md text-text-primary mt-1.5 inline-flex items-center"
          >
            <span className="kiris-typed">Hand hygiene refresher</span>
            <span
              aria-hidden
              className="kiris-cursor bg-text-primary ml-0.5 inline-block h-5 w-px"
            />
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Hook", body: "What patients see" },
            { label: "Demo", body: "5 moments, 20 sec" },
            { label: "Quiz", body: "4 checks" },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 200}ms` }}
              className="kiris-slide-in border-border-subtle bg-surface-base flex flex-col rounded-md border p-3"
            >
              <p className="text-caption text-text-tertiary uppercase">{s.label}</p>
              <p className="text-body-sm text-text-primary mt-1">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="border-border-subtle bg-surface-base flex items-center gap-3 rounded-md border p-3">
          <span
            aria-hidden
            className="bg-accent text-text-on-accent inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          >
            <Play size={12} fill="currentColor" />
          </span>
          <NarrationWaveform />
          <span className="text-caption text-text-tertiary tabular-nums">3:42</span>
        </div>
      </div>
      <PanelStyles />
    </div>
  );
}

function NarrationWaveform() {
  // 24 bars; heights are deterministic so the SVG is pure RSC.
  const HEIGHTS = [
    6, 9, 14, 11, 17, 22, 18, 13, 9, 14, 19, 23, 20, 16, 11, 8, 13, 18, 21, 15, 10, 7, 11, 14,
  ];
  return (
    <svg
      role="img"
      aria-label="Narration waveform"
      viewBox="0 0 120 24"
      className="kiris-wave text-accent h-6 flex-1"
    >
      {HEIGHTS.map((h, i) => {
        const x = i * 5;
        const y = (24 - h) / 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={2.5}
            height={h}
            rx={1.25}
            fill="currentColor"
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

/**
 * Hero panel CSS animations. Inlined as a <style> block so the homepage
 * stays a single file. CSS variables are token references; keyframes are
 * dropped to a single iteration under prefers-reduced-motion via the
 * global rule in tokens.css.
 */
function PanelStyles() {
  const css = `
    @keyframes kiris-cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes kiris-slide-in {
      0% { opacity: 0; transform: translateX(12px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes kiris-wave-pulse { 0%, 100% { opacity: 0.85; } 50% { opacity: 0.55; } }
    .kiris-cursor {
      animation: kiris-cursor-blink 1s steps(2) infinite;
    }
    .kiris-slide-in {
      animation: kiris-slide-in 480ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .kiris-wave {
      animation: kiris-wave-pulse 2.4s ease-in-out infinite;
    }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/* ------------------------------------------------------------------ */
/* 2. Stat band                                                        */
/* ------------------------------------------------------------------ */

function StatBand() {
  const stats = [
    /* TODO: validate stat */
    { value: "~10 min", label: "from blank page to finished module" },
    /* TODO: validate stat */
    { value: "0", label: "design or instructional experience needed" },
    {
      value: "5 formats",
      label: "SCORM, xAPI, MP4, HTML5, ZIP — your LMS already takes one",
    },
  ];
  return (
    <Section tone="sunken">
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-display-md text-text-primary tabular-nums">{s.value}</p>
            <p className="text-body-md text-text-secondary mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Before / After                                                   */
/* ------------------------------------------------------------------ */

function BeforeAfter() {
  const before = [
    "Weeks of nights and weekends",
    "Hire an instructional designer or beg one",
    "Record yourself narrating slide by slide",
    "Hope it passes accessibility review",
    "Fight the LMS export and re-record",
  ];
  const after = [
    "Drop in what you already have",
    "AI writes a structured, accessible module",
    "Studio-quality narration in one click",
    "WCAG 2.2 AA enforced by default",
    "One-click SCORM export, every time",
  ];
  return (
    <Section tone="base">
      <SectionHeading sub="Most clinical educators learn the long way. We made the short way the default.">
        Building hospital training used to take weeks. We made it minutes.
      </SectionHeading>
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="opacity-70">
          <p className="text-caption text-text-tertiary uppercase">Before</p>
          <ul className="mt-4 space-y-3">
            {before.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="text-text-tertiary border-border-subtle mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                >
                  <X size={12} />
                </span>
                <span className="text-body-md text-text-tertiary">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-caption text-accent uppercase">With Kiris</p>
          <ul className="mt-4 space-y-3">
            {after.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="bg-accent-soft text-accent mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                >
                  <Check size={12} />
                </span>
                <span className="text-body-md text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Demo (inverse / dark)                                            */
/* ------------------------------------------------------------------ */

function DemoSection() {
  return (
    <Section tone="inverse" id="demo">
      <SectionEyebrow highlight>See the magic</SectionEyebrow>
      <SectionHeading sub="Three inputs. One generation. Sixty to one hundred and eighty seconds.">
        Type a topic. Watch the module build itself.
      </SectionHeading>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <DemoStage step="01" label="Input">
          <div className="space-y-2">
            <DemoLine k="Topic" v="Hand hygiene refresher" />
            <DemoLine k="Audience" v="Med-surg nurses" />
            <DemoLine k="Materials" v="2 PDFs uploaded" />
          </div>
        </DemoStage>
        <DemoStage step="02" label="Generate" middle>
          <DemoCycler />
        </DemoStage>
        <DemoStage step="03" label="Done">
          <ul className="space-y-1.5">
            {["12 slides", "8:14 narrated", "4 knowledge checks", "SCORM 1.2 ready"].map((line) => (
              <li
                key={line}
                className="text-body-sm text-on-inverse inline-flex items-center gap-2"
              >
                <CheckCircle2 size={14} className="text-status-success shrink-0" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </DemoStage>
      </div>
    </Section>
  );
}

function DemoStage({
  step,
  label,
  middle = false,
  children,
}: {
  step: string;
  label: string;
  middle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6",
        middle ? "border-highlight/40 bg-white/[0.04]" : "border-white/10 bg-white/[0.02]",
      )}
    >
      <p className="text-caption text-on-inverse/60 uppercase tracking-wider">
        <span className={middle ? "text-highlight" : "text-on-inverse/60"}>{step}</span>
        <span aria-hidden className="mx-2">
          ·
        </span>
        {label}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DemoLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-caption text-on-inverse/50 w-20 shrink-0 uppercase tracking-wider">
        {k}
      </span>
      <span className="text-body-sm text-on-inverse">{v}</span>
    </div>
  );
}

/**
 * Cycling status. Six labels rotate over ~6s; the static fallback for
 * prefers-reduced-motion is set on the parent via :where() so we can keep
 * everything CSS-only.
 */
function DemoCycler() {
  const statuses = [
    "Reading materials…",
    "Drafting outline…",
    "Writing slides…",
    "Recording narration…",
    "Building quiz…",
    "Packaging SCORM…",
  ];
  const css = `
    @keyframes kiris-demo-cycle {
      0%, 14% { opacity: 1; transform: translateY(0); }
      18%, 96% { opacity: 0; transform: translateY(-4px); }
      100% { opacity: 0; }
    }
    .kiris-demo-status > span {
      animation: kiris-demo-cycle 6s cubic-bezier(0.4, 0, 0.2, 1) infinite both;
    }
    .kiris-demo-status > span:nth-child(1) { animation-delay: 0s; }
    .kiris-demo-status > span:nth-child(2) { animation-delay: 1s; }
    .kiris-demo-status > span:nth-child(3) { animation-delay: 2s; }
    .kiris-demo-status > span:nth-child(4) { animation-delay: 3s; }
    .kiris-demo-status > span:nth-child(5) { animation-delay: 4s; }
    .kiris-demo-status > span:nth-child(6) { animation-delay: 5s; }
    .kiris-demo-fallback { display: none; }
    @media (prefers-reduced-motion: reduce) {
      .kiris-demo-status { display: none; }
      .kiris-demo-fallback { display: block; }
    }
    @keyframes kiris-demo-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .kiris-demo-dot { animation: kiris-demo-pulse 1.4s ease-in-out infinite; }
  `;
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="kiris-demo-dot bg-highlight inline-block h-2.5 w-2.5 rounded-full"
        />
        <div className="kiris-demo-status text-body-sm text-on-inverse relative h-5 flex-1 overflow-hidden">
          {statuses.map((s) => (
            <span key={s} className="absolute inset-0 flex items-center" aria-hidden>
              {s}
            </span>
          ))}
        </div>
        <span className="kiris-demo-fallback text-body-sm text-on-inverse" aria-hidden>
          Generating…
        </span>
      </div>
      <p className="sr-only" role="status">
        Generating module
      </p>
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. How it works                                                     */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Drop in your materials",
      body: "Screenshots, PDFs, recordings, or a topic. Kiris generates from a description alone if that's all you have.",
    },
    {
      n: "02",
      title: "Review and tweak",
      body: (
        <>
          Click any text to edit. Press the ✨ helper for AI rewrites. Designed using{" "}
          <a
            href="/product#learning-science"
            className="text-accent underline-offset-2 hover:underline"
          >
            proven learning science
          </a>{" "}
          so the structure works without you fussing over it.
        </>
      ),
    },
    {
      n: "03",
      title: "Narrate and ship",
      body: "Studio-quality voices via AWS Polly. Export SCORM 1.2, xAPI 1.0.3, MP4, HTML5, or ZIP.",
    },
  ];
  return (
    <Section tone="base">
      <SectionEyebrow>How it works</SectionEyebrow>
      <SectionHeading sub="Whether you're a nurse educator or a compliance officer, it's the same three steps.">
        Rough materials in, polished module out.
      </SectionHeading>
      <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
        {steps.map((s) => (
          <li key={s.n}>
            <span
              aria-hidden
              className="text-text-tertiary block text-[5rem] font-semibold leading-none tracking-tight"
              style={{
                WebkitTextStroke: "1.5px var(--highlight)",
                color: "transparent",
              }}
            >
              {s.n}
            </span>
            <h3 className="text-heading-lg text-text-primary mt-4">{s.title}</h3>
            <p className="text-body-md text-text-secondary mt-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Reassurance                                                      */
/* ------------------------------------------------------------------ */

function Reassurance() {
  const points = [
    {
      title: "No design skills needed.",
      body: "Kiris handles layout, accessibility, and pacing.",
    },
    {
      title: "Sounds human, not robotic.",
      body: "Studio narration via AWS Polly. Listen to a sample below.",
    },
    {
      title: "Works with the LMS you already have.",
      body: "SCORM, xAPI, MP4 — pick one and ship.",
    },
  ];
  return (
    <Section tone="raised">
      <div className="mx-auto max-w-3xl text-center">
        <SectionEyebrow>For people who already have too much to do</SectionEyebrow>
        <h2 className="text-display-md text-text-primary mt-4">
          You&apos;re the expert. We handle the production.
        </h2>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3 md:gap-12">
        {points.map((p) => (
          <div key={p.title} className="text-center">
            <p className="text-heading-md text-text-primary">{p.title}</p>
            <p className="text-body-md text-text-secondary mt-2">{p.body}</p>
          </div>
        ))}
      </div>
      <SamplePlayer />
    </Section>
  );
}

function SamplePlayer() {
  // TODO: wire real audio asset
  return (
    <div className="border-border-subtle bg-surface-raised mx-auto mt-14 flex max-w-md items-center gap-3 rounded-full border px-3 py-2 shadow-sm">
      <button
        type="button"
        aria-label="Play 30-second narration sample"
        className="bg-accent text-text-on-accent hover:bg-accent-hover inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
      >
        <Play size={14} fill="currentColor" aria-hidden />
      </button>
      <div className="flex-1">
        <p className="text-body-sm text-text-primary font-medium">Listen to a 30-second sample</p>
        <p className="text-caption text-text-tertiary">Polly Neural · Joanna</p>
      </div>
      <span className="text-caption text-text-tertiary tabular-nums">0:30</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7. LMS strip                                                        */
/* ------------------------------------------------------------------ */

function LmsStrip() {
  const lmss = ["HealthStream", "Cornerstone", "Relias", "Workday Learning", "Docebo", "Moodle"];
  return (
    <section className="bg-surface-base py-14">
      <Container>
        <p className="text-caption text-text-tertiary text-center uppercase tracking-wider">
          Used by clinical educators to ship modules into:
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {lmss.map((name) => (
            <li
              key={name}
              className="text-body-sm text-text-tertiary font-medium uppercase tracking-wider"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Pricing teaser                                                   */
/* ------------------------------------------------------------------ */

function PricingTeaser() {
  return (
    <Section tone="sunken">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Pricing</SectionEyebrow>
          <SectionHeading sub="Pay per seat. Pay-as-you-go for AI usage. Every rate is on this site.">
            Simple per-seat pricing.
          </SectionHeading>
        </div>
        <CtaLink href="/pricing" variant="secondary" withArrow>
          See full pricing
        </CtaLink>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SEAT_PLANS.map((plan) => (
          <PlanTeaserCard key={plan.id} plan={plan} />
        ))}
      </div>
      <p className="text-body-sm text-text-secondary mt-8 text-center">
        Plus pay-as-you-go for AI generation and narration — typically $2–15 per module.{" "}
        <a href="/pricing" className="text-accent underline-offset-2 hover:underline">
          See full pricing →
        </a>
      </p>
    </Section>
  );
}

function PlanTeaserCard({ plan }: { plan: (typeof SEAT_PLANS)[number] }) {
  const isEnterprise = plan.tier === "enterprise";
  const isPopular = !!plan.badge;
  return (
    <Card className={cn("flex flex-col", isPopular ? "border-accent border-2" : "")}>
      <CardBody className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-heading-lg">{plan.name}</h3>
          {plan.badge ? (
            <span className="bg-accent-soft text-accent text-caption rounded-full px-2.5 py-1 font-medium uppercase tracking-wider">
              {plan.badge}
            </span>
          ) : null}
        </div>
        <p className="text-body-sm text-text-secondary mt-2">{plan.description}</p>
        <div className="mt-6">
          {isEnterprise ? (
            <p className="text-display-md font-semibold">Custom</p>
          ) : (
            <>
              <p className="flex items-baseline gap-1.5">
                <span className="text-display-md font-semibold">
                  ${plan.pricePerSeatMonthlyUsd}
                </span>
                <span className="text-body-md text-text-secondary">/ seat / month</span>
              </p>
              <p className="text-body-sm text-text-tertiary mt-1">
                or ${plan.pricePerSeatAnnualUsd} / seat when billed annually
              </p>
            </>
          )}
        </div>
        <p className="text-caption text-text-tertiary mt-4 uppercase tracking-wider">
          {plan.minSeats} seat{plan.minSeats > 1 ? "s" : ""} minimum
        </p>
        <ul className="text-body-sm text-text-secondary mt-4 flex flex-1 flex-col gap-2">
          {plan.features.slice(0, 4).map((f) => (
            <li key={f} className="flex gap-2">
              <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" aria-hidden />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <CtaLink
          href={isEnterprise ? "/contact-sales" : "/signup"}
          className="mt-8"
          variant={isPopular ? "primary" : "secondary"}
        >
          {isEnterprise ? "Talk to sales" : `Choose ${plan.name}`}
        </CtaLink>
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 9. FAQ                                                              */
/* ------------------------------------------------------------------ */

function Faq() {
  const items = [
    {
      q: "What's SCORM, and why does it matter?",
      a: "SCORM is the file format hospital learning systems (HealthStream, Cornerstone, Relias, etc.) use to import training. Your IT team uploads a Kiris-exported SCORM zip the same way they upload anything else.",
    },
    {
      q: "Will my hospital's LMS accept what Kiris exports?",
      a: "Yes — every modern hospital LMS supports at least one of SCORM 1.2, xAPI, MP4, HTML5, or ZIP. We export all five. If you have a less common system, tell us on the contact page and we'll confirm before you sign up.",
    },
    {
      q: "Does the AI replace me?",
      a: "No. You bring the clinical judgment — what's safe, what's right for your patients, what your team actually needs to know. Kiris saves you the production work: the layout, the narration, the accessibility checks, the file format.",
    },
    {
      q: "How does pay-as-you-go billing work?",
      a: "Your seat subscription covers everything except AI usage. Generate a module — that's a flat $2. Add narration — pennies per minute. You see usage in real time and can cap monthly spend per workspace.",
    },
  ];
  return (
    <Section tone="base">
      <SectionEyebrow>Common questions</SectionEyebrow>
      <SectionHeading sub="If you have questions we don't cover here, ask us before signing up.">
        Quick answers.
      </SectionHeading>
      <div className="mx-auto mt-10 max-w-3xl">
        <ul className="divide-border-subtle border-border-subtle divide-y border-y">
          {items.map((item) => (
            <li key={item.q}>
              <details className="group py-5">
                <summary className="text-heading-sm text-text-primary flex cursor-pointer list-none items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="text-text-tertiary border-border-subtle group-open:bg-accent-soft group-open:text-accent group-open:border-accent duration-state inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors"
                  >
                    <span className="block group-open:hidden">+</span>
                    <span className="hidden group-open:block">−</span>
                  </span>
                </summary>
                <p className="text-body-md text-text-secondary mt-3">{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Final CTA                                                       */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <Section tone="inverse" density="spacious">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-display-lg text-on-inverse">
          Your next training module is 10 minutes away.
        </h2>
        <p className="text-body-lg text-on-inverse/80 mt-4">
          Pay per seat. No contracts. Cancel anytime.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CtaLink href="/signup" size="lg" withArrow>
            Build my first module
          </CtaLink>
          <CtaLink href="/pricing" size="lg" variant="secondary">
            See full pricing
          </CtaLink>
        </div>
        <p className="text-caption text-on-inverse/60 mt-6 inline-flex items-center gap-2">
          <ShieldCheck size={14} aria-hidden />
          HIPAA-ready · WCAG 2.2 AA · BAAs available on Enterprise
        </p>
      </div>
    </Section>
  );
}

function GenStep({
  state,
  label,
  detail,
}: {
  state: "done" | "active" | "pending";
  label: string;
  detail: string;
}) {
  const isActive = state === "active";
  const isDone = state === "done";
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border px-3 py-2",
        isActive ? "border-accent bg-accent-soft" : "border-border-subtle bg-surface-base",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          isDone ? "bg-accent text-text-on-accent" : "",
          isActive ? "text-accent" : "",
          !isDone && !isActive ? "border-border-subtle text-text-tertiary border" : "",
        )}
      >
        {isDone ? (
          <Check size={14} />
        ) : isActive ? (
          <Loader2 size={14} className="animate-spin" />
        ) : null}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-body-sm font-medium",
            isActive ? "text-accent" : "text-text-primary",
            !isDone && !isActive ? "text-text-tertiary" : "",
          )}
        >
          {label}
        </p>
        <p className="text-caption text-text-tertiary truncate">{detail}</p>
      </div>
      <span
        className={cn(
          "text-caption",
          isDone ? "text-text-tertiary" : "",
          isActive ? "text-accent animate-pulse" : "",
          !isDone && !isActive ? "text-text-tertiary" : "",
        )}
        aria-hidden
      >
        {isDone ? "✓" : isActive ? "…" : ""}
      </span>
    </div>
  );
}
