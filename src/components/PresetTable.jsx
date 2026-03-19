import { PRESETS, buildPresetRun } from "../fsm/presets";
import Tag from "./ui/Tag";
import Button from "./ui/Button";

function fmtAddr(addr) {
  return addr.toString(16).toUpperCase().padStart(8, "0").slice(-5);
}

function PresetTable({ onApplyPreset, onBeforeLoad }) {
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
                <Tag key={i} type={r.t}>
                  {r.t}:{fmtAddr(r.a)}
                </Tag>
              ))}

              {reqs.length > 10 && (
                <span style={{ fontSize: "8.5px", color: "var(--text3)" }}>
                  +{reqs.length - 10} more
                </span>
              )}
            </div>
          </div>

          <Button variant="primary" onClick={() => handleLoadPreset(name)}>
            Load Preset
          </Button>
        </div>
      ))}
    </div>
  );
}

export default PresetTable;