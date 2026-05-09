import Link from "next/link";
import { Card, CardBody } from "@kiris/ui";
import { ArrowRight, Sparkles, Workflow } from "lucide-react";

export const metadata = { title: "New module" };

export default function NewModulePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-caption uppercase text-text-tertiary">New module</p>
      <h1 className="mt-1 text-display-md">How would you like to start?</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        Both modes produce export-ready output. You can switch later.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ModeCard
          href="/new/express"
          icon={<Sparkles size={20} aria-hidden />}
          title="Express AI"
          subtitle="Drop materials. Click generate."
          body="Best when you have rough materials and a clear audience. Kiris produces a complete narrated module in 60–180 seconds."
          recommended
        />
        <ModeCard
          href="/new/guided"
          icon={<Workflow size={20} aria-hidden />}
          title="Guided AI"
          subtitle="Build the outline. AI polishes."
          body="Best when you want to control structure. Use ✨ helpers per field; press 'Polish all' for a final pass."
        />
      </div>

      <p className="mt-8 text-body-sm text-text-tertiary">
        Standard tier: PHI is prohibited and pre-filtered before generation. Need PHI? Ask your
        org_admin to upgrade to the HIPAA tier.
      </p>
    </div>
  );
}

function ModeCard({
  href,
  icon,
  title,
  subtitle,
  body,
  recommended = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  body: string;
  recommended?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-lg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
    >
      <Card className="h-full transition-colors duration-state group-hover:border-accent">
        <CardBody className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
              {icon}
            </div>
            {recommended ? (
              <span className="text-caption uppercase text-accent">Recommended</span>
            ) : null}
          </div>
          <h2 className="mt-4 text-heading-lg">{title}</h2>
          <p className="text-body-sm text-text-tertiary">{subtitle}</p>
          <p className="mt-3 flex-1 text-body-md text-text-secondary">{body}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-body-sm font-medium text-accent">
            Start with {title}
            <ArrowRight size={14} aria-hidden />
          </span>
        </CardBody>
      </Card>
    </Link>
  );
}
