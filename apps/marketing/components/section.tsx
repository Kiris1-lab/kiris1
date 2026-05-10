import { Container, cn } from "@kiris/ui";
import type { ReactNode } from "react";

export type SectionTone = "base" | "raised" | "sunken" | "inverse";
export type SectionDensity = "comfortable" | "spacious";

const toneClasses: Record<SectionTone, string> = {
  base: "bg-surface-base",
  raised: "bg-surface-raised border-border-subtle border-y",
  sunken: "bg-surface-sunken border-border-subtle border-y",
  // Inverse drops onto a dark surface; eyebrows + headings flip via the
  // [data-tone="inverse"] descendant selector below so callers don't have
  // to pass a tone prop down through every component.
  inverse: "bg-surface-inverse text-on-inverse",
};

const densityClasses: Record<SectionDensity, string> = {
  comfortable: "py-20 sm:py-24",
  spacious: "py-28 lg:py-40",
};

export function Section({
  children,
  className,
  tone = "base",
  density = "comfortable",
  /** Back-compat: `raised` was the old boolean. Tone wins if both are set. */
  raised = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: SectionTone;
  density?: SectionDensity;
  raised?: boolean;
  id?: string;
}) {
  const resolvedTone: SectionTone = tone !== "base" ? tone : raised ? "raised" : "base";
  return (
    <section
      id={id}
      data-tone={resolvedTone}
      className={cn(toneClasses[resolvedTone], densityClasses[density], className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Eyebrow — small uppercase label above a section heading. On inverse-tone
 * sections, the default accent flips to ivory so it stays legible on dark.
 */
export function SectionEyebrow({
  children,
  highlight = false,
}: {
  children: ReactNode;
  /** Use the warm amber highlight color (AI/magic-moment eyebrows only). */
  highlight?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-caption uppercase",
        highlight ? "text-highlight" : "text-accent",
        !highlight && "[[data-tone=inverse]_&]:text-on-inverse",
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-display-md text-text-primary [[data-tone=inverse]_&]:text-on-inverse">
        {children}
      </h2>
      {sub ? (
        <p className="text-body-lg text-text-secondary [[data-tone=inverse]_&]:text-on-inverse/80 mt-4">
          {sub}
        </p>
      ) : null}
    </div>
  );
}
