import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border text-xs font-semibold font-mono transition-[color,background-color,border-color,opacity,transform,box-shadow] outline-none select-none focus-visible:ring-1 focus-visible:ring-blue/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "border-border2 bg-bg3 text-text hover:bg-bg4",
        outline: "border-border2 bg-transparent text-text2 hover:bg-bg3 hover:text-text",
        primary: "border-blue bg-blue text-bg hover:bg-blue/90",
        danger: "border-red/40 bg-red/12 text-red hover:bg-red/18",
        run: "border-amber/50 bg-amber/12 text-amber hover:bg-amber/18",
      },
      size: {
        default: "h-7 px-3",
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
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
});

export { buttonVariants };
export default Button;
