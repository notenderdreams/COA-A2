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
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "var(--mono)",
      }}
    >
      <thead>
        <tr>
          {HEADERS.map((c) => (
            <th
              key={c}
              style={{
                padding: "5px 8px",
                textAlign: "left",
                fontSize: "8px",
                fontWeight: 600,
                letterSpacing: ".07em",
                textTransform: "uppercase",
                color: "var(--text3)",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg2)",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {trace.length === 0 ? (
          <tr>
            <td colSpan={8} className="empty-t">
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
                style={{
                  cursor: "pointer",
                  background: isActive
                    ? "rgba(122,162,247,.1)"
                    : "transparent",
                }}
              >
                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "9px",
                    color: "var(--text2)",
                    borderLeft: isActive
                      ? "2px solid var(--blue)"
                      : "2px solid transparent",
                  }}
                >
                  {row.cycle}
                </td>

                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <Badge variant={row.state}>
                    {shortState(row.state)}
                  </Badge>
                </td>

                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text2)",
                    fontSize: "8px",
                    maxWidth: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.note}
                </td>

                {SIGNAL_KEYS.map((s) => (
                  <td
                    key={s}
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid var(--border)",
                      textAlign: "center",
                      fontSize: "9px",
                      color: row.sigs[s] ? "var(--blue)" : "var(--text3)",
                      fontWeight: row.sigs[s] ? 700 : 400,
                    }}
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