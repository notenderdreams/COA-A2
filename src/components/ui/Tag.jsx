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
        isRead && "border-blue/40 bg-blue/8 text-blue",
        isWrite && "border-purple/40 bg-purple/8 text-purple",
        active && isRead && "border-blue bg-blue text-bg",
        active && isWrite && "border-purple bg-purple text-bg",
        done && "opacity-30",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
