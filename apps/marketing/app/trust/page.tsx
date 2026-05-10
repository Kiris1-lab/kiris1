import { Banner, Card, CardBody } from "@kiris/ui";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";

export const metadata = { title: "Trust" };

const SUBPROCESSORS = [
  { v: "AWS", p: "Hosting, KMS, Polly, Comprehend Medical, Cognito", baa: "Yes" },
  { v: "Anthropic", p: "Claude Messages API", baa: "Yes (Enterprise)" },
  { v: "Vercel", p: "Marketing site (no PHI)", baa: "N/A" },
  { v: "Stripe", p: "Billing (no PHI)", baa: "N/A by design" },
  { v: "Sentry", p: "Error monitoring (PHI scrubbed)", baa: "Yes" },
  { v: "Plausible", p: "Marketing analytics", baa: "N/A" },
];

const CERTS = [
  {
    title: "Enterprise compliance",
    status: "In progress",
    body: "BAAs with AWS and Anthropic, customer-managed KMS, click-to-accept BAA flow.",
  },
  {
    title: "SOC 2 Type I",
    status: "Planned · Q2",
    body: "Observation period kickoff. Auditor selection and gap assessment underway.",
  },
  {
    title: "SOC 2 Type II",
    status: "Planned · Q4",
    body: "Type II report after the Type I observation period closes.",
  },
];

export default function TrustPage() {
  return (
    <>
      <Section tone="base" density="spacious">
        <div className="max-w-3xl">
          <SectionEyebrow>Trust</SectionEyebrow>
          <h1 className="text-display-lg text-text-primary mt-3">
            One page for subprocessors, certifications, status, and security contact
          </h1>
          <p className="text-body-lg text-text-secondary mt-5">
            We update this page whenever any of those change.
          </p>
        </div>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Status</SectionEyebrow>
        <SectionHeading>Service status.</SectionHeading>
        <div className="border-border-subtle bg-surface-raised mt-12 inline-flex items-center gap-3 rounded-full border px-5 py-3 shadow-sm">
          <span
            aria-hidden
            className="bg-status-success inline-block h-2.5 w-2.5 rounded-full"
            style={{ boxShadow: "0 0 0 4px var(--accent-soft)" }}
          />
          <p className="text-body-md text-text-primary font-medium">All systems operational</p>
        </div>
        <p className="text-body-sm text-text-secondary mt-3">
          Live status page coming soon at <code>status.kiris.ai</code>.
        </p>
      </Section>

      <Section tone="raised">
        <SectionEyebrow>Certifications</SectionEyebrow>
        <SectionHeading sub="We're being honest about timelines: SOC 2 takes a year to do correctly. Here's where we are.">
          Compliance roadmap.
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CERTS.map((c) => (
            <Card key={c.title}>
              <CardBody>
                <span className="bg-surface-sunken text-text-secondary text-caption inline-flex items-center rounded-full px-2.5 py-0.5 font-medium uppercase tracking-wider">
                  {c.status}
                </span>
                <h3 className="text-heading-md mt-3">{c.title}</h3>
                <p className="text-body-md text-text-secondary mt-2">{c.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Contact</SectionEyebrow>
        <SectionHeading>Reach security.</SectionHeading>
        <Banner variant="info" className="mt-12" title="Reporting a vulnerability">
          Email{" "}
          <a className="underline" href="mailto:security@kiris.ai">
            security@kiris.ai
          </a>
          . Please don&apos;t open public GitHub issues. We respond within 2 business days and aim
          to remediate critical issues within 14 days.
        </Banner>
      </Section>

      <Section tone="raised">
        <SectionEyebrow>Subprocessors</SectionEyebrow>
        <SectionHeading sub="The same list lives on /security. Existing customers receive 60 days notice for any new subprocessor that may touch their data.">
          Subprocessor list.
        </SectionHeading>
        <div className="border-border-subtle bg-surface-raised mt-12 overflow-hidden rounded-lg border">
          <table className="text-body-sm w-full">
            <thead className="bg-surface-sunken text-caption text-text-tertiary uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left">Subprocessor</th>
                <th className="p-4 text-left">Purpose</th>
                <th className="p-4 text-left">BAA?</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {SUBPROCESSORS.map((s) => (
                <tr key={s.v}>
                  <td className="text-text-primary p-4 font-medium">{s.v}</td>
                  <td className="text-text-secondary p-4">{s.p}</td>
                  <td className="text-text-secondary p-4">{s.baa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
