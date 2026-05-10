import {
  Check,
  CheckCircle2,
  FileText,
  Headphones,
  Loader2,
  Mic,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wand2,
  Workflow,
  X,
} from "lucide-react";
import { Badge, Card, CardBody, Container, cn } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { STANDARD_PLANS } from "@kiris/billing/plans";

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
      {/* Hero — leads with the AI-magic moment, not credentials. */}
      <section className="bg-surface-base">
        <Container>
          <div className="grid items-center gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
            <div className="lg:col-span-7">
              <h1 className="text-display-xl text-text-primary mt-2">
                Build a finished training module in the time it takes to make coffee.
              </h1>
              <p className="text-body-lg text-text-secondary mt-6 max-w-xl">
                Drop in your notes, slides, or screenshots. Kiris writes the script, narrates it,
                builds the quiz, and hands you a file your hospital&apos;s training system can use
                — in under 10 minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CtaLink href="/product" size="lg" withArrow>
                  See it build a module
                </CtaLink>
                <CtaLink href="/signup" size="lg" variant="secondary">
                  Start free trial
                </CtaLink>
              </div>
              <p className="text-caption text-text-tertiary mt-4">
                Card required. Cancel anytime.
              </p>
            </div>
            <div className="lg:col-span-5">
              <HeroGenerationVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* Outcome strip — replaces the LMS-vendor trust strip with the three things
          a non-expert wants to know in 5 seconds. */}
      <section className="border-border-subtle bg-surface-raised border-y">
        <Container>
          <div className="grid gap-8 py-12 sm:grid-cols-3">
            <Outcome
              stat="10 min"
              /* TODO: validate stat — replace with measured median time-to-export. */
              line="from blank page to finished module"
            />
            <Outcome
              stat="0"
              /* TODO: validate stat — confirm with first 10 customers. */
              line="instructional-design experience required"
            />
            <Outcome
              stat="Any LMS"
              line="SCORM 1.2, xAPI, MP4 — works with HealthStream, Cornerstone, Relias, Workday"
            />
          </div>
        </Container>
      </section>

      {/* The "ohhh" moment for non-experts. */}
      <Section>
        <SectionEyebrow>The shift</SectionEyebrow>
        <SectionHeading sub="Hospital training is usually a six-week side project nobody wants. Here's what changes when an AI handles the drafting.">
          The old way vs. Kiris.
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <ContrastCard
            tone="muted"
            label="The old way"
            items={[
              "Weeks of nights and weekends",
              "Hire an instructional designer",
              "Record yourself narrating slide by slide",
              "Hope it passes accessibility review",
              "Fight the LMS export",
            ]}
          />
          <ContrastCard
            tone="accent"
            label="With Kiris"
            items={[
              "Drop in what you already have",
              "AI writes a structured module",
              "Studio-quality narration in one click",
              "WCAG 2.2 AA by default",
              "One-click SCORM export",
            ]}
          />
        </div>
      </Section>

      {/* The magic moment — Express AI as a single hero feature. */}
      <Section raised>
        <SectionEyebrow>AI-powered</SectionEyebrow>
        <SectionHeading sub="Express AI takes three short answers — what it's about, who it's for, what materials you have — and writes a full narrated module in 60–180 seconds. Then you edit anything you want.">
          Type a topic. Get a finished module.
        </SectionHeading>
        <div className="mt-12 grid items-center gap-6 md:grid-cols-3">
          <FlowStep
            icon={<FileText size={20} aria-hidden />}
            label="You type three things"
            body="Topic, audience, any materials you have on hand. Bullet points are fine."
          />
          <FlowArrow />
          <FlowStep
            icon={<Sparkles size={20} aria-hidden />}
            label="Kiris drafts the module"
            body="Hook, learning objectives, slides, knowledge checks, and a narration script."
            highlight
          />
          <div className="md:hidden" aria-hidden />
          <FlowArrow className="md:col-start-2" />
          <div className="md:hidden" aria-hidden />
          <FlowStep
            icon={<Mic size={20} aria-hidden />}
            label="One click to narrate"
            body="Neural voices read your script with natural intonation. Preview, then export."
            className="md:col-start-3"
          />
        </div>
      </Section>

      {/* How it works — kept; copy edits to drop the jargon. */}
      <Section>
        <SectionEyebrow>How it works</SectionEyebrow>
        <SectionHeading sub="Whether you're a nurse educator or a compliance officer, it's the same three steps.">
          Rough materials in, polished module out.
        </SectionHeading>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          <StepCard
            n={1}
            icon={<UploadCloud size={20} aria-hidden />}
            title="Drop in materials"
            body="Screenshots, PDFs, Word docs, recordings. Or just a topic — Kiris can generate from a description alone."
          />
          <StepCard
            n={2}
            icon={<FileText size={20} aria-hidden />}
            title="Review, edit, polish"
            body={
              <>
                Click any text to edit. Press the ✨ helper for AI rewrites. Designed using{" "}
                <a
                  href="/product#learning-science"
                  className="text-accent underline-offset-2 hover:underline"
                >
                  proven learning science
                </a>{" "}
                so the structure works without you having to fuss with it.
              </>
            }
          />
          <StepCard
            n={3}
            icon={<Mic size={20} aria-hidden />}
            title="Narrate and export"
            body="AWS Polly Neural and Generative voices. Export SCORM 1.2, xAPI 1.0.3, or MP4."
          />
        </ol>
      </Section>

      {/* Reassurance for the busy non-expert. */}
      <Section raised>
        <SectionEyebrow>If you don&apos;t have time to learn new software</SectionEyebrow>
        <SectionHeading sub="Kiris is built for the educator who has 90 minutes between meetings and a module due Friday.">
          You&apos;re the expert. We handle the production.
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Wand2 aria-hidden size={20} />}
            title="No design skills needed"
            body="Kiris handles layout, accessibility, and pacing. You handle the message."
          />
          <FeatureCard
            icon={<Headphones aria-hidden size={20} />}
            title="Sounds human, not robotic"
            body="AWS Polly's neural voices read your script with natural intonation. Preview before you ship."
          />
          <FeatureCard
            icon={<Workflow aria-hidden size={20} />}
            title="Works with your LMS"
            body="One-click SCORM 1.2, xAPI 1.0.3, or MP4. If your LMS takes one of those, you're done."
          />
        </div>
      </Section>

      {/* Compliance / trust — present but no longer leading. For evaluators. */}
      <section className="border-border-subtle bg-surface-base border-y">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <ShieldCheck size={18} className="text-accent" aria-hidden />
              <TrustItem>HIPAA tier available</TrustItem>
              <TrustItem>WCAG 2.2 AA</TrustItem>
              <TrustItem>PHI scrubbed pre-flight</TrustItem>
              <TrustItem>Hospital-shaped admin controls</TrustItem>
            </div>
            <CtaLink href="/security" variant="ghost" withArrow>
              See security details
            </CtaLink>
          </div>
        </Container>
      </section>

      {/* Pricing teaser — kept; one new line above to set expectations. */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>Pricing</SectionEyebrow>
            <SectionHeading
              sub={
                <>
                  Start with a 7-day trial.{" "}
                  {/* TODO: confirm trial terms */}
                  No contracts, no demos required, no &ldquo;contact us for pricing.&rdquo;
                </>
              }
            >
              Simple, transparent pricing.
            </SectionHeading>
          </div>
          <CtaLink href="/pricing" variant="secondary" withArrow>
            See full pricing
          </CtaLink>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STANDARD_PLANS.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardBody className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-lg">{plan.name}</h3>
                  {plan.badge ? <Badge variant="neutral">{plan.badge}</Badge> : null}
                </div>
                <p className="text-body-sm text-text-secondary mt-2">{plan.description}</p>
                <p className="mt-6">
                  <span className="text-display-md font-semibold">${plan.monthlyUsd}</span>
                  <span className="text-body-md text-text-secondary"> /month</span>
                </p>
                <p className="text-body-sm text-text-tertiary">
                  or ${plan.annualUsd}/yr (2 months free)
                </p>
                <ul className="text-body-sm text-text-secondary mt-6 flex flex-1 flex-col gap-2">
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-accent mt-0.5" aria-hidden />
                    {plan.seatsIncluded} seat{plan.seatsIncluded > 1 ? "s" : ""} included
                    {plan.extraSeatUsd ? `, then $${plan.extraSeatUsd}/seat` : ""}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-accent mt-0.5" aria-hidden />
                    {plan.modulesPerMonth} modules/month
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-accent mt-0.5" aria-hidden />
                    {plan.aiCreditsPerSeat} AI credits / seat / month
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-accent mt-0.5" aria-hidden />
                    {plan.narrationMinPerSeat} narration min / seat / month
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-accent mt-0.5" aria-hidden />
                    {plan.storageGb} GB storage
                  </li>
                </ul>
                <CtaLink href="/signup" className="mt-8" variant="secondary">
                  Choose {plan.name}
                </CtaLink>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section raised>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-md">Your next training module is 10 minutes away.</h2>
          <p className="text-body-lg text-text-secondary mt-4">
            Drop in what you have. Walk away. Come back to a finished, narrated module ready for
            your LMS.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <CtaLink href="/signup" size="lg" withArrow>
              Start free trial
            </CtaLink>
            <CtaLink href="/product" size="lg" variant="secondary">
              See how it works
            </CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}

function Outcome({ stat, line }: { stat: string; line: string }) {
  return (
    <div>
      <p className="text-display-md text-text-primary">{stat}</p>
      <p className="text-body-md text-text-secondary mt-2">{line}</p>
    </div>
  );
}

function ContrastCard({
  tone,
  label,
  items,
}: {
  tone: "muted" | "accent";
  label: string;
  items: string[];
}) {
  const isAccent = tone === "accent";
  return (
    <Card className={cn(isAccent ? "border-accent" : "")}>
      <CardBody>
        <p
          className={cn(
            "text-caption uppercase",
            isAccent ? "text-accent" : "text-text-tertiary",
          )}
        >
          {label}
        </p>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  isAccent ? "bg-accent-soft text-accent" : "bg-surface-base text-text-tertiary",
                )}
              >
                {isAccent ? <Check size={14} /> : <X size={14} />}
              </span>
              <span
                className={cn(
                  "text-body-md",
                  isAccent ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

function FlowStep({
  icon,
  label,
  body,
  highlight = false,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md",
          highlight ? "bg-accent text-text-on-accent" : "bg-accent-soft text-accent",
        )}
      >
        {icon}
      </div>
      <p className="text-heading-sm text-text-primary">{label}</p>
      <p className="text-body-md text-text-secondary">{body}</p>
    </div>
  );
}

function FlowArrow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "text-text-tertiary hidden items-center justify-center md:flex",
        className,
      )}
    >
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
        <path
          d="M0 6 H34 M28 1 L34 6 L28 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return <span className="text-body-sm text-text-primary">{children}</span>;
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="bg-accent-soft text-accent flex h-9 w-9 items-center justify-center rounded-md">
          {icon}
        </div>
        <h3 className="text-heading-md mt-4">{title}</h3>
        <p className="text-body-md text-text-secondary mt-2">{body}</p>
      </CardBody>
    </Card>
  );
}

function StepCard({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <li>
      <Card>
        <CardBody>
          <div className="flex items-center gap-3">
            <span className="text-caption text-text-tertiary uppercase">Step {n}</span>
            <span className="text-accent" aria-hidden>
              {icon}
            </span>
          </div>
          <h3 className="text-heading-md mt-3">{title}</h3>
          <p className="text-body-md text-text-secondary mt-2">{body}</p>
        </CardBody>
      </Card>
    </li>
  );
}

/**
 * Faux generation panel — replaces the static module-preview mock with a
 * progress-style visual that reinforces the magic-moment positioning. Pure
 * CSS animation via Tailwind's animate-pulse on the in-progress row.
 */
function HeroGenerationVisual() {
  return (
    <div className="border-border-subtle bg-surface-raised relative overflow-hidden rounded-xl border shadow-lg">
      <div className="border-border-subtle text-caption text-text-tertiary flex items-center gap-2 border-b px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#fca5a5]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#86efac]" aria-hidden />
        <span className="ml-3">Generating · Hand hygiene refresher</span>
      </div>
      <div className="grid gap-3 p-6">
        <GenStep state="done" label="Reading materials" detail="3 PDFs · 1 transcript" />
        <GenStep state="done" label="Writing slides" detail="9 slides · 4 knowledge checks" />
        <GenStep state="active" label="Recording narration" detail="Polly Neural · Joanna" />
        <GenStep state="pending" label="Packaging SCORM" detail="ZIP, ready to upload" />
        <div
          className="border-border-subtle bg-surface-base text-caption text-text-tertiary mt-2 flex items-center justify-between rounded-md border px-3 py-2"
          aria-hidden
        >
          <span>Estimated total</span>
          <span className="text-text-primary font-medium">~ 8 min</span>
        </div>
      </div>
    </div>
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
        isActive
          ? "border-accent bg-accent-soft"
          : "border-border-subtle bg-surface-base",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          isDone ? "bg-accent text-text-on-accent" : "",
          isActive ? "text-accent" : "",
          !isDone && !isActive ? "border-border-subtle border text-text-tertiary" : "",
        )}
      >
        {isDone ? <Check size={14} /> : isActive ? <Loader2 size={14} className="animate-spin" /> : null}
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
