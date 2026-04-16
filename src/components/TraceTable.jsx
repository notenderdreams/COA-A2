import React from "react";
import Badge from "./ui/Badge";

const HEADERS = ["#", "State", "Note", "STC", "MRD", "MWR", "CWR", "RDY"];

const SIGNAL_KEYS = [
  "stall_cpu",
  "mem_read",
  "mem_write",
  "cache_write",
  "mem_ready",
];

function shortState(state) {
  return (
    {
      Idle: "IDLE",
      Compare_Tag: "CMP",
      Write_Back: "WB",
      Allocate: "ALLOC",
    }[state] || state
  );
}

function TraceTable({ trace, step, onSeek }) {
  return (
    <div className="flex-1 overflow-auto bg-bg/20 backdrop-blur-sm">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {HEADERS.map((c) => (
              <th
                key={c}
                className="sticky top-0 z-20 border-b border-white/5 bg-bg/80 px-4 py-4 text-left backdrop-blur-md"
              >
                <span className="text-[10px] font-bold tracking-widest text-text3 uppercase italic opacity-40">{c}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {trace.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-12 text-center">
                <div className="flex flex-col items-center gap-2 opacity-20">
                  <div className="text-sm font-bold tracking-widest uppercase">No execution data</div>
                  <div className="text-[10px] font-medium italic">Pending operations...</div>
                </div>
              </td>
            </tr>
          ) : (
            trace.map((row, i) => {
              const isActive = i === step;

              return (
                <tr
                  key={i}
                  onClick={() => onSeek(i)}
                  className={`group cursor-pointer transition-colors duration-200 ${isActive ? "bg-blue/10" : "hover:bg-white/[0.02]"}`}
                >
                  <td className={`border-b border-white/5 px-4 py-3.5 relative`}>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue shadow-[0_0_12px_rgba(122,162,247,1)]" />
                    )}
                    <span className={`font-mono text-xs ${isActive ? "font-bold text-blue" : "text-text3"}`}>
                      {row.cycle}
                    </span>
                  </td>

                  <td className="border-b border-white/5 px-4 py-3.5">
                    <Badge className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${isActive ? "ring-2 ring-blue/20" : ""}`} variant={row.state}>
                      {shortState(row.state)}
                    </Badge>
                  </td>

                  <td className="border-b border-white/5 px-4 py-3.5 max-w-[200px]">
                    <div className={`truncate text-[10px] font-medium tracking-tight ${isActive ? "text-text" : "text-text2/60"}`}>
                      {row.note}
                    </div>
                  </td>

                  {SIGNAL_KEYS.map((s) => (
                    <td key={s} className="border-b border-white/5 px-4 py-3.5 text-center">
                      <div className={`mx-auto h-1.5 w-1.5 rounded-full transition-all ${
                        row.sigs[s] ? "bg-blue shadow-[0_0_8px_rgba(122,162,247,0.5)]" : "bg-white/5"
                      }`} />
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TraceTable;
