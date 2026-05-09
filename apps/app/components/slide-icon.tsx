import {
  CheckSquare,
  GraduationCap,
  ListTree,
  PenLine,
  PlayCircle,
  ScrollText,
  Sparkles,
  Type,
} from "lucide-react";
import type { SlideType } from "@/lib/types";

export function SlideIcon({ type, size = 14 }: { type: SlideType; size?: number }) {
  const Cmp = MAP[type];
  return <Cmp size={size} aria-hidden />;
}

const MAP: Record<SlideType, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  title: Type,
  objectives: ListTree,
  concept: PenLine,
  demonstration: PlayCircle,
  knowledge_check: CheckSquare,
  scenario: Sparkles,
  summary: ScrollText,
  final_check: GraduationCap,
};

export const SLIDE_TYPE_LABEL: Record<SlideType, string> = {
  title: "Title",
  objectives: "Objectives",
  concept: "Concept",
  demonstration: "Demonstration",
  knowledge_check: "Knowledge check",
  scenario: "In your shoes",
  summary: "Summary",
  final_check: "Final check",
};
