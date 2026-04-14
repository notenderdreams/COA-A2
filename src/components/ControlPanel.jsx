import { SC } from "../fsm/constants";
import Button from "./ui/Button";

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

function SkipBackIcon(props) {
  return (
    <TransportIcon {...props}>
      <rect x="2" y="2.5" width="2" height="11" rx="0.75" />
      <path d="M13 3.15v9.7c0 .7-.78 1.12-1.37.72L5.2 8.72a.84.84 0 0 1 0-1.44l6.43-4.85c.6-.4 1.37.02 1.37.72Z" />
    </TransportIcon>
  );
}

function BackIcon(props) {
  return (
    <TransportIcon {...props}>
      <path d="M12.5 2.97v10.06c0 .7-.8 1.11-1.38.7l-6.68-5.03a.88.88 0 0 1 0-1.4l6.68-5.03c.58-.41 1.38 0 1.38.7Z" />
    </TransportIcon>
  );
}

function PlayIcon(props) {
  return (
    <TransportIcon {...props}>
      <path d="M12.62 7.26 5.8 2.96c-.66-.42-1.52.05-1.52.83v8.42c0 .78.86 1.25 1.52.83l6.82-4.3a.88.88 0 0 0 0-1.48Z" />
    </TransportIcon>
  );
}

function PauseIcon(props) {
  return (
    <TransportIcon {...props}>
      <rect x="3.25" y="2.75" width="3.25" height="10.5" rx="0.9" />
      <rect x="9.5" y="2.75" width="3.25" height="10.5" rx="0.9" />
    </TransportIcon>
  );
}

function ForwardIcon(props) {
  return (
    <TransportIcon {...props}>
      <path d="M3.5 2.97v10.06c0 .7.8 1.11 1.38.7l6.68-5.03a.88.88 0 0 0 0-1.4L4.88 2.27c-.58-.41-1.38 0-1.38.7Z" />
    </TransportIcon>
  );
}

function SkipForwardIcon(props) {
  return (
    <TransportIcon {...props}>
      <path d="M3 3.15v9.7c0 .7.78 1.12 1.37.72L10.8 8.72a.84.84 0 0 0 0-1.44L4.37 2.43C3.78 2.03 3 2.45 3 3.15Z" />
      <rect x="12" y="2.5" width="2" height="11" rx="0.75" />
    </TransportIcon>
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

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-border bg-bg2 px-4 py-2">
      <Button size="icon" onClick={() => seek(0)} disabled={!total || running}>
        <SkipBackIcon {...iconProps} />
      </Button>

      <Button
        size="icon"
        onClick={() => seek(Math.max(0, step - 1))}
        disabled={step <= 0 || running}
      >
        <BackIcon {...iconProps} />
      </Button>

      <Button
        variant={running ? "run" : "primary"}
        size="icon"
        onClick={handleToggleRun}
        disabled={!total}
      >
        {running ? <PauseIcon {...iconProps} /> : <PlayIcon {...iconProps} />}
      </Button>

      <Button
        size="icon"
        onClick={() => seek(Math.min(total - 1, step + 1))}
        disabled={step >= total - 1 || running}
      >
        <ForwardIcon {...iconProps} />
      </Button>

      <Button
        size="icon"
        onClick={() => seek(total - 1)}
        disabled={!total || running}
      >
        <SkipForwardIcon {...iconProps} />
      </Button>

      <div className="min-w-16 text-center text-xs text-text2">
        {cur ? <b className="font-semibold text-text">{cur.cycle}</b> : "-"} /{" "}
        {total || "-"}
      </div>

      {cur && (
        <div
          className="ml-1 max-w-56 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-mono"
          style={{ color: SC[curState]?.col }}
        >
          {cur.note}
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
