import { Badge, Banner, Card, CardBody, Textarea } from "@kiris/ui";
import { SUPPORT_SESSIONS, TENANTS } from "@/lib/mock-store";

export const metadata = { title: "Support sessions" };

export default function SupportSessionsPage() {
  return (
    <>
      <p className="text-caption uppercase text-text-tertiary">Customer-granted access</p>
      <h1 className="mt-1 text-display-md">Support sessions</h1>
      <p className="mt-2 max-w-2xl text-body-md text-text-secondary">
        The only path to raw module content (DESIGN §15.5). Default 4 h
        expiry; 1 h on HIPAA tier. HIPAA sessions require a second internal
        approver before the customer is prompted.
      </p>

      <Banner variant="warning" className="mt-8" title="Customer must approve in-app">
        Even with the customer's verbal consent, no support session is active
        until they click approve in their dashboard.
      </Banner>

      <Card className="mt-8">
        <CardBody>
          <h2 className="text-heading-md">Request a new session</h2>
          <form className="mt-4 grid gap-4 md:grid-cols-2" method="post" action="?action=request">
            <Field label="Tenant">
              <select
                className="h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-body-md"
                name="tenant"
              >
                {TENANTS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Default expiry">
              <select
                className="h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-body-md"
                name="expiry"
                defaultValue="4h"
              >
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
                <option value="8h">8 hours</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Scope and justification (mandatory)">
                <Textarea
                  rows={4}
                  required
                  placeholder="Investigating dunning failure for invoice in_… reported by customer. Read-only access to billing tables."
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-body-md font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
              >
                Request session
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      <h2 className="mt-12 text-heading-md">Pending and active sessions</h2>
      <ul className="mt-4 space-y-3">
        {SUPPORT_SESSIONS.map((s) => (
          <li key={s.id}>
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-heading-sm">{s.tenant}</p>
                    <p className="text-body-sm text-text-secondary">{s.scope}</p>
                  </div>
                  <Badge variant={s.status === "active" ? "success" : "warning"}>
                    {s.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="mt-3 text-caption text-text-tertiary">
                  Requested by {s.internalUser} · expires {new Date(s.expiresAt).toLocaleString()}
                </p>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-body-sm font-medium text-text-primary">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
