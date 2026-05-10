import Link from "next/link";
import { Badge } from "@kiris/ui";
import {
  Activity,
  Banknote,
  Building2,
  Database,
  Gauge,
  Inbox,
  KeyRound,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getInternalSession } from "@/lib/session";

const NAV: { href: string; label: string; icon: React.ReactNode }[] = [
  { href: "/", label: "Home", icon: <Gauge size={16} aria-hidden /> },
  { href: "/tenants", label: "Tenants", icon: <Building2 size={16} aria-hidden /> },
  { href: "/billing", label: "Billing", icon: <Banknote size={16} aria-hidden /> },
  { href: "/usage", label: "Usage", icon: <Database size={16} aria-hidden /> },
  {
    href: "/support-sessions",
    label: "Support sessions",
    icon: <KeyRound size={16} aria-hidden />,
  },
  { href: "/audit", label: "Audit log", icon: <ScrollText size={16} aria-hidden /> },
  { href: "/incidents", label: "Incidents", icon: <Activity size={16} aria-hidden /> },
  { href: "/cap-requests", label: "Cap requests", icon: <Inbox size={16} aria-hidden /> },
  { href: "/staff", label: "Staff", icon: <Users size={16} aria-hidden /> },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await getInternalSession();
  // Middleware should have redirected to /sign-in already; render nothing if
  // somehow we got here without a session.
  if (!session) return null;
  return (
    <div className="bg-surface-base flex min-h-screen">
      <aside
        className="border-border-subtle bg-surface-raised hidden w-60 shrink-0 border-r md:block"
        aria-label="Admin navigation"
      >
        <div className="text-heading-sm flex h-14 items-center gap-2 px-4">
          <ShieldCheck size={18} className="text-accent" aria-hidden />
          Kiris admin
        </div>
        <nav>
          <ul className="space-y-0.5 p-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-body-sm text-text-secondary duration-state hover:bg-accent-soft hover:text-accent flex items-center gap-2 rounded-md px-3 py-2 transition-colors"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-border-subtle bg-surface-base text-caption text-text-tertiary absolute bottom-3 left-3 right-3 rounded-md border p-3">
          <p className="text-text-primary">{session.name}</p>
          <p>{session.email}</p>
          <Badge variant="success" className="mt-2">
            <KeyRound size={11} aria-hidden /> Hardware key OK
          </Badge>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border-subtle bg-surface-base flex h-14 items-center justify-between border-b px-4">
          <span className="text-body-sm text-text-secondary">
            Internal · {session.role.replace("_", " ")} · read-only by default
          </span>
          <Badge variant="warning">Two-person rule for destructive actions</Badge>
        </header>
        <main id="main" className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
