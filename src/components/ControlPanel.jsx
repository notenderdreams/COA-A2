import { SC } from "../fsm/constants";
import Button from "./ui/Button";
import {
  SkipBack,
  Rewind,
  Play,
  Pause,
  FastForward,
  SkipForward,
} from "lucide-react";

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

  const iconProps = { size: 16, strokeWidth: 2, className: "icon" };

  return (
    <div className="transport">
      <Button onClick={() => seek(0)} disabled={!total || running}>
        <SkipBack {...iconProps} />
      </Button>

      <Button
        onClick={() => seek(Math.max(0, step - 1))}
        disabled={step <= 0 || running}
      >
        <Rewind {...iconProps} />
      </Button>

      <Button
        variant={running ? "run" : "primary"}
        onClick={handleToggleRun}
        disabled={!total}
      >
        {running ? <Pause {...iconProps} /> : <Play {...iconProps} />}
      </Button>

      <Button
        onClick={() => seek(Math.min(total - 1, step + 1))}
        disabled={step >= total - 1 || running}
      >
        <FastForward {...iconProps} />
      </Button>

      <Button onClick={() => seek(total - 1)} disabled={!total || running}>
        <SkipForward {...iconProps} />
      </Button>

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
