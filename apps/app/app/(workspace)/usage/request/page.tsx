import { Banner, ProgressBar, Textarea } from "@kiris/ui";
import { Sparkles, Mic } from "lucide-react";
import { getSession } from "@/lib/session";

export const metadata = { title: "Request more usage" };

const PRESETS = [
  { value: "10", label: "+10%" },
  { value: "50", label: "+50%" },
  { value: "100", label: "+100%" },
  { value: "custom", label: "Custom" },
];

export default function RequestUsagePage() {
  const { usage } = getSession();
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-caption uppercase text-text-tertiary">Usage</p>
      <h1 className="mt-1 text-display-md">Request more this month</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        Your team admin will be notified in-app and by email. They'll see your current usage and
        the amount you're requesting before approving.
      </p>

      <Banner variant="info" className="mt-8" title="No surprise fees">
        Approved overages are billed at the rates published on{" "}
        <a className="underline" href="https://kiris.ai/pricing">
          kiris.ai/pricing
        </a>
        . Nothing accrues without admin approval.
      </Banner>

      <form className="mt-8 space-y-6" method="get" action="/cap-requests">
        <input type="hidden" name="submitted" value="1" />
        <fieldset>
          <legend className="text-body-sm font-medium text-text-primary">
            Which allowance?
          </legend>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <KindOption
              icon={<Sparkles size={16} className="text-accent" aria-hidden />}
              name="kind"
              value="ai_credits"
              label="AI credits"
              used={usage.aiCreditsUsed}
              allowance={usage.aiCreditsAllowance}
              defaultChecked
            />
            <KindOption
              icon={<Mic size={16} className="text-accent" aria-hidden />}
              name="kind"
              value="narration_minutes"
              label="Narration minutes"
              used={usage.narrationMinutesUsed}
              allowance={usage.narrationMinutesAllowance}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-body-sm font-medium text-text-primary">Amount</legend>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {PRESETS.map((p, i) => (
              <label
                key={p.value}
                className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-border bg-surface-raised text-body-sm text-text-primary transition-colors duration-state has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:checked]:text-accent"
              >
                <input
                  type="radio"
                  name="amount"
                  value={p.value}
                  defaultChecked={i === 1}
                  className="sr-only"
                />
                {p.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="reason"
            className="text-body-sm font-medium text-text-primary"
          >
            Why do you need more?
          </label>
          <p className="mt-1 text-caption text-text-tertiary">
            One sentence is enough. Helps your admin decide quickly.
          </p>
          <Textarea
            id="reason"
            name="reason"
            rows={3}
            className="mt-2"
            placeholder="Building EHR rollout series this week — three more modules to ship by Friday."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <a
            href="/"
            className="inline-flex h-10 items-center rounded-md px-4 text-body-md font-medium text-text-secondary hover:bg-accent-soft"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-md bg-accent px-5 text-body-md font-medium text-text-on-accent shadow-sm hover:bg-accent-hover"
          >
            Send request
          </button>
        </div>
      </form>
    </div>
  );
}

function KindOption({
  icon,
  name,
  value,
  label,
  used,
  allowance,
  defaultChecked = false,
}: {
  icon: React.ReactNode;
  name: string;
  value: string;
  label: string;
  used: number;
  allowance: number;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer flex-col rounded-lg border border-border bg-surface-raised p-4 transition-colors duration-state has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
      <span className="flex items-center gap-2 text-body-md font-medium text-text-primary">
        <input
          type="radio"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          className="sr-only"
        />
        {icon}
        {label}
      </span>
      <span className="mt-2 text-caption text-text-tertiary">
        Used {used} of {allowance}
      </span>
      <ProgressBar
        className="mt-2"
        value={used}
        max={allowance}
        variant={used / allowance >= 1 ? "danger" : used / allowance >= 0.8 ? "warning" : "neutral"}
      />
    </label>
  );
}
