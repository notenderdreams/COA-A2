import React, { useRef, useState, useEffect, memo, useMemo } from "react";
import { TLC, SIGC } from "../fsm/constants";
import { cn } from "../lib/utils";

const CYCLE_WIDTH = 48; // Fixed width per cycle
const LABEL_WIDTH = 100; // Fixed label column width

function formatAddr(addr) {
  if (typeof addr !== "number" || !Number.isFinite(addr)) return "--------";
  return (addr >>> 0).toString(16).toUpperCase();
}

function formatTimestamp(req) {
  const ts = req?.timestamp ?? req?.ts ?? req?.time;
  if (ts === undefined || ts === null) return null;
  return String(ts);
}

function formatSegmentValue(value) {
  if (typeof value === "string") return value.replace("_", " ");
  if (value === undefined || value === null) return "";
  return String(value);
}

const TimelineRow = memo(function TimelineRow({
  label,
  sg,
  cf,
  isState,
  isRequest,
  total,
  phPct,
  onSeek,
}) {
  return (
    <div className="flex h-7 items-center group/row">
      <div
        className="sticky left-0 z-20 flex h-full items-center justify-end pr-4 text-[10px] font-bold uppercase tracking-widest text-text3 bg-bg2/80 backdrop-blur-md border-r border-white/5"
        style={{ width: LABEL_WIDTH }}
      >
        {label}
      </div>
      <div className="relative h-full flex-1">
        {sg.map((seg, i) => {
          const c = isRequest
            ? {
                bg: "rgba(255,255,255,0.03)",
                bd: "rgba(255,255,255,0.1)",
                tx: "var(--text2)",
              }
            : cf(seg.v);
          if (!c && !isRequest) return null;

          return (
            <div
              key={i}
              className={cn(
                "absolute top-1 flex h-5 items-center justify-center overflow-hidden rounded-sm px-2 text-[9px] font-bold transition-all hover:brightness-125 cursor-pointer select-none",
                isRequest &&
                  "border border-white/5 bg-white/[0.02] text-[10px] tracking-tight",
              )}
              style={{
                left: seg.s * CYCLE_WIDTH,
                width: (seg.e - seg.s) * CYCLE_WIDTH - 2,
                background: c?.bg,
                borderLeft: isRequest ? "" : `2px solid ${c?.bd}`,
                color: c?.tx || c?.bd,
              }}
              onClick={() => onSeek(seg.s)}
            >
              {isRequest ? (
                <span className="truncate drop-shadow-sm">
                  {seg.v?.type ?? "?"}
                  <span className="opacity-40 ml-1">
                    0x{formatAddr(seg.v?.addr)}
                  </span>
                  {formatTimestamp(seg.v) ? (
                    <span className="opacity-30 ml-1">
                      @{formatTimestamp(seg.v)}
                    </span>
                  ) : null}
                </span>
              ) : (
                <span className="truncate px-1 opacity-80 uppercase tracking-tighter">
                  {formatSegmentValue(seg.v)}
                </span>
              )}
            </div>
          );
        })}
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
    const d = running ? dur + 50 : 200;
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
  queue,
  step,
  running,
  stateDur,
  onSeek,
}) {
  const scrollRef = useRef(null);
  const total = trace.length;
  const ph = usePlayPos(step, total, running, stateDur);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current && total > 0) {
      const scrollPos = ph * (total * CYCLE_WIDTH);
      const container = scrollRef.current;
      const viewWidth = container.clientWidth - LABEL_WIDTH;
      const currentScroll = container.scrollLeft;

      if (scrollPos < currentScroll || scrollPos > currentScroll + viewWidth) {
        container.scrollTo({
          left: scrollPos - viewWidth / 2,
          behavior: running ? "auto" : "smooth",
        });
      }
    }
  }, [ph, total, running]);

  const reqSegs = useMemo(() => {
    if (!total || !queue) return [];
    const out = [];
    let i = 0;
    while (i < total) {
      const reqIdx = trace[i].reqIdx;
      if (reqIdx === undefined) {
        i++;
        continue;
      }
      const reqData = queue[reqIdx];
      let j = i + 1;
      while (j < total && trace[j].reqIdx === reqIdx) j++;
      out.push({ s: i, e: j, v: reqData });
      i = j;
    }
    return out;
  }, [trace, total, queue]);

  const stSegs = useMemo(() => {
    const out = [];
    let i = 0;
    while (i < total) {
      const v = trace[i].state;
      let j = i + 1;
      while (j < total && trace[j].state === v) j++;
      out.push({ s: i, e: j, v });
      i = j;
    }
    return out;
  }, [trace, total]);

  const phX = ph * total * CYCLE_WIDTH;

  if (!total) {
    return (
      <div className="shrink-0 border-t border-white/5 bg-bg2/50 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text3">
            Timeline
          </span>
          <span className="text-[10px] text-text3/40 uppercase font-medium">
            Waiting for operation...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-col border-t border-white/10 bg-bg2/40 backdrop-blur-2xl">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text3">
            Timeline
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="relative overflow-x-auto overflow-y-hidden no-scrollbar pb-2"
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x =
            e.clientX - rect.left + e.currentTarget.scrollLeft - LABEL_WIDTH;
          if (x >= 0) onSeek(Math.floor(x / CYCLE_WIDTH));
        }}
      >
        <div
          style={{ width: total * CYCLE_WIDTH + LABEL_WIDTH, minWidth: "100%" }}
        >
          {/* Header cycles numbers */}
          <div className="flex h-6 items-center">
            <div
              style={{ width: LABEL_WIDTH }}
              className="sticky left-0 z-20 bg-bg2/80 backdrop-blur-md border-r border-white/5 h-full"
            />
            <div className="relative flex-1 h-full">
              {Array.from({ length: total }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-2 text-[9px] font-bold text-text3/30"
                  style={{
                    left: i * CYCLE_WIDTH + CYCLE_WIDTH / 2,
                    transform: "translateX(-50%)",
                  }}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>

          <TimelineRow
            label="REQUEST"
            sg={reqSegs}
            isRequest={true}
            total={total}
            phPct={0}
            onSeek={onSeek}
          />

          <TimelineRow
            label="STATE"
            sg={stSegs}
            cf={(v) => TLC[v]}
            isState={true}
            total={total}
            phPct={0}
            onSeek={onSeek}
          />

          <div
            className="my-1 border-t border-white/5"
            style={{ marginLeft: LABEL_WIDTH }}
          />

          {[
            "stall_cpu",
            "mem_read",
            "mem_write",
            "cache_write",
            "mem_ready",
          ].map((sig) => {
            const sg = [];
            let i = 0;
            while (i < total) {
              const v = trace[i].sigs[sig];
              let j = i + 1;
              while (j < total && trace[j].sigs[sig] === v) j++;
              if (v) sg.push({ s: i, e: j, v });
              i = j;
            }
            if (!sg.length) return null;
            return (
              <TimelineRow
                key={sig}
                label={sig.replace("_", " ")}
                sg={sg}
                cf={(v) => (v ? SIGC[sig] : null)}
                total={total}
                onSeek={onSeek}
              />
            );
          })}

          {/* Playhead Indicator */}
          <div
            className="absolute top-6 bottom-0 z-30 pointer-events-none transition-opacity duration-300"
            style={{
              left: phX + LABEL_WIDTH,
              width: 2,
              background:
                "linear-gradient(to bottom, transparent, var(--blue), var(--purple), transparent)",
              boxShadow: "0 0 15px rgba(122, 162, 247, 0.4)",
            }}
          >
            <div className="absolute top-0 -left-[5px] h-2.5 w-2.5 rounded-full bg-blue ring-4 ring-blue/10" />
          </div>

          {/* Cycle background grids */}
          <div
            className="absolute top-6 bottom-0 -z-10 pointer-events-none"
            style={{ left: LABEL_WIDTH }}
          >
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-white/5"
                style={{ left: i * CYCLE_WIDTH, width: CYCLE_WIDTH }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
