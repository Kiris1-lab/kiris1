import { cn } from "../utils.js";

export function ProgressBar({
  value,
  max = 100,
  label,
  variant = "neutral",
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  variant?: "neutral" | "warning" | "danger";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    variant === "danger"
      ? "bg-status-danger"
      : variant === "warning"
        ? "bg-status-warning"
        : "bg-accent";
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="text-caption text-text-tertiary mb-1 flex items-center justify-between">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div
        className="bg-border-subtle h-1.5 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn("duration-layout h-full transition-all", fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
