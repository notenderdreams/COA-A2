import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md border font-medium transition-[color,background-color,border-color,opacity,transform] outline-none select-none disabled:pointer-events-none disabled:opacity-25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--border2)] bg-[var(--bg3)] text-[var(--text2)] hover:bg-[var(--bg4)] hover:text-[var(--text)]",
        outline:
          "border-[var(--border2)] bg-[var(--bg3)] text-[var(--text2)] hover:bg-[var(--bg4)] hover:text-[var(--text)]",
        primary:
          "border-[var(--blue)] bg-[var(--blue)] text-[#1a1a1a] hover:opacity-85",
        danger:
          "border-[rgba(247,118,142,0.3)] bg-[var(--bg3)] text-[var(--red)] hover:bg-[var(--bg4)]",
        run: "border-[var(--amber)] bg-[rgba(224,175,104,0.12)] text-[var(--amber)] hover:bg-[rgba(224,175,104,0.18)]",
      },
      size: {
        default: "min-h-7 px-3 py-1 text-xs",
        icon: "size-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(function Button(
  {
    className = "",
    variant = "default",
    size = "default",
    type = "button",
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        buttonVariants({ variant, size }),
        "font-[var(--mono)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export { buttonVariants };
export default Button;
