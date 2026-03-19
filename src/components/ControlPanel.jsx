import React from "react";
import { SC } from "../fsm/constants";

function ControlPanel({
  total,
  running,
  step,
  cur,
  curState,
  seek,
  setRunning,
}) {
  const handleToggleRun = () => {
    if (!running && step < 0 && total > 0) {
      seek(0);
    }
    setRunning((r) => !r);
  };

  return (
    <div className="transport">
      <button
        className="btn"
        onClick={() => seek(0)}
        disabled={!total || running}
      >
        ⏮
      </button>

      <button
        className="btn"
        onClick={() => seek(Math.max(0, step - 1))}
        disabled={step <= 0 || running}
      >
        ⏪
      </button>

      <button
        className={`btn ${running ? "run" : "primary"}`}
        onClick={handleToggleRun}
        disabled={!total}
      >
        {running ? "⏸" : "▶"}
      </button>

      <button
        className="btn"
        onClick={() => seek(Math.min(total - 1, step + 1))}
        disabled={step >= total - 1 || running}
      >
        ⏩
      </button>

      <button
        className="btn"
        onClick={() => seek(total - 1)}
        disabled={!total || running}
      >
        ⏭
      </button>

      <div className="cyc">
        {cur ? <b>{cur.cycle}</b> : "—"} / {total || "—"}
      </div>

      {cur && (
        <div
          style={{
            marginLeft: 4,
            fontSize: 8,
            color: SC[curState]?.col,
            fontFamily: "var(--mono)",
            maxWidth: 200,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {cur.note}
        </div>
      )}
    </div>
  );
}

export default ControlPanel;