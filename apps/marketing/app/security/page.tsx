import { Container, Banner, Card, CardBody, TierBadge } from "@kiris/ui";
import { KeyRound, Lock, ScrollText, ShieldCheck, ShieldAlert, Users } from "lucide-react";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { CtaLink } from "@/components/cta-link";

export const metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption text-accent uppercase">Security</p>
            <h1 className="text-display-lg mt-3">Security and compliance, by design.</h1>
            <p className="text-body-lg text-text-secondary mt-5">
              Most hospital training doesn&apos;t need PHI. Kiris is built around that fact, with a
              two-tier model that lets you start instantly on a HIPAA-free Standard tier and upgrade
              in-app the day you need PHI handling.
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
              <h3 className="text-heading-xl mt-4">Standard tier</h3>
              <p className="text-body-md text-text-secondary mt-2">
                Instant signup. No BAA needed. PHI prohibited by ToS — and enforced by our PHI
                scrubber on every input. Suitable for ~80% of hospital training: compliance, safety,
                equipment, software, policies.
              </p>
              <ul className="text-body-sm text-text-secondary mt-6 space-y-2">
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
              <h3 className="text-heading-xl mt-4">HIPAA tier</h3>
              <p className="text-body-md text-text-secondary mt-2">
                Click &quot;Upgrade&quot; inside the app. Your org_admin accepts our BAA, the tier
                flag flips, and PHI-aware code paths unlock immediately. We sign BAAs with our
                upstream subprocessors so you don&apos;t have to chase them.
              </p>
              <ul className="text-body-sm text-text-secondary mt-6 space-y-2">
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
          We&apos;re shipping Standard first; HIPAA tier follows shortly after. The data model and
          guardrails for HIPAA are already in place — we&apos;re finishing BAAs and HIPAA-scoped
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
        <div className="border-border-subtle mt-12 overflow-hidden rounded-lg border">
          <table className="text-body-sm w-full">
            <thead className="bg-surface-raised text-caption text-text-tertiary uppercase">
              <tr>
                <th className="p-4 text-left">Subprocessor</th>
                <th className="p-4 text-left">Purpose</th>
                <th className="p-4 text-left">Region</th>
                <th className="p-4 text-left">BAA?</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle bg-surface-raised divide-y">
              <Row
                vendor="Amazon Web Services"
                purpose="Hosting, storage, KMS, Polly, Comprehend Medical, Cognito"
                region="us-east-1"
                baa="Yes (HIPAA tier)"
              />
              <Row
                vendor="Anthropic"
                purpose="AI generation (Claude Messages API)"
                region="USA"
                baa="Yes (HIPAA tier)"
              />
              <Row
                vendor="Vercel"
                purpose="Marketing site hosting (no PHI)"
                region="USA"
                baa="N/A"
              />
              <Row
                vendor="Stripe"
                purpose="Billing, payments (no PHI ever)"
                region="USA"
                baa="N/A by design"
              />
              <Row
                vendor="Sentry"
                purpose="Error monitoring (PHI scrubbed)"
                region="USA"
                baa="Yes (HIPAA tier)"
              />
              <Row
                vendor="Plausible Analytics"
                purpose="Marketing-site privacy-respecting analytics"
                region="EU"
                baa="N/A"
              />
            </tbody>
          </table>
        </div>
        <p className="text-body-sm text-text-secondary mt-4">
          We update this list whenever a subprocessor changes. Existing customers receive 60 days
          notice for any new subprocessor that may touch their data.
        </p>
      </Section>

      <Section raised>
        <SectionEyebrow>Roadmap</SectionEyebrow>
        <SectionHeading>Trust roadmap</SectionHeading>
        <ul className="text-body-md text-text-secondary mt-12 space-y-4">
          <li>
            <strong>Now:</strong> Standard tier shipping with PHI scrubber, RLS, audit logging, CSP,
            dependency scanning, gitleaks in CI.
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
        <div className="border-border-subtle bg-surface-raised rounded-lg border p-8 shadow-sm">
          <h2 className="text-heading-xl">Reporting a security issue</h2>
          <p className="text-body-md text-text-secondary mt-3">
            Email{" "}
            <a className="underline" href="mailto:security@kiris.ai">
              security@kiris.ai
            </a>
            . Please don&apos;t open public GitHub issues for security reports. We aim to respond
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

function Control({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
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
      <td className="text-text-primary p-4 font-medium">{vendor}</td>
      <td className="text-text-secondary p-4">{purpose}</td>
      <td className="text-text-secondary p-4">{region}</td>
      <td className="text-text-secondary p-4">{baa}</td>
    </tr>
  );
}
