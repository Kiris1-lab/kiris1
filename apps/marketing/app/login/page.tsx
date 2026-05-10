import Link from "next/link";
import { Check } from "lucide-react";
import { Input } from "@kiris/ui";
import { Section } from "@/components/section";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Section tone="base" density="spacious">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div className="max-w-md">
          <h1 className="text-display-md text-text-primary">Welcome back</h1>
          <p className="text-body-md text-text-secondary mt-3">
            We&apos;ll send you to <code className="text-body-sm">app.kiris.ai</code> after
            authentication.
          </p>

          <form className="mt-8 space-y-5" method="post" action="/api/login">
            <Field label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </Field>
            <button
              type="submit"
              className="bg-accent text-body-md text-text-on-accent duration-state hover:bg-accent-hover inline-flex h-11 w-full items-center justify-center rounded-md px-5 font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              Log in
            </button>
          </form>

          <p className="text-body-sm text-text-secondary mt-6">
            New here?{" "}
            <Link href="/signup" className="underline">
              Get started
            </Link>
            .
          </p>
        </div>

        <aside className="hidden md:block">
          <div className="border-border-subtle bg-surface-raised rounded-xl border p-6 shadow-sm md:p-8">
            <p className="text-caption text-text-tertiary uppercase tracking-wider">
              Trouble signing in?
            </p>
            <ul className="mt-4 space-y-3">
              <li className="text-body-md text-text-secondary">
                Use the email address you signed up with.
              </li>
              <li className="text-body-md text-text-secondary">
                Forgot your password? Click the link below the form on the next screen.
              </li>
              <li className="text-body-md text-text-secondary">
                Still stuck? Email{" "}
                <a
                  className="text-accent underline-offset-2 hover:underline"
                  href="mailto:support@kiris.ai"
                >
                  support@kiris.ai
                </a>
                .
              </li>
            </ul>
          </div>
          <ul className="mt-8 space-y-4">
            <Reassurance>Pay per seat. Cancel anytime.</Reassurance>
            <Reassurance>WCAG 2.2 AA on every export.</Reassurance>
            <Reassurance>HIPAA-ready · BAAs on Enterprise.</Reassurance>
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
