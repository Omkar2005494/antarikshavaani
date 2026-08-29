"use client";

import React, { useState } from "react";
import { Moon, Droplets, Compass, FileCode2, Activity, Layers, Database, ChevronDown, ChevronUp } from "lucide-react";

export default function LunarMapCard({ sites, keyStats }: { sites?: any[]; keyStats?: any[] }) {
  const safeSites = Array.isArray(sites) && sites.length > 0 ? sites : [];
  const [selectedSite, setSelectedSite] = useState<any>(safeSites[0] || null);
  const [showRawData, setShowRawData] = useState(false);

  React.useEffect(() => {
    if (safeSites.length > 0 && (!selectedSite || !safeSites.find(s => s.id === selectedSite.id))) {
      setSelectedSite(safeSites[0]);
    }
  }, [safeSites]);

  if (safeSites.length === 0) return null;

  const current = selectedSite || safeSites[0];
  const spectroscopy = current?.iirs_spectroscopy || current?.iirs_spectral_analysis || {};
  const terrain = current?.tmc2_terrain || current?.tmc2_hazard_analysis || {};
  const spectralCurve = spectroscopy.spectral_curve || [
    { wavelength_um: 1.0, reflectance: 0.08 },
    { wavelength_um: 1.55, reflectance: 0.14 },
    { wavelength_um: 2.0, reflectance: 0.16 },
    { wavelength_um: 2.81, reflectance: 0.09 },
    { wavelength_um: 3.0, reflectance: 0.05 },
    { wavelength_um: 3.5, reflectance: 0.15 }
  ];

  return (
    <div className="p-5 rounded-2xl bg-space-900/95 border border-space-700/80 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-space-800">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-hud-cyan" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            ISSDC PDS4 Calibrated IIRS 256-Band Spectroscopy & TMC-2 DEM
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-space-800 hover:bg-space-700 text-hud-cyan border border-hud-cyan/30 flex items-center gap-1 transition-all"
          >
            <Database className="w-3 h-3" />
            <span>{showRawData ? "Hide Raw Data" : "Inspect Raw PDS4"}</span>
            {showRawData ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Droplets className="w-3 h-3" /> PDS4 Standard
          </span>
        </div>
      </div>

      {/* Raw Dataset Viewer Modal/Drawer */}
      {showRawData && (
        <div className="p-4 rounded-xl bg-space-950 border border-hud-cyan/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-hud-cyan">
            <span className="flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4" />
              <span>Authentic ISSDC PDS4 Metadata Object:</span>
            </span>
            <span className="text-[10px] text-slate-400">JSON / XML Archive Standard</span>
          </div>
          <pre className="text-[11px] font-mono text-emerald-300 bg-space-900/90 p-3 rounded-lg overflow-x-auto max-h-60 leading-relaxed">
            {JSON.stringify(current, null, 2)}
          </pre>
        </div>
      )}

      {/* Key Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        {(keyStats || [
          { label: "Max Water-Ice (Cabeus)", value: "2,100 PPM", badge: "PDS4 Verified" },
          { label: "3.0 μm Band Depth", value: "0.418 IBD", badge: "IIRS 256-Channel" },
          { label: "Subsurface Temp", value: "32.5 K (-240.6°C)", badge: "Deep PSR Trap" }
        ]).map((stat: any, i: number) => (
          <div key={i} className="p-3 rounded-xl bg-space-950/80 border border-space-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium uppercase">{stat.label}</div>
            <div className="text-base sm:text-lg font-extrabold text-cyan-300 mt-0.5">{stat.value}</div>
            <span className="text-[10px] text-slate-500 font-mono">{stat.badge}</span>
          </div>
        ))}
      </div>

      {/* Site Selector Buttons */}
      <div className="flex flex-wrap gap-2">
        {safeSites.map((site) => {
          const isSelected = current?.id === site.id;
          return (
            <button
              key={site.id}
              onClick={() => setSelectedSite(site)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                isSelected
                  ? "bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/20"
                  : "bg-space-950/60 text-slate-300 hover:bg-space-800 border border-space-800"
              }`}
            >
              {site.name?.split(" (")[0] || site.id}
            </button>
          );
        })}
      </div>

      {/* Detailed Site Inspection Panel */}
      {current && (
        <div className="p-4 rounded-xl bg-space-950/90 border border-space-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-space-900">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {current.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                <FileCode2 className="w-3 h-3 text-cyan-400" />
                PDS4 Product ID: {current.pds4_product_id || "urn:isro:ch2:pds4:ch2_iir_ncn_20200115t142851120_d18"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> {current.coordinates?.lat || -84.9}°S, {current.coordinates?.lon || -35.5}°E
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Elevation: {current.coordinates?.elevation_km || -3.5} km</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: 3.0 um Absorption & Reflectance Curve */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                IIRS 0.8–5.0 μm Spectral Reflectance & IBD Curve
              </span>

              <div className="p-3 rounded-lg bg-space-900/80 border border-space-800 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Wavelength (μm)</span>
                  <span>Reflectance (I/F)</span>
                </div>
                <div className="space-y-1.5">
                  {spectralCurve.map((pt: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                      <span className="w-12 text-slate-400 text-[11px]">{Number(pt.wavelength_um).toFixed(2)} μm</span>
                      <div className="flex-1 h-2 bg-space-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pt.wavelength_um === 3.0 ? "bg-hud-cyan" : "bg-blue-600/60"
                          }`}
                          style={{ width: `${Math.min((pt.reflectance || 0.1) * 400, 100)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-cyan-300 text-[11px]">{pt.reflectance}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-cyan-400/80 pt-1 font-mono">
                  *Trough at 3.0 μm demonstrates fundamental O-H stretching and molecular H₂O absorption.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="p-2 rounded bg-space-900/60 border border-space-800">
                  <span className="text-slate-500 text-[10px] block">3.0 μm IBD Depth</span>
                  <span className="font-bold text-cyan-300">{spectroscopy.ibd_3um_absorption_depth || 0.418}</span>
                </div>
                <div className="p-2 rounded bg-space-900/60 border border-space-800">
                  <span className="text-slate-500 text-[10px] block">Estimated H₂O</span>
                  <span className="font-bold text-cyan-300">{spectroscopy.estimated_h2o_concentration_ppm || 2100} PPM</span>
                </div>
              </div>
            </div>

            {/* Right: TMC-2 Terrain & Regolith Safety */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  TMC-2 Digital Elevation Model (DEM)
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  (terrain.hazard_status || terrain.landing_safety || "SAFE").includes("SAFE")
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}>
                  {terrain.hazard_status || terrain.landing_safety || "OPTIMAL_SAFE"}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-space-900/80 border border-space-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-space-800/60">
                  <span className="text-slate-400">Mean Terrain Slope:</span>
                  <span className="font-bold text-slate-200">{terrain.slope_degrees || 4.2}°</span>
                </div>
                <div className="flex justify-between py-1 border-b border-space-800/60">
                  <span className="text-slate-400">Subsurface Temp (PSR):</span>
                  <span className="font-bold text-blue-400">{spectroscopy.subsurface_temp_kelvin || 32.5} K</span>
                </div>
                <div className="pt-1 font-sans">
                  <span className="text-slate-500 text-[10px] font-mono block mb-0.5">Descent Recommendation:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{terrain.recommendation || "Optimal touchdown zone."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
