import { GenerationProgress } from "@/components/generation-progress";

export const metadata = { title: "Generating module" };

/**
 * Cosmetic in Step 2 — redirects to the seeded "hand hygiene" module so we can
 * demo the editor end-to-end. Real generation in Step 3 receives the form
 * payload, runs the scrubber, calls Anthropic, and returns the new module ID.
 */
export default function GeneratingPage() {
  return <GenerationProgress redirectToModuleId="m_hand_hygiene" />;
}
