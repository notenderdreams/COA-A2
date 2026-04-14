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
        "flex h-7 rounded-md border border-[var(--border2)] bg-[var(--bg3)] px-3 py-1 text-xs text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text3)] focus-visible:border-[var(--blue)] disabled:cursor-not-allowed disabled:opacity-50",
        "font-[var(--mono)]",
        className,
      )}
      {...props}
    />
  );
});

export default Input;
