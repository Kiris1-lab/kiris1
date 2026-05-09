import { test } from "node:test";
import assert from "node:assert/strict";
import { regexScan } from "./regex-fallback.js";

test("MRN is detected with high confidence", () => {
  const findings = regexScan("Patient chart MRN: 123456 admitted yesterday.");
  const mrn = findings.find((f) => f.type === "MEDICAL_RECORD_NUMBER");
  assert.ok(mrn, "expected an MRN finding");
  assert.ok(mrn.confidence >= 0.85);
});

test("SSN is detected with high confidence", () => {
  const findings = regexScan("Verified SSN 123-45-6789 on file.");
  const ssn = findings.find((f) => f.type === "SSN");
  assert.ok(ssn);
  assert.ok(ssn.confidence >= 0.85);
});

test("EHR chrome triggers a moderate-confidence detection", () => {
  const findings = regexScan("Screenshot of an Epic encounter pane.");
  const ehr = findings.find((f) => f.type === "EHR_CHROME");
  assert.ok(ehr);
});

test("Innocuous text returns no findings", () => {
  const findings = regexScan("Wash your hands for at least twenty seconds.");
  assert.equal(findings.length, 0);
});
