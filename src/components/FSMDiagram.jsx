import React, { memo } from "react";
import { SC, NP, NR } from "../fsm/constants";

export const FSMDiagram = memo(function FSMDiagram({
  active,
  fillPct,
  activeEdge,
}) {
  const safeFillPct = Number.isFinite(fillPct)
    ? Math.max(0, Math.min(1, fillPct))
    : 0;

  const edges = [
    { f: "Idle", t: "Compare_Tag", lbl: "Valid CPU request", cp: null },
    {
      f: "Compare_Tag",
      t: "Idle",
      lbl: "Cache Hit / Mark Ready",
      cp: { x: 200, y: 30 },
    },
    { f: "Compare_Tag", t: "Write_Back", lbl: "Miss + Dirty", cp: null },
    {
      f: "Write_Back",
      t: "Allocate",
      lbl: "Memory Ready",
      cp: { x: 200, y: 330 },
    },
    {
      f: "Compare_Tag",
      t: "Allocate",
      lbl: "Miss + Clean",
      cp: null,
      lblOff: { x: -20, y: 0 },
    },
    {
      f: "Allocate",
      t: "Compare_Tag",
      lbl: "Memory Ready",
      cp: { x: 165, y: 185 },
    },
    {
      f: "Write_Back",
      t: "Write_Back",
      lbl: "Mem not Ready",
      self: true,
      side: "right",
    },
    {
      f: "Allocate",
      t: "Allocate",
      lbl: "Mem not Ready",
      self: true,
      side: "left",
    },
  ];

  function nodePt(name, toward) {
    const { cx, cy } = NP[name];
    if (!toward) return { x: cx, y: cy };
    const { cx: tx, cy: ty } = NP[toward];
    const dx = tx - cx,
      dy = ty - cy,
      d = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: cx + (dx / d) * NR, y: cy + (dy / d) * NR };
  }

  function edgePath(e) {
    if (e.self) {
      const { cx, cy } = NP[e.f];
      const ox = e.side === "right" ? 1 : -1;
      return {
        d: `M${cx + ox * NR * 0.55},${cy - 18} C${cx + ox * 75},${cy - 52} ${cx + ox * 75},${cy + 14} ${cx + ox * NR * 0.7},${cy + 20}`,
        mx: cx + ox * 66,
        my: cy - 32,
      };
    }
    const p1 = nodePt(e.f, e.t),
      p2 = nodePt(e.t, e.f);
    if (e.cp) {
      const cpx = e.cp.x,
        cpy = e.cp.y;
      const isAlloc2Cmp = e.f === "Allocate" && e.t === "Compare_Tag";
      const lmx = isAlloc2Cmp ? cpx - 18 : cpx;
      const lmy =
        cpy +
        (e.f === "Compare_Tag" && e.t === "Idle"
          ? -10
          : e.f === "Write_Back"
            ? 14
            : isAlloc2Cmp
              ? -8
              : 0);
      return {
        d: `M${p1.x},${p1.y} Q${cpx},${cpy} ${p2.x},${p2.y}`,
        mx: lmx,
        my: lmy,
      };
    }
    const lmx = (p1.x + p2.x) / 2 + (e.lblOff ? e.lblOff.x : 0);
    const lmy = (p1.y + p2.y) / 2 + (e.lblOff ? e.lblOff.y : -8);
    return { d: `M${p1.x},${p1.y} L${p2.x},${p2.y}`, mx: lmx, my: lmy };
  }

  return (
    <svg viewBox="0 0 430 380" width="100%" style={{ overflow: "visible" }}>
      <defs>
        <marker
          id="ah0"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#3a3a3a" />
        </marker>
        {Object.keys(SC).map((s) => (
          <marker
            key={s}
            id={`ah-${s}`}
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L7,3.5 L0,7 Z" fill={SC[s].col} />
          </marker>
        ))}
        {Object.keys(SC).map((s) => (
          <filter
            key={s}
            id={`glow-${s}`}
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feFlood floodColor={SC[s].col} floodOpacity={0.85} result="c" />
            <feComposite in="c" in2="b" operator="in" result="s" />
            <feMerge>
              <feMergeNode in="s" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
        <style>{`@keyframes dashMove{to{stroke-dashoffset:-14}}`}</style>
      </defs>
      {edges.map((e) => {
        const key = `${e.f}__${e.t}`;
        const isAct = activeEdge === key;
        const col = SC[active]?.col || "#3a3a3a";
        const { d, mx, my } = edgePath(e);
        return (
          <g key={key}>
            {isAct && (
              <path
                d={d}
                fill="none"
                stroke={col}
                strokeWidth="6"
                opacity=".15"
                filter={`url(#glow-${active})`}
              />
            )}
            <path
              d={d}
              fill="none"
              stroke={isAct ? col : "#333"}
              strokeWidth={isAct ? 1.8 : 0.9}
              markerEnd={`url(#${isAct ? "ah-" + active : "ah0"})`}
              style={{ transition: "stroke .35s, stroke-width .35s" }}
            />
            {isAct && (
              <path
                d={d}
                fill="none"
                stroke={col}
                strokeWidth="1.5"
                opacity=".9"
                strokeDasharray="5 9"
                style={{ animation: "dashMove 1s linear infinite" }}
              />
            )}
            <text
              x={mx}
              y={my}
              textAnchor="middle"
              fontSize="7.5"
              fill={isAct ? col : "#4a4a5a"}
              fontFamily="'JetBrains Mono', monospace"
              style={{ transition: "fill .35s" }}
            >
              {e.lbl}
            </text>
          </g>
        );
      })}
      {Object.entries(NP).map(([id, { cx, cy }]) => {
        const isAct = active === id;
        const sc = SC[id];
        const nameLines = {
          Idle: ["IDLE"],
          Compare_Tag: ["CMP", "TAG"],
          Write_Back: ["WRITE", "BACK"],
          Allocate: ["ALLOC"],
        }[id];
        const sub = {
          Idle: "wait",
          Compare_Tag: "hit / miss?",
          Write_Back: "evict dirty",
          Allocate: "fetch block",
        }[id];
        const fillH = Math.min(NR * 2 * safeFillPct, NR * 2);
        const fillY = cy + NR - fillH;
        return (
          <g key={id}>
            <defs>
              <clipPath id={`clip-${id}`}>
                <circle cx={cx} cy={cy} r={NR - 1} />
              </clipPath>
            </defs>
            <circle
              cx={cx}
              cy={cy}
              r={NR}
              fill="#1e1e1e"
              stroke={isAct ? sc.col : "#333"}
              strokeWidth={isAct ? 2 : 1}
              filter={isAct ? `url(#glow-${id})` : undefined}
              style={{ transition: "stroke .35s" }}
            />
            {isAct && (
              <rect
                clipPath={`url(#clip-${id})`}
                x={cx - NR}
                y={fillY}
                width={NR * 2}
                height={fillH}
                fill={sc.col}
                opacity=".22"
                style={{ transition: "none" }}
              />
            )}
            {isAct && safeFillPct > 0.02 && safeFillPct < 0.99 && (
              <line
                clipPath={`url(#clip-${id})`}
                x1={cx - NR}
                y1={fillY}
                x2={cx + NR}
                y2={fillY}
                stroke={sc.col}
                strokeWidth={1.2}
                opacity={Math.min(safeFillPct * 3, 0.8)}
                style={{ transition: "none" }}
              />
            )}
            {isAct && (
              <circle
                cx={cx}
                cy={cy}
                r={NR - 5}
                fill="none"
                stroke={sc.col}
                strokeWidth=".5"
                opacity=".35"
              />
            )}
            {nameLines.map((ln, i, arr) => (
              <text
                key={i}
                x={cx}
                y={cy + (i - (arr.length - 1) / 2) * 12 - (sub ? 5 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="10"
                fontWeight="600"
                fill={isAct ? sc.col : "#787c99"}
                style={{ transition: "fill .35s", pointerEvents: "none" }}
              >
                {ln}
              </text>
            ))}
            <text
              x={cx}
              y={cy + NR * 0.52}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="7.5"
              fill={isAct ? "#a9b1d6" : "#4a4a5a"}
              style={{ transition: "fill .35s", pointerEvents: "none" }}
            >
              {sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
});
