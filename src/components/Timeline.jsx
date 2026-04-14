import React, { useRef, useCallback, useState, useEffect, memo } from "react";
import { TLC, SIGC } from "../fsm/constants";

const TimelineRow = memo(function TimelineRow({
  label,
  sg,
  cf,
  isState,
  total,
  trackRef,
  phPct,
  onSeek,
  startDrag,
}) {
  return (
    <div className="mb-1 flex h-5 items-center">
      <div className="w-24 shrink-0 whitespace-nowrap pr-2 text-right text-xs text-text3">
        {label}
      </div>
      <div
        className="relative h-full flex-1 cursor-pointer overflow-hidden rounded-sm border border-border bg-bg3"
        ref={isState ? trackRef : null}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onSeek(
            Math.min(
              total - 1,
              Math.floor(((e.clientX - r.left) / r.width) * total),
            ),
          );
        }}
      >
        <div
          className="pointer-events-none absolute bottom-0 top-0 w-0.5 -translate-x-1/2 bg-white/80"
          style={{ left: `${phPct}%` }}
        />
        {sg.map((seg, i) => {
          const c = cf(seg.v);
          if (!c) return null;
          return (
            <div
              key={i}
              className="absolute top-px flex h-[calc(100%-2px)] items-center justify-center overflow-hidden whitespace-nowrap rounded-sm text-xs font-semibold"
              style={{
                left: `${(seg.s / total) * 100}%`,
                width: `${seg.pct}%`,
                background: c.bg,
                borderTop: `1.5px solid ${c.bd}`,
                color: c.tx || c.bd,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSeek(seg.s);
              }}
            >
              {""}
            </div>
          );
        })}
        {isState && (
          <div
            className="absolute top-0 z-10 flex h-full w-3.5 cursor-grab items-center justify-center"
            style={{ left: `calc(${phPct}% - 7px)` }}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
          >
            <div className="h-full w-[1.5px] bg-white/85" />
          </div>
        )}
      </div>
    </div>
  );
});

function usePlayPos(step, total, running, dur) {
  const [pos, setPos] = useState(0);
  const raf = useRef();
  const posRef = useRef(0);
  useEffect(() => {
    if (!total) {
      posRef.current = 0;
      raf.current = requestAnimationFrame(() => setPos(0));
      return;
    }
    const target = step < 0 ? 0 : (step + 0.5) / total;
    cancelAnimationFrame(raf.current);
    const from = posRef.current;
    const d = running ? dur + 50 : 160;
    const t0 = performance.now();
    const anim = (now) => {
      const t = Math.min((now - t0) / d, 1);
      const e = running ? t : 1 - Math.pow(1 - t, 3);
      const value = from + (target - from) * e;
      posRef.current = value;
      setPos(value);
      if (t < 1) raf.current = requestAnimationFrame(anim);
    };
    raf.current = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(raf.current);
  }, [step, total, running, dur]);
  return pos;
}

export const Timeline = memo(function Timeline({
  trace,
  step,
  running,
  stateDur,
  onSeek,
}) {
  const total = trace.length;
  const ph = usePlayPos(step, total, running, stateDur);
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const startDrag = useCallback(
    (e) => {
      e.preventDefault();
      dragging.current = true;
      const move = (ev) => {
        if (!dragging.current || !trackRef.current) return;
        const r = trackRef.current.getBoundingClientRect();
        const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
        onSeek(
          Math.min(
            total - 1,
            Math.floor(
              Math.max(0, Math.min(1, (cx - r.left) / r.width)) * total,
            ),
          ),
        );
      };
      const up = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", up);
    },
    [total, onSeek],
  );

  if (!total) {
    return (
      <div className="shrink-0 border-t border-border bg-bg2 px-3 py-2">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-text2">
            Timeline
          </span>
          <span className="text-xs text-text3">no data yet</span>
        </div>
      </div>
    );
  }

  function segs(key) {
    const out = [];
    let i = 0;
    while (i < total) {
      const v = key === "state" ? trace[i].state : trace[i].sigs[key];
      let j = i + 1;
      while (
        j < total &&
        (key === "state" ? trace[j].state : trace[j].sigs[key]) === v
      ) {
        j++;
      }
      out.push({ s: i, e: j, v, pct: ((j - i) / total) * 100 });
      i = j;
    }
    return out;
  }

  const stSegs = segs("state");
  const phPct = ph * 100;
  const interval = total <= 16 ? 4 : total <= 32 ? 8 : 16;
  const ticks = [];
  for (let i = 0; i <= total; i += interval) ticks.push(i);

  return (
    <div className="shrink-0 border-t border-border bg-bg2 px-3 py-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-text2">
          Timeline
        </span>
        <span className="text-[7.5px] text-text3">drag or click to seek</span>
      </div>
      <div>
        <div className="mb-1 flex h-2.5">
          <div className="relative ml-24 flex-1">
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute translate-x-[-50%] text-[6.5px] text-text3"
                style={{ left: `${(t / total) * 100}%` }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <TimelineRow
          label="STATE"
          sg={stSegs}
          cf={(v) => TLC[v]}
          isState={true}
          total={total}
          trackRef={trackRef}
          phPct={phPct}
          onSeek={onSeek}
          startDrag={startDrag}
        />
        <div className="my-1 ml-24 h-px bg-border" />
        {["stall_cpu", "mem_read", "mem_write", "cache_write", "mem_ready"]
          .map((sig) => {
            const sg = segs(sig);
            if (!sg.some((s) => s.v)) return null;
            return (
              <TimelineRow
                key={sig}
                label={sig.replace("_", " ")}
                sg={sg}
                cf={(v) => (v ? SIGC[sig] : null)}
                isState={false}
                total={total}
                trackRef={null}
                phPct={phPct}
                onSeek={onSeek}
                startDrag={startDrag}
              />
            );
          })
          .filter(Boolean)}
      </div>
    </div>
  );
});
