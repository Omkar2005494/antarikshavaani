"use client";

import React from "react";
import { Brain, Database, LineChart, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

interface AgentStep {
  step: number;
  agent_name: string;
  status: "WAITING" | "PROCESSING" | "COMPLETED";
  message: string;
}

export default function AgentStepper({ steps, currentStep }: { steps: AgentStep[]; currentStep: number }) {
  const agentIcons = [
    <Brain key="1" className="w-3.5 h-3.5" />,
    <Database key="2" className="w-3.5 h-3.5" />,
    <LineChart key="3" className="w-3.5 h-3.5" />,
    <Sparkles key="4" className="w-3.5 h-3.5" />
  ];

  return (
    <div className="p-3 rounded-xl bg-space-900/60 border border-space-800/80 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-hud-cyan" />
          <span>Swarm Pipeline:</span>
        </div>

        {/* 4 Steps in a single compact row */}
        <div className="flex-1 flex items-center justify-between gap-2 max-w-2xl">
          {steps.map((s, idx) => {
            const isCurrent = currentStep === s.step;
            const isDone = currentStep > s.step || s.status === "COMPLETED";

            return (
              <div key={s.step} className="flex items-center space-x-2">
                <div
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                    isCurrent
                      ? "bg-hud-cyan/15 text-hud-cyan border border-hud-cyan/40 shadow-sm shadow-hud-cyan/20"
                      : isDone
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      : "bg-space-950/60 text-slate-500 border border-space-800"
                  }`}
                >
                  <span className="shrink-0">{agentIcons[idx]}</span>
                  <span className="hidden sm:inline font-medium">{s.agent_name.replace(/^\d+\.\s*/, "")}</span>
                  {isCurrent && <Loader2 className="w-3 h-3 text-hud-cyan animate-spin shrink-0" />}
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                </div>
                {idx < steps.length - 1 && (
                  <span className="hidden md:inline text-slate-700 text-xs font-mono">→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Step Message */}
        <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs hidden lg:block">
          {steps.find(s => s.step === currentStep)?.message || "Pipeline idle"}
        </div>
      </div>
    </div>
  );
}
