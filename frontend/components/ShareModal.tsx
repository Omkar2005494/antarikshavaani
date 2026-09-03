"use client";

import React, { useState } from "react";
import { X, Check, Copy, Share2, ExternalLink } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text?: string;
  imageUrl?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  text,
  imageUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://antarikshavaani.stackverse.io";
  const shareText = `🚀 Exploring ${title} on AntarikshaVaani by Stackverse-labs! AI-powered ISRO mission intelligence & calibrated space telemetry.

Check it out:`;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(currentUrl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${currentUrl}#${encodeURIComponent(title)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "LinkedIn",
      icon: "💼",
      color: "bg-[#0077b5]/20 border-[#0077b5]/40 text-[#38bdf8] hover:bg-[#0077b5]/30",
      url: `https://www.linkedin.com/feed/?shareActive=true&text=${encodedShareText}%20${encodedUrl}%20%23ISRO%20%23AntarikshaVaani%20%23StackverseLabs%20%23SpaceTech`,
    },
    {
      name: "Twitter / X",
      icon: "🐦",
      color: "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
      url: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}&hashtags=ISRO,AntarikshaVaani,StackverseLabs,SpaceTech`,
    },
    {
      name: "WhatsApp",
      icon: "💬",
      color: "bg-[#25D366]/20 border-[#25D366]/40 text-[#4ade80] hover:bg-[#25D366]/30",
      url: `https://api.whatsapp.com/send?text=${encodedShareText}%20${encodedUrl}`,
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#0c1322] border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-cyan-950/40 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Share Discovery</h3>
              <p className="text-[10px] font-mono text-slate-400">Stackverse-labs • AntarikshaVaani</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          {imageUrl && (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 mb-2">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <h4 className="text-xs font-semibold text-white truncate">{title}</h4>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {text || "Calibrated ISRO mission telemetry and 8K space astrophotography by AntarikshaVaani."}
          </p>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
            Share Directly to Socials:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {shareLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-medium transition-all ${item.color}`}
              >
                <span className="text-base mb-1">{item.icon}</span>
                <span className="text-[10px] font-mono">{item.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">
            Or Copy Link:
          </span>
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-cyan-500/50">
            <input
              type="text"
              readOnly
              value={`${currentUrl}#${encodeURIComponent(title.slice(0, 30))}`}
              className="flex-1 bg-transparent border-none text-[11px] font-mono text-slate-300 focus:ring-0 px-2 select-all"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold font-mono hover:bg-cyan-400 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
