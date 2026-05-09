import { notFound } from "next/navigation";
import { Badge, Banner, Card, CardBody, Textarea } from "@kiris/ui";
import { TENANTS } from "@/lib/mock-store";

export const metadata = { title: "Tenant detail" };

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = TENANTS.find((x) => x.id === id);
  if (!t) notFound();

  return (
    <>
      <p className="text-caption text-text-tertiary uppercase">Tenant</p>
      <h1 className="text-display-md mt-1">{t.name}</h1>
      <p className="text-body-sm text-text-tertiary mt-1">{t.id}</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant={t.tier === "hipaa" ? "success" : "neutral"}>{t.tier}</Badge>
        <Badge variant="outline">{t.plan}</Badge>
        <Badge variant={t.status === "active" ? "success" : "warning"}>{t.status}</Badge>
        <span className="text-body-sm text-text-tertiary">
          {t.seats} seats · {t.modules} modules · ${t.mrrUsd}/mo MRR
        </span>
      </div>

      <Banner variant="info" className="mt-8" title="Module content not displayed">
        Internal staff cannot read raw module content unless the customer grants a support session
        (DESIGN §15.5). Use the Support sessions tab below to request one.
      </Banner>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="text-heading-md">Billing</h2>
            <dl className="text-body-sm mt-4 grid grid-cols-2 gap-3">
              <Row label="Plan" value={t.plan} />
              <Row label="Tier" value={t.tier} />
              <Row label="MRR" value={`$${t.mrrUsd.toLocaleString()}`} />
              <Row label="Status" value={t.status} />
              <Row label="Signup" value={new Date(t.signupAt).toLocaleDateString()} />
            </dl>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="text-heading-md">Caps and overrides</h2>
            <p className="text-body-sm text-text-secondary mt-2">
              Plan defaults plus any per-user overrides currently in effect. Adjustments are logged
              with the role + justification you supply.
            </p>
            <ul className="text-body-sm text-text-secondary mt-4 space-y-2">
              <li>AI credits / seat / mo: 100</li>
              <li>Narration min / seat / mo: 60</li>
              <li>Storage: 50 GB</li>
            </ul>
          </CardBody>
        </Card>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="text-heading-md">Issue credit</h2>
            <p className="text-body-sm text-text-secondary mt-2">
              Two-person approval required when the credit exceeds $5,000 in a single action (DESIGN
              §8.10). Logged with mandatory justification.
            </p>
            <form className="mt-4 space-y-3" method="post" action="?action=credit">
              <Field label="Amount (USD)">
                <input
                  type="number"
                  min={1}
                  className="border-border bg-surface-raised h-10 w-full rounded-md border px-3"
                />
              </Field>
              <Field label="Justification (required)">
                <Textarea rows={3} required />
              </Field>
              <button
                type="submit"
                className="bg-accent text-body-md text-text-on-accent hover:bg-accent-hover inline-flex h-10 items-center rounded-md px-4 font-medium shadow-sm"
              >
                Issue credit
              </button>
            </form>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="text-heading-md">Suspend tenant</h2>
            <p className="text-body-sm text-text-secondary mt-2">
              Sets status = suspended. Customer is notified by email and an app-wide banner.
              Reversible.
            </p>
            <form className="mt-4 space-y-3" method="post" action="?action=suspend">
              <Field label="Justification (required)">
                <Textarea rows={3} required />
              </Field>
              <button
                type="submit"
                className="border-status-danger bg-surface-raised text-body-md text-status-danger inline-flex h-10 items-center rounded-md border px-4 font-medium hover:bg-[#fef2f2]"
              >
                Suspend
              </button>
            </form>
          </CardBody>
        </Card>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="text-text-primary">{value}</dd>
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
