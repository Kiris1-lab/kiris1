import { EmptyState } from "@kiris/ui";
import { Inbox } from "lucide-react";

export const metadata = { title: "Cap requests" };

export default function CapRequestsPage() {
  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Product feedback</p>
      <h1 className="text-display-md mt-1">Cap-increase activity (global)</h1>
      <p className="text-body-md text-text-secondary mt-2 max-w-2xl">
        Cross-tenant trend view. Spikes here usually mean a plan is under-priced or a product
        workflow is forcing waste. Tenants resolve their own queues in-app.
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
