"use client";

import { useId, useMemo, useState } from "react";
import { SEAT_PLANS, USAGE_RATES } from "@kiris/billing/plans";

/**
 * Cost calculator. Three sliders → live monthly estimate broken down line
 * by line. Picks the cheapest seat plan that fits the seat count, defaults
 * to Standard narration. Pure client; no network.
 */
export function PricingCalculator() {
  const [seats, setSeats] = useState(10);
  const [modules, setModules] = useState(8);
  const [narrationMin, setNarrationMin] = useState(120);

  const aiRate = USAGE_RATES.find((r) => r.label === "AI generation")?.pricePerUnitUsd ?? 2;
  const narrationRate =
    USAGE_RATES.find((r) => r.label === "Narration · Standard voice")?.pricePerUnitUsd ?? 0.08;

  const plan = useMemo(() => pickPlan(seats), [seats]);

  const seatCost = plan.tier === "enterprise" ? 0 : seats * plan.pricePerSeatMonthlyUsd;
  const aiCost = modules * aiRate;
  const narrationCost = narrationMin * narrationRate;
  const total = seatCost + aiCost + narrationCost;
  const baseId = useId();

  return (
    <div className="border-border-subtle bg-surface-raised mx-auto max-w-4xl rounded-xl border p-6 shadow-sm md:p-10">
      <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
        <div className="space-y-6">
          <Slider
            id={`${baseId}-seats`}
            label="Editor seats"
            value={seats}
            onChange={setSeats}
            min={3}
            max={100}
            unit="seats"
            note={
              plan.tier === "enterprise"
                ? "Enterprise · custom pricing"
                : `${plan.name} plan · $${plan.pricePerSeatMonthlyUsd} / seat / month`
            }
          />
          <Slider
            id={`${baseId}-modules`}
            label="Modules generated per month"
            value={modules}
            onChange={setModules}
            min={0}
            max={50}
            unit="modules"
            note={`$${aiRate.toFixed(2)} per module`}
          />
          <Slider
            id={`${baseId}-narration`}
            label="Narration minutes per month"
            value={narrationMin}
            onChange={setNarrationMin}
            min={0}
            max={1000}
            step={10}
            unit="min"
            note={`$${narrationRate.toFixed(2)} per minute (Standard voice)`}
          />
        </div>

        <div className="border-border-subtle md:bg-surface-sunken md:rounded-lg md:border md:p-6">
          <p className="text-caption text-text-tertiary uppercase tracking-wider">
            Estimated monthly
          </p>
          {plan.tier === "enterprise" ? (
            <p className="text-display-md mt-2 font-semibold">Custom</p>
          ) : (
            <p className="text-display-lg mt-2 font-semibold tabular-nums">${total.toFixed(0)}</p>
          )}
          <ul className="text-body-sm text-text-secondary mt-6 space-y-2">
            <li className="flex justify-between gap-3">
              <span>
                {seats} {seats === 1 ? "seat" : "seats"}
                {plan.tier === "enterprise" ? "" : ` × $${plan.pricePerSeatMonthlyUsd}`}
              </span>
              <span className="tabular-nums">
                {plan.tier === "enterprise" ? "—" : `$${seatCost.toFixed(0)}`}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span>
                {modules} module{modules === 1 ? "" : "s"} × ${aiRate.toFixed(2)}
              </span>
              <span className="tabular-nums">${aiCost.toFixed(2)}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>
                {narrationMin} min × ${narrationRate.toFixed(2)}
              </span>
              <span className="tabular-nums">${narrationCost.toFixed(2)}</span>
            </li>
          </ul>
          {plan.tier === "enterprise" ? (
            <p className="text-body-sm text-text-secondary mt-6">
              At {seats} seats, contact sales for volume pricing.
            </p>
          ) : (
            <p className="text-body-sm text-text-secondary mt-6">
              Switch to annual billing and save ~17% on seat pricing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function pickPlan(seats: number) {
  // Cheapest plan whose minSeats fits, falling back to Enterprise.
  // SEAT_PLANS is ordered Team → Scale → Enterprise.
  if (seats >= 25) return SEAT_PLANS[2]!; // Enterprise
  if (seats >= 10) return SEAT_PLANS[1]!; // Scale
  return SEAT_PLANS[0]!; // Team
}

function Slider({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  note,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  note: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="text-body-sm text-text-primary font-medium">{label}</span>
        <span className="text-heading-md text-text-primary tabular-nums">
          {value.toLocaleString()}{" "}
          <span className="text-body-sm text-text-tertiary font-normal">{unit}</span>
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent mt-3 w-full"
      />
      <p className="text-caption text-text-tertiary mt-1.5">{note}</p>
    </div>
  );
}
