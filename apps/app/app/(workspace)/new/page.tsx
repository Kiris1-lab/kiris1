import Link from "next/link";
import { Card, CardBody } from "@kiris/ui";
import { ArrowRight, Sparkles, Workflow } from "lucide-react";

export const metadata = { title: "New module" };

export default function NewModulePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-caption text-text-tertiary uppercase">New module</p>
      <h1 className="text-display-md mt-1">How would you like to start?</h1>
      <p className="text-body-md text-text-secondary mt-2">
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

      <p className="text-body-sm text-text-tertiary mt-8">
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
      <Card className="duration-state group-hover:border-accent h-full transition-colors">
        <CardBody className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <div className="bg-accent-soft text-accent flex h-10 w-10 items-center justify-center rounded-md">
              {icon}
            </div>
            {recommended ? (
              <span className="text-caption text-accent uppercase">Recommended</span>
            ) : null}
          </div>
          <h2 className="text-heading-lg mt-4">{title}</h2>
          <p className="text-body-sm text-text-tertiary">{subtitle}</p>
          <p className="text-body-md text-text-secondary mt-3 flex-1">{body}</p>
          <span className="text-body-sm text-accent mt-6 inline-flex items-center gap-2 font-medium">
            Start with {title}
            <ArrowRight size={14} aria-hidden />
          </span>
        </CardBody>
      </Card>
    </Link>
  );
}
