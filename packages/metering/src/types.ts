/**
 * Usage event types — DESIGN §8.6.
 *
 * Hard rule: NEVER reports PHI, module names, or user content to Stripe —
 * only counts.
 */
export type EventType =
  | "ai_credit"
  | "narration_neural_min"
  | "narration_generative_min"
  | "storage_gb_month"
  | "module_created";

export const UNITS: Record<EventType, string> = {
  ai_credit: "credits",
  narration_neural_min: "minutes",
  narration_generative_min: "minutes",
  storage_gb_month: "gb-month",
  module_created: "modules",
};

export interface UsageRecord {
  tenantId: string;
  userId: string | null;
  eventType: EventType;
  /** Quantity in the event's natural unit (credits, minutes, gb-month, modules). */
  quantity: number;
  /** Optional reference — module ID, narration job ID, etc. */
  refId?: string;
}

export interface Allowance {
  /** Sum of seat allowances + per-user overrides currently in effect. */
  totalAllowance: number;
  /** Sum of usage_daily for this period. */
  used: number;
}
