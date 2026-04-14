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

  const TH = {
    padding: "4px 0 6px",
    borderBottom: "1px solid var(--border)",
    fontSize: "7.5px",
    color: "var(--text3)",
    fontWeight: 600,
    letterSpacing: ".05em",
    textTransform: "uppercase",
    textAlign: "center",
  };
  const TD = {
    padding: "0",
    borderBottom: "1px solid var(--border2)",
    verticalAlign: "top",
  };

  function WHead(wi) {
    const act = wi === activeWord;
    return (
      <th
        key={wi}
        style={{
          ...TH,
          minWidth: "64px",
          background: act ? "rgba(224,175,104,.1)" : "transparent",
          color: act ? "var(--amber)" : "var(--text3)",
        }}
      >
        <div>W{wi}</div>
        <div
          style={{
            fontWeight: 400,
            fontSize: "7px",
            opacity: 0.7,
            marginTop: "2px",
          }}
        >
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
        style={{
          ...TD,
          background: act ? "rgba(224,175,104,.14)" : "transparent",
          textAlign: "center",
          padding: "5px 4px 4px",
        }}
      >
        {val != null ? (
          <span
            style={{
              fontSize: "9.5px",
              fontFamily: "var(--mono)",
              fontWeight: act ? 700 : 400,
              color: act
                ? "var(--amber)"
                : isDirty
                  ? "var(--amber)"
                  : "var(--text2)",
            }}
          >
            {hVal(val)}
          </span>
        ) : (
          <span style={{ color: "var(--text3)", fontSize: "9px" }}>—</span>
        )}
      </td>
    );
  }

  return (
    <div className="shrink-0 border-b border-border">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th
                className="sticky top-0 bg-bg2 px-2 py-1 text-left text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3"
                style={{ minWidth: "70px", paddingLeft: "10px" }}
              >
                Set
              </th>
              <th
                className="sticky top-0 bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3"
                style={{ width: "28px" }}
              >
                V
              </th>
              <th
                className="sticky top-0 bg-bg2 px-2 py-1 text-center text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3"
                style={{ width: "28px" }}
              >
                D
              </th>
              <th
                className="sticky top-0 bg-bg2 px-2 py-1 text-left text-[7.5px] font-semibold uppercase tracking-[0.05em] text-text3"
                style={{ minWidth: "70px", paddingLeft: "6px" }}
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
                    className="border-b border-border2 px-2 py-1.5 text-left"
                    style={{
                      borderLeft: isActive
                        ? "2px solid var(--blue)"
                        : "2px solid transparent",
                    }}
                  >
                    <span
                      className={`font-mono text-[9.5px] ${isActive ? "font-semibold text-text" : "font-normal text-text2"}`}
                    >
                      {i}
                    </span>
                  </td>
                  <td className="border-b border-border2 px-0 py-1.5 text-center">
                    <span
                      className={`inline-flex size-3 rounded-[2px] text-[7.5px] font-semibold leading-3 ${l.valid ? "bg-green/15 text-green" : "bg-bg3 text-text3"}`}
                    >
                      {l.valid ? "1" : "0"}
                    </span>
                  </td>
                  <td className="border-b border-border2 px-0 py-1.5 text-center">
                    <span
                      className={`inline-flex size-3 rounded-[2px] text-[7.5px] font-semibold leading-3 ${isDirty ? "bg-amber/15 text-amber" : "bg-bg3 text-text3"}`}
                    >
                      {isDirty ? "1" : "0"}
                    </span>
                  </td>
                  <td
                    className="border-b border-border2 px-1.5 py-1.5 font-mono text-[8.5px]"
                    style={{
                      color: isActive
                        ? "var(--blue)"
                        : isDirty
                          ? "var(--amber)"
                          : "var(--text2)",
                    }}
                  >
                    {l.valid ? h5(l.tag) : "—"}
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
