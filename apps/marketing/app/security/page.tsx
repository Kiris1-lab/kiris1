import { Container, Banner, Card, CardBody, TierBadge } from "@kiris/ui";
import {
  KeyRound,
  Lock,
  ScrollText,
  ShieldCheck,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { CtaLink } from "@/components/cta-link";

export const metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption uppercase text-accent">Security</p>
            <h1 className="mt-3 text-display-lg">Security and compliance, by design.</h1>
            <p className="mt-5 text-body-lg text-text-secondary">
              Most hospital training doesn't need PHI. Kiris is built around that fact, with a
              two-tier model that lets you start instantly on a HIPAA-free Standard tier and
              upgrade in-app the day you need PHI handling.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <SectionEyebrow>Two tiers</SectionEyebrow>
        <SectionHeading sub="Pick the right tier for the work you do.">
          Standard or HIPAA tier
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <TierBadge tier="standard" />
              <h3 className="mt-4 text-heading-xl">Standard tier</h3>
              <p className="mt-2 text-body-md text-text-secondary">
                Instant signup. No BAA needed. PHI prohibited by ToS — and enforced by our PHI
                scrubber on every input. Suitable for ~80% of hospital training: compliance,
                safety, equipment, software, policies.
              </p>
              <ul className="mt-6 space-y-2 text-body-sm text-text-secondary">
                <li>· TLS 1.2+ in transit, AES-256 at rest (AWS KMS)</li>
                <li>· Postgres RLS tenant isolation, not just app code</li>
                <li>· Comprehend Medical PHI scrubber on every input</li>
                <li>· 1-year audit retention</li>
                <li>· Optional MFA</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <TierBadge tier="hipaa" />
              <h3 className="mt-4 text-heading-xl">HIPAA tier</h3>
              <p className="mt-2 text-body-md text-text-secondary">
                Click "Upgrade" inside the app. Your org_admin accepts our BAA, the tier flag
                flips, and PHI-aware code paths unlock immediately. We sign BAAs with our
                upstream subprocessors so you don't have to chase them.
              </p>
              <ul className="mt-6 space-y-2 text-body-sm text-text-secondary">
                <li>· BAA included; AWS, Anthropic, Polly all under BAA</li>
                <li>· Customer-managed KMS keys per tenant</li>
                <li>· Field-level encryption on module content + narration scripts</li>
                <li>· 6-year audit retention</li>
                <li>· MFA required for editors and above</li>
                <li>· Cryptographic key destruction on hard delete</li>
              </ul>
            </CardBody>
          </Card>
        </div>
        <Banner variant="info" className="mt-8" title="Standard tier is launching first">
          We're shipping Standard first; HIPAA tier follows shortly after. The data model and
          guardrails for HIPAA are already in place — we're finishing BAAs and HIPAA-scoped
          infrastructure.
        </Banner>
      </Section>

      <Section raised>
        <SectionEyebrow>Controls</SectionEyebrow>
        <SectionHeading>What protects your data</SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Control
            icon={<Lock aria-hidden size={20} />}
            title="Encryption everywhere"
            body="TLS 1.2+ in transit, AES-256 at rest via AWS KMS. HIPAA tier uses customer-managed CMKs and field-level encryption."
          />
          <Control
            icon={<KeyRound aria-hidden size={20} />}
            title="Tenant isolation in the database"
            body="Postgres row-level security, not just app code. App code is one barrier; RLS is the other."
          />
          <Control
            icon={<ShieldAlert aria-hidden size={20} />}
            title="PHI scrubber on Standard"
            body="AWS Comprehend Medical pre-flights every input. High-confidence PHI is hard-blocked. Failure mode: fail-closed for HIPAA-likely content."
          />
          <Control
            icon={<Users aria-hidden size={20} />}
            title="Role-based access"
            body="org_admin, team_admin, editor, viewer. Authorization at the API layer, not just the UI."
          />
          <Control
            icon={<ScrollText aria-hidden size={20} />}
            title="Comprehensive audit log"
            body="Every state-changing action logged with actor, IP, request ID, success. No PHI in log entries."
          />
          <Control
            icon={<ShieldCheck aria-hidden size={20} />}
            title="No client-side secrets"
            body="Browsers never see Anthropic, Polly, Comprehend, or Stripe-secret keys. Every AI / TTS / PHI call goes through our API."
          />
        </div>
      </Section>

      <Section>
        <SectionEyebrow>Subprocessors</SectionEyebrow>
        <SectionHeading sub="Our subprocessors are listed publicly. We sign a BAA with each one that touches PHI on the HIPAA tier so you don't have to.">
          Who we work with
        </SectionHeading>
        <div className="mt-12 overflow-hidden rounded-lg border border-border-subtle">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-raised text-caption uppercase text-text-tertiary">
              <tr>
                <th className="p-4 text-left">Subprocessor</th>
                <th className="p-4 text-left">Purpose</th>
                <th className="p-4 text-left">Region</th>
                <th className="p-4 text-left">BAA?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface-raised">
              <Row vendor="Amazon Web Services" purpose="Hosting, storage, KMS, Polly, Comprehend Medical, Cognito" region="us-east-1" baa="Yes (HIPAA tier)" />
              <Row vendor="Anthropic" purpose="AI generation (Claude Messages API)" region="USA" baa="Yes (HIPAA tier)" />
              <Row vendor="Vercel" purpose="Marketing site hosting (no PHI)" region="USA" baa="N/A" />
              <Row vendor="Stripe" purpose="Billing, payments (no PHI ever)" region="USA" baa="N/A by design" />
              <Row vendor="Sentry" purpose="Error monitoring (PHI scrubbed)" region="USA" baa="Yes (HIPAA tier)" />
              <Row vendor="Plausible Analytics" purpose="Marketing-site privacy-respecting analytics" region="EU" baa="N/A" />
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-body-sm text-text-secondary">
          We update this list whenever a subprocessor changes. Existing customers receive 60 days
          notice for any new subprocessor that may touch their data.
        </p>
      </Section>

      <Section raised>
        <SectionEyebrow>Roadmap</SectionEyebrow>
        <SectionHeading>Trust roadmap</SectionHeading>
        <ul className="mt-12 space-y-4 text-body-md text-text-secondary">
          <li>
            <strong>Now:</strong> Standard tier shipping with PHI scrubber, RLS, audit logging,
            CSP, dependency scanning, gitleaks in CI.
          </li>
          <li>
            <strong>Q1:</strong> HIPAA tier launch with BAAs in place, customer-managed KMS,
            field-level encryption, support session flow.
          </li>
          <li>
            <strong>Q2:</strong> SOC 2 Type I observation period kickoff. Annual penetration test.
          </li>
          <li>
            <strong>Q4:</strong> SOC 2 Type II report.
          </li>
        </ul>
      </Section>

      <Section>
        <div className="rounded-lg border border-border-subtle bg-surface-raised p-8 shadow-sm">
          <h2 className="text-heading-xl">Reporting a security issue</h2>
          <p className="mt-3 text-body-md text-text-secondary">
            Email{" "}
            <a className="underline" href="mailto:security@kiris.ai">
              security@kiris.ai
            </a>
            . Please don't open public GitHub issues for security reports. We aim to respond
            within 2 business days and remediate critical issues within 14 days.
          </p>
          <CtaLink href="/trust" className="mt-6" variant="secondary">
            See our public trust page
          </CtaLink>
        </div>
      </Section>
    </>
  );
}

function Control({
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

function Row({
  vendor,
  purpose,
  region,
  baa,
}: {
  vendor: string;
  purpose: string;
  region: string;
  baa: string;
}) {
  return (
    <tr>
      <td className="p-4 font-medium text-text-primary">{vendor}</td>
      <td className="p-4 text-text-secondary">{purpose}</td>
      <td className="p-4 text-text-secondary">{region}</td>
      <td className="p-4 text-text-secondary">{baa}</td>
    </tr>
  );
}
