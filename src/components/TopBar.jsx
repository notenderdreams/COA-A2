import React from "react";
import Chip from "./ui/Chip";

/**
 * TopBar - Application Header
 * Displays app title and status chips
 * Height: 48px (12 units), padding: 16px (4 units), gap: 16px
 * Typography: 14px base weight 600
 */
export default function TopBar({ running, total }) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-4 border-b border-border bg-bg2 px-4">
      <div className="size-2 rounded-full bg-blue" />
      <div className="text-base font-semibold text-text">
        FSM Cache Controller
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Chip>COA / A2 / 230041234</Chip>
        <Chip live={running}>{running ? "RUNNING" : "PAUSED"}</Chip>
        <Chip className="text-green">{total} cycles</Chip>
      </div>
    </div>
  );
}
