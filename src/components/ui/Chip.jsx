import React from "react";
import { cn } from "../../lib/utils";

export default function Chip({ children, className = "", live, ...props }) {
  return (
    <div
      className={cn(
        "rounded-sm border border-border2 bg-bg3 px-2 py-1 text-xs text-text2",
        live && "border-green bg-green/8 text-green",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
