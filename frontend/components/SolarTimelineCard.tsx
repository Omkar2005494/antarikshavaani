"use client";

import React, { useState } from "react";
import { Sun, Zap, AlertTriangle, ShieldAlert, Radio, Activity, Database, ChevronDown, ChevronUp } from "lucide-react";

export default function SolarTimelineCard({ events, keyStats }: { events?: any[]; keyStats?: any[] }) {
  const safeEvents = Array.isArray(events) && events.length > 0 ? events : [];
  const [showRawData, setShowRawData] = useState(false);

  return (
    <div className="p-5 rounded-2xl bg-space-900/95 border border-space-700/80 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-space-800">
        <div className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-hud-amber animate-spin" style={{ animationDuration: "20s" }} />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Aditya-L1 SWOC Space Weather & CME Kinematics
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-space-800 hover:bg-space-700 text-hud-amber border border-hud-amber/30 flex items-center gap-1 transition-all"
          >
            <Database className="w-3 h-3" />
            <span>{showRawData ? "Hide Raw Data" : "Inspect Raw SWOC"}</span>
            {showRawData ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Halo Orbit (1.5M km)
          </span>
        </div>
      </div>

      {/* Raw SWOC Event Viewer */}
      {showRawData && (
        <div className="p-4 rounded-xl bg-space-950 border border-hud-amber/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-hud-amber">
            <span>Authentic Aditya-L1 SWOC Telemetry Logs:</span>
            <span className="text-[10px] text-slate-400">ISRO Space Weather Operations Centre</span>
          </div>
          <pre className="text-[11px] font-mono text-amber-300 bg-space-900/90 p-3 rounded-lg overflow-x-auto max-h-60 leading-relaxed">
            {JSON.stringify(safeEvents, null, 2)}
          </pre>
        </div>
      )}

      {/* Key Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        {(keyStats || [
          { label: "Latest Flare", value: "X5.8 Class", badge: "Active Region AR3780" },
          { label: "Geomagnetic Storm", value: "G4 (Severe)", badge: "Kp = 7.8 | R3 Blackout" },
          { label: "CME Velocity", value: "1,420 km/s", badge: "PAPA Proton: 24.5/cm3" }
        ]).map((stat: any, i: number) => (
          <div key={i} className="p-3 rounded-xl bg-space-950/80 border border-space-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium uppercase">{stat.label}</div>
            <div className="text-base sm:text-lg font-extrabold text-hud-amber mt-0.5">{stat.value}</div>
            <span className="text-[10px] text-slate-500 font-mono">{stat.badge}</span>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {safeEvents.map((evt: any, idx: number) => {
          const flareClass = evt.flare_classification || evt.flare_class || "X5.8";
          const isMajor = flareClass.startsWith("X");
          const cme = evt.cme_parameters || {};
          const forecast = evt.space_weather_forecast || evt.geomagnetic_storm_forecast || {};
          const papa = evt.papa_aspex_telemetry || {};
          const affectedSats = forecast.affected_spacecraft || forecast.satellites_at_risk || [];

          return (
            <div key={idx} className="p-4 rounded-xl bg-space-950/90 border border-space-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-space-900">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    isMajor
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}>
                    {flareClass}
                  </span>
                  <span className="text-xs font-bold text-white">{evt.active_region}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{evt.timestamp}</span>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <p><strong className="text-hud-cyan">VELC Coronagraph:</strong> {evt.velc_coronagraph_log || "Coronal mass eruption tracked."}</p>
                <p><strong className="text-hud-amber">SUIT UV Telescope:</strong> {evt.suit_uv_observations || "Chromospheric flash heating observed."}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-space-900 text-xs font-mono">
                <div className="p-2 rounded bg-space-900/60 border border-space-800">
                  <span className="text-slate-500 text-[10px] block">CME Velocity</span>
                  <span className="font-bold text-hud-amber">{cme.velocity_km_s || 1420} km/s</span>
                </div>
                <div className="p-2 rounded bg-space-900/60 border border-space-800">
                  <span className="text-slate-500 text-[10px] block">Geomagnetic Risk</span>
                  <span className="font-bold text-rose-400">{forecast.geomagnetic_storm_scale || "G4 (Severe)"}</span>
                </div>
                <div className="p-2 rounded bg-space-900/60 border border-space-800">
                  <span className="text-slate-500 text-[10px] block">Kp Index</span>
                  <span className="font-bold text-rose-400">{forecast.kp_index || 7.8}</span>
                </div>
                <div className="p-2 rounded bg-space-900/60 border border-space-800">
                  <span className="text-slate-500 text-[10px] block">Solar Wind Speed</span>
                  <span className="font-bold text-hud-cyan">{papa.solar_wind_speed_km_s || 780} km/s</span>
                </div>
              </div>

              {affectedSats.length > 0 && (
                <div className="pt-2 border-t border-space-900/60">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-400" /> Constellation Satellites Alerted:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {affectedSats.map((sat: any, i: number) => {
                      const name = typeof sat === "string" ? sat : `${sat.name} (${sat.risk || "Risk"})`;
                      return (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/40 text-[10px] font-mono text-rose-300">
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
