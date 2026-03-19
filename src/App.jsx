import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { makeCache, simulateReq } from './fsm/logic';
import { PRESETS, SDUR, SC } from './fsm/constants';
import { FSMDiagram } from './components/FSMDiagram';
import { CacheTable } from './components/CacheTable';
import { Timeline } from './components/Timeline';
import { MemoryTable } from './components/MemoryTable';
import './index.css';

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
  const [addrStr, setAddrStr] = useState('0x00000000');
  const [dataStr, setDataStr] = useState('0x000000AB');
  const [activeEdge, setActiveEdge] = useState(null);
  const [cacheSnaps, setCacheSnaps] = useState([]);
  const [memSnaps, setMemSnaps] = useState([]);
  const [activeTab, setActiveTab] = useState('cache');
  const runRef = useRef();
  const [leftPct, setLeftPct] = useState(58);
  const mainRef = useRef(null);
  const divDragging = useRef(false);

  const startDivDrag = useCallback((e) => {
    e.preventDefault();
    divDragging.current = true;
    document.body.classList.add('resizing');
    const el = document.querySelector('.divider');
    if (el) el.classList.add('dragging');

    const move = (ev) => {
      if (!divDragging.current || !mainRef.current) return;
      const r = mainRef.current.getBoundingClientRect();
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const pct = Math.min(80, Math.max(20, ((cx - r.left) / r.width) * 100));
      setLeftPct(pct);
    };

    const up = () => {
      divDragging.current = false;
      document.body.classList.remove('resizing');
      const el = document.querySelector('.divider');
      if (el) el.classList.remove('dragging');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
  }, []);

  const activeSet = useMemo(() => {
    return step >= 0 && step < trace.length ? trace[step].activeSet : -1;
  }, [step, trace]);

  const curState = step >= 0 && step < trace.length ? trace[step].state : 'Idle';
  const curSigs = step >= 0 && step < trace.length ? trace[step].sigs : { stall_cpu: 0, mem_read: 0, mem_write: 0, cache_write: 0, mem_ready: 0 };
  const fillPct = useFill(curState);

  useEffect(() => {
    if (step < 0) {
      setActiveEdge(null);
      return;
    }
    const cur = trace[step]?.state || 'Idle';
    const prev = step > 0 ? trace[step - 1]?.state || 'Idle' : 'Idle';
    setActiveEdge(cur === prev && cur !== 'Idle' ? `${cur}__${cur}` : `${prev}__${cur}`);
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
    const newSteps = steps.map((s, i) => ({ ...s, cycle: trace.length + i + 1, reqIdx }));
    const newSnaps = steps.map((_, i) =>
      i === steps.length - 1
        ? newCache.map((l) => ({ ...l, data: Array.isArray(l.data) ? [...l.data] : new Array(4).fill(0) }))
        : cache.map((l) => ({ ...l, data: Array.isArray(l.data) ? [...l.data] : new Array(4).fill(0) }))
    );
    const newMemSnaps = steps.map((_, i) => (i === steps.length - 1 ? { ...newMem } : { ...mem }));
    setTrace((t) => [...t, ...newSteps]);
    setCacheSnaps((cs) => [...cs, ...newSnaps]);
    setMemSnaps((ms) => [...ms, ...newMemSnaps]);
    setCache(newCache);
    setMem(newMem);
    setQueue((q) => [...q, { type: req.type, addr: req.addr, data: req.data, reqIdx }]);
  }

  function handleRead() {
    const a = parseInt(addrStr, 16) >>> 0;
    if (isNaN(a)) return;
    enqueue('R', a, null);
  }

  function handleWrite() {
    const a = parseInt(addrStr, 16) >>> 0;
    const d = parseInt(dataStr, 16) & 0xffffffff;
    if (isNaN(a)) return;
    enqueue('W', a, d);
  }

  function loadPreset(name) {
    reset();
    setTimeout(() => {
      let c = makeCache();
      let m = {};
      let allSteps = [];
      let allSnaps = [];
      let allMemSnaps = [];
      let qArr = [];
      for (const req of PRESETS[name]) {
        const { steps, newCache, newMem } = simulateReq({ type: req.t, addr: req.a, data: req.d ?? 0 }, c, m);
        const reqIdx = qArr.length;
        const newSteps = steps.map((s, i) => ({ ...s, cycle: allSteps.length + i + 1, reqIdx }));
        const newSnaps = steps.map((_, i) =>
          i === steps.length - 1
            ? newCache.map((l) => ({ ...l, data: Array.isArray(l.data) ? [...l.data] : new Array(4).fill(0) }))
            : c.map((l) => ({ ...l, data: Array.isArray(l.data) ? [...l.data] : new Array(4).fill(0) }))
        );
        const newMemSnaps = steps.map((_, i) => (i === steps.length - 1 ? { ...newMem } : { ...m }));
        allSteps = [...allSteps, ...newSteps];
        allSnaps = [...allSnaps, ...newSnaps];
        allMemSnaps = [...allMemSnaps, ...newMemSnaps];
        qArr.push({ type: req.t, addr: req.a, data: req.d ?? null, reqIdx });
        c = newCache;
        m = newMem;
      }
      setTrace(allSteps);
      setCacheSnaps(allSnaps);
      setMemSnaps(allMemSnaps);
      setCache(c);
      setMem(m);
      setQueue(qArr);
    }, 10);
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
    setActiveTab('cache');
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
    let hits = 0, misses = 0, wbs = 0;
    for (let i = 0; i < limit; i++) {
      const s = trace[i];
      if (s.state === 'Idle' && i > 0 && s.reqIdx !== undefined && !seen.has(s.reqIdx)) {
        const prev = trace[i - 1];
        if (prev && prev.state !== 'Idle') {
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
  const hitRate = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
  const sigCls = { stall_cpu: 'r', mem_read: '', mem_write: 'a', cache_write: 'g', mem_ready: 'p' };
  const sn = (s) => ({ Idle: 'IDLE', Compare_Tag: 'CMP', Write_Back: 'WB', Allocate: 'ALLOC' }[s] || s);

  return (
    <div className="app">
      <div className="topbar">
        <div className="dot" />
        <div className="tb-title">FSM Cache Controller</div>
        <div className="tb-sub">write-back · write-allocate · direct-mapped · 1024 sets · 16B blocks · 32-bit addr</div>
        <div className="tb-right">
          <div className="chip">COA / A2 / 230041234</div>
          <div className={`chip ${running ? 'live' : ''}`}>{running ? '● RUNNING' : 'PAUSED'}</div>
          <div className="chip" style={{ color: 'var(--green)' }}>
            {total} cycles
          </div>
        </div>
      </div>
      <div ref={mainRef} className="main">
        <div className="left" style={{ width: leftPct + '%', flexShrink: 0, flexGrow: 0 }}>
          <div className="fsm-area">
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '480px', gap: 0 }}>
              <div className="fsm-wrap">
                <FSMDiagram active={curState} fillPct={fillPct} activeEdge={activeEdge} />
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '8px 2px 2px', justifyContent: 'center' }}>
                {Object.entries(curSigs).map(([k, v]) => (
                  <div key={k} className={`sp ${v ? 'on ' + (sigCls[k] || '') : ''}`}>
                    {k.replace(/_/g, ' ')} = <b>{v}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="q-wrap">
            {queue.length === 0 ? (
              <span style={{ fontSize: 8.5, color: 'var(--text3)' }}>queue empty</span>
            ) : (
              queue.map((q, i) => (
                <span
                  key={i}
                  className={`qtag ${q.type === 'R' ? 'r' : 'w'}${i === activeReqIdx ? ' act' : ''} ${i < activeReqIdx ? 'done' : ''}`}
                >
                  {q.type}:{q.addr.toString(16).toUpperCase().padStart(8, '0').slice(-5)}
                  {q.type === 'W' ? '=' + q.data.toString(16).toUpperCase().padStart(2, '0') : ''}
                </span>
              ))
            )}
          </div>
          <div className="enq-row">
            <span className="lbl">ADDR</span>
            <input type="text" value={addrStr} onChange={(e) => setAddrStr(e.target.value)} style={{ width: 84 }} placeholder="0x00000000" />
            <div style={{ width: '1px', height: '14px', background: 'var(--border2)', margin: '0 4px' }} />
            <button className="btn primary" onClick={handleRead} style={{ background: 'var(--blue)', borderColor: 'var(--blue)', color: '#1a1a1a' }}>+ Read</button>
            <div style={{ width: '1px', height: '14px', background: 'var(--border2)', margin: '0 4px' }} />
            <span className="lbl">DATA</span>
            <input type="text" value={dataStr} onChange={(e) => setDataStr(e.target.value)} style={{ width: 84 }} placeholder="0x000000AB" />
            <button className="btn primary" onClick={handleWrite} style={{ background: 'var(--purple)', borderColor: 'var(--purple)', color: '#1a1a1a' }}>+ Write</button>
            <div style={{ flex: 1 }} />
            <button className="btn danger" onClick={reset}>↺ Reset</button>
          </div>
          <div className="transport">
            <button className="btn" onClick={() => seek(0)} disabled={!total || running}>⏮</button>
            <button className="btn" onClick={() => seek(Math.max(0, step - 1))} disabled={step <= 0 || running}>⏪</button>
            <button
              className={`btn ${running ? 'run' : 'primary'}`}
              onClick={() => {
                if (!running && step < 0 && total > 0) seek(0);
                setRunning((r) => !r);
              }}
              disabled={!total}
            >
              {running ? '⏸' : '▶'}
            </button>
            <button className="btn" onClick={() => seek(Math.min(total - 1, step + 1))} disabled={step >= total - 1 || running}>⏩</button>
            <button className="btn" onClick={() => seek(total - 1)} disabled={!total || running}>⏭</button>
            <div className="cyc">
              {cur ? <b>{cur.cycle}</b> : '—'} / {total || '—'}
            </div>
            {cur && (
              <div style={{ marginLeft: 4, fontSize: 8, color: SC[curState]?.col, fontFamily: 'var(--mono)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {cur.note}
              </div>
            )}
          </div>
        </div>
        <div className="divider" onMouseDown={startDivDrag} />
        <div className="right" style={{ flex: 1, minWidth: 0 }}>
          <div className="ph">
            <span className="ph-label">Execution</span>
            {cur && <span className={`schip sc-${curState}`}>{curState.replace('_', ' ')}</span>}
          </div>
          <div className="stats-row">
            <div className="stat">
              <div className="stat-v sv-green">{hits}</div>
              <div className="stat-l">hits</div>
            </div>
            <div className="stat">
              <div className="stat-v sv-red">{misses}</div>
              <div className="stat-l">misses</div>
            </div>
            <div className="stat">
              <div className="stat-v sv-amber">{wbs}</div>
              <div className="stat-l">writebacks</div>
            </div>
            <div className="stat">
              <div className="stat-v sv-blue">{hits + misses > 0 ? hitRate + '%' : '—'}</div>
              <div className="stat-l">hit rate</div>
            </div>
          </div>
          <div className="tabs">
            <div className={`tab ${activeTab === 'cache' ? 'active' : ''}`} onClick={() => setActiveTab('cache')}>Cache State</div>
            <div className={`tab ${activeTab === 'trace' ? 'active' : ''}`} onClick={() => setActiveTab('trace')}>Trace</div>
            <div className={`tab ${activeTab === 'memory' ? 'active' : ''}`} onClick={() => setActiveTab('memory')}>Memory</div>
            <div className={`tab ${activeTab === 'presets' ? 'active' : ''}`} onClick={() => setActiveTab('presets')}>Presets</div>
          </div>
          <div className="tab-content">
            {activeTab === 'cache' ? (
              <CacheTable cache={dispCache} activeSet={activeSet} lastReq={cur ? cur.addr : null} />
            ) : activeTab === 'memory' ? (
              <MemoryTable mem={dispMem} />
            ) : activeTab === 'presets' ? (
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(PRESETS).map(([name, reqs]) => (
                  <div key={name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{name}</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {reqs.slice(0, 10).map((r, i) => (
                          <span key={i} className={`qtag ${r.t === 'R' ? 'r' : 'w'}`}>
                            {r.t}:{r.a.toString(16).toUpperCase().padStart(8, '0').slice(-5)}
                          </span>
                        ))}
                        {reqs.length > 10 && <span style={{ fontSize: '8.5px', color: 'var(--text3)' }}>+{reqs.length - 10} more</span>}
                      </div>
                    </div>
                    <button className="btn primary" onClick={() => loadPreset(name)}>Load Preset</button>
                  </div>
                ))}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)' }}>
                <thead>
                  <tr>
                    {['#', 'State', 'Note', 'STC', 'MRD', 'MWR', 'CWR', 'RDY'].map((c) => (
                      <th
                        key={c}
                        style={{
                          padding: '5px 8px',
                          textAlign: 'left',
                          fontSize: '8px',
                          fontWeight: 600,
                          letterSpacing: '.07em',
                          textTransform: 'uppercase',
                          color: 'var(--text3)',
                          borderBottom: '1px solid var(--border)',
                          background: 'var(--bg2)',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trace.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-t">
                        load a preset or add requests
                      </td>
                    </tr>
                  ) : (
                    trace.map((row, i) => {
                      const isActive = i === step;
                      return (
                        <tr
                          key={i}
                          onClick={() => seek(i)}
                          style={{ cursor: 'pointer', background: isActive ? 'rgba(122,162,247,.1)' : 'transparent' }}
                        >
                          <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)', fontSize: '9px', color: 'var(--text2)', borderLeft: isActive ? '2px solid var(--blue)' : '2px solid transparent' }}>
                            {row.cycle}
                          </td>
                          <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>
                            <span className={`schip sc-${row.state}`}>{sn(row.state)}</span>
                          </td>
                          <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text2)', fontSize: '8px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.note}
                          </td>
                          {['stall_cpu', 'mem_read', 'mem_write', 'cache_write', 'mem_ready'].map((s) => (
                            <td
                              key={s}
                              style={{
                                padding: '4px 8px',
                                borderBottom: '1px solid var(--border)',
                                textAlign: 'center',
                                fontSize: '9px',
                                color: row.sigs[s] ? 'var(--blue)' : 'var(--text3)',
                                fontWeight: row.sigs[s] ? 700 : 400,
                              }}
                            >
                              {row.sigs[s] ? '1' : '·'}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
          <Timeline trace={trace} step={step} running={running} stateDur={SDUR[curState] || 700} onSeek={seek} />
        </div>
      </div>
    </div>
  );
}

export default App;
