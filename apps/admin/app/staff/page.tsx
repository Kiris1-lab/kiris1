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
      <p className="text-caption text-text-tertiary uppercase">Internal staff</p>
      <h1 className="text-display-md mt-1">Staff and roles</h1>

      <Banner variant="warning" className="mt-6" title="super_admin actions">
        Adding, removing, or elevating staff requires a second super_admin approver (DESIGN §15.4).
        All actions logged with mandatory justification.
      </Banner>

      <Card className="mt-8">
        <CardBody className="p-0">
          <table className="text-body-sm w-full">
            <thead className="border-border-subtle text-caption text-text-tertiary border-b uppercase">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Hardware key</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {STAFF.map((s) => (
                <tr key={s.email}>
                  <td className="text-text-primary p-4">{s.name}</td>
                  <td className="text-text-secondary p-4">{s.email}</td>
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
