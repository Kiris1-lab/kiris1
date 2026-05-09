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
      <h1 className="text-display-md mt-3">Upgrade to HIPAA tier</h1>
      <p className="text-body-md text-text-secondary mt-2">
        Click-to-accept BAA, in-app, by an <code>org_admin</code>. Pro-rated upgrade charge is
        applied immediately. Tier flag flips and PHI-aware code paths unlock.
      </p>

      {!isOrgAdmin ? (
        <Banner variant="warning" className="mt-8" title="Only org_admins can accept the BAA">
          Ask your org_admin ({session.tenant.name}) to upgrade. They&apos;ll see this page when
          they sign in.
        </Banner>
      ) : null}

      <Card className="mt-8">
        <CardBody>
          <h2 className="text-heading-md">What changes</h2>
          <ul className="text-body-md text-text-secondary mt-4 space-y-2">
            {HIPAA_GAINS.map((g) => (
              <li key={g} className="flex gap-2">
                <CheckCircle2 size={16} className="text-accent mt-1 shrink-0" aria-hidden />
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
          <p className="text-body-sm text-text-secondary mt-2">
            By accepting, you (the org_admin) bind your organization to Kiris&apos;s HIPAA Business
            Associate Agreement, version <code className="font-mono">v1.0</code>. We log your
            acceptance with timestamp, IP, full name, job title, and BAA hash.
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
            <div className="flex items-center justify-between gap-4 md:col-span-2">
              <p className="text-body-sm text-text-secondary flex items-center gap-2">
                <ShieldCheck size={14} className="text-accent" aria-hidden />
                BAA stored at <code className="font-mono">/legal/baa-v1.0.pdf</code>
              </p>
              <button
                type="submit"
                disabled={!isOrgAdmin}
                className="bg-accent text-body-md text-text-on-accent duration-state hover:bg-accent-hover inline-flex h-11 items-center gap-2 rounded-md px-5 font-medium shadow-sm transition-colors disabled:opacity-50"
              >
                <KeyRound size={14} aria-hidden /> Accept and upgrade
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      <p className="text-caption text-text-tertiary mt-6">
        After upgrade, MFA is required for editors and above. Your org_admin is prompted to enroll a
        hardware key on next sign-in.
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
      <span className="text-body-sm text-text-primary font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
