import Link from "next/link";
import { Input } from "@kiris/ui";
import { Section } from "@/components/section";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Section>
      <div className="mx-auto max-w-md">
        <h1 className="text-display-md">Log in</h1>
        <p className="text-body-md text-text-secondary mt-3">
          Welcome back. We&apos;ll send you to <code className="text-body-sm">app.kiris.ai</code>{" "}
          after authentication.
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
