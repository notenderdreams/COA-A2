import React, { memo } from "react";
import Badge from "./ui/Badge";

export const MemoryTable = memo(function MemoryTable({ mem }) {
  const blocks = Object.keys(mem)
    .map(Number)
    .sort((a, b) => a - b);

  const h8 = (v) =>
    "0x" + (v >>> 0).toString(16).toUpperCase().padStart(8, "0");

  if (blocks.length === 0) {
    return (
      <div className="p-5 text-center text-[9px] text-text3">
        no memory accessed yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full border-collapse font-mono text-[9px]">
        <thead>
          <tr>
            <th
              className="sticky top-0 border-b border-border bg-bg2 px-2 py-1 pl-2.5 text-left text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3"
            >
              Block Base Addr
            </th>
            <th className="sticky top-0 border-b border-border bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3">
              Last Op
            </th>
            <th className="sticky top-0 border-b border-border bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3">
              Word 3
            </th>
            <th className="sticky top-0 border-b border-border bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3">
              Word 2
            </th>
            <th className="sticky top-0 border-b border-border bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3">
              Word 1
            </th>
            <th className="sticky top-0 border-b border-border bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3">
              Word 0
            </th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((addr) => {
            const block = mem[addr];
            const isWB = block.op === "WB";
            return (
              <tr key={addr} className={isWB ? "bg-red/5" : "bg-blue/5"}>
                <td
                  className={`border-b border-l-2 border-border text-left text-[9.5px] font-semibold ${isWB ? "border-l-red text-red" : "border-l-blue text-blue"}`}
                >
                  {h8(addr)}
                </td>
                <td className="border-b border-border px-2 py-1 text-center align-middle">
                  <Badge
                    variant={isWB ? "Write_Back" : "Compare_Tag"}
                    className="text-[7px]"
                  >
                    {isWB ? "WRITTEN" : "READ"}
                  </Badge>
                </td>
                {[3, 2, 1, 0].map((wi) => {
                  const wordAddr = addr + wi * 4;
                  return (
                    <td
                      key={wi}
                      className={`border-b border-border px-2 py-1 text-center align-middle ${isWB ? "text-text" : "text-text2"}`}
                    >
                      <div className="mb-0.5 font-mono text-[7.5px] text-text3">
                        {h8(wordAddr)}
                      </div>
                      <div className="text-[10px] font-semibold">
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
