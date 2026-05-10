import { Input, Textarea } from "@kiris/ui";
import { Section, SectionEyebrow } from "@/components/section";

export const metadata = { title: "Talk to sales" };

const STEPS = [
  { n: 1, label: "We respond within one business day." },
  { n: 2, label: "30-minute call to understand your needs." },
  { n: 3, label: "Custom proposal within 48 hours." },
];

export default function ContactSalesPage() {
  return (
    <>
      <Section tone="base" density="spacious">
        <div className="max-w-3xl">
          <SectionEyebrow>Talk to sales</SectionEyebrow>
          <h1 className="text-display-lg text-text-primary mt-3">Talk to us about Enterprise</h1>
          <p className="text-body-lg text-text-secondary mt-5">
            Most teams should{" "}
            <a href="/signup" className="underline underline-offset-2">
              sign up directly
            </a>{" "}
            — every plan and rate is on our{" "}
            <a href="/pricing" className="underline underline-offset-2">
              pricing page
            </a>
            . Use this form if you need volume seat pricing, BAAs, SAML SSO, custom data residency,
            or a premium SLA.
          </p>
        </div>
      </Section>

      <Section tone="base">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <p className="text-caption text-accent uppercase tracking-wider">
              What happens after you submit
            </p>
            <ol className="mt-6 space-y-5">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span
                    aria-hidden
                    className="bg-accent-soft text-accent text-body-sm inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold tabular-nums"
                  >
                    {step.n}
                  </span>
                  <p className="text-body-md text-text-primary mt-1">{step.label}</p>
                </li>
              ))}
            </ol>
            <p className="text-body-sm text-text-secondary mt-10">
              We will never sell, share, or use this information for any purpose other than
              responding to your inquiry.
            </p>
          </div>

          <form
            className="space-y-5"
            method="post"
            action="/api/contact-sales"
            aria-describedby="contact-help"
          >
            <p id="contact-help" className="sr-only">
              Contact sales form
            </p>
            <Field label="Work email" htmlFor="email">
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </Field>
            <Field label="Full name" htmlFor="name">
              <Input id="name" name="name" type="text" required autoComplete="name" />
            </Field>
            <Field label="Organization" htmlFor="org">
              <Input id="org" name="org" type="text" required autoComplete="organization" />
            </Field>
            <Field label="Approximate seat count" htmlFor="seats">
              <Input id="seats" name="seats" type="number" min={1} />
            </Field>
            <Field label="What are you looking to do?" htmlFor="message">
              <Textarea id="message" name="message" required minLength={20} rows={5} />
            </Field>

            <button
              type="submit"
              className="bg-accent text-body-md text-text-on-accent duration-state hover:bg-accent-hover inline-flex h-11 items-center justify-center rounded-md px-6 font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              Send to sales
            </button>
          </form>
        </div>
      </Section>
    </>
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
