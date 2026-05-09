import Link from "next/link";
import { Badge, Card, CardBody, Input } from "@kiris/ui";
import { TENANTS } from "@/lib/mock-store";

export const metadata = { title: "Tenants" };

export default function TenantsPage() {
  return (
    <>
      <p className="text-caption uppercase text-text-tertiary">Tenants</p>
      <h1 className="mt-1 text-display-md">All tenants</h1>

      <div className="mt-6 max-w-md">
        <Input type="search" placeholder="Search by name, ID, or email…" aria-label="Search tenants" />
      </div>

      <Card className="mt-6">
        <CardBody className="p-0">
          <table className="w-full text-body-sm">
            <thead className="border-b border-border-subtle text-caption uppercase text-text-tertiary">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Plan</th>
                <th className="p-4 text-left">Tier</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Seats</th>
                <th className="p-4 text-left">Modules</th>
                <th className="p-4 text-right">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {TENANTS.map((t) => (
                <tr key={t.id}>
                  <td className="p-4">
                    <Link
                      href={`/tenants/${t.id}`}
                      className="font-medium text-text-primary hover:text-accent"
                    >
                      {t.name}
                    </Link>
                    <p className="text-caption text-text-tertiary">{t.id}</p>
                  </td>
                  <td className="p-4 text-text-secondary">{t.plan}</td>
                  <td className="p-4">
                    <Badge variant={t.tier === "hipaa" ? "success" : "neutral"}>{t.tier}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        t.status === "active"
                          ? "success"
                          : t.status === "past_due"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-text-secondary">{t.seats}</td>
                  <td className="p-4 text-text-secondary">{t.modules}</td>
                  <td className="p-4 text-right font-medium">${t.mrrUsd.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  );
}
