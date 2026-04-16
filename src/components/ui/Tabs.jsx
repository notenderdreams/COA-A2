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
        "flex shrink-0 gap-1 border-b border-white/5 bg-white/[0.01] px-4 backdrop-blur-sm",
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
        "relative px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-text3 transition-all duration-300 hover:text-text2",
        active && "text-blue",
        className,
      )}
      data-state={active ? "active" : "inactive"}
      onClick={() => ctx?.onValueChange?.(value)}
      {...props}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue to-purple shadow-[0_0_10px_rgba(122,162,247,0.5)]" />
      )}
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
