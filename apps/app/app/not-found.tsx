import Link from "next/link";
import { TopNav } from "@/components/top-nav";
import { EmptyState } from "@kiris/ui";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <TopNav />
      <main id="main" className="mx-auto max-w-app px-4 py-20">
        <EmptyState
          icon={<FileQuestion size={20} aria-hidden />}
          title="We couldn't find that"
          body="The module may have been moved, deleted, or you don't have access."
          action={
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-body-md font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
            >
              Back to dashboard
            </Link>
          }
        />
      </main>
    </>
  );
}
