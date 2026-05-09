import { Card, CardBody, Badge, Banner } from "@kiris/ui";
import { Building2, ShieldCheck, KeyRound, Inbox } from "lucide-react";
import { KPI, OPEN_INVOICES, SUPPORT_SESSIONS, TENANTS } from "@/lib/mock-store";

export const metadata = { title: "Home" };

export default function AdminHome() {
  return (
    <>
      <p className="text-caption uppercase text-text-tertiary">Operator dashboard</p>
      <h1 className="mt-1 text-display-md">Today</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Tenants" value={KPI.tenants} sub={`${Math.round(KPI.hipaaShare * 100)}% HIPAA`} icon={<Building2 size={16} aria-hidden />} />
        <Stat label="MRR" value={`$${KPI.mrrUsd.toLocaleString()}`} sub={`ARR $${KPI.arrUsd.toLocaleString()}`} icon={<ShieldCheck size={16} aria-hidden />} />
        <Stat label="Signups · 7d" value={KPI.signupsThisWeek} sub={`${KPI.churnThisMonth} churn this month`} icon={<Inbox size={16} aria-hidden />} />
        <Stat label="Active support sessions" value={KPI.activeSupportSessions} sub="Click 'Support sessions' for detail" icon={<KeyRound size={16} aria-hidden />} />
      </div>

      <Banner variant="info" className="mt-8" title="Read-only by default">
        Write actions require a justification field and are logged to
        <code className="mx-1">internal_audit_log</code>. Destructive actions
        require a second approver.
      </Banner>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <header className="flex items-center justify-between">
              <h2 className="text-heading-md">Past-due tenants</h2>
              <Badge variant="warning">Action recommended</Badge>
            </header>
            <ul className="mt-4 divide-y divide-border-subtle">
              {TENANTS.filter((t) => t.status === "past_due").map((t) => (
                <li key={t.id} className="flex items-center justify-between py-3 text-body-sm">
                  <span>
                    <span className="font-medium text-text-primary">{t.name}</span>
                    <span className="ml-2 text-text-tertiary">{t.plan}</span>
                  </span>
                  <Badge variant="warning">past_due</Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="text-heading-md">Open invoices</h2>
            <ul className="mt-4 divide-y divide-border-subtle">
              {OPEN_INVOICES.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between py-3 text-body-sm">
                  <span>
                    <span className="font-medium text-text-primary">{inv.tenant}</span>
                    <span className="ml-2 text-text-tertiary">due {inv.dueAt}</span>
                  </span>
                  <span>${inv.totalUsd.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="text-heading-md">Pending support sessions</h2>
        <Card className="mt-4">
          <CardBody>
            {SUPPORT_SESSIONS.length === 0 ? (
              <p className="text-body-sm text-text-tertiary">None.</p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {SUPPORT_SESSIONS.map((s) => (
                  <li key={s.id} className="py-3 text-body-sm">
                    <p className="font-medium text-text-primary">
                      {s.tenant} — {s.scope}
                    </p>
                    <p className="text-caption text-text-tertiary">
                      Requested by {s.internalUser} · expires {new Date(s.expiresAt).toLocaleString()}
                    </p>
                    <Badge variant="warning" className="mt-2">
                      {s.status.replace("_", " ")}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>
    </>
  );
}

function Stat({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-2 text-text-tertiary">
          {icon}
          <p className="text-caption uppercase">{label}</p>
        </div>
        <p className="mt-2 text-display-md">{value}</p>
        <p className="text-body-sm text-text-secondary">{sub}</p>
      </CardBody>
    </Card>
  );
}
