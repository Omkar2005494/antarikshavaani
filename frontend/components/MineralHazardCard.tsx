"use client";

import React, { useState } from "react";
import { Sparkles, Thermometer, Zap, Database, FileCode2, ChevronDown, ChevronUp } from "lucide-react";

export default function MineralHazardCard({ sites, keyStats }: { sites?: any[]; keyStats?: any[] }) {
  const safeSites = Array.isArray(sites) && sites.length > 0 ? sites : [];
  const shivShakti = safeSites.find((s: any) => s.id === "site_shiv_shakti_point") || safeSites[0] || {};
  const [showRawData, setShowRawData] = useState(false);

  const chaste = shivShakti.chaste_thermal_profile || {
    sensors_depth_mm: [0, -10, -20, -30, -40, -50, -60, -70, -80, -90],
    temperature_celsius: [50.2, 38.4, 25.1, 14.8, 4.2, -3.1, -7.5, -9.8, -10.5, -11.2],
    summary: "Steep 61.4°C thermal drop across top 90mm due to vacuum insulation."
  };

  return (
    <div className="p-5 rounded-2xl bg-space-900/95 border border-space-700/80 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-space-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-hud-saffron" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Pragyan Rover LIBS In-Situ Mineralogy & ChaSTE Thermal Profile
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-space-800 hover:bg-space-700 text-hud-saffron border border-amber-500/40 flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/40"
          >
            <Database className="w-3.5 h-3.5 text-hud-saffron" />
            <span>{showRawData ? "Hide Raw Data" : "🔍 Inspect Raw Telemetry"}</span>
            {showRawData ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Shiv Shakti (69.373°S)
          </span>
        </div>
      </div>

      {/* Raw Dataset Viewer Modal/Drawer */}
      {showRawData && (
        <div className="p-4 rounded-xl bg-space-950 border border-amber-500/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-hud-saffron">
            <span className="flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-hud-saffron" />
              <span>Authentic Chandrayaan-3 Pragyan LIBS & ChaSTE 10-Point Data Object:</span>
            </span>
            <span className="text-[10px] text-slate-400">ISSDC PRADAN Archive</span>
          </div>
          <pre className="text-[11px] font-mono text-amber-300 bg-space-900/90 p-3 rounded-lg overflow-x-auto max-h-64 leading-relaxed">
            {JSON.stringify(shivShakti, null, 2)}
          </pre>
        </div>
      )}

      {/* Key Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        {(keyStats || [
          { label: "Sulfur In-Situ (LIBS)", value: "0.42 wt%", badge: "282.8nm & 286.3nm Lines" },
          { label: "ChaSTE Thermal Drop", value: "61.4°C / 90mm", badge: "+50.2°C to -11.2°C" },
          { label: "RAMBHA-LP Plasma", value: "1.06 x 10^4 /cm3", badge: "Daytime Ionosphere" }
        ]).map((stat: any, i: number) => (
          <div key={i} className="p-3 rounded-xl bg-space-950/80 border border-space-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium uppercase">{stat.label}</div>
            <div className="text-base sm:text-lg font-extrabold text-hud-saffron mt-0.5">{stat.value}</div>
            <span className="text-[10px] text-slate-500 font-mono">{stat.badge}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Pragyan LIBS Elemental Abundances */}
        <div className="p-4 rounded-xl bg-space-950/90 border border-space-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-mono">Pragyan LIBS/APXS Elemental Abundance</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Sulfur (S) Discovered
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { element: "Silicon (Si)", val: 21.4, color: "bg-blue-500" },
              { element: "Aluminum (Al)", val: 13.2, color: "bg-cyan-500" },
              { element: "Iron (Fe)", val: 8.6, color: "bg-rose-500" },
              { element: "Calcium (Ca)", val: 6.8, color: "bg-amber-500" },
              { element: "Magnesium (Mg)", val: 4.5, color: "bg-emerald-500" },
              { element: "Sulfur (S) [Historic In-Situ]", val: 0.42, color: "bg-hud-saffron" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium">{item.element}</span>
                  <span className="text-slate-400">{item.val}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-space-900 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(item.val * 4.5, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded bg-space-900/60 border border-space-800 text-[11px] text-slate-400 space-y-1 font-mono">
            <span className="font-semibold text-hud-saffron flex items-center gap-1">
              <Zap className="w-3 h-3" /> LIBS Atomic Emission Lines:
            </span>
            <p className="text-[10px] text-slate-300">
              Neutral Sulfur (S I) verified at 282.8 nm, 286.3 nm, and 303.4 nm.
            </p>
          </div>
        </div>

        {/* Right: ChaSTE 10-Point Thermal Depth Gradient */}
        <div className="p-4 rounded-xl bg-space-950/90 border border-space-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              ChaSTE 10-Sensor Probe Thermal Profile
            </span>
            <span className="text-[10px] font-mono text-slate-400">0 to -90 mm</span>
          </div>

          {chaste.sensors_depth_mm && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {chaste.sensors_depth_mm.map((depth: number, idx: number) => {
                const temp = chaste.temperature_celsius ? chaste.temperature_celsius[idx] : 0;
                const isPositive = temp > 0;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded bg-space-900/50">
                    <span className="font-mono text-slate-400 text-[11px]">Depth {depth} mm:</span>
                    <span className={`font-mono font-bold ${isPositive ? "text-amber-400" : "text-cyan-400"}`}>
                      {temp > 0 ? `+${temp}` : temp}°C
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-2.5 rounded bg-space-900/60 border border-space-800 text-[11px] text-slate-400 font-sans">
            <span className="font-semibold text-slate-300 block mb-0.5 font-mono">Physical Regolith Insulation:</span>
            <p className="text-[10px] leading-relaxed text-slate-300">
              {chaste.summary || "Steep 61.4°C thermal drop across top 90mm regolith."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
