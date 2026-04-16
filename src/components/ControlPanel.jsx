import { SC } from "../fsm/constants";
import Button from "./ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";

function TransportIcon({ children, size = 16, className = "icon" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

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

  const iconProps = { size: 16, className: "icon" };
  const stateColorClass = {
    Idle: "text-green",
    Compare_Tag: "text-blue",
    Write_Back: "text-red",
    Allocate: "text-amber",
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-border bg-bg2 px-4 py-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => seek(0)}
        disabled={!total || running}
      >
        <SkipBack {...iconProps} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => seek(Math.max(0, step - 1))}
        disabled={step <= 0 || running}
      >
        <ChevronLeft {...iconProps} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleToggleRun}
        disabled={!total}
        className={running ? "border-border2 bg-bg4 text-text" : ""}
      >
        {running ? <Pause {...iconProps} /> : <Play {...iconProps} />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => seek(Math.min(total - 1, step + 1))}
        disabled={step >= total - 1 || running}
      >
        <ChevronRight {...iconProps} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => seek(total - 1)}
        disabled={!total || running}
      >
        <SkipForward {...iconProps} />
      </Button>

      <div className="min-w-16 text-center text-xs text-text2">
        {cur ? <b className="font-semibold text-text">{cur.cycle}</b> : "-"} /{" "}
        {total || "-"}
      </div>

      {cur && (
        <div
          className={`ml-1 min-w-0 flex-1 whitespace-pre-wrap text-right font-mono text-xs leading-tight ${stateColorClass[curState] || "text-text2"}`}
        >
          {cur.note}
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
