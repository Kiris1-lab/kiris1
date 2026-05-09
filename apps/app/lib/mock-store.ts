import type { CapRequest, Module, Slide } from "./types.js";

/**
 * In-memory mock store for Step 2. NOT for production. Real persistence
 * arrives in Step 3 via @kiris/db (Drizzle on RDS Postgres with RLS).
 *
 * Module IDs are stable so deep links work across reloads of the dev server.
 */

function slide(
  position: number,
  type: Slide["type"],
  title: string,
  body: string,
  narration: string,
  durationSeconds: number,
  reviewedByUser = false,
): Slide {
  return {
    id: `s_${position}_${type}`,
    position,
    type,
    title,
    bodyMarkdown: body,
    narrationScript: narration,
    altText: "",
    reviewedByUser,
    aiConfidence: 0.92,
    durationSeconds,
  };
}

const HAND_HYGIENE: Module = {
  id: "m_hand_hygiene",
  title: "Hand hygiene refresher for med-surg nurses",
  status: "ready",
  authoringMode: "express",
  updatedAt: "2026-05-08T14:21:00.000Z",
  estimatedDurationSeconds: 7 * 60 + 18,
  slideCount: 9,
  reviewedSlideCount: 6,
  audience:
    "Med-surg nurses on the day shift. After this module they should be able to identify the 5 moments for hand hygiene and demonstrate proper technique.",
  learningObjectives: [
    "Identify the 5 moments for hand hygiene.",
    "Demonstrate proper technique in under 20 seconds.",
    "Apply the 5 moments during your next shift.",
  ],
  slides: [
    slide(
      1,
      "title",
      "Hand hygiene refresher",
      "A 7-minute refresher for med-surg nurses.",
      "It's 7:14 AM. You step into Mr. Reyes's room with your med pass cart. What's the very first thing you should do?",
      24,
      true,
    ),
    slide(
      2,
      "objectives",
      "What you'll be able to do",
      "- Identify the 5 moments for hand hygiene\n- Demonstrate proper technique in under 20 seconds\n- Apply the 5 moments during your next shift",
      "By the end of this short module, you'll be able to identify the five moments for hand hygiene, demonstrate proper technique in under twenty seconds, and apply both during your next shift.",
      30,
      true,
    ),
    slide(
      3,
      "concept",
      "The 5 moments",
      "**1.** Before patient contact\n**2.** Before clean / aseptic procedure\n**3.** After body fluid exposure\n**4.** After patient contact\n**5.** After contact with patient surroundings",
      "There are five moments. Notice that two of them happen before you do anything, and three happen after. The 'before' moments protect your patient. The 'after' moments protect you and the next patient.",
      52,
      true,
    ),
    slide(
      4,
      "demonstration",
      "Technique in 20 seconds",
      "Apply enough product to cover all surfaces. Rub palms, then back of each hand, between fingers, base of thumbs, fingertips, and wrists.",
      "Apply enough product to cover all surfaces. Rub palms together, then the back of each hand, between your fingers, the base of each thumb, your fingertips, and finally your wrists. Twenty seconds — about the time it takes to count to twenty in your head.",
      48,
      true,
    ),
    slide(
      5,
      "knowledge_check",
      "Knowledge check · which moment?",
      "You're walking out of Mr. Reyes's room after taking his blood pressure. Which moment applies?\n\n- After body fluid exposure\n- **After patient contact**\n- After contact with patient surroundings",
      "Take a moment. You took his blood pressure but didn't touch any body fluids. Which moment applies?",
      26,
      true,
    ),
    slide(
      6,
      "concept",
      "Surfaces count",
      "The bedrail, the call button, the over-bed table — patient surroundings count as patient contact for moment 5.",
      "Here's the one most often missed. The bedrail. The call button. The over-bed table. Patient surroundings count as patient contact for moment five — even if you never touched the patient.",
      36,
      false,
    ),
    slide(
      7,
      "scenario",
      "In your shoes · the cluttered cart",
      "Your med pass cart is parked between two rooms. You finish in 312, then push the cart toward 314. What do you do at the doorway of 314?",
      "You finish in 312 and push the cart toward 314. What do you do at the doorway of 314? Choose the option you'd actually do tomorrow.",
      40,
      false,
    ),
    slide(
      8,
      "summary",
      "Quick recap",
      "- 5 moments, 2 before / 3 after\n- 20 seconds, all surfaces\n- Surroundings = contact",
      "Quick recap. Five moments — two before, three after. Twenty seconds, all surfaces. And remember: surroundings count as contact.",
      28,
      false,
    ),
    slide(
      9,
      "final_check",
      "Final knowledge check",
      "Three short questions covering the objectives.",
      "Three short questions to wrap up.",
      154,
      false,
    ),
  ],
};

const FALLS: Module = {
  id: "m_falls",
  title: "Fall risk assessment · Q2 update",
  status: "draft",
  authoringMode: "guided",
  updatedAt: "2026-05-09T09:02:00.000Z",
  estimatedDurationSeconds: 9 * 60,
  slideCount: 11,
  reviewedSlideCount: 2,
  audience: "All med-surg and step-down nurses. Updated for the new Hester Davis tooling.",
  learningObjectives: [
    "Score a Hester Davis assessment in under 90 seconds.",
    "Identify the three highest-yield interventions for high-risk patients.",
    "Document interventions in the new EHR flowsheet.",
  ],
  slides: [
    slide(1, "title", "Fall risk assessment · Q2 update", "What changed in May.", "...", 20),
    slide(2, "objectives", "What you'll be able to do", "...", "...", 30, true),
    slide(3, "concept", "Hester Davis recap", "...", "...", 60, true),
    slide(4, "concept", "What's new in May", "...", "...", 45),
    slide(5, "demonstration", "Walkthrough · scoring a 56-yr admit", "...", "...", 70),
    slide(6, "knowledge_check", "Knowledge check · scoring", "...", "...", 30),
    slide(7, "concept", "Top 3 interventions", "...", "...", 60),
    slide(8, "scenario", "In your shoes · the post-op patient", "...", "...", 50),
    slide(9, "demonstration", "Documenting in the new flowsheet", "...", "...", 70),
    slide(10, "summary", "Quick recap", "...", "...", 25),
    slide(11, "final_check", "Final knowledge check", "Five questions.", "...", 80),
  ],
};

const MODULES = new Map<string, Module>([
  [HAND_HYGIENE.id, HAND_HYGIENE],
  [FALLS.id, FALLS],
]);

export function listModules(): Module[] {
  return [...MODULES.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getModule(id: string): Module | undefined {
  return MODULES.get(id);
}

const CAP_REQUESTS: CapRequest[] = [
  {
    id: "cr_1",
    userId: "u_jordan",
    userName: "Jordan Lee",
    kind: "ai_credits",
    currentUsage: 100,
    currentAllowance: 100,
    requestedAmount: 50,
    reason: "Building EHR rollout series this week — three more modules to ship by Friday.",
    status: "pending",
    createdAt: "2026-05-09T08:14:00.000Z",
  },
  {
    id: "cr_2",
    userId: "u_marisol",
    userName: "Marisol Vega",
    kind: "narration_minutes",
    currentUsage: 60,
    currentAllowance: 60,
    requestedAmount: 30,
    reason: "Adding Spanish-language narration to the orientation module.",
    status: "pending",
    createdAt: "2026-05-09T11:42:00.000Z",
  },
];

export function listCapRequests(): CapRequest[] {
  return CAP_REQUESTS;
}
