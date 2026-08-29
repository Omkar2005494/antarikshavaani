"use client";

import React, { useState, useEffect } from "react";
import { Satellite, Radio, Globe2, Activity, ShieldCheck, Clock } from "lucide-react";

export default function Navbar() {
  const [timeStr, setTimeStr] = useState({ ist: "", utc: "" });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr({
        ist: now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }) + " IST",
        utc: now.toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: false }) + " UTC",
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-space-700/60 shadow-2xl">
      {/* Indian Tricolor Accent Line */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-hud-saffron shadow-sm shadow-hud-saffron/40" />
        <div className="w-1/3 bg-white shadow-sm shadow-white/40" />
        <div className="w-1/3 bg-emerald-500 shadow-sm shadow-emerald-500/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hud-cyan via-space-700 to-space-950 p-[1.5px] shadow-lg shadow-hud-cyan/20">
              <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
                <Satellite className="w-5 h-5 text-hud-cyan animate-pulse-glow" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-space-950 rounded-full animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-space-950 rounded-full" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-hud-cyan">
                AntarikshaVaani
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-hud-cyan/10 text-hud-cyan border border-hud-cyan/30 rounded-full">
                v2.0 PDS4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide">
              ISRO Autonomous Space Intelligence System
            </p>
          </div>
        </div>

        {/* Right: Live Telemetry & Clocks */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Real-time Space Clock */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-space-950/80 border border-space-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-hud-cyan" />
            <span className="text-white font-semibold">{timeStr.ist || "LIVE IST"}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{timeStr.utc || "UTC"}</span>
          </div>

          {/* ISTRAC Active Tracking Status */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-space-950/80 border border-space-800 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">ISTRAC:</span>
            <span className="text-emerald-400 font-bold">54 Active Satellites</span>
          </div>

          {/* IDSN Byalalu Deep Space Dish */}
          <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-space-800/60 border border-space-700 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-hud-saffron" />
            <span className="text-slate-300 hidden md:inline">IDSN Byalalu:</span>
            <span className="text-hud-saffron font-bold">32m Dish Locked</span>
          </div>
        </div>
      </div>
    </header>
  );
}
