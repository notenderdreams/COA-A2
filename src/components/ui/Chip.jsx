import React from "react";
import { cn } from "../../lib/utils";

export default function Chip({ children, className = "", live, ...props }) {
  return (
    <div
      className={cn(
        "rounded-sm border border-[var(--border2)] bg-[var(--bg3)] px-2 py-1 text-xs text-[var(--text2)]",
        live &&
          "border-[var(--green)] bg-[rgba(115,218,202,0.08)] text-[var(--green)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
