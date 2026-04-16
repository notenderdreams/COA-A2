import React, { createContext, useContext } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext(null);

function Tabs({ value, onValueChange, className, children }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        "flex shrink-0 border-b border-border bg-bg2",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;

  return (
    <button
      type="button"
      className={cn(
        "mb-[-1px] border-b-2 border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-text3 transition-[color,border-color] hover:text-text2",
        active && "border-b-blue text-text",
        className,
      )}
      data-state={active ? "active" : "inactive"}
      onClick={() => ctx?.onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className, children }) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;

  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
