import React, { useRef, useCallback, useState, useEffect, memo } from 'react';
import { TLC, SIGC } from '../fsm/constants';

function usePlayPos(step, total, running, dur) {
  const [pos, setPos] = useState(0);
  const raf = useRef();
  const sr = useRef({});
  useEffect(() => {
    if (!total) {
      setPos(0);
      return;
    }
    const target = step < 0 ? 0 : (step + 0.5) / total;
    cancelAnimationFrame(raf.current);
    const from = pos;
    const d = running ? dur + 50 : 160;
    const t0 = performance.now();
    sr.current = { from, to: target, t0, d };
    const anim = (now) => {
      const t = Math.min((now - sr.current.t0) / sr.current.d, 1);
      const e = running ? t : 1 - Math.pow(1 - t, 3);
      setPos(sr.current.from + (sr.current.to - sr.current.from) * e);
      if (t < 1) raf.current = requestAnimationFrame(anim);
    };
    raf.current = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(raf.current);
  }, [step, total, running, dur, pos]);
  return pos;
}

export const Timeline = memo(function Timeline({ trace, step, running, stateDur, onSeek }) {
  const total = trace.length;
  const ph = usePlayPos(step, total, running, stateDur);
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const startDrag = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const move = (ev) => {
      if (!dragging.current || !trackRef.current) return;
      const r = trackRef.current.getBoundingClientRect();
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      onSeek(Math.min(total - 1, Math.floor(Math.max(0, Math.min(1, (cx - r.left) / r.width)) * total)));
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
  }, [total, onSeek]);

  if (!total) {
    return (
      <div className="timeline">
        <div className="tl-hdr">
          <span className="tl-lbl">Timeline</span>
          <span className="tl-hint">no data yet</span>
        </div>
      </div>
    );
  }

  function segs(key) {
    const out = [];
    let i = 0;
    while (i < total) {
      const v = key === 'state' ? trace[i].state : trace[i].sigs[key];
      let j = i + 1;
      while (j < total && (key === 'state' ? trace[j].state : trace[j].sigs[key]) === v) {
        j++;
      }
      out.push({ s: i, e: j, v, pct: ((j - i) / total) * 100 });
      i = j;
    }
    return out;
  }

  const stSegs = segs('state');
  const phPct = ph * 100;
  const sn = (v) => ({ Idle: 'IDLE', Compare_Tag: 'CMP', Write_Back: 'WB', Allocate: 'ALLOC' }[v] || v);
  const interval = total <= 16 ? 4 : total <= 32 ? 8 : 16;
  const ticks = [];
  for (let i = 0; i <= total; i += interval) ticks.push(i);

  function Row({ label, sg, cf, isState }) {
    return (
      <div className="tl-row">
        <div className="tl-rl">{label}</div>
        <div
          className="tl-track"
          ref={isState ? trackRef : null}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            onSeek(Math.min(total - 1, Math.floor(((e.clientX - r.left) / r.width) * total)));
          }}
        >
          <div className="tl-ph" style={{ left: `${phPct}%` }} />
          {sg.map((seg, i) => {
            const c = cf(seg.v);
            if (!c) return null;
            return (
              <div
                key={i}
                className="tl-seg"
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
                {seg.pct > 6 ? sn(seg.v) : ''}
              </div>
            );
          })}
          {isState && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                left: `calc(${phPct}% - 7px)`,
                zIndex: 10,
              }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div style={{ width: '1.5px', height: '100%', background: 'rgba(255,255,255,.85)' }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="timeline">
      <div className="tl-hdr">
        <span className="tl-lbl">Timeline</span>
        <span className="tl-hint">drag or click to seek</span>
      </div>
      <div>
        <div className="tl-axis">
          <div className="tl-ax-inner">
            {ticks.map((t) => (
              <div key={t} className="tl-tick" style={{ left: `${(t / total) * 100}%` }}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <Row label="STATE" sg={stSegs} cf={(v) => TLC[v]} isState={true} />
        <div className="tl-div" />
        {['stall_cpu', 'mem_read', 'mem_write', 'cache_write', 'mem_ready']
          .map((sig) => {
            const sg = segs(sig);
            if (!sg.some((s) => s.v)) return null;
            return <Row key={sig} label={sig.replace('_', ' ')} sg={sg} cf={(v) => (v ? SIGC[sig] : null)} isState={false} />;
          })
          .filter(Boolean)}
      </div>
    </div>
  );
});
