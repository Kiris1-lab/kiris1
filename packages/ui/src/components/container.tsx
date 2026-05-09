import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils.js";

export const Container = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { width?: "marketing" | "app" | "reading" }
>(function Container({ className, width = "marketing", ...props }, ref) {
  const max =
    width === "app" ? "max-w-app" : width === "reading" ? "max-w-reading" : "max-w-marketing";
  return <div ref={ref} className={cn("mx-auto w-full px-4 sm:px-6", max, className)} {...props} />;
});
