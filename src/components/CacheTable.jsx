import React, { useRef, useEffect, memo } from "react";
import { addr2offset } from "../fsm/logic";

export const CacheTable = memo(function CacheTable({
  cache,
  activeSet,
  lastReq,
}) {
  const rows = Array.from({ length: cache.length }, (_, i) => i);
  const rowRefs = useRef({});

  useEffect(() => {
    if (activeSet >= 0 && rowRefs.current[activeSet]) {
      rowRefs.current[activeSet].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeSet]);

  const hVal = (v) =>
    "0x" + (v >>> 0).toString(16).toUpperCase().padStart(8, "0");
  const h5 = (v) =>
    "0x" + (v >>> 0).toString(16).toUpperCase().padStart(5, "0");

  const activeOff = lastReq != null ? addr2offset(lastReq) : -1;
  const activeWord = activeOff >= 0 ? Math.floor(activeOff / 4) : -1;

  function WHead(wi) {
    const act = wi === activeWord;
    return (
      <th
        key={wi}
        className={`sticky top-0 z-10 min-w-[70px] border-b border-white/5 px-4 py-3 text-center transition-colors duration-300 ${
          act ? "bg-amber/10 text-amber shadow-[inset_0_-2px_0_var(--amber)]" : "bg-bg/80 text-text3 backdrop-blur-md"
        }`}
      >
        <div className="text-[10px] font-bold tracking-widest uppercase">Word {wi}</div>
        <div className="mt-0.5 text-[9px] font-medium opacity-40">
          [{wi * 4 + 3}:{wi * 4}]
        </div>
      </th>
    );
  }

  function WCell(wi, val, isActive, isDirty) {
    const act = isActive && wi === activeWord;
    return (
      <td
        key={wi}
        className={`align-top border-b border-white/5 px-4 py-3.5 text-center transition-all duration-300 ${
          act ? "bg-amber/5 animate-pulse" : "bg-transparent"
        }`}
      >
        {val != null ? (
          <span
            className={`font-mono text-xs tracking-tight ${
              act ? "font-bold text-amber" : isDirty ? "text-amber/90" : "text-text2/80"
            }`}
          >
            {hVal(val)}
          </span>
        ) : (
          <span className="text-xs text-text3/30">—</span>
        )}
      </td>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg/20 backdrop-blur-sm">
      <div className="relative flex-1 overflow-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky top-0 z-20 min-w-[70px] border-b border-white/5 bg-bg/80 px-5 py-4 text-left backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-widest text-text3 uppercase">Set</span>
              </th>
              <th className="sticky top-0 z-20 w-10 border-b border-white/5 bg-bg/80 px-2 py-4 text-center backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-widest text-text3 uppercase">V</span>
              </th>
              <th className="sticky top-0 z-20 w-10 border-b border-white/5 bg-bg/80 px-2 py-4 text-center backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-widest text-text3 uppercase">D</span>
              </th>
              <th className="sticky top-0 z-20 min-w-[80px] border-b border-white/5 bg-bg/80 px-4 py-4 text-left backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-widest text-text3 uppercase">Tag</span>
              </th>
              {WHead(3)}
              {WHead(2)}
              {WHead(1)}
              {WHead(0)}
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const l = cache[i];
              const isActive = i === activeSet;
              const isDirty = l.valid && l.dirty;
              return (
                <tr
                  key={i}
                  ref={(el) => (rowRefs.current[i] = el)}
                  className={`group transition-colors duration-200 ${
                    isActive
                      ? "bg-blue/10"
                      : isDirty
                        ? "bg-amber/[0.03] hover:bg-amber/[0.05]"
                        : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className={`relative border-b border-white/5 px-5 py-3.5 text-left`}>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue shadow-[0_0_12px_rgba(122,162,247,1)]" />
                    )}
                    <span className={`font-mono text-xs ${isActive ? "font-bold text-blue" : "text-text2/60"}`}>
                      {i}
                    </span>
                  </td>
                  <td className="border-b border-white/5 px-0 py-3.5 text-center">
                    <div className={`mx-auto h-2 w-2 rounded-full ring-4 transition-all ${
                      l.valid ? "bg-green ring-green/10" : "bg-bg3 ring-transparent"
                    }`} />
                  </td>
                  <td className="border-b border-white/5 px-0 py-3.5 text-center">
                    <div className={`mx-auto h-2 w-2 rounded-full ring-4 transition-all ${
                      isDirty ? "bg-amber ring-amber/10" : "bg-bg3 ring-transparent"
                    }`} />
                  </td>
                  <td className="border-b border-white/5 px-4 py-3.5">
                    <span className={`font-mono text-xs ${isActive ? "font-bold text-blue" : isDirty ? "text-amber/90" : "text-text2/60"}`}>
                      {l.valid ? h5(l.tag) : "—"}
                    </span>
                  </td>
                  {[3, 2, 1, 0].map((wi) =>
                    WCell(
                      wi,
                      l.valid && Array.isArray(l.data) ? l.data[wi] : null,
                      isActive,
                      isDirty,
                    ),
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/5 px-6 py-2 pb-3 bg-bg/40 backdrop-blur-md">
        <span className="text-[10px] font-bold tracking-widest text-text3 uppercase opacity-60">1024 sets loaded</span>
        <span className="text-[10px] font-bold tracking-widest text-text2 uppercase">16B block size · 4-word hierarchy</span>
      </div>
    </div>
  );
});
