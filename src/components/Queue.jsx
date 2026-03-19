import React from "react";

function Queue({ queue, activeReqIdx }) {
  return (
    <div className="q-wrap">
      {queue.length === 0 ? (
        <span style={{ fontSize: 8.5, color: "var(--text3)" }}>
          queue empty
        </span>
      ) : (
        queue.map((q, i) => (
          <span
            key={i}
            className={`qtag ${q.type === "R" ? "r" : "w"}${i === activeReqIdx ? " act" : ""} ${i < activeReqIdx ? "done" : ""}`}
          >
            {q.type}:
            {q.addr.toString(16).toUpperCase().padStart(8, "0").slice(-5)}
            {q.type === "W"
              ? "=" + q.data.toString(16).toUpperCase().padStart(2, "0")
              : ""}
          </span>
        ))
      )}
    </div>
  );
}

export default Queue;