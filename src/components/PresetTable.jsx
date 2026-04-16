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
    <div className="flex flex-col gap-4 p-6 bg-bg/20 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-blue" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text3">
          Execution Presets
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Object.entries(PRESETS).map(([name, reqs]) => (
          <div
            key={name}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-sm font-bold text-text mb-1 tracking-tight">
                  {name}
                </div>
                <div className="text-[10px] font-bold text-text3 uppercase tracking-widest opacity-60">
                  {reqs.length} Operations
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={() => handleLoadPreset(name)}
                className="bg-blue/10 border-blue/20 text-blue hover:bg-blue hover:text-white rounded-xl px-4 py-2 text-[11px] font-bold transition-all active:scale-95"
              >
                DEPLOY
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {reqs.slice(0, 8).map((r, i) => (
                <Tag key={i} type={r.t} className="bg-white/5 border-white/5 text-[9px] px-2 py-0.5 rounded-md font-mono">
                  {r.t}:{fmtAddr(r.a)}
                </Tag>
              ))}
              {reqs.length > 8 && (
                <span className="inline-flex items-center px-1 text-[10px] font-bold text-text3 opacity-40 uppercase tracking-tighter">
                  +{reqs.length - 8} MORE
                </span>
              )}
            </div>
            
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-blue/5 blur-2xl group-hover:bg-blue/10 transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PresetTable;