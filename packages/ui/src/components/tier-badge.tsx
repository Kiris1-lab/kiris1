import { ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "./badge.js";

/**
 * Tier badge — visible at all times in the app top nav (§16, §2.5).
 * On the marketing site, used to call out HIPAA-tier availability.
 */
export function TierBadge({ tier }: { tier: "standard" | "hipaa" }) {
  if (tier === "hipaa") {
    return (
      <Badge variant="success" aria-label="HIPAA tier">
        <ShieldCheck size={12} aria-hidden />
        HIPAA
      </Badge>
    );
  }
  return (
    <Badge variant="neutral" aria-label="Standard tier">
      <Sparkles size={12} aria-hidden />
      Standard
    </Badge>
  );
}
