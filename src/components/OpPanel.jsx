import React from "react";

function Divider() {
  return (
    <div
      style={{
        width: "1px",
        height: "14px",
        background: "var(--border2)",
        margin: "0 4px",
      }}
    />
  );
}

function OpPanel({
  addrStr,
  setAddrStr,
  dataStr,
  setDataStr,
  handleRead,
  handleWrite,
  reset,
}) {
  return (
    <div className="enq-row">
      <span className="lbl">ADDR</span>
      <input
        type="text"
        value={addrStr}
        onChange={(e) => setAddrStr(e.target.value)}
        style={{ width: 84 }}
        placeholder="0x00000000"
      />

      <Divider />

      <button
        className="btn primary"
        onClick={handleRead}
        style={{
          background: "var(--blue)",
          borderColor: "var(--blue)",
          color: "#1a1a1a",
        }}
      >
        + Read
      </button>

      <Divider />

      <span className="lbl">DATA</span>
      <input
        type="text"
        value={dataStr}
        onChange={(e) => setDataStr(e.target.value)}
        style={{ width: 84 }}
        placeholder="0x000000AB"
      />

      <button
        className="btn primary"
        onClick={handleWrite}
        style={{
          background: "var(--purple)",
          borderColor: "var(--purple)",
          color: "#1a1a1a",
        }}
      >
        + Write
      </button>

      <div style={{ flex: 1 }} />

      <button className="btn danger" onClick={reset}>
        ↺ Reset
      </button>
    </div>
  );
}

export default OpPanel;