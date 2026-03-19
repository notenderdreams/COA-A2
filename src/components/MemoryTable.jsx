import React, { memo } from "react";
import Badge from "./ui/Badge";

export const MemoryTable = memo(function MemoryTable({ mem }) {
  const blocks = Object.keys(mem)
    .map(Number)
    .sort((a, b) => a - b);

  const h8 = (v) =>
    "0x" + (v >>> 0).toString(16).toUpperCase().padStart(8, "0");

  const TH = {
    padding: "4px 8px",
    borderBottom: "1px solid var(--border)",
    fontSize: "7.5px",
    color: "var(--text3)",
    fontWeight: 600,
    letterSpacing: ".05em",
    textTransform: "uppercase",
    textAlign: "center",
    background: "var(--bg2)",
    position: "sticky",
    top: 0,
  };
  const TD = {
    padding: "5px 8px",
    borderBottom: "1px solid var(--border)",
    textAlign: "center",
    verticalAlign: "middle",
  };

  if (blocks.length === 0) {
    return <div className="empty-t">no memory accessed yet</div>;
  }

  return (
    <div style={{ overflowX: "auto", flex: 1 }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--mono)",
        }}
      >
        <thead>
          <tr>
            <th style={{ ...TH, textAlign: "left", paddingLeft: "10px" }}>
              Block Base Addr
            </th>
            <th style={TH}>Last Op</th>
            <th style={TH}>Word 3</th>
            <th style={TH}>Word 2</th>
            <th style={TH}>Word 1</th>
            <th style={TH}>Word 0</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((addr) => {
            const block = mem[addr];
            const isWB = block.op === "WB";
            return (
              <tr
                key={addr}
                style={{
                  background: isWB
                    ? "rgba(247,118,142,.05)"
                    : "rgba(122,162,247,.05)",
                }}
              >
                <td
                  style={{
                    ...TD,
                    textAlign: "left",
                    color: isWB ? "var(--red)" : "var(--blue)",
                    fontWeight: 600,
                    fontSize: "9.5px",
                    borderLeft: `2px solid ${isWB ? "var(--red)" : "var(--blue)"}`,
                  }}
                >
                  {h8(addr)}
                </td>
                <td style={{ ...TD }}>
                  <Badge
                    variant={isWB ? "Write_Back" : "Compare_Tag"}
                    style={{ fontSize: "7px" }}
                  >
                    {isWB ? "WRITTEN" : "READ"}
                  </Badge>
                </td>
                {[3, 2, 1, 0].map((wi) => {
                  const wordAddr = addr + wi * 4;
                  return (
                    <td
                      key={wi}
                      style={{
                        ...TD,
                        color: isWB ? "var(--text)" : "var(--text2)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "7.5px",
                          color: "var(--text3)",
                          fontFamily: "var(--mono)",
                          marginBottom: "2px",
                        }}
                      >
                        {h8(wordAddr)}
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 600 }}>
                        {h8(block.data[wi])}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
