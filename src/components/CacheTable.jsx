import React, { useRef, useEffect, memo } from 'react';
import { addr2offset } from '../fsm/logic';

export const CacheTable = memo(function CacheTable({ cache, activeSet, lastReq }) {
  const rows = Array.from({ length: cache.length }, (_, i) => i);
  const rowRefs = useRef({});

  useEffect(() => {
    if (activeSet >= 0 && rowRefs.current[activeSet]) {
      rowRefs.current[activeSet].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSet]);

  const hVal = (v) => '0x' + (v >>> 0).toString(16).toUpperCase().padStart(8, '0');
  const h5 = (v) => '0x' + (v >>> 0).toString(16).toUpperCase().padStart(5, '0');

  const activeOff = lastReq != null ? addr2offset(lastReq) : -1;
  const activeWord = activeOff >= 0 ? Math.floor(activeOff / 4) : -1;

  const TH = {
    padding: '4px 0 6px',
    borderBottom: '1px solid var(--border)',
    fontSize: '7.5px',
    color: 'var(--text3)',
    fontWeight: 600,
    letterSpacing: '.05em',
    textTransform: 'uppercase',
    textAlign: 'center',
  };
  const TD = { padding: '0', borderBottom: '1px solid var(--border2)', verticalAlign: 'top' };

  function WHead(wi) {
    const act = wi === activeWord;
    return (
      <th
        key={wi}
        style={{
          ...TH,
          minWidth: '64px',
          background: act ? 'rgba(224,175,104,.1)' : 'transparent',
          color: act ? 'var(--amber)' : 'var(--text3)',
        }}
      >
        <div>W{wi}</div>
        <div style={{ fontWeight: 400, fontSize: '7px', opacity: 0.7, marginTop: '2px' }}>
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
          background: act ? 'rgba(224,175,104,.14)' : 'transparent',
          textAlign: 'center',
          padding: '5px 4px 4px',
        }}
      >
        {val != null ? (
          <span
            style={{
              fontSize: '9.5px',
              fontFamily: 'var(--mono)',
              fontWeight: act ? 700 : 400,
              color: act ? 'var(--amber)' : isDirty ? 'var(--amber)' : 'var(--text2)',
            }}
          >
            {hVal(val)}
          </span>
        ) : (
          <span style={{ color: 'var(--text3)', fontSize: '9px' }}>—</span>
        )}
      </td>
    );
  }

  return (
    <div className="cache-wrap">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...TH, minWidth: '70px', textAlign: 'left', paddingLeft: '10px' }}>Set</th>
              <th style={{ ...TH, width: '28px' }}>V</th>
              <th style={{ ...TH, width: '28px' }}>D</th>
              <th style={{ ...TH, minWidth: '70px', textAlign: 'left', paddingLeft: '6px' }}>Tag</th>
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
                  style={{
                    background: isActive ? 'rgba(122,162,247,.07)' : isDirty ? 'rgba(224,175,104,.04)' : 'transparent',
                  }}
                >
                  <td
                    style={{
                      ...TD,
                      borderLeft: isActive ? '2px solid var(--blue)' : '2px solid transparent',
                      padding: '5px 8px',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontFamily: 'var(--mono)',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--text)' : 'var(--text2)',
                      }}
                    >
                      {i}
                    </span>
                  </td>
                  <td style={{ ...TD, textAlign: 'center', padding: '5px 0' }}>
                    <span className={`vbit ${l.valid ? 'v1' : 'v0'}`}>{l.valid ? '1' : '0'}</span>
                  </td>
                  <td style={{ ...TD, textAlign: 'center', padding: '5px 0' }}>
                    <span className={`vbit ${isDirty ? 'd1' : 'd0'}`}>{isDirty ? '1' : '0'}</span>
                  </td>
                  <td
                    style={{
                      ...TD,
                      padding: '5px 6px',
                      fontSize: '8.5px',
                      fontFamily: 'var(--mono)',
                      color: isActive ? 'var(--blue)' : isDirty ? 'var(--amber)' : 'var(--text2)',
                    }}
                  >
                    {l.valid ? h5(l.tag) : '—'}
                  </td>
                  {...[3, 2, 1, 0].map((wi) =>
                    WCell(wi, l.valid && Array.isArray(l.data) ? l.data[wi] : null, isActive, isDirty)
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        style={{
          padding: '3px 10px',
          fontSize: '7.5px',
          color: 'var(--text3)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>
          all 1024 sets loaded
        </span>
        <span>each row = 16B block · bar = value magnitude</span>
      </div>
    </div>
  );
});
