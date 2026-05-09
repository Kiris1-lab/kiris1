import { EmptyState } from "@kiris/ui";
import { Activity } from "lucide-react";

export const metadata = { title: "Incidents" };

export default function IncidentsPage() {
  return (
    <>
      <p className="text-caption uppercase text-text-tertiary">Reliability</p>
      <h1 className="mt-1 text-display-md">Incidents</h1>
      <EmptyState
        className="mt-12"
        icon={<Activity size={20} aria-hidden />}
        title="No open incidents"
        body="Incident timeline + severity + owner + status will surface here. Wired in Step 5 alongside the public status page."
      />
    </>
  );
}
