import React from "react";
import Chip from "./ui/Chip";

export default function TopBar({ running, total }) {
  return (
    <div className="topbar">
      <div className="dot" />
      <div className="tb-title">FSM Cache Controller</div>
      <div className="tb-right">
        <Chip>COA / A2 / 230041234</Chip>
        <Chip live={running}>
          {running ? "● RUNNING" : "PAUSED"}
        </Chip>
        <Chip style={{ color: "var(--green)" }}>
          {total} cycles
        </Chip>
      </div>
    </div>
  );
}
