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
    <table className="w-full border-collapse font-mono text-sm">
      <thead>
        <tr>
          {HEADERS.map((c) => (
            <th
              key={c}
              className="sticky top-0 z-1 border-b border-border bg-bg2 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text3"
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {trace.length === 0 ? (
          <tr>
            <td colSpan={8} className="p-6 text-center text-sm text-text3">
              load a preset or add requests
            </td>
          </tr>
        ) : (
          trace.map((row, i) => {
            const isActive = i === step;

            return (
              <tr
                key={i}
                onClick={() => onSeek(i)}
                className={`cursor-pointer ${isActive ? "bg-blue/10" : "bg-transparent"}`}
              >
                <td
                  className="border-b border-border px-3 py-2 text-sm text-text2"
                  style={{
                    borderLeft: isActive
                      ? "2px solid var(--blue)"
                      : "2px solid transparent",
                  }}
                >
                  {row.cycle}
                </td>

                <td className="border-b border-border px-3 py-2">
                  <Badge variant={row.state}>{shortState(row.state)}</Badge>
                </td>

                <td className="max-w-40 truncate border-b border-border px-3 py-2 text-xs text-text2">
                  {row.note}
                </td>

                {SIGNAL_KEYS.map((s) => (
                  <td
                    key={s}
                    className={`border-b border-border px-3 py-2 text-center text-sm ${row.sigs[s] ? "font-bold text-blue" : "font-normal text-text3"}`}
                  >
                    {row.sigs[s] ? "1" : "·"}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default TraceTable;
