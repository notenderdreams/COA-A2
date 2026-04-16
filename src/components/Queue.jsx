import React from "react";
import Tag from "./ui/Tag";

function formatHex(value, width) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "?".repeat(width);
  }
  return value.toString(16).toUpperCase().padStart(width, "0");
}

function Queue({ queue, activeReqIdx }) {
  return (
    <div className="flex max-h-[52px] shrink-0 flex-wrap content-start gap-0.5 overflow-y-auto border-t border-border bg-bg2 px-3 py-1.5">
      {queue.length === 0 ? (
        <span className="text-xs text-text3">queue empty</span>
      ) : (
        queue.map((q, i) => (
          <Tag
            key={i}
            type={q.type}
            active={i === activeReqIdx}
            done={i < activeReqIdx}
          >
            {q.type ?? "?"}:
            {formatHex(q?.addr, 8).slice(-5)}
            {q.type === "W"
              ? "=" + formatHex(q?.data, 2)
              : ""}
          </Tag>
        ))
      )}
    </div>
  );
}

export default Queue;
