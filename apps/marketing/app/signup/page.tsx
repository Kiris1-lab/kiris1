import Link from "next/link";
import { Input, Banner, TierBadge } from "@kiris/ui";
import { Section } from "@/components/section";

export const metadata = { title: "Get started" };

export default function SignupPage() {
  return (
    <Section>
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <h1 className="text-display-md">Get started</h1>
          <TierBadge tier="standard" />
        </div>
        <p className="text-body-md text-text-secondary mt-3">
          Card required. First charge is immediate. No trial — month-to-month with cancel-anytime
          serves as the trial.
        </p>

        <Banner variant="info" className="mt-6" title="No PHI on Standard tier">
          The Standard tier prohibits Protected Health Information. Our PHI scrubber will block
          high-confidence detections. Need PHI? Upgrade to HIPAA tier in-app once you&apos;re signed
          in.
        </Banner>

        <form
          className="mt-8 space-y-5"
          method="post"
          action="/api/signup"
          aria-describedby="signup-help"
        >
          <p id="signup-help" className="text-body-sm text-text-secondary">
            We will never sell, share, or use your account information for any purpose other than
            providing the service.
          </p>

          <Field label="Work email" htmlFor="email">
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </Field>
          <Field label="Your name" htmlFor="name">
            <Input id="name" name="name" type="text" required autoComplete="name" />
          </Field>
          <Field label="Organization" htmlFor="org">
            <Input id="org" name="org" type="text" required autoComplete="organization" />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={12}
              autoComplete="new-password"
              aria-describedby="password-help"
            />
            <p id="password-help" className="text-caption text-text-tertiary mt-1.5">
              Minimum 12 characters. We hash with bcrypt; we never store plaintext.
            </p>
          </Field>

          <button
            type="submit"
            className="bg-accent text-body-md text-text-on-accent duration-state hover:bg-accent-hover inline-flex h-11 w-full items-center justify-center rounded-md px-5 font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          >
            Continue to plan selection
          </button>
        </form>

        <p className="text-body-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
          .
        </p>
        <p className="text-caption text-text-tertiary mt-2">
          By signing up you agree to our Terms of Service and Privacy Policy. PHI is prohibited on
          the Standard tier.
        </p>
      </div>
    </Section>
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
    <div>
      <label htmlFor={htmlFor} className="text-body-sm text-text-primary font-medium">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
