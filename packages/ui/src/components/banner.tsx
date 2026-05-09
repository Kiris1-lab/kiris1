import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils.js";

const banner = cva("flex items-start gap-3 rounded-md border p-4 text-body-sm", {
  variants: {
    variant: {
      info: "border-[#bae6fd] bg-[#f0f9ff] text-[#075985]",
      success: "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
      warning: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
      danger: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
    },
  },
  defaultVariants: { variant: "info" },
});

const iconFor = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
} as const;

export interface BannerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof banner> {
  title?: ReactNode;
}

export function Banner({ variant = "info", title, children, className, ...props }: BannerProps) {
  const Icon = iconFor[variant ?? "info"];
  return (
    <div role="status" className={cn(banner({ variant }), className)} {...props}>
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden />
      <div className="flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}
