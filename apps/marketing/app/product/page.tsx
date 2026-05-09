import { Container } from "@kiris/ui";
import {
  Brain,
  Edit3,
  FileCheck2,
  GraduationCap,
  Layers,
  ListChecks,
  Mic,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";
import { CtaLink } from "@/components/cta-link";

export const metadata = { title: "Product" };

export default function ProductPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption text-accent uppercase">Product</p>
            <h1 className="text-display-lg mt-3">
              Everything a clinical educator needs. Nothing they don&apos;t.
            </h1>
            <p className="text-body-lg text-text-secondary mt-5">
              Kiris is a focused authoring tool that turns rough materials into polished, narrated,
              SCORM-ready modules. Two AI authoring modes, one polished output, real learning
              science under the hood.
            </p>
            <div className="mt-8 flex gap-3">
              <CtaLink href="/signup" size="lg" withArrow>
                Get started
              </CtaLink>
              <CtaLink href="/pricing" size="lg" variant="secondary">
                See pricing
              </CtaLink>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <SectionEyebrow>Authoring</SectionEyebrow>
        <SectionHeading sub="Pick the workflow that fits the task. Both produce export-ready output.">
          Two authoring modes. One polished output.
        </SectionHeading>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <FeatureBlock
            icon={<Sparkles aria-hidden size={20} />}
            kicker="Express AI"
            title="Drop in materials, get a complete module."
            body="Title, materials, audience, goal. Click generate. Kiris builds the outline, slides, narration, knowledge checks, and an in-your-shoes scenario in 60–180 seconds."
            bullets={[
              "Bloom's-taxonomy-aware learning objectives",
              "Mayer's 12 multimedia principles applied automatically",
              "Knowledge checks every 2–3 minutes",
              "AI critic pass rejects cluttered or off-topic slides",
            ]}
          />
          <FeatureBlock
            icon={<Workflow aria-hidden size={20} />}
            kicker="Guided AI"
            title="Build the outline yourself. AI polishes on demand."
            body="A blank outline tree, drag-to-reorder, inline ✨ helpers on every field. Click 'Polish all' when you want a full pass for consistency, transitions, and accessibility."
            bullets={[
              "Outline tree with sections, slides, drag-to-reorder",
              "Per-field AI helpers: polish, regenerate, shorten, plain-language, translate",
              "Asset library with crop, annotate, hotspots",
              "Add interactive moments anywhere",
            ]}
          />
        </div>
      </Section>

      <Section raised>
        <SectionEyebrow>Editor</SectionEyebrow>
        <SectionHeading sub="Both modes converge in the same editor — direct manipulation, keyboard-first, accessible by default.">
          Where the work actually happens.
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureBullet
            icon={<Layers aria-hidden size={18} />}
            title="3-column layout"
            body="Outline on the left, slide canvas in the middle, properties + AI helpers on the right. Collapsible rails."
          />
          <FeatureBullet
            icon={<Edit3 aria-hidden size={18} />}
            title="Direct-manipulation editing"
            body="Click text to edit. Drag to reorder. Cmd/Ctrl-Z everywhere."
          />
          <FeatureBullet
            icon={<Mic aria-hidden size={18} />}
            title="Clinical-grade narration"
            body="AWS Polly Neural and Generative voices. Regenerate per-slide; preview audio with timestamps."
          />
          <FeatureBullet
            icon={<ListChecks aria-hidden size={18} />}
            title="Knowledge checks"
            body="Single-choice, multi-choice, true/false, drag-match, branching scenarios. Plausible distractors generated automatically."
          />
          <FeatureBullet
            icon={<Brain aria-hidden size={18} />}
            title="In-your-shoes moments"
            body="Every Kiris module includes at least one branching scenario. Adult-learning research is consistent: scenarios drive retention."
          />
          <FeatureBullet
            icon={<ShieldCheck aria-hidden size={18} />}
            title="WCAG 2.2 AA"
            body="Authoring app and exported modules both meet AA. Captions, alt text, color-independent meaning."
          />
        </div>
      </Section>

      <Section>
        <SectionEyebrow>Pedagogy</SectionEyebrow>
        <SectionHeading sub="Every module Kiris generates follows a structure grounded in research: hook, objectives, microlearning segments, application, summary, final knowledge check.">
          Modules built on real learning science.
        </SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <PrincipleCard
            icon={<GraduationCap aria-hidden size={20} />}
            title="Microlearning structure"
            body="3–5 segments of 2–4 minutes each. Working memory holds about 7 items; modules respect that."
          />
          <PrincipleCard
            icon={<Brain aria-hidden size={20} />}
            title="Mayer's principles"
            body="Coherence, signaling, redundancy, modality, contiguity, personalization — applied at generation time."
          />
          <PrincipleCard
            icon={<FileCheck2 aria-hidden size={20} />}
            title="Plain language by default"
            body="Flesch reading ease ≥ 60. Clinical terminology preserved where appropriate; surrounding language stays accessible."
          />
        </div>
      </Section>

      <Section raised>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-md">A polished module, before lunch.</h2>
          <p className="text-body-lg text-text-secondary mt-4">
            Card required at signup. No contracts. Cancel anytime.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <CtaLink href="/signup" size="lg" withArrow>
              Get started
            </CtaLink>
            <CtaLink href="/pricing" size="lg" variant="secondary">
              See pricing
            </CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}

function FeatureBlock({
  icon,
  kicker,
  title,
  body,
  bullets,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <div className="border-border-subtle bg-surface-raised rounded-lg border p-8 shadow-sm">
      <div className="text-accent flex items-center gap-3">
        <span className="bg-accent-soft flex h-9 w-9 items-center justify-center rounded-md">
          {icon}
        </span>
        <span className="text-caption uppercase">{kicker}</span>
      </div>
      <h3 className="text-heading-xl mt-4">{title}</h3>
      <p className="text-body-md text-text-secondary mt-3">{body}</p>
      <ul className="text-body-md text-text-secondary mt-6 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureBullet({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="bg-accent-soft text-accent flex h-9 w-9 items-center justify-center rounded-md">
        {icon}
      </div>
      <h3 className="text-heading-md mt-4">{title}</h3>
      <p className="text-body-md text-text-secondary mt-2">{body}</p>
    </div>
  );
}

function PrincipleCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="border-border-subtle bg-surface-raised rounded-lg border p-6 shadow-sm">
      <div className="bg-accent-soft text-accent flex h-9 w-9 items-center justify-center rounded-md">
        {icon}
      </div>
      <h3 className="text-heading-md mt-4">{title}</h3>
      <p className="text-body-md text-text-secondary mt-2">{body}</p>
    </div>
  );
}
