import { Container, Card, CardBody, Badge, Banner } from "@kiris/ui";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";

export const metadata = { title: "Trust" };

export default function TrustPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption uppercase text-accent">Trust</p>
            <h1 className="mt-3 text-display-lg">Public trust page.</h1>
            <p className="mt-5 text-body-lg text-text-secondary">
              The single page where you can find our subprocessors, certifications, status, and
              security contact. We update this page whenever any of those change.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <SectionEyebrow>Status</SectionEyebrow>
        <SectionHeading>Service status</SectionHeading>
        <Card className="mt-12">
          <CardBody>
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full bg-status-success"
                aria-hidden
              />
              <p className="text-body-md font-medium">All systems operational</p>
            </div>
            <p className="mt-2 text-body-sm text-text-secondary">
              Live status page coming soon at <code>status.kiris.ai</code>.
            </p>
          </CardBody>
        </Card>
      </Section>

      <Section raised>
        <SectionEyebrow>Certifications</SectionEyebrow>
        <SectionHeading sub="We're being honest about timelines: SOC 2 takes a year to do correctly. Here's where we are.">
          Compliance roadmap
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <CertCard
            title="HIPAA tier"
            status="In progress"
            body="BAAs with AWS and Anthropic, HIPAA-scoped infrastructure, click-to-accept BAA flow."
          />
          <CertCard
            title="SOC 2 Type I"
            status="Planned (Q2)"
            body="Observation period kickoff. Auditor selection and gap assessment underway."
          />
          <CertCard
            title="SOC 2 Type II"
            status="Planned (Q4)"
            body="Type II report after the Type I observation period closes."
          />
        </div>
      </Section>

      <Section>
        <SectionEyebrow>Contact</SectionEyebrow>
        <SectionHeading>Reach security</SectionHeading>
        <Banner variant="info" className="mt-12" title="Reporting a vulnerability">
          Email{" "}
          <a className="underline" href="mailto:security@kiris.ai">
            security@kiris.ai
          </a>
          . Please don't open public GitHub issues. We respond within 2 business days and aim
          to remediate critical issues within 14 days.
        </Banner>
      </Section>

      <Section raised>
        <SectionEyebrow>Subprocessors</SectionEyebrow>
        <SectionHeading sub="The same list lives on /security. Existing customers receive 60 days notice for any new subprocessor that may touch their data.">
          Subprocessor list
        </SectionHeading>
        <div className="mt-12 overflow-hidden rounded-lg border border-border-subtle">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-raised text-caption uppercase text-text-tertiary">
              <tr>
                <th className="p-4 text-left">Subprocessor</th>
                <th className="p-4 text-left">Purpose</th>
                <th className="p-4 text-left">BAA?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface-raised">
              <Row v="AWS" p="Hosting, KMS, Polly, Comprehend Medical, Cognito" baa="Yes" />
              <Row v="Anthropic" p="Claude Messages API" baa="Yes (HIPAA tier)" />
              <Row v="Vercel" p="Marketing site (no PHI)" baa="N/A" />
              <Row v="Stripe" p="Billing (no PHI)" baa="N/A by design" />
              <Row v="Sentry" p="Error monitoring (PHI scrubbed)" baa="Yes" />
              <Row v="Plausible" p="Marketing analytics" baa="N/A" />
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

function CertCard({
  title,
  status,
  body,
}: {
  title: string;
  status: string;
  body: string;
}) {
  return (
    <Card>
      <CardBody>
        <Badge variant="neutral">{status}</Badge>
        <h3 className="mt-3 text-heading-md">{title}</h3>
        <p className="mt-2 text-body-md text-text-secondary">{body}</p>
      </CardBody>
    </Card>
  );
}

function Row({ v, p, baa }: { v: string; p: string; baa: string }) {
  return (
    <tr>
      <td className="p-4 font-medium text-text-primary">{v}</td>
      <td className="p-4 text-text-secondary">{p}</td>
      <td className="p-4 text-text-secondary">{baa}</td>
    </tr>
  );
}
