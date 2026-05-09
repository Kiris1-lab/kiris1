import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../utils.js";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "rounded-md transition-colors duration-state ease-in-out-soft",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-[var(--focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-pressed shadow-sm",
        secondary:
          "bg-surface-raised text-text-primary border border-border hover:border-border-strong shadow-sm",
        ghost: "bg-transparent text-text-primary hover:bg-accent-soft",
        destructive: "bg-status-danger text-text-on-accent hover:opacity-90 shadow-sm",
      },
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-10 px-4 text-body-md",
        lg: "h-12 px-6 text-body-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, ...props },
  ref,
) {
  return <button ref={ref} className={cn(button({ variant, size }), className)} {...props} />;
});
