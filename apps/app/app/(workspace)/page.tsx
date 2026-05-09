import Link from "next/link";
import { EmptyState } from "@kiris/ui";
import { Plus, Sparkles } from "lucide-react";
import { listModules } from "@/lib/data";
import { ModuleCard } from "@/components/module-card";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const modules = await listModules();

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-caption uppercase text-text-tertiary">Modules</p>
          <h1 className="mt-1 text-display-md">Your work</h1>
          <p className="mt-2 text-body-md text-text-secondary">
            Pick up where you left off, or start something new.
          </p>
        </div>
        <Link
          href="/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-body-md font-medium text-text-on-accent shadow-sm transition-colors duration-state hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        >
          <Plus size={16} aria-hidden />
          New module
        </Link>
      </div>

      {modules.length === 0 ? (
        <EmptyState
          className="mt-12"
          icon={<Sparkles size={20} aria-hidden />}
          title="No modules yet"
          body="Drop in screenshots, recordings, or notes — Kiris will draft a polished, narrated module in under three minutes."
          action={
            <Link
              href="/new"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-body-md font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
            >
              <Plus size={16} aria-hidden />
              Create your first module
            </Link>
          }
        />
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>
      )}
    </>
  );
}
