import { Container, cn } from "@kiris/ui";
import type { ReactNode } from "react";

export function Section({
  children,
  className,
  raised = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  raised?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-24",
        raised ? "bg-surface-raised border-y border-border-subtle" : "",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="text-caption uppercase text-accent">{children}</p>;
}

export function SectionHeading({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-display-md text-text-primary">{children}</h2>
      {sub ? <p className="mt-4 text-body-lg text-text-secondary">{sub}</p> : null}
    </div>
  );
}
