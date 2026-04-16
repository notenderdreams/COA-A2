import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(function Input(
  { className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-7 rounded-md border border-border2 bg-bg3 px-3 py-1 text-xs text-text outline-none transition-colors placeholder:text-text3 focus-visible:border-blue disabled:cursor-not-allowed disabled:opacity-50",
        "font-mono",
        className,
      )}
      {...props}
    />
  );
});

export default Input;
