import { Card, CardBody, cn } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";

export const metadata = { title: "Integrations" };

type Status = "tested" | "compatible" | "roadmap";

const LMSs: { name: string; note: string; status: Status }[] = [
  { name: "HealthStream", note: "SCORM 1.2 priority. Tested against sandbox.", status: "tested" },
  { name: "Cornerstone OnDemand", note: "SCORM 1.2 + xAPI.", status: "tested" },
  { name: "Relias", note: "SCORM 1.2.", status: "tested" },
  { name: "Workday Learning", note: "SCORM 1.2 + xAPI.", status: "compatible" },
  { name: "SAP SuccessFactors", note: "SCORM 1.2.", status: "compatible" },
  { name: "Saba / Cornerstone Cloud", note: "SCORM 1.2 + xAPI.", status: "compatible" },
  { name: "Moodle", note: "SCORM 1.2 + xAPI.", status: "compatible" },
  { name: "Canvas / Blackboard", note: "SCORM 1.2 today, LTI 1.3 in v2.", status: "roadmap" },
];

const FORMATS = [
  { name: "SCORM 1.2", note: "Broadest LMS support including HealthStream. Priority format." },
  { name: "SCORM 2004 4th Edition", note: "Better sequencing rules; for Cornerstone and others." },
  { name: "xAPI (Tin Can)", note: "Modern statement-based tracking; preferred by some LMSs." },
  { name: "MP4", note: "For video-only LMSs and stand-alone playback." },
  { name: "HTML5 ZIP", note: "Direct hosting outside any LMS." },
];

export default function IntegrationsPage() {
  return (
    <>
      <Section tone="base" density="spacious">
        <div className="max-w-3xl">
          <SectionEyebrow>Integrations</SectionEyebrow>
          <h1 className="text-display-lg text-text-primary mt-3">
            Works with the LMS you already have
          </h1>
          <p className="text-body-lg text-text-secondary mt-5">
            Kiris exports the same five formats every time, so you&apos;re never locked in. SCORM
            1.2 is our priority format and is tested against an actual HealthStream sandbox before
            every release.
          </p>
        </div>
      </Section>

      <Section tone="base">
        <SectionEyebrow>LMSs</SectionEyebrow>
        <SectionHeading sub="Hospitals overwhelmingly run one of a handful of LMSs. Kiris exports cleanly to all of them.">
          LMSs we test against.
        </SectionHeading>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {LMSs.map((lms) => (
            <Card key={lms.name}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-heading-sm">{lms.name}</h3>
                  <StatusPill status={lms.status} />
                </div>
                <p className="text-body-sm text-text-secondary mt-2">{lms.note}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="raised">
        <SectionEyebrow>Formats</SectionEyebrow>
        <SectionHeading>Export formats.</SectionHeading>
        <ul className="border-border-subtle mt-12 divide-y border-y">
          {FORMATS.map((f) => (
            <li
              key={f.name}
              className="grid items-start gap-2 py-5 md:grid-cols-[12rem_1fr] md:gap-8"
            >
              <p className="text-heading-sm text-text-primary">{f.name}</p>
              <p className="text-body-md text-text-secondary">{f.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Roadmap</SectionEyebrow>
        <SectionHeading sub="Direct LMS push lands in v2 — HealthStream first.">
          Beyond file export.
        </SectionHeading>
        <ul className="text-body-md text-text-secondary mt-12 max-w-3xl space-y-4">
          <li>
            <strong className="text-text-primary">HealthStream API push (v2):</strong> publish
            modules without leaving Kiris.
          </li>
          <li>
            <strong className="text-text-primary">Cornerstone API push (v2):</strong> same for
            Cornerstone admins.
          </li>
          <li>
            <strong className="text-text-primary">LTI 1.3 (v2):</strong> for Canvas, Blackboard, and
            Moodle deployments.
          </li>
        </ul>
      </Section>

      <Section tone="sunken">
        <div className="border-border-subtle bg-surface-raised mx-auto max-w-3xl rounded-xl border p-8 text-center shadow-sm md:p-12">
          <h2 className="text-heading-xl text-text-primary">Don&apos;t see your LMS?</h2>
          <p className="text-body-md text-text-secondary mt-3">
            Tell us which one and we&apos;ll confirm compatibility before you sign up. Most modern
            hospital LMSs accept at least one of our formats — we&apos;ll save you the
            trial-and-error.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CtaLink href="/contact-sales" withArrow>
              Tell us your LMS
            </CtaLink>
            <CtaLink href="/signup" variant="secondary">
              Start without one
            </CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; className: string }> = {
    tested: {
      label: "Tested",
      className: "bg-accent-soft text-accent",
    },
    compatible: {
      label: "Compatible",
      className: "bg-surface-sunken text-text-secondary border border-border-subtle",
    },
    roadmap: {
      label: "Roadmap",
      className: "bg-highlight-soft text-highlight",
    },
  };
  const variant = map[status];
  return (
    <span
      className={cn(
        "text-caption inline-flex items-center rounded-full px-2.5 py-0.5 font-medium uppercase tracking-wider",
        variant.className,
      )}
    >
      {variant.label}
    </span>
  );
}
