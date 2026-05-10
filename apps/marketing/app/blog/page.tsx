import { Mail } from "lucide-react";
import { Input } from "@kiris/ui";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";

export const metadata = { title: "Blog" };

const PLANNED = [
  {
    title: "Microlearning, working memory, and why your annual mandates feel painful",
    tag: "Pedagogy",
  },
  {
    title: "EHR rollout training without burning out the educators",
    tag: "Workflow",
  },
  {
    title: "What counts as PHI in training content (and what doesn't)",
    tag: "Compliance",
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <Section tone="base" density="spacious">
        <div className="max-w-3xl">
          <SectionEyebrow>Blog</SectionEyebrow>
          <h1 className="text-display-lg text-text-primary mt-3">Notes for clinical educators</h1>
          <p className="text-body-lg text-text-secondary mt-5">
            We write for the people who actually ship training. Long-form, no fluff, evidence-based.
          </p>
        </div>
      </Section>

      <Section tone="raised">
        <div className="border-border-subtle bg-surface-base mx-auto max-w-3xl rounded-xl border p-8 md:p-10">
          <div className="flex items-center gap-3">
            <span className="bg-highlight-soft text-highlight inline-flex h-10 w-10 items-center justify-center rounded-md">
              <Mail aria-hidden size={20} />
            </span>
            <p className="text-caption text-highlight uppercase tracking-wider">
              First posts coming soon
            </p>
          </div>
          <h2 className="text-heading-xl text-text-primary mt-5">
            We&apos;re publishing our first posts soon. Want them in your inbox?
          </h2>
          <p className="text-body-md text-text-secondary mt-2">
            One practical post a month on hospital training. No fluff. Unsubscribe in one click.
          </p>
          <form
            method="post"
            action="/api/newsletter"
            className="mt-6 flex w-full flex-col gap-2 sm:flex-row"
            aria-label="Newsletter signup"
          >
            <label htmlFor="blog-newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="blog-newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@hospital.org"
              className="flex-1"
            />
            <button
              type="submit"
              className="bg-accent text-text-on-accent text-body-md duration-state hover:bg-accent-hover inline-flex h-10 items-center justify-center rounded-md px-4 font-medium shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </Section>

      <Section tone="base">
        <SectionEyebrow>Planned topics</SectionEyebrow>
        <SectionHeading sub="What we're writing toward. Suggestions welcome — email blog@kiris.ai.">
          On the editorial calendar.
        </SectionHeading>
        <ul className="border-border-subtle mt-12 max-w-3xl divide-y border-y">
          {PLANNED.map((post) => (
            <li key={post.title} className="flex items-baseline justify-between gap-4 py-5">
              <p className="text-heading-sm text-text-primary">{post.title}</p>
              <span className="text-caption text-text-tertiary shrink-0 uppercase tracking-wider">
                {post.tag}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
