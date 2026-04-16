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
    <div className="flex flex-col border-b border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text3">
            Statistics
          </span>
        </div>
        {curState && (
          <Badge className="bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-wider text-text2 px-2 py-1">
            {curState.replace("_", " ")}
          </Badge>
        )}
      </div>

      <div className="flex">
        <div className="flex-1 border-r border-white/5 px-6 py-4 transition-colors hover:bg-white/[0.02]">
          <div className="text-xl font-title font-bold text-green">{hits}</div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-text3 opacity-60">
            HITS
          </div>
        </div>
        <div className="flex-1 border-r border-white/5 px-6 py-4 transition-colors hover:bg-white/[0.02]">
          <div className="text-xl font-title font-bold text-red">{misses}</div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-text3 opacity-60">
            MISSES
          </div>
        </div>
        <div className="flex-1 border-r border-white/5 px-6 py-4 transition-colors hover:bg-white/[0.02]">
          <div className="text-xl font-title font-bold text-amber">{wbs}</div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-text3 opacity-60">
            WBKS
          </div>
        </div>
        <div className="flex-1 px-6 py-4 transition-colors hover:bg-white/[0.02]">
          <div className="text-xl font-title font-bold text-blue">
            {hits + misses > 0 ? hitRate + "%" : "—"}
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-text3 opacity-60">
            HIT RATE
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
