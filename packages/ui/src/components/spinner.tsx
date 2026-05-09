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
      className={cn("text-text-tertiary animate-spin", className)}
      size={size}
      aria-label={label}
      role="status"
    />
  );
}
