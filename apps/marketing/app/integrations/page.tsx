import { Container, Card, CardBody, Badge } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";

export const metadata = { title: "Integrations" };

const LMSs = [
  { name: "HealthStream", note: "SCORM 1.2 priority. Tested against sandbox." },
  { name: "Cornerstone OnDemand", note: "SCORM 1.2 + xAPI." },
  { name: "Relias", note: "SCORM 1.2." },
  { name: "Workday Learning", note: "SCORM 1.2 + xAPI." },
  { name: "SAP SuccessFactors", note: "SCORM 1.2." },
  { name: "Saba / Cornerstone Cloud", note: "SCORM 1.2 + xAPI." },
  { name: "Moodle", note: "SCORM 1.2 + xAPI." },
  { name: "Canvas / Blackboard", note: "SCORM 1.2 + LTI 1.3 (roadmap)." },
];

const formats = [
  { name: "SCORM 1.2", note: "Broadest LMS support including HealthStream. Priority format." },
  { name: "SCORM 2004 4th Edition", note: "Better sequencing rules; for Cornerstone and others." },
  { name: "xAPI (Tin Can)", note: "Modern statement-based tracking; preferred by some LMSs." },
  { name: "MP4", note: "For video-only LMSs and stand-alone playback." },
  { name: "HTML5 ZIP", note: "Direct hosting outside any LMS." },
];

export default function IntegrationsPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption uppercase text-accent">Integrations</p>
            <h1 className="mt-3 text-display-lg">Works with the LMS you already have.</h1>
            <p className="mt-5 text-body-lg text-text-secondary">
              Kiris exports the same five formats every time, so you're never locked in.
              SCORM 1.2 is our priority format and is tested against an actual HealthStream
              sandbox before every release.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <SectionEyebrow>LMSs</SectionEyebrow>
        <SectionHeading sub="Hospitals overwhelmingly run one of a handful of LMSs. Kiris exports cleanly to all of them.">
          LMSs we test against
        </SectionHeading>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {LMSs.map((lms) => (
            <Card key={lms.name}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-sm">{lms.name}</h3>
                </div>
                <p className="mt-2 text-body-sm text-text-secondary">{lms.note}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section raised>
        <SectionEyebrow>Formats</SectionEyebrow>
        <SectionHeading>Export formats</SectionHeading>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {formats.map((format) => (
            <Card key={format.name}>
              <CardBody>
                <Badge variant="neutral">Format</Badge>
                <h3 className="mt-3 text-heading-md">{format.name}</h3>
                <p className="mt-2 text-body-md text-text-secondary">{format.note}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionEyebrow>Roadmap</SectionEyebrow>
        <SectionHeading sub="Direct LMS push lands in v2 — HealthStream first.">
          Beyond file export
        </SectionHeading>
        <ul className="mt-12 space-y-4 text-body-md text-text-secondary">
          <li>
            <strong>HealthStream API push (v2):</strong> publish modules without leaving Kiris.
          </li>
          <li>
            <strong>Cornerstone API push (v2):</strong> same for Cornerstone admins.
          </li>
          <li>
            <strong>LTI 1.3 (v2):</strong> for Canvas, Blackboard, and Moodle deployments.
          </li>
        </ul>
        <div className="mt-10">
          <CtaLink href="/contact-sales" variant="secondary" withArrow>
            Don't see your LMS? Tell us
          </CtaLink>
        </div>
      </Section>
    </>
  );
}
