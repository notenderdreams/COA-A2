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
    <div className="flex flex-col gap-2 p-2.5">
      {Object.entries(PRESETS).map(([name, reqs]) => (
        <div
          key={name}
          className="flex items-center justify-between rounded-md border border-border bg-bg3 p-2.5"
        >
          <div>
            <div className="mb-1 text-[11px] font-semibold text-text">
              {name}
            </div>

            <div className="flex flex-wrap gap-1">
              {reqs.slice(0, 10).map((r, i) => (
                <Tag key={i} type={r.t}>
                  {r.t}:{fmtAddr(r.a)}
                </Tag>
              ))}

              {reqs.length > 10 && (
                <span className="text-[8.5px] text-text3">
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