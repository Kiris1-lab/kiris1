import { Banner, Input, Textarea } from "@kiris/ui";
import { Sparkles } from "lucide-react";

export const metadata = { title: "New module · Guided AI" };

export default function GuidedPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-caption uppercase text-accent">Guided AI</p>
      <h1 className="mt-1 text-display-md">Sketch the outline.</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        Start with a topic and audience. Add sections and slides — drag to reorder. Use the
        <Sparkles size={12} className="mx-1 inline text-accent" aria-hidden /> helper on every
        field to polish, regenerate, or translate.
      </p>

      <Banner variant="info" className="mt-8" title="Want a starting outline?">
        Click "Suggest outline" after filling in the basics and Kiris will draft a structure you
        can accept, reject, or rework.
      </Banner>

      <form
        method="get"
        action="/modules/m_falls"
        className="mt-8 space-y-6"
        aria-describedby="guided-help"
      >
        <p id="guided-help" className="sr-only">
          Title, audience and goal, and an outline.
        </p>

        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            name="title"
            required
            placeholder="Fall risk assessment · Q2 update"
          />
        </Field>

        <Field
          label="Audience and goal"
          htmlFor="audience"
          help="Used by every ✨ helper to keep generated content relevant."
        >
          <Textarea
            id="audience"
            name="audience"
            required
            rows={3}
            placeholder="All med-surg and step-down nurses. Updated for the new Hester Davis tooling."
          />
        </Field>

        <Field
          label="Initial outline (optional)"
          htmlFor="outline"
          help="One section or slide per line. Indent with 2 spaces for slides under a section."
        >
          <Textarea
            id="outline"
            name="outline"
            rows={10}
            className="font-mono"
            defaultValue={[
              "Hester Davis recap",
              "  What changed in May",
              "Walkthrough · scoring a 56-yr admit",
              "Knowledge check · scoring",
              "Top 3 interventions",
              "In your shoes · the post-op patient",
              "Documenting in the new flowsheet",
              "Quick recap",
              "Final knowledge check",
            ].join("\n")}
          />
        </Field>

        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface-raised px-4 text-body-md font-medium text-text-primary transition-colors duration-state hover:border-border-strong"
          >
            <Sparkles size={14} className="text-accent" aria-hidden /> Suggest outline
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-body-md font-medium text-text-on-accent shadow-sm transition-colors duration-state hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          >
            Open the editor
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-body-sm font-medium text-text-primary">
        {label}
      </label>
      {help ? <p className="mt-1 text-caption text-text-tertiary">{help}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}
