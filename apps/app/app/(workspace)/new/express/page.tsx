import { Banner, Input, Textarea } from "@kiris/ui";
import { ShieldAlert, UploadCloud } from "lucide-react";

export const metadata = { title: "New module · Express AI" };

const DURATIONS = [
  { value: "auto", label: "Let AI decide" },
  { value: "180", label: "3 min" },
  { value: "300", label: "5 min" },
  { value: "480", label: "8 min" },
  { value: "720", label: "12 min" },
];

export default function ExpressPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-caption uppercase text-accent">Express AI</p>
      <h1 className="mt-1 text-display-md">Tell Kiris what you need.</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        Three short inputs. One generation. Lands in the editor in 60–180 seconds.
      </p>

      <Banner variant="info" className="mt-8" title="Pre-flight PHI scan on Standard tier">
        Materials are scanned by AWS Comprehend Medical before generation. High-confidence PHI is
        blocked; ambiguous detections will ask you to confirm.
      </Banner>

      {/*
        method="get" so the Step 2 demo navigates without a server action.
        Real submission (file upload + scrubber preflight + streaming Anthropic
        call) lands in Step 3 via the API.
      */}
      <form
        method="get"
        action="/new/express/generating"
        className="mt-8 space-y-6"
        aria-describedby="express-help"
      >
        <p id="express-help" className="sr-only">
          Title or topic, materials, and audience and goal. Optional target duration.
        </p>

        <Field
          label="Title or topic"
          htmlFor="title"
          help="A short description of the module. Example: 'Hand hygiene refresher for med-surg nurses.'"
        >
          <Input
            id="title"
            name="title"
            required
            placeholder="Hand hygiene refresher for med-surg nurses"
          />
        </Field>

        <Field
          label="Materials"
          htmlFor="materials"
          help="Drop screenshots, PDFs, Word docs, or recordings. Or paste a URL. Or skip — Kiris can generate from the topic alone."
        >
          <div className="rounded-lg border border-dashed border-border bg-surface-raised p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
              <UploadCloud size={18} aria-hidden />
            </div>
            <p className="mt-3 text-body-md text-text-secondary">
              Drop files here, or{" "}
              <label
                htmlFor="materials"
                className="cursor-pointer font-medium text-accent underline"
              >
                browse
                <input id="materials" name="materials" type="file" multiple className="sr-only" />
              </label>
            </p>
            <p className="mt-1 text-caption text-text-tertiary">
              PDF, DOCX, PPTX, MP4, PNG, JPG · Max 100 MB per file
            </p>
          </div>
        </Field>

        <Field
          label="Audience and goal"
          htmlFor="audience"
          help="Who is this for, and what should they be able to do after the module? The more specific, the better the output."
        >
          <Textarea
            id="audience"
            name="audience"
            required
            rows={4}
            placeholder="Med-surg nurses on the day shift. After this module they should be able to identify the 5 moments for hand hygiene and demonstrate proper technique."
          />
        </Field>

        <Field label="Target duration" htmlFor="duration" help="Optional.">
          <select
            id="duration"
            name="duration"
            defaultValue="auto"
            className="h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-body-md text-text-primary focus:border-accent focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-1"
          >
            {DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="flex items-center gap-2 text-body-sm text-text-secondary">
            <ShieldAlert size={14} className="text-accent" aria-hidden />
            PHI scrub will run before generation
          </p>
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-body-md font-medium text-text-on-accent shadow-sm transition-colors duration-state hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          >
            Generate module
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
