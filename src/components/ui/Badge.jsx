import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-[var(--border2)] bg-[var(--bg3)] text-[var(--text2)]",
        Idle: "border-[rgba(115,218,202,0.2)] bg-[rgba(115,218,202,0.1)] text-[var(--green)]",
        Compare_Tag:
          "border-[rgba(122,162,247,0.2)] bg-[rgba(122,162,247,0.1)] text-[var(--blue)]",
        Write_Back:
          "border-[rgba(247,118,142,0.2)] bg-[rgba(247,118,142,0.1)] text-[var(--red)]",
        Allocate:
          "border-[rgba(224,175,104,0.2)] bg-[rgba(224,175,104,0.1)] text-[var(--amber)]",
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
