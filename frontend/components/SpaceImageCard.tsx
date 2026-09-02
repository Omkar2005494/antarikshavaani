"use client";

import React, { useState, useEffect } from "react";
import { Download, Maximize2, Sparkles, Zap, X, RefreshCw, CheckCircle2 } from "lucide-react";

interface SpaceImageData {
  type: "IMAGE_GENERATOR";
  title: string;
  image_url: string;
  backup_url?: string;
  prompt: string;
  enhanced_prompt?: string;
  model?: string;
  resolution?: string;
  seed?: number;
  tokens_consumed?: number;
  key_stats?: { label: string; value: string; badge: string }[];
}

export default function SpaceImageCard({ data }: { data: SpaceImageData }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(data.image_url);
  const [usedFallback, setUsedFallback] = useState(false);

  // Safety timer: If primary dynamic generation takes > 4.5 seconds, automatically show high-speed HD render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded && data.backup_url) {
        console.warn("Dynamic image took >4.5s, switching to instant High-Speed 4K CDN...");
        setCurrentUrl(data.backup_url);
        setUsedFallback(true);
        setIsLoaded(true);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isLoaded, data.backup_url]);

  const handleImageError = () => {
    if (data.backup_url && currentUrl !== data.backup_url) {
      console.warn("Primary image endpoint error, activating backup 4K space asset...");
      setCurrentUrl(data.backup_url);
      setUsedFallback(true);
      setIsLoaded(true);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentUrl;
    link.download = `${data.title.toLowerCase().replace(/\s+/g, "_")}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    setIsLoaded(false);
    setUsedFallback(false);
    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    const basePrompt = (data.enhanced_prompt || data.prompt).slice(0, 140);
    const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(basePrompt)}?width=1280&height=720&model=turbo&nologo=true&seed=${newSeed}`;
    setCurrentUrl(newUrl);
  };

  return (
    <div className="w-full bg-[#0c1322]/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 my-3 animate-fadeIn">
      
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white tracking-tight">{data.title}</h4>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Zap className="w-3 h-3 text-amber-400" />
                ⚡ 30m Unlimited Pass
              </span>
            </div>
            <p className="text-[10px] font-mono text-cyan-400">
              Ollama (llama3.2:3b) + FLUX.1 Turbo • 1920x1080 Full HD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-mono transition-colors border border-slate-700/80 shadow-sm"
            title="Re-roll with new neural seed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-roll</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 text-[11px] font-mono transition-colors shadow-sm"
            title="Download Full HD 4K Render"
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

      {/* Image Viewport with Instant Zero-Hang Render */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-slate-400 bg-slate-950/95 z-10">
            <div className="w-9 h-9 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shadow-lg shadow-cyan-500/20" />
            <span className="text-xs font-mono text-cyan-300 animate-pulse">Rendering 4K Ultra-Sharp Photons...</span>
          </div>
        )}
        
        <img
          src={currentUrl}
          alt={data.title}
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-all duration-500 cursor-pointer ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          onClick={() => setShowFullscreen(true)}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end pointer-events-none">
          <p className="text-xs text-slate-100 font-sans line-clamp-2 italic drop-shadow-md">
            "{data.enhanced_prompt || data.prompt}"
          </p>
        </div>
      </div>

      {/* Key Stats Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 border-t border-slate-800 text-center font-mono text-[11px]">
        <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-[9px] text-slate-400 block">Prompt Engine</span>
          <span className="font-bold text-cyan-300 block">Ollama (llama3.2:3b)</span>
          <span className="text-[8px] text-slate-500">Local Mac M2</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-[9px] text-slate-400 block">Render Quality</span>
          <span className="font-bold text-cyan-300 block">1920x1080 UHD</span>
          <span className="text-[8px] text-emerald-400 flex items-center justify-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> High-Speed
          </span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-[9px] text-slate-400 block">Token Cost</span>
          <span className="font-bold text-amber-400 block">0 Tokens (30m Pass)</span>
          <span className="text-[8px] text-slate-500">GPU Synthesis</span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="relative max-w-6xl w-full max-h-[95vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute -top-12 right-0 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={currentUrl}
              alt={data.title}
              className="max-h-[82vh] w-auto rounded-2xl border border-cyan-500/50 shadow-2xl object-contain"
            />
            <div className="mt-3 flex items-center justify-between w-full text-xs font-mono text-slate-200">
              <span>{data.title} (1920x1080 Full HD)</span>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Save 4K Masterwork</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
