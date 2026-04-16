import React from "react";
import { RotateCcw } from "lucide-react";

/**
 * OpPanel - Footer Operation Panel
 * Provides memory read/write controls
 * Spacing: 4-based scale (8px padding, 4px gaps)
 * Typography: 12px base, 10px labels
 */
function OpPanel({
  addrStr,
  setAddrStr,
  dataStr,
  setDataStr,
  handleRead,
  handleWrite,
  reset,
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text3 ml-1">
            Memory Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={addrStr}
              onChange={(e) => setAddrStr(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-blue outline-none transition-all focus:border-blue/30 focus:bg-white/10"
              placeholder="0x00000000"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text3 ml-1">
            Data Value
          </label>
          <input
            type="text"
            value={dataStr}
            onChange={(e) => setDataStr(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-purple outline-none transition-all focus:border-purple/30 focus:bg-white/10"
            placeholder="0x00000000"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleRead}
          className="flex-1 cursor-pointer rounded-xl bg-blue/10 py-2.5 text-xs font-bold text-blue transition-all hover:bg-blue/20 active:scale-95 border border-blue/20"
        >
          READ
        </button>
        <button
          onClick={handleWrite}
          className="flex-1 cursor-pointer rounded-xl bg-purple/10 py-2.5 text-xs font-bold text-purple transition-all hover:bg-purple/20 active:scale-95 border border-purple/20"
        >
          WRITE
        </button>
        <button
          onClick={reset}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/5 text-text3 transition-all hover:bg-white/10 hover:text-red active:scale-95 border border-white/10"
          title="Reset All"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}

export default OpPanel;
