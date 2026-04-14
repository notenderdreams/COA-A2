import React from "react";
import Button from "./ui/Button";
import Divider from "./ui/Divider";
import Input from "./ui/Input";

/**
 * OpPanel - Footer Operation Panel
 * Provides memory read/write controls
 * Spacing: 4-based scale (8px padding, 4px gaps)
 * Typography: 12px base, 10px labels
 */
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
    <div className="flex shrink-0 flex-wrap items-center gap-1 border-t border-border bg-bg2 px-2 py-2">
      <span className="text-xs font-medium text-text3">ADDR</span>
      <Input
        type="text"
        value={addrStr}
        onChange={(e) => setAddrStr(e.target.value)}
        className="w-20"
        placeholder="0x00000000"
      />

      <Divider />

      <Button variant="primary" onClick={handleRead}>
        + Read
      </Button>

      <Divider />

      <span className="text-xs font-medium text-text3">DATA</span>
      <Input
        type="text"
        value={dataStr}
        onChange={(e) => setDataStr(e.target.value)}
        className="w-20"
        placeholder="0x000000AB"
      />

      <Button
        variant="default"
        className="border-purple bg-purple text-bg hover:opacity-85"
        onClick={handleWrite}
      >
        + Write
      </Button>

      <div className="flex-1" />

      <Button variant="danger" onClick={reset}>
        ↺ Reset
      </Button>
    </div>
  );
}

export default OpPanel;
