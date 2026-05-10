import { Stethoscope, Users, ClipboardCheck } from "lucide-react";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { CtaLink } from "@/components/cta-link";

export const metadata = { title: "Who Kiris is for" };

const PERSONAS = [
  {
    icon: <Stethoscope aria-hidden size={22} />,
    title: "Clinical educators",
    summary:
      "Nurse educators, infection-control leads, department-level training owners. You write the training other clinicians take.",
    before:
      "Last month: Friday night writing a hand-hygiene module in PowerPoint. Saturday recording yourself narrating it. Sunday troubleshooting why HealthStream wouldn't accept the SCORM zip.",
    after:
      "This month: Tuesday morning, between rounds. Drop in last quarter's chart audit, click generate, edit the scenario to match your unit, and ship it. Home by 5.",
  },
  {
    icon: <Users aria-hidden size={22} />,
    title: "IT trainers",
    summary:
      "EMR rollouts, software change-management, new-equipment onboarding. You ship a lot of training fast.",
    before:
      "Eight Epic micro-modules due in three weeks. You're recording screen captures, manually adding captions, and re-rendering every time someone catches a typo.",
    after:
      "Drop in your screen-capture videos and bullet outline. Kiris writes the matching script, generates captions, and packages SCORM. You spend the freed time on the things that need a human.",
  },
  {
    icon: <ClipboardCheck aria-hidden size={22} />,
    title: "Compliance & L&D leaders",
    summary: "Annual mandates, OSHA, HIPAA awareness, JCAHO. You own the calendar and the LMS.",
    before:
      "October. Twenty-three mandates due by January. You're juggling vendors, instructional designers, and the LMS team. Half of last year's modules need re-recording for accessibility.",
    after:
      "October. You generate the year's modules in two afternoons, hand them to your educators for clinical review, and have everything WCAG 2.2 AA before Thanksgiving.",
  },
];

export default function CustomersPage() {
  return (
    <>
      <Section tone="base" density="spacious">
        <div className="max-w-3xl">
          <SectionEyebrow>Who Kiris is for</SectionEyebrow>
          <h1 className="text-display-lg text-text-primary mt-3">
            Built for the people who actually build hospital training
          </h1>
          <p className="text-body-lg text-text-secondary mt-5">
            Most hospital training is built by people whose primary job isn&apos;t building
            training. Kiris is the tool that respects that.
          </p>
        </div>
      </Section>

      {PERSONAS.map((persona, i) => (
        <Section key={persona.title} tone={i % 2 === 0 ? "raised" : "base"}>
          <div className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-16">
            <div>
              <span className="bg-accent-soft text-accent inline-flex h-12 w-12 items-center justify-center rounded-md">
                {persona.icon}
              </span>
              <h2 className="text-heading-xl text-text-primary mt-5">{persona.title}</h2>
              <p className="text-body-md text-text-secondary mt-3 max-w-md">{persona.summary}</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <p className="text-caption text-text-tertiary uppercase tracking-wider">
                  A week before Kiris
                </p>
                <p className="text-body-md text-text-secondary mt-3">{persona.before}</p>
              </div>
              <div className="border-border-subtle border-l-0 md:border-l md:pl-8">
                <p className="text-caption text-accent uppercase tracking-wider">
                  A week with Kiris
                </p>
                <p className="text-body-md text-text-primary mt-3">{persona.after}</p>
              </div>
            </div>
          </div>
        </Section>
      ))}

      <Section tone="inverse" density="spacious">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-md text-on-inverse">Become a design partner.</h2>
          <p className="text-body-lg text-on-inverse/80 mt-4">
            We&apos;re issuing one-month credits to early design partners. We&apos;re especially
            looking for clinical educators, IT trainers, and compliance leads at US hospitals
            shipping into HealthStream, Cornerstone, or Relias.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaLink href="/contact-sales" size="lg" withArrow>
              Apply to be a design partner
            </CtaLink>
            <CtaLink href="/signup" size="lg" variant="secondary">
              Or just sign up
            </CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}
