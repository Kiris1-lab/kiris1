import { Container, Card, CardBody } from "@kiris/ui";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { CtaLink } from "@/components/cta-link";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption uppercase text-accent">Customers</p>
            <h1 className="mt-3 text-display-lg">Case studies, soon.</h1>
            <p className="mt-5 text-body-lg text-text-secondary">
              We're working with a small group of design partners through beta. Public case
              studies will land here once those teams have shipped modules into production
              workflows.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <SectionEyebrow>Who we're built for</SectionEyebrow>
        <SectionHeading sub="If you fit one of these profiles, we want to talk.">
          Built for the people who actually build hospital training.
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Persona
            title="Clinical educators"
            body="Nurse educators, infection-control leads, department-level training owners. You write the training other clinicians take."
          />
          <Persona
            title="IT trainers"
            body="EMR rollouts, software change-management, new-equipment onboarding. You ship a lot of training fast."
          />
          <Persona
            title="Compliance & L&D leaders"
            body="Annual mandates, OSHA, HIPAA awareness, JCAHO. You own the calendar and the LMS."
          />
        </div>
      </Section>

      <Section raised>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-md">Become a design partner.</h2>
          <p className="mt-4 text-body-lg text-text-secondary">
            We're issuing one-month credits to early design partners through our admin console.
            Email us if you want to be considered.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <CtaLink href="/contact-sales" size="lg" withArrow>
              Contact sales
            </CtaLink>
            <CtaLink href="/signup" size="lg" variant="secondary">
              Sign up directly
            </CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}

function Persona({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardBody>
        <h3 className="text-heading-md">{title}</h3>
        <p className="mt-2 text-body-md text-text-secondary">{body}</p>
      </CardBody>
    </Card>
  );
}
