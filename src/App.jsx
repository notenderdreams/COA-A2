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
import Queue from "./components/Queue";
import OpPanel from "./components/OpPanel";
import ControlPanel from "./components/ControlPanel";
import PresetTable from "./components/PresetTable";
import TraceTable from "./components/TraceTable";
import StatsPanel from "./components/StatsPanel";
import SignalBadge from "./components/ui/SignalBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/Tabs";

function useFill(state) {
  const [pct, setPct] = useState(0);
  const raf = useRef();
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const dur = SDUR[state] || 700;
    const t0 = performance.now();
    let initialized = false;
    const tick = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      if (!initialized) {
        setPct(0);
        initialized = true;
      }
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
  const [cacheSnaps, setCacheSnaps] = useState([]);
  const [memSnaps, setMemSnaps] = useState([]);
  const [activeTab, setActiveTab] = useState("cache");
  const runRef = useRef();
  const [leftPct, setLeftPct] = useState(58);
  const [isResizing, setIsResizing] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("resizing", isResizing);
    return () => {
      document.body.classList.remove("resizing");
    };
  }, [isResizing]);

  const startDivDrag = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsResizing(true);
  }, []);

  const handleDivDrag = useCallback(
    (e) => {
      if (!isResizing || !mainRef.current) return;
      const r = mainRef.current.getBoundingClientRect();
      const cx = e.clientX;
      const pct = Math.min(80, Math.max(20, ((cx - r.left) / r.width) * 100));
      setLeftPct(pct);
    },
    [isResizing],
  );

  const stopDivDrag = useCallback((e) => {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsResizing(false);
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

  const activeEdge = useMemo(() => {
    if (step < 0) return null;
    const cur = trace[step]?.state || "Idle";
    const prev = step > 0 ? trace[step - 1]?.state || "Idle" : "Idle";
    return cur === prev && cur !== "Idle"
      ? `${cur}__${cur}`
      : `${prev}__${cur}`;
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
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar running={running} total={total} />
      <div ref={mainRef} className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className="flex min-w-55 flex-col overflow-hidden"
          style={{ width: leftPct + "%", flexShrink: 0, flexGrow: 0 }}
        >
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-2 pt-4">
            <div className="flex w-full max-w-120 flex-col gap-0">
              <div className="w-full max-w-120">
                <FSMDiagram
                  active={curState}
                  fillPct={fillPct}
                  activeEdge={activeEdge}
                />
              </div>
              <div className="grid w-full grid-cols-5 gap-1 px-0.5 pb-0.5 pt-2">
                {Object.entries(curSigs).map(([k, v]) => (
                  <SignalBadge
                    key={k}
                    signalName={k}
                    value={v}
                    variantClass={sigCls[k]}
                  />
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
        <div
          className={`relative w-1.25 shrink-0 cursor-col-resize border-x border-border bg-bg3 transition-colors hover:bg-blue ${isResizing ? "bg-blue" : ""}`}
          onPointerDown={startDivDrag}
          onPointerMove={handleDivDrag}
          onPointerUp={stopDivDrag}
          onPointerCancel={stopDivDrag}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panes"
        >
          <div className="absolute left-1/2 top-1/2 h-7 w-px -translate-x-1/2 -translate-y-1/2 bg-border2" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-bg2">
          <StatsPanel
            curState={curState}
            hits={hits}
            misses={misses}
            wbs={wbs}
          />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="cache">Cache State</TabsTrigger>
              <TabsTrigger value="trace">Trace</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>
            <TabsContent value="cache">
              <CacheTable
                cache={dispCache}
                activeSet={activeSet}
                lastReq={cur ? cur.addr : null}
              />
            </TabsContent>
            <TabsContent value="memory">
              <MemoryTable mem={dispMem} />
            </TabsContent>
            <TabsContent value="presets">
              <PresetTable
                onBeforeLoad={reset}
                onApplyPreset={applyPresetResult}
              />
            </TabsContent>
            <TabsContent value="trace">
              <TraceTable trace={trace} step={step} onSeek={seek} />
            </TabsContent>
          </Tabs>
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
