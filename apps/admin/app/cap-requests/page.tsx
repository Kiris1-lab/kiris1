import { EmptyState } from "@kiris/ui";
import { Inbox } from "lucide-react";

export const metadata = { title: "Cap requests" };

export default function CapRequestsPage() {
  return (
    <>
      <p className="text-caption uppercase text-text-tertiary">Product feedback</p>
      <h1 className="mt-1 text-display-md">Cap-increase activity (global)</h1>
      <p className="mt-2 max-w-2xl text-body-md text-text-secondary">
        Cross-tenant trend view. Spikes here usually mean a plan is
        under-priced or a product workflow is forcing waste. Tenants resolve
        their own queues in-app.
      </p>
      <EmptyState
        className="mt-12"
        icon={<Inbox size={20} aria-hidden />}
        title="Aggregate trend chart"
        body="Wired to the read-replica in Step 5."
      />
    </>
  );
}
