import React from "react";

function StatsPanel({ curState, hits, misses, wbs }) {
  const hitRate = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div className="ph">
        <span className="ph-label">Execution</span>
        {curState && (
          <span className={`schip sc-${curState}`}>
            {curState.replace("_", " ")}
          </span>
        )}
      </div>

      <div className="stats-row">
        <div className="stat">
          <div className="stat-v sv-green">{hits}</div>
          <div className="stat-l">hits</div>
        </div>
        <div className="stat">
          <div className="stat-v sv-red">{misses}</div>
          <div className="stat-l">misses</div>
        </div>
        <div className="stat">
          <div className="stat-v sv-amber">{wbs}</div>
          <div className="stat-l">writebacks</div>
        </div>
        <div className="stat">
          <div className="stat-v sv-blue">{hits + misses > 0 ? hitRate + "%" : "—"}</div>
          <div className="stat-l">hit rate</div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;