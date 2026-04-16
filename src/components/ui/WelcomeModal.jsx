import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * WelcomeModal - Onboarding dialog shown on start
 * Showcases the app name "SPADE" and provides initial instructions.
 */
export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      className="animate-in fade-in duration-700"
    >
      <div
        style={{
          width: "90%",
          maxWidth: "480px",
          minWidth: "320px",
        }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-bg2/40 p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl ring-1 ring-white/10 transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-5"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-blue/20 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-purple/20 blur-[100px]" />
        
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-1 text-[10px] font-bold tracking-[0.4em] text-blue uppercase opacity-60">
            Welcome to
          </div>
          <h1 className="mb-2 font-title text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 drop-shadow-2xl">
            FSM Cache Controller
          </h1>
          <div className="mb-10 h-1 w-12 rounded-full bg-gradient-to-r from-blue to-purple" />
          
          <div className="flex flex-col gap-4 text-left w-full">
            <div className="group flex items-start gap-4 rounded-2xl bg-white/[0.03] p-5 border border-white/[0.05] transition-all hover:bg-white/[0.05]">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue font-bold text-xs ring-1 ring-blue/20">1</div>
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-white/90">
                  Select a Preset
                </p>
                <p className="text-xs leading-relaxed text-text2">
                  Head to the <span className="text-blue font-medium">Presets</span> tab on the right to load a simulation trace.
                </p>
              </div>
            </div>
            
            <div className="group flex items-start gap-4 rounded-2xl bg-white/[0.03] p-5 border border-white/[0.05] transition-all hover:bg-white/[0.05]">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple/10 text-purple font-bold text-xs ring-1 ring-purple/20">2</div>
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-white/90">
                  Start Simulation
                </p>
                <p className="text-xs leading-relaxed text-text2">
                  Press <span className="text-purple font-medium italic underline decoration-purple/30 underline-offset-2">Play</span> or hit <kbd className="mx-0.5 rounded-md border border-white/10 bg-bg4 px-1.5 py-0.5 font-mono text-[10px] text-amber shadow-sm">Space</kbd> to begin.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="group relative mt-10 w-full cursor-pointer overflow-hidden rounded-2xl bg-white text-bg py-4.5 font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/20"
          >
            <span className="relative z-10">Launch Environment</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue/20 to-purple/20 transition-transform duration-500 group-hover:translate-x-0" />
          </button>
{/*           
          <p className="mt-6 text-[10px] text-text3 font-medium uppercase tracking-widest">
            230041234 & 230041262
          </p> */}
        </div>
      </div>
    </div>,
    document.body,
  );
}
