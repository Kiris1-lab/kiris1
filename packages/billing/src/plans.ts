/**
 * Pricing plans — single source of truth for marketing + app + admin.
 * Numbers from DESIGN.md §7.3 / §7.4. Stripe Price IDs are provided via env
 * vars (see .env.example) and looked up at runtime, never hard-coded.
 */

export type Tier = "standard" | "hipaa";
export type BillingCycle = "monthly" | "annual";

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

export const STANDARD_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tier: "standard",
    monthlyUsd: 79,
    annualUsd: 790,
    seatsIncluded: 1,
    modulesPerMonth: 5,
    aiCreditsPerSeat: 50,
    narrationMinPerSeat: 30,
    storageGb: 5,
    description: "For a single educator who wants to ship modules fast.",
  },
  {
    id: "team",
    name: "Team",
    tier: "standard",
    monthlyUsd: 399,
    annualUsd: 3990,
    seatsIncluded: 10,
    extraSeatUsd: 35,
    modulesPerMonth: 50,
    aiCreditsPerSeat: 100,
    narrationMinPerSeat: 60,
    storageGb: 50,
    description: "Built for a department's clinical educators and IT trainers.",
    badge: "Most popular",
  },
  {
    id: "pro",
    name: "Pro",
    tier: "standard",
    monthlyUsd: 1199,
    annualUsd: 11990,
    seatsIncluded: 25,
    extraSeatUsd: 45,
    modulesPerMonth: 200,
    aiCreditsPerSeat: 200,
    narrationMinPerSeat: 120,
    storageGb: 250,
    description: "For health systems running enterprise-wide training programs.",
  },
];

export const HIPAA_PLANS: Plan[] = [
  {
    id: "team-hipaa",
    name: "Team-HIPAA",
    tier: "hipaa",
    monthlyUsd: 799,
    annualUsd: 7990,
    seatsIncluded: 10,
    extraSeatUsd: 35,
    modulesPerMonth: 50,
    aiCreditsPerSeat: 100,
    narrationMinPerSeat: 60,
    storageGb: 50,
    description: "Everything in Team plus BAA + HIPAA-scoped infrastructure.",
  },
  {
    id: "pro-hipaa",
    name: "Pro-HIPAA",
    tier: "hipaa",
    monthlyUsd: 1999,
    annualUsd: 19990,
    seatsIncluded: 25,
    extraSeatUsd: 45,
    modulesPerMonth: 200,
    aiCreditsPerSeat: 200,
    narrationMinPerSeat: 120,
    storageGb: 250,
    description: "Pro with HIPAA tier infrastructure, BAA, and 6-year audit retention.",
  },
];

export const ENTERPRISE = {
  id: "enterprise-hipaa",
  name: "Enterprise-HIPAA",
  startsAtMonthlyUsd: 4999,
  description:
    "For health systems with volume needs, SSO/SAML, custom DPA, and premium SLA. Annual only.",
};

export const OVERAGE_RATES = {
  aiCreditUsd: 0.04,
  narrationNeuralUsdPerMin: 0.05,
  narrationGenerativeUsdPerMin: 0.4,
  storageUsdPerGbMonth: 0.5,
};
