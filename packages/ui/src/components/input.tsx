import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../utils.js";

const baseField =
  "w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-body-md text-text-primary placeholder:text-text-tertiary transition-colors duration-state focus:border-accent focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-1 disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(baseField, "h-10", className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(baseField, "min-h-24", className)} {...props} />;
});
