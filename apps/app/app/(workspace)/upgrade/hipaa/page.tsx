import { Banner, Card, CardBody, Input, TierBadge } from "@kiris/ui";
import { CheckCircle2, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/session";

export const metadata = { title: "Upgrade to HIPAA tier" };

const HIPAA_GAINS = [
  "BAA with Kiris (we sign upstream BAAs with AWS, Anthropic, and Polly so you don't have to chase them)",
  "Customer-managed KMS key per tenant",
  "Field-level encryption on module content + narration scripts",
  "6-year audit log retention",
  "MFA required for editors and above",
  "PHI scrubber switches to confirm-then-route to HIPAA-scoped infrastructure",
  "Cryptographic key destruction on hard delete",
];

export default function HipaaUpgradePage() {
  const session = getSession();
  const isOrgAdmin = session.user.role === "org_admin";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2">
        <TierBadge tier={session.tenant.tier} />
        <span className="text-text-tertiary" aria-hidden>
          →
        </span>
        <TierBadge tier="hipaa" />
      </div>
      <h1 className="mt-3 text-display-md">Upgrade to HIPAA tier</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        Click-to-accept BAA, in-app, by an <code>org_admin</code>. Pro-rated
        upgrade charge is applied immediately. Tier flag flips and PHI-aware
        code paths unlock.
      </p>

      {!isOrgAdmin ? (
        <Banner variant="warning" className="mt-8" title="Only org_admins can accept the BAA">
          Ask your org_admin ({session.tenant.name}) to upgrade. They'll see this
          page when they sign in.
        </Banner>
      ) : null}

      <Card className="mt-8">
        <CardBody>
          <h2 className="text-heading-md">What changes</h2>
          <ul className="mt-4 space-y-2 text-body-md text-text-secondary">
            {HIPAA_GAINS.map((g) => (
              <li key={g} className="flex gap-2">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-accent" aria-hidden />
                {g}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardBody>
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-accent" aria-hidden />
            <h2 className="text-heading-md">Click-to-accept BAA</h2>
          </div>
          <p className="mt-2 text-body-sm text-text-secondary">
            By accepting, you (the org_admin) bind your organization to Kiris's
            HIPAA Business Associate Agreement, version{" "}
            <code className="font-mono">v1.0</code>. We log your acceptance with
            timestamp, IP, full name, job title, and BAA hash.
          </p>

          <form
            method="get"
            action="/upgrade/hipaa/accepted"
            className="mt-6 grid gap-4 md:grid-cols-2"
            aria-describedby="baa-help"
          >
            <input type="hidden" name="baaVersion" value="v1.0" />
            <p id="baa-help" className="sr-only md:col-span-2">
              Both fields required to accept the BAA.
            </p>
            <Field label="Full name" htmlFor="fullName">
              <Input id="fullName" name="fullName" required disabled={!isOrgAdmin} />
            </Field>
            <Field label="Job title" htmlFor="jobTitle">
              <Input id="jobTitle" name="jobTitle" required disabled={!isOrgAdmin} />
            </Field>
            <div className="md:col-span-2 flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-body-sm text-text-secondary">
                <ShieldCheck size={14} className="text-accent" aria-hidden />
                BAA stored at <code className="font-mono">/legal/baa-v1.0.pdf</code>
              </p>
              <button
                type="submit"
                disabled={!isOrgAdmin}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-body-md font-medium text-text-on-accent shadow-sm transition-colors duration-state hover:bg-accent-hover disabled:opacity-50"
              >
                <KeyRound size={14} aria-hidden /> Accept and upgrade
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-caption text-text-tertiary">
        After upgrade, MFA is required for editors and above. Your org_admin is
        prompted to enroll a hardware key on next sign-in.
      </p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-body-sm font-medium text-text-primary">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
