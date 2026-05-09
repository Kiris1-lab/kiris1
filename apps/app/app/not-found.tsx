import Link from "next/link";
import { TopNav } from "@/components/top-nav";
import { EmptyState } from "@kiris/ui";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <TopNav />
      <main id="main" className="max-w-app mx-auto px-4 py-20">
        <EmptyState
          icon={<FileQuestion size={20} aria-hidden />}
          title="We couldn't find that"
          body="The module may have been moved, deleted, or you don't have access."
          action={
            <Link
              href="/"
              className="bg-accent text-body-md text-text-on-accent hover:bg-accent-hover inline-flex h-10 items-center rounded-md px-4 font-medium shadow-sm"
            >
              Back to dashboard
            </Link>
          }
        />
      </main>
    </>
  );
}
