import Link from "next/link";
import { Badge, Card, CardBody, ProgressBar } from "@kiris/ui";
import { Sparkles, Workflow } from "lucide-react";
import type { ModuleSummary } from "@/lib/types";
import { formatDuration, formatRelative } from "@/lib/format";

export function ModuleCard({ module }: { module: ModuleSummary }) {
  const reviewedPct = module.slideCount === 0
    ? 0
    : Math.round((module.reviewedSlideCount / module.slideCount) * 100);
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-2">
          <Badge variant={module.status === "ready" ? "success" : "neutral"}>
            {module.status}
          </Badge>
          <Badge variant="outline">
            {module.authoringMode === "express" ? (
              <>
                <Sparkles size={11} aria-hidden /> Express
              </>
            ) : (
              <>
                <Workflow size={11} aria-hidden /> Guided
              </>
            )}
          </Badge>
        </div>
        <h3 className="mt-3 text-heading-md">
          <Link
            href={`/modules/${module.id}`}
            className="transition-colors duration-state hover:text-accent"
          >
            {module.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-body-sm text-text-secondary">{module.audience}</p>

        <div className="mt-5">
          <ProgressBar
            value={module.reviewedSlideCount}
            max={module.slideCount}
            label="Reviewed slides"
          />
        </div>

        <div className="mt-5 flex items-center justify-between text-caption text-text-tertiary">
          <span>{module.slideCount} slides · {formatDuration(module.estimatedDurationSeconds)}</span>
          <span>{formatRelative(module.updatedAt)}</span>
        </div>
      </CardBody>
    </Card>
  );
}
