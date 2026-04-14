import React from "react";
import Badge from "./ui/Badge";

/**
 * StatsPanel - Display Execution Statistics
 * Shows hits, misses, writebacks, and hit rate
 * Spacing: 4-based scale
 * Typography: 16px numbers, 10px labels
 */
function StatsPanel({ curState, hits, misses, wbs }) {
  const hitRate =
    hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <div className="flex flex-col gap-0">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text2">
          Execution
        </span>
        {curState && (
          <Badge variant={curState}>{curState.replace("_", " ")}</Badge>
        )}
      </div>

      <div className="flex shrink-0 border-b border-border">
        <div className="flex-1 border-r border-border px-3 py-2">
          <div className="text-lg font-semibold text-green">{hits}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-text3">
            hits
          </div>
        </div>
        <div className="flex-1 border-r border-border px-3 py-2">
          <div className="text-lg font-semibold text-red">{misses}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-text3">
            misses
          </div>
        </div>
        <div className="flex-1 border-r border-border px-3 py-2">
          <div className="text-lg font-semibold text-amber">{wbs}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-text3">
            writebacks
          </div>
        </div>
        <div className="flex-1 px-3 py-2">
          <div className="text-lg font-semibold text-blue">
            {hits + misses > 0 ? hitRate + "%" : "—"}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-text3">
            hit rate
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
