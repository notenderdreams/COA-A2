import React from "react";
import Tag from "./ui/Tag";

function Queue({ queue, activeReqIdx }) {
  return (
    <div className="q-wrap">
      {queue.length === 0 ? (
        <span style={{ fontSize: 8.5, color: "var(--text3)" }}>
          queue empty
        </span>
      ) : (
        queue.map((q, i) => (
          <Tag
            key={i}
            type={q.type}
            active={i === activeReqIdx}
            done={i < activeReqIdx}
          >
            {q.type}:
            {q.addr.toString(16).toUpperCase().padStart(8, "0").slice(-5)}
            {q.type === "W"
              ? "=" + q.data.toString(16).toUpperCase().padStart(2, "0")
              : ""}
          </Tag>
        ))
      )}
    </div>
  );
}

export default Queue;