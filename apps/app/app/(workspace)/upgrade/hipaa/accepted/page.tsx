import Link from "next/link";
import { Banner, Card, CardBody, TierBadge } from "@kiris/ui";

export const metadata = { title: "HIPAA upgrade accepted" };

export default function HipaaAcceptedPage({
  searchParams,
}: {
  searchParams: Promise<{ fullName?: string; jobTitle?: string }>;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <TierBadge tier="hipaa" />
      <h1 className="text-display-md mt-3">You&apos;re on the HIPAA tier.</h1>
      <p className="text-body-md text-text-secondary mt-2">
        BAA <code>v1.0</code> accepted. Pro-rated charge applied. Tier badge flipped across the app.
        New module routes use HIPAA-scoped storage.
      </p>

      <Banner variant="success" className="mt-8" title="MFA required for editors">
        Your org_admin and every editor will be prompted to enroll a hardware key on their next
        sign-in.
      </Banner>

      <Card className="mt-6">
        <CardBody>
          <h2 className="text-heading-md">What happens behind the scenes</h2>
          <ul className="text-body-md text-text-secondary mt-4 space-y-2">
            <li>· A per-tenant KMS CMK is allocated and attached to your S3 prefix.</li>
            <li>
              · Future AI calls route to the BAA-covered Anthropic org with Zero Data Retention.
            </li>
            <li>· Audit log retention is extended to 6 years.</li>
            <li>
              · The PHI scrubber switches from blocking to routing PHI to HIPAA-scoped storage.
            </li>
          </ul>
        </CardBody>
      </Card>

      <div className="mt-8">
        <Link
          href="/"
          className="bg-accent text-body-md text-text-on-accent hover:bg-accent-hover inline-flex h-10 items-center rounded-md px-4 font-medium shadow-sm"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
