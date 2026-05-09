import { Input, Textarea } from "@kiris/ui";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";

export const metadata = { title: "Contact sales" };

export default function ContactSalesPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption uppercase text-accent">Contact sales</p>
            <h1 className="mt-3 text-display-lg">For Enterprise needs only.</h1>
            <p className="mt-5 text-body-lg text-text-secondary">
              Most teams should{" "}
              <a href="/signup" className="underline">
                sign up directly
              </a>{" "}
              — every plan and price is on our{" "}
              <a href="/pricing" className="underline">
                pricing page
              </a>
              . Use this form only if you need volume seat pricing, SSO/SAML, a custom DPA, or a
              premium SLA.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <div className="mx-auto max-w-2xl">
          <form
            className="space-y-5"
            method="post"
            action="/api/contact-sales"
            aria-describedby="contact-help"
          >
            <p id="contact-help" className="text-body-sm text-text-secondary">
              We respond within one business day. We will never sell, share, or use this
              information for any purpose other than responding to your inquiry.
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
              <Textarea id="message" name="message" required minLength={20} />
            </Field>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-5 text-body-md font-medium text-text-on-accent shadow-sm transition-colors duration-state hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
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
      <label htmlFor={htmlFor} className="text-body-sm font-medium text-text-primary">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
