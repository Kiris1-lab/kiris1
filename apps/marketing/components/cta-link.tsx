import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@kiris/ui";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-state ease-in-out-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-text-on-accent shadow-sm hover:bg-accent-hover active:bg-accent-pressed",
  secondary:
    "bg-surface-raised text-text-primary border border-border shadow-sm hover:border-border-strong",
  ghost: "bg-transparent text-text-primary hover:bg-accent-soft",
};

const sizeClasses: Record<Size, string> = {
  md: "h-10 px-4 text-body-md",
  lg: "h-12 px-6 text-body-md",
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
      {withArrow ? <ArrowRight size={16} aria-hidden /> : null}
    </Link>
  );
}
