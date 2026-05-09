import { Container, Card, CardBody, Badge } from "@kiris/ui";
import Link from "next/link";
import { Section, SectionEyebrow, SectionHeading } from "@/components/section";

export const metadata = { title: "Blog" };

const posts: { slug: string; title: string; excerpt: string; tag: string; date: string }[] = [
  {
    slug: "microlearning-for-hospital-training",
    title: "Microlearning, working memory, and why your annual mandates feel painful",
    excerpt:
      "How research from Sweller and Mayer maps to the way you actually run hospital training — and what to do about it.",
    tag: "Pedagogy",
    date: "Coming soon",
  },
  {
    slug: "ehr-rollout-training-without-burnout",
    title: "EHR rollout training without burning out the educators",
    excerpt:
      "Why a SCORM-first authoring tool changes the math on Epic and Cerner go-lives.",
    tag: "Workflow",
    date: "Coming soon",
  },
  {
    slug: "what-counts-as-phi-in-training-content",
    title: "What counts as PHI in training content (and what doesn't)",
    excerpt:
      "A practical guide for clinical educators deciding whether their next module needs HIPAA tier.",
    tag: "Compliance",
    date: "Coming soon",
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <section className="bg-surface-base">
        <Container>
          <div className="max-w-3xl py-20">
            <p className="text-caption uppercase text-accent">Blog</p>
            <h1 className="mt-3 text-display-lg">Notes for clinical educators.</h1>
            <p className="mt-5 text-body-lg text-text-secondary">
              We write for the people who actually ship training. Long-form, no fluff,
              evidence-based.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <SectionEyebrow>Latest</SectionEyebrow>
        <SectionHeading>Articles</SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug}>
              <CardBody>
                <Badge variant="neutral">{post.tag}</Badge>
                <h2 className="mt-3 text-heading-md">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors duration-state hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-body-md text-text-secondary">{post.excerpt}</p>
                <p className="mt-4 text-caption text-text-tertiary">{post.date}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
