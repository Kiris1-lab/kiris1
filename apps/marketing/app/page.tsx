import {
  CheckCircle2,
  FileText,
  Mic,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Workflow,
} from "lucide-react";
import { Badge, Card, CardBody, Container, TierBadge } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { STANDARD_PLANS } from "@kiris/billing/plans";

export default function HomePage() {
  return (
    <>
      {/* Hero — DESIGN §16.10. Full-bleed off-white, large display text on the left. */}
      <section className="bg-surface-base">
        <Container>
          <div className="grid items-center gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2">
                <TierBadge tier="standard" />
                <Badge variant="outline">HIPAA tier available</Badge>
              </div>
              <h1 className="mt-5 text-display-xl text-text-primary">
                Polished hospital training, in under ten minutes.
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-text-secondary">
                Drop in screenshots, recordings, and bullet points. Kiris generates a narrated,
                accessible, SCORM-ready module — designed for the way clinical educators actually
                work.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CtaLink href="/signup" size="lg" withArrow>
                  Get started
                </CtaLink>
                <CtaLink href="/pricing" size="lg" variant="secondary">
                  See pricing
                </CtaLink>
              </div>
              <p className="mt-6 text-body-sm text-text-tertiary">
                Card required. Cancel anytime. No contracts.
              </p>
            </div>
            <div className="lg:col-span-5">
              <HeroVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border-subtle bg-surface-raised">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-4 py-6 text-body-sm text-text-secondary">
            <p className="text-caption uppercase tracking-wider text-text-tertiary">
              Built for hospital LMSs
            </p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 font-medium text-text-primary">
              <li>HealthStream</li>
              <li>Cornerstone</li>
              <li>Relias</li>
              <li>Workday Learning</li>
              <li>Any SCORM 1.2 / xAPI LMS</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Three-up feature grid */}
      <Section>
        <SectionEyebrow>Why Kiris</SectionEyebrow>
        <SectionHeading
          sub="Two authoring modes, one polished output. Built on real learning science. Designed for non-designers."
        >
          Hospital training that doesn't take three weeks.
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Sparkles aria-hidden size={20} />}
            title="Express AI"
            body="Drop materials, describe the audience, click generate. Kiris produces a complete, narrated module in 60–180 seconds."
          />
          <FeatureCard
            icon={<Workflow aria-hidden size={20} />}
            title="Guided AI"
            body="Build the outline you want. Use the ✨ helper on every field to polish, regenerate, and translate. Stay in control."
          />
          <FeatureCard
            icon={<ShieldCheck aria-hidden size={20} />}
            title="Hospital-shaped controls"
            body="Per-seat caps, admin approval queues, role-based folders, transparent overage rates. No surprise bills."
          />
        </div>
      </Section>

      {/* How it works — 3 steps */}
      <Section raised>
        <SectionEyebrow>How it works</SectionEyebrow>
        <SectionHeading sub="The same three steps, whether you're a nurse educator or a compliance officer.">
          From rough materials to a SCORM module in three steps.
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
            body="Direct-manipulation editor. Click any text to edit. Press ✨ for AI helpers. Mayer's principles applied automatically."
          />
          <StepCard
            n={3}
            icon={<Mic size={20} aria-hidden />}
            title="Narrate and export"
            body="Clinical-grade AWS Polly Neural and Generative voices. Export SCORM, xAPI, or MP4."
          />
        </ol>
      </Section>

      {/* Pricing teaser */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>Pricing</SectionEyebrow>
            <SectionHeading sub="Every plan and price is on this site. No contracts, no trials, no surprises.">
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
                <p className="mt-2 text-body-sm text-text-secondary">{plan.description}</p>
                <p className="mt-6">
                  <span className="text-display-md font-semibold">${plan.monthlyUsd}</span>
                  <span className="text-body-md text-text-secondary"> /month</span>
                </p>
                <p className="text-body-sm text-text-tertiary">
                  or ${plan.annualUsd}/yr (2 months free)
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-2 text-body-sm text-text-secondary">
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden />
                    {plan.seatsIncluded} seat{plan.seatsIncluded > 1 ? "s" : ""} included
                    {plan.extraSeatUsd ? `, then $${plan.extraSeatUsd}/seat` : ""}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden />
                    {plan.modulesPerMonth} modules/month
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden />
                    {plan.aiCreditsPerSeat} AI credits / seat / month
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden />
                    {plan.narrationMinPerSeat} narration min / seat / month
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden />
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
          <h2 className="text-display-md">Designed for non-designers.</h2>
          <p className="mt-4 text-body-lg text-text-secondary">
            A nurse educator with no instructional-design background can ship a polished
            module before lunch.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <CtaLink href="/signup" size="lg" withArrow>
              Get started
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
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft text-accent">
          {icon}
        </div>
        <h3 className="mt-4 text-heading-md">{title}</h3>
        <p className="mt-2 text-body-md text-text-secondary">{body}</p>
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
  body: string;
}) {
  return (
    <li>
      <Card>
        <CardBody>
          <div className="flex items-center gap-3">
            <span className="text-caption uppercase text-text-tertiary">Step {n}</span>
            <span className="text-accent" aria-hidden>
              {icon}
            </span>
          </div>
          <h3 className="mt-3 text-heading-md">{title}</h3>
          <p className="mt-2 text-body-md text-text-secondary">{body}</p>
        </CardBody>
      </Card>
    </li>
  );
}

function HeroVisual() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-surface-raised shadow-lg">
      <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3 text-caption text-text-tertiary">
        <span className="h-2.5 w-2.5 rounded-full bg-[#fca5a5]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#86efac]" aria-hidden />
        <span className="ml-3">Hand hygiene refresher · Module preview</span>
      </div>
      <div className="grid gap-4 p-6">
        <div className="rounded-lg bg-accent-soft p-4 text-body-sm text-accent">
          <p className="font-semibold">Hook</p>
          <p className="mt-1 text-text-secondary">
            "It's 7:14 AM. You step into Mr. Reyes's room with your med pass cart…"
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-border-subtle p-4">
          <p className="text-caption uppercase text-text-tertiary">Learning objectives</p>
          <ul className="space-y-1 text-body-sm text-text-secondary">
            <li>· Identify the 5 moments for hand hygiene</li>
            <li>· Demonstrate proper technique under 20 seconds</li>
            <li>· Apply the 5 moments during your next shift</li>
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Concept", "Demo", "Knowledge check"].map((label) => (
            <div
              key={label}
              className="rounded-md border border-border-subtle bg-surface-base p-3 text-caption text-text-secondary"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border-subtle p-3 text-body-sm text-text-secondary">
          <Mic size={16} aria-hidden className="text-accent" />
          <span>Polly Neural · Joanna · 3 min 42 sec</span>
        </div>
      </div>
    </div>
  );
}
