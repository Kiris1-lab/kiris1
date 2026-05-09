import Link from "next/link";
import { Badge, Card, CardBody, ProgressBar } from "@kiris/ui";
import { Sparkles, Workflow } from "lucide-react";
import type { ModuleSummary } from "@/lib/types";
import { formatDuration, formatRelative } from "@/lib/format";

export function ModuleCard({ module }: { module: ModuleSummary }) {
  const reviewedPct =
    module.slideCount === 0 ? 0 : Math.round((module.reviewedSlideCount / module.slideCount) * 100);
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-2">
          <Badge variant={module.status === "ready" ? "success" : "neutral"}>{module.status}</Badge>
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
        <h3 className="text-heading-md mt-3">
          <Link
            href={`/modules/${module.id}`}
            className="duration-state hover:text-accent transition-colors"
          >
            {module.title}
          </Link>
        </h3>
        <p className="text-body-sm text-text-secondary mt-2 line-clamp-2">{module.audience}</p>

        <div className="mt-5">
          <ProgressBar
            value={module.reviewedSlideCount}
            max={module.slideCount}
            label="Reviewed slides"
          />
        </div>

        <div className="text-caption text-text-tertiary mt-5 flex items-center justify-between">
          <span>
            {module.slideCount} slides · {formatDuration(module.estimatedDurationSeconds)}
          </span>
          <span>{formatRelative(module.updatedAt)}</span>
        </div>
      </CardBody>
    </Card>
  );
}
