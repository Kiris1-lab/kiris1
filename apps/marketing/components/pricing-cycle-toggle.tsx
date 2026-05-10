"use client";

import { useId, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardBody, cn } from "@kiris/ui";
import { CtaLink } from "@/components/cta-link";
import { SEAT_PLANS, type SeatPlan } from "@kiris/billing/plans";

type Cycle = "monthly" | "annual";

export function PricingCycleToggle() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const baseId = useId();
  const monthlyId = `${baseId}-monthly`;
  const annualId = `${baseId}-annual`;

  return (
    <div>
      <div className="flex items-center justify-center">
        <div
          role="tablist"
          aria-label="Billing cycle"
          className="bg-surface-sunken border-border-subtle inline-flex rounded-full border p-1"
        >
          <CycleTab id={monthlyId} active={cycle === "monthly"} onClick={() => setCycle("monthly")}>
            Monthly
          </CycleTab>
          <CycleTab id={annualId} active={cycle === "annual"} onClick={() => setCycle("annual")}>
            Annual <span className="text-highlight ml-2 font-medium">Save ~17%</span>
          </CycleTab>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SEAT_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </div>
    </div>
  );
}

function CycleTab({
  id,
  active,
  onClick,
  children,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "text-body-sm duration-state inline-flex h-9 items-center rounded-full px-4 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
        active
          ? "bg-surface-raised text-text-primary shadow-sm"
          : "text-text-secondary hover:text-text-primary",
      )}
    >
      {children}
    </button>
  );
}

function PlanCard({ plan, cycle }: { plan: SeatPlan; cycle: Cycle }) {
  const isEnterprise = plan.tier === "enterprise";
  const isPopular = !!plan.badge;
  const monthlyPrice = plan.pricePerSeatMonthlyUsd;
  const annualPrice = plan.pricePerSeatAnnualUsd;
  const headlinePrice = cycle === "monthly" ? monthlyPrice : annualPrice;

  return (
    <Card className={cn("flex flex-col", isPopular ? "border-accent border-2" : "")}>
      <CardBody className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-heading-lg">{plan.name}</h3>
          {plan.badge ? (
            <span className="bg-accent-soft text-accent text-caption rounded-full px-2.5 py-1 font-medium uppercase tracking-wider">
              {plan.badge}
            </span>
          ) : null}
        </div>
        <p className="text-body-sm text-text-secondary mt-2">{plan.description}</p>

        <div className="mt-6">
          {isEnterprise ? (
            <>
              <p className="text-display-md font-semibold">Custom</p>
              <p className="text-body-sm text-text-tertiary mt-1">
                Volume seat pricing, BAA, SAML SSO, custom DPA.
              </p>
            </>
          ) : (
            <>
              <p className="flex items-baseline gap-1.5">
                <span className="text-display-md font-semibold">${headlinePrice}</span>
                <span className="text-body-md text-text-secondary">/ seat / month</span>
              </p>
              <p className="text-body-sm text-text-tertiary mt-1">
                {cycle === "annual"
                  ? `or $${monthlyPrice} / seat when billed monthly`
                  : `or $${annualPrice} / seat when billed annually`}
              </p>
            </>
          )}
        </div>

        <p className="text-caption text-text-tertiary mt-4 uppercase tracking-wider">
          {plan.minSeats} seat{plan.minSeats > 1 ? "s" : ""} minimum
        </p>

        <ul className="text-body-sm text-text-secondary mt-4 flex flex-1 flex-col gap-2">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-2">
              <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" aria-hidden />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <CtaLink
          href={isEnterprise ? "/contact-sales" : "/signup"}
          className="mt-8"
          variant={isPopular ? "primary" : "secondary"}
        >
          {isEnterprise ? "Talk to sales" : `Choose ${plan.name}`}
        </CtaLink>
      </CardBody>
    </Card>
  );
}
