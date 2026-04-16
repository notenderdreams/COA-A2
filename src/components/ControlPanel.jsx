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

  const stateColorClass = {
    Idle: "text-green",
    Compare_Tag: "text-blue",
    Write_Back: "text-red",
    Allocate: "text-amber",
  };

  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-white/5 bg-white/[0.02] px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => seek(0)}
          disabled={!total || running}
          className="h-8 w-8 border-white/10 bg-white/5 hover:bg-white/10 text-text2"
        >
          <SkipBack size={14} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => seek(Math.max(0, step - 1))}
          disabled={step <= 0 || running}
          className="h-8 w-8 border-white/10 bg-white/5 hover:bg-white/10 text-text2"
        >
          <ChevronLeft size={14} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleRun}
          disabled={!total}
          className={`h-9 w-9 rounded-xl transition-all ${
            running
              ? "bg-red/10 text-red border-red/20 hover:bg-red/20"
              : "bg-blue/10 text-blue border-blue/20 hover:bg-blue/20"
          }`}
        >
          {running ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => seek(Math.min(total - 1, step + 1))}
          disabled={step >= total - 1 || running}
          className="h-8 w-8 border-white/10 bg-white/5 hover:bg-white/10 text-text2"
        >
          <ChevronRight size={14} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => seek(total - 1)}
          disabled={!total || running}
          className="h-8 w-8 border-white/10 bg-white/5 hover:bg-white/10 text-text2"
        >
          <SkipForward size={14} />
        </Button>
      </div>

      <div className="mx-2 flex items-center justify-center rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold text-text2 ring-1 ring-white/10">
        <span className="text-white">{cur ? cur.cycle : "-"}</span>
        <span className="mx-1 text-text3">/</span>
        <span>{total || "0"}</span>
      </div>

      {cur && (
        <div
          className={`ml-2 min-w-0 flex flex-1 items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 font-mono text-[11px] ${
            stateColorClass[curState] || "text-text2"
          }`}
        >
          <span className="shrink-0 select-none opacity-40">LOG:</span>
          <span className="min-w-0 truncate whitespace-nowrap">{cur.note}</span>
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
