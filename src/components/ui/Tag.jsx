import React from "react";
import { cn } from "../../lib/utils";

export default function Tag({
  children,
  type,
  active,
  done,
  className = "",
  ...props
}) {
  const isRead = type === "R" || type === "r";
  const isWrite = type === "W" || type === "w";

  return (
    <span
      className={cn(
        "inline-flex rounded-sm border px-2 py-1 text-xs font-semibold",
        isRead &&
          "border-[rgba(122,162,247,0.4)] bg-[rgba(122,162,247,0.08)] text-[var(--blue)]",
        isWrite &&
          "border-[rgba(187,154,247,0.4)] bg-[rgba(187,154,247,0.08)] text-[var(--purple)]",
        active &&
          isRead &&
          "border-[var(--blue)] bg-[var(--blue)] text-[#1a1a1a]",
        active &&
          isWrite &&
          "border-[var(--purple)] bg-[var(--purple)] text-[#1a1a1a]",
        done && "opacity-30",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
