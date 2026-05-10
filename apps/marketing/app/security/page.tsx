/* FOUNDER REVIEW: Legal/compliance disclosures around PHI on Standard tier
 * have been deemphasized in favor of Enterprise framing. Confirm with counsel
 * that no required PHI-prohibition language was removed. The previous page
 * explicitly told visitors "PHI prohibited by ToS" and described the PHI
 * scrubber as a hard gate. Both still exist as product behavior; this page
 * just no longer leads with that disclosure. */

import { Banner, Card, CardBody } from "@kiris/ui";
import {
  Download,
  KeyRound,
  Lock,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { CtaLink } from "@/components/cta-link";

export const metadata = { title: "Security" };

const CONTROLS = [
  {
    icon: <Lock aria-hidden size={20} />,
    title: "Encryption everywhere",
    body: "TLS 1.2+ in transit, AES-256 at rest via AWS KMS. Enterprise plans use customer-managed CMKs and field-level encryption on module content + narration scripts.",
  },
  {
    icon: <KeyRound aria-hidden size={20} />,
    title: "Tenant isolation in the database",
    body: "Postgres row-level security, not just application code. App code is one barrier; RLS is the other. A misrouted query is blocked at the DB.",
  },
  {
    icon: <ShieldAlert aria-hidden size={20} />,
    title: "PHI scrubber on every input",
    body: "AWS Comprehend Medical pre-flights every authoring input. High-confidence PHI is hard-blocked. Failure mode: fail-closed for HIPAA-likely content.",
  },
  {
    icon: <Users aria-hidden size={20} />,
    title: "Role-based access",
    body: "org_admin, team_admin, editor, viewer. Authorization at the API layer, not just the UI. Every state-changing route checks the role server-side.",
  },
  {
    icon: <ScrollText aria-hidden size={20} />,
    title: "Comprehensive audit log",
    body: "Every state-changing action recorded with actor, IP, request ID, success state, and tier-at-time. No PHI in log entries — references only.",
  },
  {
    icon: <ShieldCheck aria-hidden size={20} />,
    title: "No client-side secrets",
    body: "Browsers never see Anthropic, Polly, Comprehend, or Stripe-secret keys. Every AI / TTS / PHI call goes through our API — never a browser fetch to the vendor.",
  },
];

const SUBPROCESSORS = [
  {
    vendor: "Amazon Web Services",
    purpose: "Hosting, storage, KMS, Polly, Comprehend Medical, Cognito",
    region: "us-east-1",
    baa: "Yes (Enterprise)",
  },
  {
    vendor: "Anthropic",
    purpose: "AI generation (Claude Messages API)",
    region: "USA",
    baa: "Yes (Enterprise)",
  },
  { vendor: "Vercel", purpose: "Marketing site hosting (no PHI)", region: "USA", baa: "N/A" },
  {
    vendor: "Stripe",
    purpose: "Billing, payments (no PHI ever)",
    region: "USA",
    baa: "N/A by design",
  },
  {
    vendor: "Sentry",
    purpose: "Error monitoring (PHI scrubbed before send)",
    region: "USA",
    baa: "Yes (Enterprise)",
  },
  {
    vendor: "Plausible Analytics",
    purpose: "Privacy-respecting analytics",
    region: "EU",
    baa: "N/A",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Section tone="base" density="spacious">
        <div className="max-w-3xl">
          <SectionEyebrow>Security</SectionEyebrow>
          <h1 className="text-display-lg text-text-primary mt-3">
            Security that&apos;s simple to evaluate, hard to bypass
          </h1>
          <p className="text-body-lg text-text-secondary mt-5">
            Encryption, tenant isolation, audit logging, and access controls in every workspace.
            Advanced compliance — including BAAs and customer-managed keys — comes with Enterprise.
          </p>
        </div>
      </Section>

      <Section tone="base">
        <div className="max-w-3xl">
          <p className="text-body-lg text-text-secondary">
            Kiris is built for healthcare from day one. Every workspace gets the same
            production-grade security posture — TLS 1.2+ in transit, AES-256 at rest, Postgres
            row-level security at the database layer, and a comprehensive audit trail. There is no
            &ldquo;lite&rdquo; mode. The differences for Enterprise customers are the BAAs,
            per-tenant customer-managed encryption keys, extended audit retention, and forced MFA.
          </p>
        </div>
      </Section>

      <Section tone="raised">
        <SectionEyebrow>Controls</SectionEyebrow>
        <SectionHeading>What protects your data.</SectionHeading>
        <ul className="border-border-subtle mt-12 divide-y border-y">
          {CONTROLS.map((c) => (
            <li key={c.title} className="grid gap-4 py-6 md:grid-cols-[auto_1fr] md:gap-8">
              <span className="bg-accent-soft text-accent inline-flex h-10 w-10 items-center justify-center rounded-md">
                {c.icon}
              </span>
              <div>
                <p className="text-heading-sm text-text-primary">{c.title}</p>
                <p className="text-body-md text-text-secondary mt-2 max-w-2xl">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Compliance</SectionEyebrow>
        <SectionHeading sub="Most hospital training doesn't require Protected Health Information. For programs that do, our Enterprise plan adds the controls and contractual coverage that compliance teams expect.">
          Compliance for healthcare-grade workloads.
        </SectionHeading>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h3 className="text-heading-md">Included with every plan</h3>
              <ul className="text-body-md text-text-secondary mt-4 space-y-2">
                <li>· TLS 1.2+ in transit, AES-256 at rest (AWS KMS)</li>
                <li>· Postgres RLS tenant isolation</li>
                <li>· PHI scrubber on every input</li>
                <li>· 1-year audit retention</li>
                <li>· Optional MFA</li>
              </ul>
            </CardBody>
          </Card>
          <Card className="border-accent border-2">
            <CardBody>
              <div className="flex items-center justify-between">
                <h3 className="text-heading-md">Enterprise adds</h3>
                <span className="bg-accent-soft text-accent text-caption rounded-full px-2.5 py-1 font-medium uppercase tracking-wider">
                  Custom
                </span>
              </div>
              <ul className="text-body-md text-text-secondary mt-4 space-y-2">
                <li>· Business Associate Agreement (BAA)</li>
                <li>· Customer-managed KMS keys per tenant</li>
                <li>· Field-level encryption on module content</li>
                <li>· 6-year audit retention</li>
                <li>· MFA required for editors and above</li>
                <li>· Cryptographic key destruction on hard delete</li>
              </ul>
              <CtaLink href="/contact-sales" className="mt-6" variant="secondary" withArrow>
                Talk to sales
              </CtaLink>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section tone="raised">
        <SectionEyebrow>Subprocessors</SectionEyebrow>
        <SectionHeading sub="Our subprocessors are listed publicly. We sign a BAA with each one that touches PHI on the Enterprise plan so you don't have to.">
          Who we work with.
        </SectionHeading>
        <div className="border-border-subtle bg-surface-raised mt-12 overflow-hidden rounded-lg border">
          <table className="text-body-sm w-full">
            <thead className="bg-surface-sunken text-caption text-text-tertiary uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left">Subprocessor</th>
                <th className="p-4 text-left">Purpose</th>
                <th className="p-4 text-left">Region</th>
                <th className="p-4 text-left">BAA?</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {SUBPROCESSORS.map((s) => (
                <tr key={s.vendor}>
                  <td className="text-text-primary p-4 font-medium">{s.vendor}</td>
                  <td className="text-text-secondary p-4">{s.purpose}</td>
                  <td className="text-text-secondary p-4">{s.region}</td>
                  <td className="text-text-secondary p-4">{s.baa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-body-sm text-text-secondary">
            We update this list whenever a subprocessor changes. Existing customers receive 60 days
            notice for any new subprocessor that may touch their data.
          </p>
          {/* TODO: generate real PDF */}
          <a
            href="/api/subprocessors.pdf"
            className="text-body-sm text-accent inline-flex items-center gap-1.5 hover:underline"
          >
            <Download size={14} aria-hidden />
            Download subprocessor list (PDF)
          </a>
        </div>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Roadmap</SectionEyebrow>
        <SectionHeading>Trust roadmap.</SectionHeading>
        <ul className="text-body-md text-text-secondary mt-12 max-w-3xl space-y-4">
          <li>
            <strong className="text-text-primary">Now:</strong> Encryption, RLS, audit logging, CSP,
            dependency scanning, and gitleaks in CI ship in every workspace.
          </li>
          <li>
            <strong className="text-text-primary">Q1:</strong> Enterprise plan launch with BAAs in
            place, customer-managed KMS, field-level encryption, and the support-session approval
            flow.
          </li>
          <li>
            <strong className="text-text-primary">Q2:</strong> SOC 2 Type I observation period
            kickoff. Annual penetration test.
          </li>
          <li>
            <strong className="text-text-primary">Q4:</strong> SOC 2 Type II report.
          </li>
        </ul>
      </Section>

      <Section tone="raised">
        <Banner variant="info" title="Reporting a security issue">
          Email{" "}
          <a className="underline" href="mailto:security@kiris.ai">
            security@kiris.ai
          </a>
          . Please don&apos;t open public GitHub issues. We respond within 2 business days and aim
          to remediate critical issues within 14 days.
        </Banner>
        <div className="mt-6">
          <CtaLink href="/trust" variant="secondary" withArrow>
            See our public trust page
          </CtaLink>
        </div>
      </Section>
    </>
  );
}
