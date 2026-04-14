import React from "react";
import { cn } from "../../lib/utils";

export default function Divider({ className = "", style = {}, ...props }) {
  return (
    <div
      className={cn("mx-1 h-8 w-px bg-[var(--border2)]", className)}
      style={{
        ...style,
      }}
      {...props}
    />
  );
}
