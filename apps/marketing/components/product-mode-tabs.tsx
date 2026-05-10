"use client";

import { useId, useState } from "react";
import { cn } from "@kiris/ui";

/**
 * Tab switcher for the /product page top section. Two visible panels
 * (Express AI / Guided AI) toggle on click. Keyboard: arrow keys move
 * between tabs (per WAI-ARIA tab pattern), Enter/Space activates.
 */
export function ProductModeTabs({
  expressLabel,
  guidedLabel,
  express,
  guided,
}: {
  expressLabel: string;
  guidedLabel: string;
  express: React.ReactNode;
  guided: React.ReactNode;
}) {
  const [active, setActive] = useState<"express" | "guided">("express");
  const baseId = useId();
  const expressTabId = `${baseId}-tab-express`;
  const guidedTabId = `${baseId}-tab-guided`;
  const expressPanelId = `${baseId}-panel-express`;
  const guidedPanelId = `${baseId}-panel-guided`;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((prev) => (prev === "express" ? "guided" : "express"));
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Authoring modes"
        onKeyDown={onKey}
        className="bg-surface-sunken border-border-subtle inline-flex rounded-full border p-1"
      >
        <Tab
          id={expressTabId}
          panelId={expressPanelId}
          active={active === "express"}
          onClick={() => setActive("express")}
        >
          {expressLabel}
        </Tab>
        <Tab
          id={guidedTabId}
          panelId={guidedPanelId}
          active={active === "guided"}
          onClick={() => setActive("guided")}
        >
          {guidedLabel}
        </Tab>
      </div>
      <div className="mt-8">
        <div
          role="tabpanel"
          id={expressPanelId}
          aria-labelledby={expressTabId}
          hidden={active !== "express"}
        >
          {express}
        </div>
        <div
          role="tabpanel"
          id={guidedPanelId}
          aria-labelledby={guidedTabId}
          hidden={active !== "guided"}
        >
          {guided}
        </div>
      </div>
    </div>
  );
}

function Tab({
  id,
  panelId,
  active,
  onClick,
  children,
}: {
  id: string;
  panelId: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-controls={panelId}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
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
