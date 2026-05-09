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
          className="bg-accent text-body-md text-text-on-accent hover:bg-accent-hover inline-flex h-10 items-center rounded-md px-4 font-medium shadow-sm"
        >
          Back to admin home
        </Link>
      }
    />
  );
}
