import { cn } from "../utils.js";

export function KBD({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 items-center rounded border border-border-subtle bg-surface-raised px-1.5 font-mono text-[10px] font-medium text-text-secondary",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
