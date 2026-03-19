import React from "react";
import Button from "./ui/Button";
import Divider from "./ui/Divider";
import Input from "./ui/Input";

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
      <Input
        type="text"
        value={addrStr}
        onChange={(e) => setAddrStr(e.target.value)}
        style={{ width: 84 }}
        placeholder="0x00000000"
      />

      <Divider />

      <Button
        variant="primary"
        onClick={handleRead}
        style={{
          background: "var(--blue)",
          borderColor: "var(--blue)",
          color: "#1a1a1a",
        }}
      >
        + Read
      </Button>

      <Divider />

      <span className="lbl">DATA</span>
      <Input
        type="text"
        value={dataStr}
        onChange={(e) => setDataStr(e.target.value)}
        style={{ width: 84 }}
        placeholder="0x000000AB"
      />

      <Button
        variant="primary"
        onClick={handleWrite}
        style={{
          background: "var(--purple)",
          borderColor: "var(--purple)",
          color: "#1a1a1a",
        }}
      >
        + Write
      </Button>

      <div style={{ flex: 1 }} />

      <Button variant="danger" onClick={reset}>
        ↺ Reset
      </Button>
    </div>
  );
}

export default OpPanel;