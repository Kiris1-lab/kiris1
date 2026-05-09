import { Badge, Banner, Card, CardBody, Textarea } from "@kiris/ui";
import { SUPPORT_SESSIONS, TENANTS } from "@/lib/mock-store";

export const metadata = { title: "Support sessions" };

export default function SupportSessionsPage() {
  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Customer-granted access</p>
      <h1 className="text-display-md mt-1">Support sessions</h1>
      <p className="text-body-md text-text-secondary mt-2 max-w-2xl">
        The only path to raw module content (DESIGN §15.5). Default 4 h expiry; 1 h on HIPAA tier.
        HIPAA sessions require a second internal approver before the customer is prompted.
      </p>

      <Banner variant="warning" className="mt-8" title="Customer must approve in-app">
        Even with the customer&apos;s verbal consent, no support session is active until they click
        approve in their dashboard.
      </Banner>

      <Card className="mt-8">
        <CardBody>
          <h2 className="text-heading-md">Request a new session</h2>
          <form className="mt-4 grid gap-4 md:grid-cols-2" method="post" action="?action=request">
            <Field label="Tenant">
              <select
                className="border-border bg-surface-raised text-body-md h-10 w-full rounded-md border px-3"
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
                className="border-border bg-surface-raised text-body-md h-10 w-full rounded-md border px-3"
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
                className="bg-accent text-body-md text-text-on-accent hover:bg-accent-hover inline-flex h-10 items-center rounded-md px-4 font-medium shadow-sm"
              >
                Request session
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      <h2 className="text-heading-md mt-12">Pending and active sessions</h2>
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
                <p className="text-caption text-text-tertiary mt-3">
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
      <span className="text-body-sm text-text-primary font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
