/**
 * Pricing model — per-seat subscription + pay-as-you-go usage.
 *
 * Per-seat pricing covers the workspace, editor, and unlimited modules.
 * Usage (AI generation, narration, storage beyond the included tier) is
 * billed monthly at the rates in USAGE_RATES.
 *
 * Compliance and BAA capabilities are bundled into Enterprise — they are
 * presented as an Enterprise benefit, not a separate "tier" the user has
 * to think about on the marketing site.
 *
 * TODO(founder): regenerate Stripe Price IDs to match new model. The legacy
 * STANDARD_PLANS / HIPAA_PLANS / ENTERPRISE / OVERAGE_RATES exports are
 * preserved as aliases so apps/app and apps/admin continue to compile until
 * they're migrated in a follow-up change.
 */

export type Tier = "standard" | "hipaa";
export type BillingCycle = "monthly" | "annual";

/* ------------------------------------------------------------------ */
/* New per-seat model                                                  */
/* ------------------------------------------------------------------ */

export interface SeatPlan {
  id: string;
  name: string;
  tier: "team" | "scale" | "enterprise";
  pricePerSeatMonthlyUsd: number;
  pricePerSeatAnnualUsd: number; // ~17% off monthly equivalent
  minSeats: number;
  description: string;
  badge?: string;
  features: string[];
  hipaaIncluded: boolean;
}

export const SEAT_PLANS: SeatPlan[] = [
  {
    id: "team",
    name: "Team",
    tier: "team",
    pricePerSeatMonthlyUsd: 49,
    pricePerSeatAnnualUsd: 39,
    minSeats: 3,
    description: "For a department's clinical educators and IT trainers.",
    features: [
      "Unlimited modules",
      "Pay-as-you-go AI generation and narration",
      "All export formats (SCORM, xAPI, MP4, HTML5, ZIP)",
      "Role-based folders and admin approvals",
      "Email support",
    ],
    hipaaIncluded: false,
  },
  {
    id: "scale",
    name: "Scale",
    tier: "scale",
    pricePerSeatMonthlyUsd: 79,
    pricePerSeatAnnualUsd: 65,
    minSeats: 10,
    description: "For health systems running training across multiple departments.",
    badge: "Most popular",
    features: [
      "Everything in Team",
      "Volume discounts on AI and narration usage",
      "SSO (Google, Microsoft)",
      "Priority email + chat support",
      "Dedicated onboarding",
    ],
    hipaaIncluded: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tier: "enterprise",
    pricePerSeatMonthlyUsd: 0, // custom
    pricePerSeatAnnualUsd: 0,
    minSeats: 25,
    description: "For health systems with custom needs and the highest compliance requirements.",
    features: [
      "Everything in Scale",
      "Advanced compliance controls and BAA",
      "Custom data residency and retention",
      "SAML SSO and SCIM provisioning",
      "Custom DPA and premium SLA",
      "Dedicated success manager",
    ],
    hipaaIncluded: true,
  },
];

export interface UsageRate {
  label: string;
  unit: string;
  pricePerUnitUsd: number;
  description: string;
}

export const USAGE_RATES: UsageRate[] = [
  {
    label: "AI generation",
    unit: "per module",
    pricePerUnitUsd: 2.0,
    description: "Flat rate per generated module, regardless of length.",
  },
  {
    label: "Narration · Standard voice",
    unit: "per minute",
    pricePerUnitUsd: 0.08,
    description: "AWS Polly Neural voices.",
  },
  {
    label: "Narration · Studio voice",
    unit: "per minute",
    pricePerUnitUsd: 0.5,
    description: "AWS Polly Generative voices — broadcast quality.",
  },
  {
    label: "Storage",
    unit: "per GB / month",
    pricePerUnitUsd: 0.1,
    description: "Beyond the 50 GB included with each workspace.",
  },
];

/* ------------------------------------------------------------------ */
/* Legacy exports — DO NOT USE IN NEW CODE                             */
/*                                                                     */
/* apps/app/ and apps/admin/ still consume the old Plan / STANDARD_PLANS
 * shape. Aliases below let those compile while we migrate them in a
 * follow-up change. The shape is intentionally a SeatPlan-derived view
 * so callers reading `monthlyUsd`, `seatsIncluded`, `aiCreditsPerSeat`
 * etc. still type-check.                                              */
/* ------------------------------------------------------------------ */

export interface Plan {
  id: string;
  name: string;
  tier: Tier;
  monthlyUsd: number;
  annualUsd: number;
  seatsIncluded: number;
  extraSeatUsd?: number;
  modulesPerMonth: number;
  aiCreditsPerSeat: number;
  narrationMinPerSeat: number;
  storageGb: number;
  description: string;
  badge?: string;
}

/**
 * Synthetic legacy plan envelope. Maps a SeatPlan to the old shape so
 * apps/app + apps/admin keep typechecking. New code MUST use SEAT_PLANS.
 *
 * - monthlyUsd / annualUsd reflect the price for `minSeats` (the smallest
 *   billable amount). Real bills scale with actual seats.
 * - seatsIncluded === minSeats.
 * - modules / credits / narration / storage are best-effort defaults
 *   carried over from the prior model so cap-request UIs still render.
 */
function legacyPlanFromSeat(
  plan: SeatPlan,
  defaults: {
    modulesPerMonth: number;
    aiCreditsPerSeat: number;
    narrationMinPerSeat: number;
    storageGb: number;
    extraSeatUsd?: number;
    legacyId?: string;
    legacyName?: string;
  },
): Plan {
  return {
    id: defaults.legacyId ?? plan.id,
    name: defaults.legacyName ?? plan.name,
    tier: plan.hipaaIncluded ? "hipaa" : "standard",
    monthlyUsd: plan.pricePerSeatMonthlyUsd * plan.minSeats,
    annualUsd: plan.pricePerSeatAnnualUsd * plan.minSeats * 12,
    seatsIncluded: plan.minSeats,
    extraSeatUsd: defaults.extraSeatUsd,
    modulesPerMonth: defaults.modulesPerMonth,
    aiCreditsPerSeat: defaults.aiCreditsPerSeat,
    narrationMinPerSeat: defaults.narrationMinPerSeat,
    storageGb: defaults.storageGb,
    description: plan.description,
    badge: plan.badge,
  };
}

const TEAM_LEGACY = legacyPlanFromSeat(SEAT_PLANS[0]!, {
  modulesPerMonth: 50,
  aiCreditsPerSeat: 100,
  narrationMinPerSeat: 60,
  storageGb: 50,
  extraSeatUsd: 49,
});

const SCALE_LEGACY = legacyPlanFromSeat(SEAT_PLANS[1]!, {
  modulesPerMonth: 200,
  aiCreditsPerSeat: 200,
  narrationMinPerSeat: 120,
  storageGb: 250,
  extraSeatUsd: 79,
});

const ENTERPRISE_LEGACY: Plan = {
  id: "enterprise",
  name: "Enterprise",
  tier: "hipaa",
  monthlyUsd: 0,
  annualUsd: 0,
  seatsIncluded: SEAT_PLANS[2]!.minSeats,
  modulesPerMonth: 0,
  aiCreditsPerSeat: 0,
  narrationMinPerSeat: 0,
  storageGb: 0,
  description: SEAT_PLANS[2]!.description,
};

export const STANDARD_PLANS: Plan[] = [TEAM_LEGACY, SCALE_LEGACY];
export const HIPAA_PLANS: Plan[] = [];

export const ENTERPRISE = {
  id: "enterprise",
  name: "Enterprise",
  startsAtMonthlyUsd: 0,
  description: SEAT_PLANS[2]!.description,
};

export const OVERAGE_RATES = {
  aiCreditUsd: 0,
  narrationNeuralUsdPerMin: 0.08,
  narrationGenerativeUsdPerMin: 0.5,
  storageUsdPerGbMonth: 0.1,
};

// Suppress unused-warning if no caller imports the enterprise legacy.
void ENTERPRISE_LEGACY;
