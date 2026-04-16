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
    "": "border-blue bg-blue/10 text-blue",
    g: "border-green bg-green/10 text-green",
    r: "border-red bg-red/10 text-red",
    a: "border-amber bg-amber/10 text-amber",
    p: "border-purple bg-purple/10 text-purple",
  };
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm border border-border2 bg-bg3 px-2 py-0.5 text-xs font-semibold leading-none text-text3 transition-all",
        value && variantMap[variantClass ?? ""],
        className,
      )}
      {...props}
    >
      {signalName.replace(/_/g, " ")} = <b>{value}</b>
    </div>
  );
}
