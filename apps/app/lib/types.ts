/**
 * In-app domain types. Mirrors a subset of DESIGN.md §5 sufficient to wire the
 * UI. Real DB types come from @kiris/db in Step 3.
 */

export type Tier = "standard" | "hipaa";
export type Role = "org_admin" | "team_admin" | "editor" | "viewer";
export type AuthoringMode = "express" | "guided";
export type ModuleStatus = "draft" | "ready" | "exported";

export type SlideType =
  | "title"
  | "objectives"
  | "concept"
  | "demonstration"
  | "knowledge_check"
  | "scenario"
  | "summary"
  | "final_check";

export interface Slide {
  id: string;
  position: number;
  type: SlideType;
  title: string;
  bodyMarkdown: string;
  narrationScript: string;
  altText: string;
  reviewedByUser: boolean;
  aiConfidence: number;
  durationSeconds: number;
}

export interface ModuleSummary {
  id: string;
  title: string;
  status: ModuleStatus;
  authoringMode: AuthoringMode;
  updatedAt: string;
  estimatedDurationSeconds: number;
  slideCount: number;
  reviewedSlideCount: number;
  audience: string;
}

export interface Module extends ModuleSummary {
  learningObjectives: string[];
  slides: Slide[];
}

export interface Session {
  user: { id: string; name: string; email: string; role: Role };
  tenant: { id: string; name: string; tier: Tier };
  usage: {
    aiCreditsUsed: number;
    aiCreditsAllowance: number;
    narrationMinutesUsed: number;
    narrationMinutesAllowance: number;
  };
}

export interface CapRequest {
  id: string;
  userId: string;
  userName: string;
  kind: "ai_credits" | "narration_minutes";
  currentUsage: number;
  currentAllowance: number;
  requestedAmount: number;
  reason: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}
