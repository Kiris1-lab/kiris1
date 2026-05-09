import { EmptyState } from "@kiris/ui";
import { Activity } from "lucide-react";

export const metadata = { title: "Incidents" };

export default function IncidentsPage() {
  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Reliability</p>
      <h1 className="text-display-md mt-1">Incidents</h1>
      <EmptyState
        className="mt-12"
        icon={<Activity size={20} aria-hidden />}
        title="No open incidents"
        body="Incident timeline + severity + owner + status will surface here. Wired in Step 5 alongside the public status page."
      />
    </>
  );
}
