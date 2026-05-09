import { EmptyState } from "@kiris/ui";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <EmptyState
      className="mt-12"
      icon={<FileQuestion size={20} aria-hidden />}
      title="Not found"
      body="The page or record you're looking for doesn't exist (or you don't have access)."
      action={
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-body-md font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
        >
          Back to admin home
        </Link>
      }
    />
  );
}
