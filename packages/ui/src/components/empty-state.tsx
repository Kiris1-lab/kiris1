import type { ReactNode } from "react";
import { cn } from "../utils.js";

/**
 * Empty state primitive (DESIGN §16.11). Every screen with no data ships one
 * of these — never a blank screen. Pass an icon and a single primary action.
 */
export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border-subtle bg-surface-raised mx-auto flex max-w-md flex-col items-center rounded-lg border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="bg-accent-soft text-accent mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          {icon}
        </div>
      ) : null}
      <h2 className="text-heading-lg">{title}</h2>
      {body ? <p className="text-body-md text-text-secondary mt-2">{body}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
