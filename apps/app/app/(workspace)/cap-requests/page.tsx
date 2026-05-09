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
      <p className="text-caption uppercase text-text-tertiary">Admin</p>
      <h1 className="mt-1 text-display-md">Approval queue</h1>
      <p className="mt-2 max-w-2xl text-body-md text-text-secondary">
        Review and decide on cap-increase requests from your team. Decisions are logged and the
        requester is notified in-app and by email.
      </p>

      {params.submitted === "1" ? (
        <Banner variant="success" className="mt-8" title="Request sent">
          Your team admin has been notified. You'll see a decision here once they respond.
        </Banner>
      ) : null}

      <Banner variant="info" className="mt-8" title="Auto-approval rules">
        Configure rules per team (up to +50%/user/mo, by role, by $ ceiling) so routine bumps
        don't pile up here. Coming in Step 4.
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
                        <h2 className="mt-2 text-heading-md">
                          {req.userName} · +{req.requestedAmount}
                          {req.kind === "ai_credits" ? " AI credits" : " narration minutes"}
                        </h2>
                        <p className="mt-2 max-w-2xl text-body-md text-text-secondary">
                          {req.reason}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface-raised px-3 text-body-sm font-medium text-text-primary hover:border-status-danger hover:text-status-danger"
                        >
                          Deny
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface-raised px-3 text-body-sm font-medium text-text-primary hover:border-border-strong"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-body-sm font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
                        >
                          Approve + new baseline
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-md border border-border-subtle bg-surface-base p-3">
                        <div className="flex items-center gap-2 text-caption uppercase text-text-tertiary">
                          {req.kind === "ai_credits" ? (
                            <Sparkles size={12} aria-hidden />
                          ) : (
                            <Mic size={12} aria-hidden />
                          )}
                          Current usage
                        </div>
                        <p className="mt-1 text-body-md">
                          {req.currentUsage} / {req.currentAllowance}
                        </p>
                        <ProgressBar
                          className="mt-2"
                          value={req.currentUsage}
                          max={req.currentAllowance}
                          variant={req.currentUsage >= req.currentAllowance ? "danger" : "warning"}
                        />
                      </div>
                      <div className="rounded-md border border-border-subtle bg-surface-base p-3">
                        <p className="text-caption uppercase text-text-tertiary">Requested</p>
                        <p className="mt-1 text-body-md">
                          +{req.requestedAmount} ({pctIncrease}% increase)
                        </p>
                        <p className="mt-2 text-caption text-text-tertiary">
                          Approving applies this allowance for the rest of this billing period.
                          "Approve + new baseline" makes it permanent.
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

