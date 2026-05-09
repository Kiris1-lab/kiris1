import { Container, Card, CardBody, Badge, Banner } from "@kiris/ui";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";

export const metadata = { title: "Trust" };

export default function TrustPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption text-accent uppercase">Trust</p>
            <h1 className="text-display-lg mt-3">Public trust page.</h1>
            <p className="text-body-lg text-text-secondary mt-5">
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
              <span className="bg-status-success h-2.5 w-2.5 rounded-full" aria-hidden />
              <p className="text-body-md font-medium">All systems operational</p>
            </div>
            <p className="text-body-sm text-text-secondary mt-2">
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
          . Please don&apos;t open public GitHub issues. We respond within 2 business days and aim
          to remediate critical issues within 14 days.
        </Banner>
      </Section>

      <Section raised>
        <SectionEyebrow>Subprocessors</SectionEyebrow>
        <SectionHeading sub="The same list lives on /security. Existing customers receive 60 days notice for any new subprocessor that may touch their data.">
          Subprocessor list
        </SectionHeading>
        <div className="border-border-subtle mt-12 overflow-hidden rounded-lg border">
          <table className="text-body-sm w-full">
            <thead className="bg-surface-raised text-caption text-text-tertiary uppercase">
              <tr>
                <th className="p-4 text-left">Subprocessor</th>
                <th className="p-4 text-left">Purpose</th>
                <th className="p-4 text-left">BAA?</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle bg-surface-raised divide-y">
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

function CertCard({ title, status, body }: { title: string; status: string; body: string }) {
  return (
    <Card>
      <CardBody>
        <Badge variant="neutral">{status}</Badge>
        <h3 className="text-heading-md mt-3">{title}</h3>
        <p className="text-body-md text-text-secondary mt-2">{body}</p>
      </CardBody>
    </Card>
  );
}

function Row({ v, p, baa }: { v: string; p: string; baa: string }) {
  return (
    <tr>
      <td className="text-text-primary p-4 font-medium">{v}</td>
      <td className="text-text-secondary p-4">{p}</td>
      <td className="text-text-secondary p-4">{baa}</td>
    </tr>
  );
}
