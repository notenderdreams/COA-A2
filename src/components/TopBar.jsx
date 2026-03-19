export default function TopBar({ running, total }) {
  return (
    <div className="topbar">
      <div className="dot" />
      <div className="tb-title">FSM Cache Controller</div>
      <div className="tb-right">
        <div className="chip">COA / A2 / 230041234</div>
        <div className={`chip ${running ? "live" : ""}`}>
          {running ? "● RUNNING" : "PAUSED"}
        </div>
        <div className="chip" style={{ color: "var(--green)" }}>
          {total} cycles
        </div>
      </div>
    </div>
  );
}
