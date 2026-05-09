import { Loader2 } from "lucide-react";
import { cn } from "../utils.js";

export function Spinner({
  size = 18,
  className,
  label = "Loading",
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <Loader2
      className={cn("animate-spin text-text-tertiary", className)}
      size={size}
      aria-label={label}
      role="status"
    />
  );
}
