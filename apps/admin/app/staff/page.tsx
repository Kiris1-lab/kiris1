import { Badge, Card, CardBody, Banner } from "@kiris/ui";

export const metadata = { title: "Staff" };

const STAFF = [
  { name: "Sam Rivera", email: "ops@kiris.ai", role: "ops_admin", hardwareKey: true },
  { name: "Jordan Kim", email: "support@kiris.ai", role: "support", hardwareKey: true },
  { name: "Lin Park", email: "billing@kiris.ai", role: "billing_admin", hardwareKey: true },
];

export default function StaffPage() {
  return (
    <>
      <p className="text-caption uppercase text-text-tertiary">Internal staff</p>
      <h1 className="mt-1 text-display-md">Staff and roles</h1>

      <Banner variant="warning" className="mt-6" title="super_admin actions">
        Adding, removing, or elevating staff requires a second super_admin
        approver (DESIGN §15.4). All actions logged with mandatory justification.
      </Banner>

      <Card className="mt-8">
        <CardBody className="p-0">
          <table className="w-full text-body-sm">
            <thead className="border-b border-border-subtle text-caption uppercase text-text-tertiary">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Hardware key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {STAFF.map((s) => (
                <tr key={s.email}>
                  <td className="p-4 text-text-primary">{s.name}</td>
                  <td className="p-4 text-text-secondary">{s.email}</td>
                  <td className="p-4">
                    <Badge variant="neutral">{s.role}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={s.hardwareKey ? "success" : "danger"}>
                      {s.hardwareKey ? "enrolled" : "missing"}
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
