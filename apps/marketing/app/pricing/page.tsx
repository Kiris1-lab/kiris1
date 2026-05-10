import { Banner, Card, CardBody } from "@kiris/ui";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { PricingCycleToggle } from "@/components/pricing-cycle-toggle";
import { PricingCalculator } from "@/components/pricing-calculator";
import { USAGE_RATES } from "@kiris/billing/plans";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <Section tone="base" density="spacious">
        <div className="max-w-3xl">
          <SectionEyebrow>Pricing</SectionEyebrow>
          <h1 className="text-display-lg text-text-primary mt-3">
            Simple per-seat pricing. Pay only for what you use.
          </h1>
          <p className="text-body-lg text-text-secondary mt-5">
            Every plan, every rate, every overage on this page. No &ldquo;contact us for
            pricing&rdquo; for anything but Enterprise.
          </p>
        </div>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Plans</SectionEyebrow>
        <SectionHeading sub="Pick a plan, pay per seat. Annual saves about 17%.">
          One subscription. Three plans.
        </SectionHeading>
        <div className="mt-12">
          <PricingCycleToggle />
        </div>
      </Section>

      <Section tone="sunken">
        <SectionEyebrow>Pay-as-you-go</SectionEyebrow>
        <SectionHeading sub="Your seat subscription covers everything except generation and narration. These are the published rates.">
          AI usage rates.
        </SectionHeading>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {USAGE_RATES.map((rate) => (
            <Card key={rate.label}>
              <CardBody>
                <p className="text-caption text-text-tertiary uppercase tracking-wider">
                  {rate.label}
                </p>
                <p className="mt-2">
                  <span className="text-heading-lg font-semibold tabular-nums">
                    ${rate.pricePerUnitUsd.toFixed(2)}
                  </span>{" "}
                  <span className="text-body-sm text-text-secondary">{rate.unit}</span>
                </p>
                <p className="text-body-sm text-text-secondary mt-2">{rate.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Calculator</SectionEyebrow>
        <SectionHeading sub="Drag the sliders. The estimate updates live.">
          Estimate your monthly bill in 30 seconds.
        </SectionHeading>
        <div className="mt-12">
          <PricingCalculator />
        </div>
      </Section>

      <Section tone="raised">
        <SectionEyebrow>Cancellation</SectionEyebrow>
        <SectionHeading sub="Self-serve in the customer portal. No phone calls. No retention pop-ups.">
          How cancellation works.
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h3 className="text-heading-md">Monthly</h3>
              <p className="text-body-md text-text-secondary mt-2">
                Cancel anytime. Access until the end of the current period. No partial refund.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="text-heading-md">Annual</h3>
              <p className="text-body-md text-text-secondary mt-2">
                Cancel anytime. Two options: end-of-term (no refund) or immediate (prorated refund).
              </p>
            </CardBody>
          </Card>
        </div>
        <Banner variant="info" className="mt-8" title="Data after cancellation">
          30 days of read-only access for export, then soft delete for 30 days, then hard delete
          (Enterprise: cryptographic key destruction). Full detail on our{" "}
          <a className="underline" href="/security">
            security page
          </a>
          .
        </Banner>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Common questions</SectionEyebrow>
        <SectionHeading>FAQ.</SectionHeading>
        <ul className="divide-border-subtle border-border-subtle mx-auto mt-10 max-w-3xl divide-y border-y">
          {FAQ.map((item) => (
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
      </Section>
    </>
  );
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why no free trial?",
    a: "Card-up-front means we attract serious buyers and keep prices low. Per-seat means you can start with 3 people, decide in your first 30 days, and cancel anytime — that's effectively the trial.",
  },
  {
    q: "What happens if I cancel?",
    a: "30 days of read-only access for export. Then soft delete for 30 days. Then hard delete (Enterprise: cryptographic key destruction).",
  },
  {
    q: "How is AI usage calculated?",
    a: "AI generation is a flat $2 per module, regardless of length. Narration is per-minute. You see usage in real time and can cap monthly spend per workspace.",
  },
  {
    q: "What's the difference between Standard and Studio narration?",
    a: "Standard uses AWS Polly Neural voices — natural intonation, very good for most training. Studio uses Polly Generative voices — broadcast-quality, slightly slower to render, much more expensive ($0.50/min vs. $0.08/min). Most teams ship Standard and reserve Studio for hero modules.",
  },
  {
    q: "Do you require a long-term contract?",
    a: "No. Month-to-month or annual prepay; both cancel-anytime. No multi-year contracts even on Enterprise.",
  },
  {
    q: "When do overages get charged?",
    a: "There's no overage on AI usage — it's pay-as-you-go from dollar one. Workspace admins can cap monthly spend per workspace, so you never wake up to a surprise bill.",
  },
];
