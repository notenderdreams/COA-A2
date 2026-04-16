import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-border2 bg-bg3 text-text2",
        Idle: "border-green/20 bg-green/10 text-green",
        Compare_Tag:
          "border-blue/20 bg-blue/10 text-blue",
        Write_Back:
          "border-red/20 bg-red/10 text-red",
        Allocate:
          "border-amber/20 bg-amber/10 text-amber",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export default function Badge({
  className = "",
  variant = "default",
  children,
  ...props
}) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
