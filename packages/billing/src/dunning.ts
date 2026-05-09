/**
 * Dunning state machine — DESIGN §8.9.
 *
 *  day  state         action
 *  0    failed        Stripe retries 3x; email customer
 *  3    failed_d3     in-app banner
 *  7    failed_d7     email + banner; AI throttled to 50%
 *  14   failed_d14    account read-only
 *  21   failed_d21    account suspended
 *  51   hard_delete   if still failed
 *
 * Pure function over (last_invoice_failed_at, now).
 */

export type DunningState =
  | "current"
  | "failed_d0"
  | "failed_d3"
  | "failed_d7"
  | "failed_d14"
  | "failed_d21";

export interface DunningInputs {
  lastFailureAt: Date | null;
  now?: Date;
  /** Invoiced customers get a longer timeline. */
  isInvoiced?: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function computeDunningState({
  lastFailureAt,
  now = new Date(),
  isInvoiced = false,
}: DunningInputs): DunningState {
  if (!lastFailureAt) return "current";
  const days = Math.floor((now.getTime() - lastFailureAt.getTime()) / DAY_MS);
  // Invoiced customers get the same early stages but a delayed suspension at day 60.
  const suspensionThreshold = isInvoiced ? 60 : 21;
  if (days >= suspensionThreshold) return "failed_d21";
  if (days >= 14) return "failed_d14";
  if (days >= 7) return "failed_d7";
  if (days >= 3) return "failed_d3";
  return "failed_d0";
}

export const HARD_DELETE_THRESHOLD_DAYS = 51;

export function shouldHardDelete({ lastFailureAt, now = new Date() }: DunningInputs): boolean {
  if (!lastFailureAt) return false;
  const days = Math.floor((now.getTime() - lastFailureAt.getTime()) / DAY_MS);
  return days >= HARD_DELETE_THRESHOLD_DAYS;
}

export function dunningCustomerMessage(state: DunningState): string {
  switch (state) {
    case "current":
      return "";
    case "failed_d0":
      return "Your last payment didn't go through. We'll retry automatically; please update your card if needed.";
    case "failed_d3":
      return "We've been unable to charge your card for 3 days. Update payment to avoid interruption.";
    case "failed_d7":
      return "AI generation is temporarily throttled to 50% while we resolve the payment issue.";
    case "failed_d14":
      return "Your account is read-only. Update payment to restore full access.";
    case "failed_d21":
      return "Your account is suspended. Update payment to restore access.";
  }
}
