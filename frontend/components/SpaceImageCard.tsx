"use client";

import React, { useState } from "react";
import { Download, Maximize2, Sparkles, ExternalLink, RefreshCw, X, ShieldCheck } from "lucide-react";

interface SpaceImageData {
  type: "IMAGE_GENERATOR";
  title: string;
  image_url: string;
  prompt: string;
  enhanced_prompt?: string;
  model?: string;
  resolution?: string;
  seed?: number;
  key_stats?: { label: string; value: string; badge: string }[];
}

export default function SpaceImageCard({ data }: { data: SpaceImageData }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = data.image_url;
    link.download = `${data.title.toLowerCase().replace(/\s+/g, "_")}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#0c1322]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/5 my-3 animate-fadeIn">
      
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">{data.title}</h4>
            <p className="text-[10px] font-mono text-cyan-400">FLUX.1 Space Neural Renderer • {data.resolution || "1280x720"}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-mono transition-colors border border-slate-700/80 shadow-sm"
            title="Download Full HD Render"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={() => setShowFullscreen(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700/80 shadow-sm"
            title="Fullscreen Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image Viewport */}
      <div className="relative aspect-video w-full bg-slate-950/80 overflow-hidden group">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            <span className="text-xs font-mono">Synthesizing 8K Space Photons...</span>
          </div>
        )}
        
        <img
          src={data.image_url}
          alt={data.title}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 cursor-pointer ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          onClick={() => setShowFullscreen(true)}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end pointer-events-none">
          <p className="text-xs text-slate-200 font-sans line-clamp-2 italic">
            "{data.enhanced_prompt || data.prompt}"
          </p>
        </div>
      </div>

      {/* Key Stats Bar */}
      {data.key_stats && (
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 border-t border-slate-800/80 text-center font-mono text-[11px]">
          {data.key_stats.map((st, i) => (
            <div key={i} className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] text-slate-400 block">{st.label}</span>
              <span className="font-bold text-cyan-300 block">{st.value}</span>
              <span className="text-[8px] text-slate-500">{st.badge}</span>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute -top-10 right-0 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={data.image_url}
              alt={data.title}
              className="max-h-[80vh] w-auto rounded-2xl border border-cyan-500/40 shadow-2xl object-contain"
            />
            <div className="mt-3 flex items-center justify-between w-full text-xs font-mono text-slate-300">
              <span>{data.title}</span>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:opacity-90 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save High-Res 8K</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
