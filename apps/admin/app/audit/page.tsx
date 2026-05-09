import { Badge, Card, CardBody, Input } from "@kiris/ui";
import { AUDIT_EVENTS } from "@/lib/mock-store";

export const metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Compliance</p>
      <h1 className="text-display-md mt-1">Audit log</h1>
      <p className="text-body-md text-text-secondary mt-2 max-w-2xl">
        Every state-changing action across the customer plane is logged here. Standard tenants:
        1-year retention. HIPAA tenants: 6-year retention (DESIGN §6.6).
      </p>

      <div className="mt-6 grid max-w-3xl gap-3 md:grid-cols-3">
        <Input type="search" placeholder="Tenant…" aria-label="Tenant filter" />
        <Input type="search" placeholder="Action…" aria-label="Action filter" />
        <Input type="search" placeholder="Request ID…" aria-label="Request ID filter" />
      </div>

      <Card className="mt-6">
        <CardBody className="p-0">
          <table className="text-body-sm w-full">
            <thead className="border-border-subtle text-caption text-text-tertiary border-b uppercase">
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
            <tbody className="divide-border-subtle divide-y">
              {AUDIT_EVENTS.map((e) => (
                <tr key={e.id}>
                  <td className="text-text-tertiary p-4">{new Date(e.ts).toLocaleString()}</td>
                  <td className="text-text-primary p-4">{e.tenant}</td>
                  <td className="text-text-secondary p-4">{e.actor}</td>
                  <td className="text-body-sm p-4 font-mono">{e.action}</td>
                  <td className="text-text-secondary p-4">{e.target}</td>
                  <td className="text-text-tertiary p-4">{e.ip}</td>
                  <td className="text-caption text-text-tertiary p-4 font-mono">{e.requestId}</td>
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
