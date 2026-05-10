import Link from "next/link";
import { Check } from "lucide-react";
import { Input } from "@kiris/ui";
import { Section } from "@/components/section";

export const metadata = { title: "Get started" };

export default function SignupPage() {
  return (
    <Section tone="base" density="spacious">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
        {/* Left — form */}
        <div className="max-w-md">
          <h1 className="text-display-md text-text-primary">Create your Kiris account.</h1>
          <p className="text-body-md text-text-secondary mt-3">
            Card required. First charge is the next month&apos;s seat subscription.
          </p>

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
              Create my account
            </button>
          </form>

          <p className="text-body-sm text-text-secondary mt-6">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
            .
          </p>

          {/* FOUNDER REVIEW: PHI-prohibited banner moved from prominent to
              footer-link. Confirm legal sufficiency. The full PHI prohibition
              still lives in our Terms and is enforced by the PHI scrubber on
              every input; this surface previously fronted that warning to all
              prospective customers. */}
          <p className="text-caption text-text-tertiary mt-5">
            Need to handle Protected Health Information? Our Enterprise plan includes a BAA —{" "}
            <Link href="/contact-sales" className="text-accent underline-offset-2 hover:underline">
              talk to sales
            </Link>
            .
          </p>
          <p className="text-caption text-text-tertiary mt-2">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Right — reassurance panel (hidden on mobile) */}
        <aside className="hidden md:block">
          <div className="border-border-subtle bg-surface-raised rounded-xl border p-6 shadow-sm md:p-8">
            <p className="text-caption text-text-tertiary uppercase tracking-wider">
              From a clinical educator
            </p>
            {/* TODO: real customer quote */}
            <blockquote className="text-heading-md text-text-primary mt-4">
              &ldquo;Built our hand-hygiene refresher on a Tuesday afternoon between rounds. The
              SCORM uploaded into HealthStream first try.&rdquo;
            </blockquote>
            <p className="text-body-sm text-text-tertiary mt-4">
              — placeholder until we have a real one we&apos;re allowed to publish
            </p>
          </div>
          <ul className="mt-8 space-y-4">
            <Reassurance>Pay per seat. Start with 3, scale anytime.</Reassurance>
            <Reassurance>Cancel anytime in the customer portal. No phone calls.</Reassurance>
            <Reassurance>WCAG 2.2 AA enforced on every export.</Reassurance>
            <Reassurance>BAAs and customer-managed keys available on Enterprise.</Reassurance>
          </ul>
        </aside>
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

function Reassurance({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="bg-accent-soft text-accent mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
      >
        <Check size={14} />
      </span>
      <span className="text-body-md text-text-primary">{children}</span>
    </li>
  );
}
