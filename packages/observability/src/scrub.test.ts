import { test } from "node:test";
import assert from "node:assert/strict";
import { scrubString, scrubValue } from "./scrub.js";

test("scrubString redacts MRN, SSN, DOB, phone, email", () => {
  const out = scrubString(
    "Patient MRN 123456 SSN 123-45-6789 DOB 1/2/1980 phone 415-555-1212 email a@example.org",
  );
  assert.match(out, /\[redacted-mrn\]/);
  assert.match(out, /\[redacted-ssn\]/);
  assert.match(out, /\[redacted-dob\]/);
  assert.match(out, /\[redacted-phone\]/);
  // example.org is not in the allowlist, so it should be redacted.
  assert.match(out, /\[redacted-email\]/);
});

test("scrubString preserves operational example.com / kiris.ai emails", () => {
  const out = scrubString("Errors from a@example.com or ops@kiris.ai are operational.");
  assert.ok(out.includes("a@example.com"));
  assert.ok(out.includes("ops@kiris.ai"));
});

test("scrubValue redacts secret-looking keys", () => {
  const out = scrubValue({
    request: {
      headers: { authorization: "bearer abc", "user-agent": "ua" },
    },
    body: { password: "p", note: "fine" },
  }) as any;
  assert.equal(out.request.headers.authorization, "[redacted-secret]");
  assert.equal(out.request.headers["user-agent"], "ua");
  assert.equal(out.body.password, "[redacted-secret]");
  assert.equal(out.body.note, "fine");
});
