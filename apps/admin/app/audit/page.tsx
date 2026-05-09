import { Badge, Card, CardBody, Input } from "@kiris/ui";
import { AUDIT_EVENTS } from "@/lib/mock-store";

export const metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <>
      <p className="text-caption uppercase text-text-tertiary">Compliance</p>
      <h1 className="mt-1 text-display-md">Audit log</h1>
      <p className="mt-2 max-w-2xl text-body-md text-text-secondary">
        Every state-changing action across the customer plane is logged here.
        Standard tenants: 1-year retention. HIPAA tenants: 6-year retention
        (DESIGN §6.6).
      </p>

      <div className="mt-6 grid max-w-3xl gap-3 md:grid-cols-3">
        <Input type="search" placeholder="Tenant…" aria-label="Tenant filter" />
        <Input type="search" placeholder="Action…" aria-label="Action filter" />
        <Input type="search" placeholder="Request ID…" aria-label="Request ID filter" />
      </div>

      <Card className="mt-6">
        <CardBody className="p-0">
          <table className="w-full text-body-sm">
            <thead className="border-b border-border-subtle text-caption uppercase text-text-tertiary">
              <tr>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Tenant</th>
                <th className="p-4 text-left">Actor</th>
                <th className="p-4 text-left">Action</th>
                <th className="p-4 text-left">Target</th>
                <th className="p-4 text-left">IP</th>
                <th className="p-4 text-left">Request ID</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {AUDIT_EVENTS.map((e) => (
                <tr key={e.id}>
                  <td className="p-4 text-text-tertiary">{new Date(e.ts).toLocaleString()}</td>
                  <td className="p-4 text-text-primary">{e.tenant}</td>
                  <td className="p-4 text-text-secondary">{e.actor}</td>
                  <td className="p-4 font-mono text-body-sm">{e.action}</td>
                  <td className="p-4 text-text-secondary">{e.target}</td>
                  <td className="p-4 text-text-tertiary">{e.ip}</td>
                  <td className="p-4 font-mono text-caption text-text-tertiary">{e.requestId}</td>
                  <td className="p-4">
                    <Badge variant={e.success ? "success" : "danger"}>
                      {e.success ? "ok" : "fail"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  );
}
