import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { makeCache, simulateReq } from "./fsm/logic";
import { SDUR, SC } from "./fsm/constants";
import { FSMDiagram } from "./components/FSMDiagram";
import { CacheTable } from "./components/CacheTable";
import { Timeline } from "./components/Timeline";
import { MemoryTable } from "./components/MemoryTable";
import Topbar from "./components/TopBar";
import "./index.css";
import Queue from "./components/Queue";
import OpPanel from "./components/OpPanel";
import ControlPanel from "./components/ControlPanel";
import PresetsPanel from "./components/PresetsPanel";
import TraceTable from "./components/TraceTable";
import StatsPanel from "./components/StatsPanel";

function useFill(state) {
  const [pct, setPct] = useState(0);
  const raf = useRef();
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const dur = SDUR[state] || 700;
    const t0 = performance.now();
    setPct(0);
    const tick = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      setPct(1 - Math.pow(1 - t, 3));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [state]);
  return pct;
}

function App() {
  const [trace, setTrace] = useState([]);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [queue, setQueue] = useState([]);
  const [cache, setCache] = useState(makeCache());
  const [mem, setMem] = useState({});
  const [addrStr, setAddrStr] = useState("0x00000000");
  const [dataStr, setDataStr] = useState("0x000000AB");
  const [activeEdge, setActiveEdge] = useState(null);
  const [cacheSnaps, setCacheSnaps] = useState([]);
  const [memSnaps, setMemSnaps] = useState([]);
  const [activeTab, setActiveTab] = useState("cache");
  const runRef = useRef();
  const [leftPct, setLeftPct] = useState(58);
  const mainRef = useRef(null);
  const divDragging = useRef(false);

  const startDivDrag = useCallback((e) => {
    e.preventDefault();
    divDragging.current = true;
    document.body.classList.add("resizing");
    const el = document.querySelector(".divider");
    if (el) el.classList.add("dragging");

    const move = (ev) => {
      if (!divDragging.current || !mainRef.current) return;
      const r = mainRef.current.getBoundingClientRect();
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const pct = Math.min(80, Math.max(20, ((cx - r.left) / r.width) * 100));
      setLeftPct(pct);
    };

    const up = () => {
      divDragging.current = false;
      document.body.classList.remove("resizing");
      const el = document.querySelector(".divider");
      if (el) el.classList.remove("dragging");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  }, []);

  const activeSet = useMemo(() => {
    return step >= 0 && step < trace.length ? trace[step].activeSet : -1;
  }, [step, trace]);

  const curState =
    step >= 0 && step < trace.length ? trace[step].state : "Idle";
  const curSigs =
    step >= 0 && step < trace.length
      ? trace[step].sigs
      : {
          stall_cpu: 0,
          mem_read: 0,
          mem_write: 0,
          cache_write: 0,
          mem_ready: 0,
        };
  const fillPct = useFill(curState);

  useEffect(() => {
    if (step < 0) {
      setActiveEdge(null);
      return;
    }
    const cur = trace[step]?.state || "Idle";
    const prev = step > 0 ? trace[step - 1]?.state || "Idle" : "Idle";
    setActiveEdge(
      cur === prev && cur !== "Idle" ? `${cur}__${cur}` : `${prev}__${cur}`,
    );
  }, [step, trace]);

  useEffect(() => {
    if (!running) return;
    clearTimeout(runRef.current);
    const dur = SDUR[curState] || 700;
    runRef.current = setTimeout(() => {
      setStep((s) => {
        if (s >= trace.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, dur + 100);
    return () => clearTimeout(runRef.current);
  }, [running, step, trace.length, curState]);

  function enqueue(type, addr, data) {
    const req = { type, addr, data };
    const { steps, newCache, newMem } = simulateReq(req, cache, mem);
    const reqIdx = queue.length;
    const newSteps = steps.map((s, i) => ({
      ...s,
      cycle: trace.length + i + 1,
      reqIdx,
    }));
    const newSnaps = steps.map((_, i) =>
      i === steps.length - 1
        ? newCache.map((l) => ({
            ...l,
            data: Array.isArray(l.data) ? [...l.data] : new Array(4).fill(0),
          }))
        : cache.map((l) => ({
            ...l,
            data: Array.isArray(l.data) ? [...l.data] : new Array(4).fill(0),
          })),
    );
    const newMemSnaps = steps.map((_, i) =>
      i === steps.length - 1 ? { ...newMem } : { ...mem },
    );
    setTrace((t) => [...t, ...newSteps]);
    setCacheSnaps((cs) => [...cs, ...newSnaps]);
    setMemSnaps((ms) => [...ms, ...newMemSnaps]);
    setCache(newCache);
    setMem(newMem);
    setQueue((q) => [
      ...q,
      { type: req.type, addr: req.addr, data: req.data, reqIdx },
    ]);
  }

  function handleRead() {
    const a = parseInt(addrStr, 16) >>> 0;
    if (isNaN(a)) return;
    enqueue("R", a, null);
  }

  function handleWrite() {
    const a = parseInt(addrStr, 16) >>> 0;
    const d = parseInt(dataStr, 16) & 0xffffffff;
    if (isNaN(a)) return;
    enqueue("W", a, d);
  }

  function applyPresetResult(result) {
    setTrace(result.trace);
    setCacheSnaps(result.cacheSnaps);
    setMemSnaps(result.memSnaps);
    setCache(result.cache);
    setMem(result.mem);
    setQueue(result.queue);
  }

  function reset() {
    clearTimeout(runRef.current);
    setRunning(false);
    setTrace([]);
    setStep(-1);
    setCacheSnaps([]);
    setMemSnaps([]);
    setQueue([]);
    setCache(makeCache());
    setMem({});
    setActiveEdge(null);
  }

  function seek(idx) {
    setRunning(false);
    setStep(idx);
    setActiveTab("cache");
  }

  const cur = step >= 0 && step < trace.length ? trace[step] : null;
  const dispCache = cur && cacheSnaps[step] ? cacheSnaps[step] : cache;
  const dispMem = cur && memSnaps[step] ? memSnaps[step] : mem;
  const total = trace.length;
  const activeReqIdx = cur?.reqIdx ?? -1;

  const liveStats = useMemo(() => {
    if (!trace.length) return { hits: 0, misses: 0, wbs: 0 };
    const limit = step >= 0 ? step + 1 : 0;
    const seen = new Set();
    let hits = 0,
      misses = 0,
      wbs = 0;
    for (let i = 0; i < limit; i++) {
      const s = trace[i];
      if (
        s.state === "Idle" &&
        i > 0 &&
        s.reqIdx !== undefined &&
        !seen.has(s.reqIdx)
      ) {
        const prev = trace[i - 1];
        if (prev && prev.state !== "Idle") {
          seen.add(s.reqIdx);
          if (s._isHit) hits++;
          else misses++;
          if (s._isWB) wbs++;
        }
      }
    }
    return { hits, misses, wbs };
  }, [trace, step]);

  const { hits, misses, wbs } = liveStats;
  const sigCls = {
    stall_cpu: "r",
    mem_read: "",
    mem_write: "a",
    cache_write: "g",
    mem_ready: "p",
  };

  return (
    <div className="app">
      <Topbar running={running} total={total} />
      <div ref={mainRef} className="main">
        <div
          className="left"
          style={{ width: leftPct + "%", flexShrink: 0, flexGrow: 0 }}
        >
          <div className="fsm-area">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "480px",
                gap: 0,
              }}
            >
              <div className="fsm-wrap">
                <FSMDiagram
                  active={curState}
                  fillPct={fillPct}
                  activeEdge={activeEdge}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  padding: "8px 2px 2px",
                  justifyContent: "center",
                }}
              >
                {Object.entries(curSigs).map(([k, v]) => (
                  <div
                    key={k}
                    className={`sp ${v ? "on " + (sigCls[k] || "") : ""}`}
                  >
                    {k.replace(/_/g, " ")} = <b>{v}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Queue queue={queue} activeReqIdx={activeReqIdx} />
          <OpPanel
            addrStr={addrStr}
            setAddrStr={setAddrStr}
            dataStr={dataStr}
            setDataStr={setDataStr}
            handleRead={handleRead}
            handleWrite={handleWrite}
            reset={reset}
          />
          <ControlPanel
            total={total}
            running={running}
            step={step}
            cur={cur}
            curState={curState}
            seek={seek}
            setRunning={setRunning}
          />
        </div>
        <div className="divider" onMouseDown={startDivDrag} />
        <div className="right" style={{ flex: 1, minWidth: 0 }}>
          <StatsPanel
            curState={curState}
            hits={hits}
            misses={misses}
            wbs={wbs}
          />
          <div className="tabs">
            <div
              className={`tab ${activeTab === "cache" ? "active" : ""}`}
              onClick={() => setActiveTab("cache")}
            >
              Cache State
            </div>
            <div
              className={`tab ${activeTab === "trace" ? "active" : ""}`}
              onClick={() => setActiveTab("trace")}
            >
              Trace
            </div>
            <div
              className={`tab ${activeTab === "memory" ? "active" : ""}`}
              onClick={() => setActiveTab("memory")}
            >
              Memory
            </div>
            <div
              className={`tab ${activeTab === "presets" ? "active" : ""}`}
              onClick={() => setActiveTab("presets")}
            >
              Presets
            </div>
          </div>
          <div className="tab-content">
            {activeTab === "cache" ? (
              <CacheTable
                cache={dispCache}
                activeSet={activeSet}
                lastReq={cur ? cur.addr : null}
              />
            ) : activeTab === "memory" ? (
              <MemoryTable mem={dispMem} />
            ) : activeTab === "presets" ? (
              <PresetsPanel
                onBeforeLoad={reset}
                onApplyPreset={applyPresetResult}
              />
            ) : (
              <TraceTable trace={trace} step={step} onSeek={seek} />
            )}
          </div>
          <Timeline
            trace={trace}
            step={step}
            running={running}
            stateDur={SDUR[curState] || 700}
            onSeek={seek}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
