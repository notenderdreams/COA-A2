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
        className={`sticky top-0 z-10 min-w-16 border-b border-border px-0 pb-[6px] pt-1 text-center text-[8.5px] font-semibold uppercase tracking-[0.05em] shadow-[inset_0_-1px_0_#111111] ${act ? "bg-amber/10 text-amber" : "bg-bg2 text-text3"}`}
      >
        <div className="text-[9px]">W{wi}</div>
        <div className="mt-[2px] text-[7.5px] font-normal opacity-70">
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
        className={`align-top border-b border-border2 px-1 pb-1 pt-[5px] text-center ${act ? "bg-amber/15" : "bg-transparent"}`}
      >
        {val != null ? (
          <span
            className={`font-mono text-[9.5px] ${act ? "font-semibold" : "font-normal"} ${act || isDirty ? "text-amber" : "text-text2"}`}
          >
            {hVal(val)}
          </span>
        ) : (
          <span className="text-[9px] text-text3">—</span>
        )}
      </td>
    );
  }

  return (
    <div className="shrink-0 border-b border-border">
      <div className="relative">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th
                className="sticky top-0 z-10 min-w-[70px] border-b border-border bg-bg2 px-2 py-1 pl-2.5 text-left text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3 shadow-[inset_0_-1px_0_#111111]"
              >
                Set
              </th>
              <th
                className="sticky top-0 z-10 w-7 border-b border-border bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3 shadow-[inset_0_-1px_0_#111111]"
              >
                V
              </th>
              <th
                className="sticky top-0 z-10 w-7 border-b border-border bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3 shadow-[inset_0_-1px_0_#111111]"
              >
                D
              </th>
              <th
                className="sticky top-0 z-10 min-w-[70px] border-b border-border bg-bg2 px-2 py-1 pl-1.5 text-left text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3 shadow-[inset_0_-1px_0_#111111]"
              >
                Tag
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
                  className={
                    isActive
                      ? "bg-blue/10"
                      : isDirty
                        ? "bg-amber/5"
                        : "bg-transparent"
                  }
                >
                  <td
                    className={`border-b border-border2 border-l-2 px-2 py-1.5 text-left ${isActive ? "border-l-blue" : "border-l-transparent"}`}
                  >
                    <span
                      className={`font-mono text-[9.5px] ${isActive ? "font-semibold text-text" : "font-normal text-text2"}`}
                    >
                      {i}
                    </span>
                  </td>
                  <td className="border-b border-border2 px-0 py-1.5 text-center">
                    <div className="flex h-5 items-center justify-center">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-xs text-[7.5px] font-semibold leading-none ${l.valid ? "bg-green/15 text-green" : "bg-bg3 text-text3"}`}
                      >
                        {l.valid ? "1" : "0"}
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-border2 px-0 py-1.5 text-center">
                    <div className="flex h-5 items-center justify-center">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-xs text-[7.5px] font-semibold leading-none ${isDirty ? "bg-amber/15 text-amber" : "bg-bg3 text-text3"}`}
                      >
                        {isDirty ? "1" : "0"}
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-border2 px-1.5 py-1.5 align-middle">
                    <div className="flex h-full items-center">
                      <span
                        className={`font-mono text-[9.5px] ${isActive ? "font-semibold text-blue" : isDirty ? "font-normal text-amber" : "font-normal text-text2"}`}
                      >
                        {l.valid ? h5(l.tag) : "—"}
                      </span>
                    </div>
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
      <div className="flex justify-between border-t border-border px-2.5 py-0.75 text-[7.5px] text-text3">
        <span>all 1024 sets loaded</span>
        <span>each row = 16B block · bar = value magnitude</span>
      </div>
    </div>
  );
});
