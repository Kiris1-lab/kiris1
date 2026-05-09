import { Container, Card, CardBody, Badge, Banner } from "@kiris/ui";
import { CheckCircle2 } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import {
  STANDARD_PLANS,
  HIPAA_PLANS,
  ENTERPRISE,
  OVERAGE_RATES,
  type Plan,
} from "@kiris/billing/plans";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption uppercase text-accent">Pricing</p>
            <h1 className="mt-3 text-display-lg">Simple, transparent pricing. No contracts.</h1>
            <p className="mt-5 text-body-lg text-text-secondary">
              Every plan, every price, every overage rate is on this page. No "contact us for
              pricing." No retention dark patterns. Cancel anytime in the customer portal.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <SectionEyebrow>Standard tier</SectionEyebrow>
        <SectionHeading sub="Instant signup. No PHI permitted. Suitable for ~80% of hospital training: compliance, safety, equipment, software, policies.">
          Standard tier
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STANDARD_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Section>

      <Section raised>
        <SectionEyebrow>HIPAA tier</SectionEyebrow>
        <SectionHeading sub="One-click upgrade in-app once your org_admin accepts our BAA. HIPAA-scoped infrastructure, separate KMS keys, 6-year audit retention, MFA required.">
          HIPAA tier
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {HIPAA_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
          <Card>
            <CardBody className="flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-heading-lg">{ENTERPRISE.name}</h3>
                <Badge variant="outline">Custom</Badge>
              </div>
              <p className="mt-2 text-body-sm text-text-secondary">{ENTERPRISE.description}</p>
              <p className="mt-6">
                <span className="text-display-md font-semibold">
                  ${ENTERPRISE.startsAtMonthlyUsd.toLocaleString()}
                </span>
                <span className="text-body-md text-text-secondary"> /month and up</span>
              </p>
              <p className="text-body-sm text-text-tertiary">Annual only</p>
              <ul className="mt-6 flex flex-1 flex-col gap-2 text-body-sm text-text-secondary">
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden /> Volume seat
                  pricing
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden /> SSO / SAML
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden /> Custom DPA
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden /> Premium SLA
                </li>
              </ul>
              <CtaLink href="/contact-sales" className="mt-8" variant="secondary">
                Contact sales
              </CtaLink>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionEyebrow>Overages</SectionEyebrow>
        <SectionHeading sub="Overages are billed at these published rates only. The admin approval workflow means an admin must approve any overage before it accrues — no surprise bills.">
          Overage rates
        </SectionHeading>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <RateCard label="AI credits" rate={`$${OVERAGE_RATES.aiCreditUsd}/credit`} sub="≈ 10K Claude tokens" />
          <RateCard
            label="Narration · Neural"
            rate={`$${OVERAGE_RATES.narrationNeuralUsdPerMin}/min`}
            sub="AWS Polly Neural"
          />
          <RateCard
            label="Narration · Generative"
            rate={`$${OVERAGE_RATES.narrationGenerativeUsdPerMin}/min`}
            sub="AWS Polly Generative"
          />
          <RateCard
            label="Storage"
            rate={`$${OVERAGE_RATES.storageUsdPerGbMonth}/GB-mo`}
            sub="Beyond plan allowance"
          />
        </div>
      </Section>

      <Section raised>
        <SectionEyebrow>Cancellation</SectionEyebrow>
        <SectionHeading sub="Self-serve in the customer portal. No phone calls. No retention pop-ups.">
          How cancellation works
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h3 className="text-heading-md">Monthly</h3>
              <p className="mt-2 text-body-md text-text-secondary">
                Cancel anytime. Access until the end of the current period. No partial refund.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="text-heading-md">Annual</h3>
              <p className="mt-2 text-body-md text-text-secondary">
                Cancel anytime. Two options: end-of-term (no refund) or immediate (prorated
                refund).
              </p>
            </CardBody>
          </Card>
        </div>
        <Banner variant="info" className="mt-8" title="Data after cancellation">
          30 days of read-only access for export, then soft delete for 30 days, then hard delete
          (HIPAA: KMS key destruction). Full detail on our{" "}
          <a className="underline" href="/security">
            security page
          </a>
          .
        </Banner>
      </Section>

      <Section>
        <SectionEyebrow>FAQ</SectionEyebrow>
        <SectionHeading>Common questions</SectionHeading>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Faq q="Is there a free trial?">
            No. Card-up-front signup means we attract qualified buyers. Transparent month-to-month
            pricing already serves as a trial — sign up, decide, cancel.
          </Faq>
          <Faq q="Can I cancel anytime?">
            Yes. Monthly and annual both cancel anytime. No phone calls, no retention pop-ups.
          </Faq>
          <Faq q="What happens to my data if I cancel?">
            30 days of read-only access for export. Then soft delete for 30 days. Then hard delete
            (HIPAA tier: cryptographic key destruction).
          </Faq>
          <Faq q="Do you require a long-term contract?">
            No. Month-to-month or annual prepay; both cancel-anytime. No multi-year contracts even
            on Enterprise.
          </Faq>
          <Faq q="When do overages get charged?">
            Caps soft-warn at 80% and hard-block at 100%. Your admin must approve any overage
            request before it accrues. Approved overages bill on your next invoice at the
            published rates above.
          </Faq>
          <Faq q="How does HIPAA tier billing work?">
            Click "Upgrade to HIPAA tier" anywhere in the app. Org_admin accepts our BAA, the
            tier flag flips, and your invoice is prorated immediately for the difference.
          </Faq>
        </div>
      </Section>
    </>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card className="flex flex-col">
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
          or ${plan.annualUsd.toLocaleString()}/yr (2 months free)
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
            {plan.aiCreditsPerSeat} AI credits/seat/month
          </li>
          <li className="flex gap-2">
            <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden />
            {plan.narrationMinPerSeat} narration min/seat/month
          </li>
          <li className="flex gap-2">
            <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden />
            {plan.storageGb} GB storage
          </li>
          {plan.tier === "hipaa" ? (
            <li className="flex gap-2">
              <CheckCircle2 size={16} className="mt-0.5 text-accent" aria-hidden />
              BAA, HIPAA-scoped infra, MFA required
            </li>
          ) : null}
        </ul>
        <CtaLink href="/signup" className="mt-8" variant="secondary">
          Choose {plan.name}
        </CtaLink>
      </CardBody>
    </Card>
  );
}

function RateCard({ label, rate, sub }: { label: string; rate: string; sub: string }) {
  return (
    <Card>
      <CardBody>
        <p className="text-caption uppercase text-text-tertiary">{label}</p>
        <p className="mt-2 text-heading-lg">{rate}</p>
        <p className="mt-1 text-body-sm text-text-secondary">{sub}</p>
      </CardBody>
    </Card>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-heading-md">{q}</h3>
      <p className="mt-2 text-body-md text-text-secondary">{children}</p>
    </div>
  );
}
