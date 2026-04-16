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
      <div className="p-5 text-center text-xs text-text3">
        no memory accessed yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-bg/20 backdrop-blur-sm">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky top-0 z-20 border-b border-white/5 bg-bg/80 px-6 py-4 text-left backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-widest text-text3 uppercase italic opacity-40">Block Addr</span>
            </th>
            <th className="sticky top-0 z-20 border-b border-white/5 bg-bg/80 px-4 py-4 text-center backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-widest text-text3 uppercase italic opacity-40">Op</span>
            </th>
            {[3, 2, 1, 0].map((wi) => (
              <th key={wi} className="sticky top-0 z-20 border-b border-white/5 bg-bg/80 px-4 py-4 text-center backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-widest text-text3 uppercase uppercase italic opacity-40">Word {wi}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {blocks.map((addr) => {
            const block = mem[addr];
            const isWB = block.op === "WB";
            return (
              <tr key={addr} className={`group border-b border-white/5 transition-colors duration-200 ${isWB ? "hover:bg-red/5" : "hover:bg-blue/5"}`}>
                <td className={`relative border-b border-white/5 px-6 py-4`}>
                  <div className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full shadow-lg ${isWB ? "bg-red shadow-red/40" : "bg-blue shadow-blue/40"}`} />
                  <span className={`font-mono text-xs font-bold ${isWB ? "text-red" : "text-blue"}`}>
                    {h8(addr)}
                  </span>
                </td>
                <td className="border-b border-white/5 px-4 py-4">
                  <div className="flex justify-center">
                    <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${isWB ? "bg-red/10 text-red border border-red/20" : "bg-blue/10 text-blue border border-blue/20"}`}>
                      {isWB ? "WB" : "READ"}
                    </span>
                  </div>
                </td>
                {[3, 2, 1, 0].map((wi) => {
                  return (
                    <td key={wi} className="border-b border-white/5 px-4 py-4 text-center">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-text3/30 uppercase tracking-tighter">
                          +{wi * 4}B
                        </span>
                        <span className="font-mono text-[11px] font-medium text-text2/80">
                          {h8(block.data[wi])}
                        </span>
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
