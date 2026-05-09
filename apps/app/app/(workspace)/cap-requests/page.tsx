import { Badge, Banner, Card, CardBody, EmptyState, ProgressBar } from "@kiris/ui";
import { Inbox, Mic, Sparkles } from "lucide-react";
import { listCapRequests } from "@/lib/mock-store";
import { formatRelative } from "@/lib/format";

export const metadata = { title: "Approval queue" };

export default async function CapRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const params = await searchParams;
  const requests = listCapRequests();
  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Admin</p>
      <h1 className="text-display-md mt-1">Approval queue</h1>
      <p className="text-body-md text-text-secondary mt-2 max-w-2xl">
        Review and decide on cap-increase requests from your team. Decisions are logged and the
        requester is notified in-app and by email.
      </p>

      {params.submitted === "1" ? (
        <Banner variant="success" className="mt-8" title="Request sent">
          Your team admin has been notified. You&apos;ll see a decision here once they respond.
        </Banner>
      ) : null}

      <Banner variant="info" className="mt-8" title="Auto-approval rules">
        Configure rules per team (up to +50%/user/mo, by role, by $ ceiling) so routine bumps
        don&apos;t pile up here. Coming in Step 4.
      </Banner>

      {requests.length === 0 ? (
        <EmptyState
          className="mt-12"
          icon={<Inbox size={20} aria-hidden />}
          title="Nothing pending"
          body="When teammates ask for more AI credits or narration minutes, requests show up here."
        />
      ) : (
        <ul className="mt-10 space-y-4">
          {requests.map((req) => {
            const pctIncrease = Math.round((req.requestedAmount / req.currentAllowance) * 100);
            return (
              <li key={req.id}>
                <Card>
                  <CardBody>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="warning">Pending</Badge>
                          <span className="text-body-sm text-text-tertiary">
                            {formatRelative(req.createdAt)}
                          </span>
                        </div>
                        <h2 className="text-heading-md mt-2">
                          {req.userName} · +{req.requestedAmount}
                          {req.kind === "ai_credits" ? " AI credits" : " narration minutes"}
                        </h2>
                        <p className="text-body-md text-text-secondary mt-2 max-w-2xl">
                          {req.reason}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="border-border bg-surface-raised text-body-sm text-text-primary hover:border-status-danger hover:text-status-danger inline-flex h-9 items-center gap-2 rounded-md border px-3 font-medium"
                        >
                          Deny
                        </button>
                        <button
                          type="button"
                          className="border-border bg-surface-raised text-body-sm text-text-primary hover:border-border-strong inline-flex h-9 items-center gap-2 rounded-md border px-3 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="bg-accent text-body-sm text-text-on-accent hover:bg-accent-hover inline-flex h-9 items-center gap-2 rounded-md px-3 font-medium shadow-sm"
                        >
                          Approve + new baseline
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="border-border-subtle bg-surface-base rounded-md border p-3">
                        <div className="text-caption text-text-tertiary flex items-center gap-2 uppercase">
                          {req.kind === "ai_credits" ? (
                            <Sparkles size={12} aria-hidden />
                          ) : (
                            <Mic size={12} aria-hidden />
                          )}
                          Current usage
                        </div>
                        <p className="text-body-md mt-1">
                          {req.currentUsage} / {req.currentAllowance}
                        </p>
                        <ProgressBar
                          className="mt-2"
                          value={req.currentUsage}
                          max={req.currentAllowance}
                          variant={req.currentUsage >= req.currentAllowance ? "danger" : "warning"}
                        />
                      </div>
                      <div className="border-border-subtle bg-surface-base rounded-md border p-3">
                        <p className="text-caption text-text-tertiary uppercase">Requested</p>
                        <p className="text-body-md mt-1">
                          +{req.requestedAmount} ({pctIncrease}% increase)
                        </p>
                        <p className="text-caption text-text-tertiary mt-2">
                          Approving applies this allowance for the rest of this billing period.
                          &quot;Approve + new baseline&quot; makes it permanent.
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
