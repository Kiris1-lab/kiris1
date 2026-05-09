import { cn } from "../utils.js";

export function KBD({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "border-border-subtle bg-surface-raised text-text-secondary inline-flex h-5 items-center rounded border px-1.5 font-mono text-[10px] font-medium",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
