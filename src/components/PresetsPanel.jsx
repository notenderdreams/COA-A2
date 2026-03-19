import React from "react";
import { PRESETS, buildPresetRun } from "../fsm/presets";

function fmtAddr(addr) {
  return addr.toString(16).toUpperCase().padStart(8, "0").slice(-5);
}

function PresetsPanel({ onApplyPreset, onBeforeLoad }) {
  function handleLoadPreset(name) {
    if (onBeforeLoad) onBeforeLoad();
    setTimeout(() => {
      const result = buildPresetRun(name);
      onApplyPreset(result);
    }, 10);
  }

  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {Object.entries(PRESETS).map(([name, reqs]) => (
        <div
          key={name}
          style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: "4px",
              }}
            >
              {name}
            </div>

            <div
              style={{
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
              }}
            >
              {reqs.slice(0, 10).map((r, i) => (
                <span key={i} className={`qtag ${r.t === "R" ? "r" : "w"}`}>
                  {r.t}:{fmtAddr(r.a)}
                </span>
              ))}

              {reqs.length > 10 && (
                <span style={{ fontSize: "8.5px", color: "var(--text3)" }}>
                  +{reqs.length - 10} more
                </span>
              )}
            </div>
          </div>

          <button className="btn primary" onClick={() => handleLoadPreset(name)}>
            Load Preset
          </button>
        </div>
      ))}
    </div>
  );
}

export default PresetsPanel;