import { Card, CardBody, EmptyState } from "@kiris/ui";
import { Database } from "lucide-react";

export const metadata = { title: "Usage" };

export default function UsagePage() {
  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Cost vs revenue</p>
      <h1 className="text-display-md mt-1">Usage and unit economics</h1>
      <p className="text-body-md text-text-secondary mt-2 max-w-2xl">
        Anthropic spend by tier, Polly spend, AWS spend, per-tenant unit economics, scrubber
        decision counts. Wired to real data in Step 5 once the read-replica grants are in place.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-caption text-text-tertiary uppercase">Anthropic · 30d</p>
            <p className="text-display-md mt-2">$1,287</p>
            <p className="text-body-sm text-text-secondary">Standard $1,054 · HIPAA $233</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-caption text-text-tertiary uppercase">Polly · 30d</p>
            <p className="text-display-md mt-2">$412</p>
            <p className="text-body-sm text-text-secondary">Neural $304 · Generative $108</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-caption text-text-tertiary uppercase">Scrubber · 30d</p>
            <p className="text-display-md mt-2">14,802</p>
            <p className="text-body-sm text-text-secondary">3 hard-block, 41 confirm</p>
          </CardBody>
        </Card>
      </div>

      <EmptyState
        className="mt-12"
        icon={<Database size={20} aria-hidden />}
        title="Per-tenant unit economics chart"
        body="Wired to the read-replica in Step 5. Will surface tenants whose unit economics are upside-down so we can intervene."
      />
    </>
  );
}
