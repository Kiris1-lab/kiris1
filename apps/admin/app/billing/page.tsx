import { Badge, Card, CardBody } from "@kiris/ui";
import { KPI, OPEN_INVOICES, TENANTS } from "@/lib/mock-store";

export const metadata = { title: "Billing" };

export default function BillingPage() {
  const byTier = TENANTS.reduce(
    (acc, t) => {
      acc[t.tier].mrr += t.mrrUsd;
      acc[t.tier].count += 1;
      return acc;
    },
    { standard: { mrr: 0, count: 0 }, hipaa: { mrr: 0, count: 0 } },
  );

  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Billing</p>
      <h1 className="text-display-md mt-1">Revenue and dunning</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-caption text-text-tertiary uppercase">MRR · Standard</p>
            <p className="text-display-md mt-2">${byTier.standard.mrr.toLocaleString()}</p>
            <p className="text-body-sm text-text-secondary">{byTier.standard.count} tenants</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-caption text-text-tertiary uppercase">MRR · HIPAA</p>
            <p className="text-display-md mt-2">${byTier.hipaa.mrr.toLocaleString()}</p>
            <p className="text-body-sm text-text-secondary">{byTier.hipaa.count} tenants</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-caption text-text-tertiary uppercase">ARR · projected</p>
            <p className="text-display-md mt-2">${KPI.arrUsd.toLocaleString()}</p>
            <p className="text-body-sm text-text-secondary">12 × current MRR</p>
          </CardBody>
        </Card>
      </div>

      <h2 className="text-heading-md mt-12">Open invoices</h2>
      <Card className="mt-4">
        <CardBody className="p-0">
          <table className="text-body-sm w-full">
            <thead className="border-border-subtle text-caption text-text-tertiary border-b uppercase">
              <tr>
                <th className="p-4 text-left">Tenant</th>
                <th className="p-4 text-left">Invoice</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Due</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {OPEN_INVOICES.map((i) => (
                <tr key={i.id}>
                  <td className="p-4">{i.tenant}</td>
                  <td className="text-caption text-text-tertiary p-4 font-mono">{i.id}</td>
                  <td className="p-4">
                    <Badge variant="warning">{i.status}</Badge>
                  </td>
                  <td className="text-text-secondary p-4">{i.dueAt}</td>
                  <td className="p-4 text-right">${i.totalUsd.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  );
}
