import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDunningState, shouldHardDelete } from "./dunning.js";

const DAY = 24 * 60 * 60 * 1000;

test("no failure → current", () => {
  assert.equal(computeDunningState({ lastFailureAt: null }), "current");
});

test("just-failed → failed_d0", () => {
  const now = new Date("2026-05-01");
  assert.equal(
    computeDunningState({ lastFailureAt: new Date(now.getTime() - 1 * DAY), now }),
    "failed_d0",
  );
});

test("8-day failure → failed_d7", () => {
  const now = new Date("2026-05-09");
  assert.equal(
    computeDunningState({ lastFailureAt: new Date(now.getTime() - 8 * DAY), now }),
    "failed_d7",
  );
});

test("22-day failure → failed_d21", () => {
  const now = new Date("2026-05-23");
  assert.equal(
    computeDunningState({ lastFailureAt: new Date(now.getTime() - 22 * DAY), now }),
    "failed_d21",
  );
});

test("invoiced customer at day 30 is still failed_d14 (not yet d21)", () => {
  const now = new Date("2026-05-31");
  assert.equal(
    computeDunningState({
      lastFailureAt: new Date(now.getTime() - 30 * DAY),
      now,
      isInvoiced: true,
    }),
    "failed_d14",
  );
});

test("hard delete fires only past 51 days", () => {
  const now = new Date("2026-07-01");
  assert.equal(
    shouldHardDelete({ lastFailureAt: new Date(now.getTime() - 50 * DAY), now }),
    false,
  );
  assert.equal(
    shouldHardDelete({ lastFailureAt: new Date(now.getTime() - 52 * DAY), now }),
    true,
  );
});
