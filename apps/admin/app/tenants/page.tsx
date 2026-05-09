import Link from "next/link";
import { Badge, Card, CardBody, Input } from "@kiris/ui";
import { TENANTS } from "@/lib/mock-store";

export const metadata = { title: "Tenants" };

export default function TenantsPage() {
  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Tenants</p>
      <h1 className="text-display-md mt-1">All tenants</h1>

      <div className="mt-6 max-w-md">
        <Input
          type="search"
          placeholder="Search by name, ID, or email…"
          aria-label="Search tenants"
        />
      </div>

      <Card className="mt-6">
        <CardBody className="p-0">
          <table className="text-body-sm w-full">
            <thead className="border-border-subtle text-caption text-text-tertiary border-b uppercase">
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
            <tbody className="divide-border-subtle divide-y">
              {TENANTS.map((t) => (
                <tr key={t.id}>
                  <td className="p-4">
                    <Link
                      href={`/tenants/${t.id}`}
                      className="text-text-primary hover:text-accent font-medium"
                    >
                      {t.name}
                    </Link>
                    <p className="text-caption text-text-tertiary">{t.id}</p>
                  </td>
                  <td className="text-text-secondary p-4">{t.plan}</td>
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
                  <td className="text-text-secondary p-4">{t.seats}</td>
                  <td className="text-text-secondary p-4">{t.modules}</td>
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
