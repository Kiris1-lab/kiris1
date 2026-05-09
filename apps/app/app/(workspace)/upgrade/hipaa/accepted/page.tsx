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
      <h1 className="mt-3 text-display-md">You're on the HIPAA tier.</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        BAA <code>v1.0</code> accepted. Pro-rated charge applied. Tier badge
        flipped across the app. New module routes use HIPAA-scoped storage.
      </p>

      <Banner variant="success" className="mt-8" title="MFA required for editors">
        Your org_admin and every editor will be prompted to enroll a hardware
        key on their next sign-in.
      </Banner>

      <Card className="mt-6">
        <CardBody>
          <h2 className="text-heading-md">What happens behind the scenes</h2>
          <ul className="mt-4 space-y-2 text-body-md text-text-secondary">
            <li>· A per-tenant KMS CMK is allocated and attached to your S3 prefix.</li>
            <li>· Future AI calls route to the BAA-covered Anthropic org with Zero Data Retention.</li>
            <li>· Audit log retention is extended to 6 years.</li>
            <li>· The PHI scrubber switches from blocking to routing PHI to HIPAA-scoped storage.</li>
          </ul>
        </CardBody>
      </Card>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-body-md font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
