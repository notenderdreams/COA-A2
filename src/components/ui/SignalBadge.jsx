import React from "react";
import { cn } from "../../lib/utils";

export default function SignalBadge({
  signalName,
  value,
  variantClass = "",
  className = "",
  ...props
}) {
  const variantMap = {
    "": "border-[var(--blue)] bg-[rgba(122,162,247,0.1)] text-[var(--blue)]",
    g: "border-[var(--green)] bg-[rgba(115,218,202,0.1)] text-[var(--green)]",
    r: "border-[var(--red)] bg-[rgba(247,118,142,0.1)] text-[var(--red)]",
    a: "border-[var(--amber)] bg-[rgba(224,175,104,0.1)] text-[var(--amber)]",
    p: "border-[var(--purple)] bg-[rgba(187,154,247,0.1)] text-[var(--purple)]",
  };
  return (
    <div
      className={cn(
        "rounded-sm border border-[var(--border2)] bg-[var(--bg3)] px-2 py-1 text-xs font-semibold text-[var(--text3)] transition-all",
        value && variantMap[variantClass ?? ""],
        className,
      )}
      {...props}
    >
      {signalName.replace(/_/g, " ")} = <b>{value}</b>
    </div>
  );
}
