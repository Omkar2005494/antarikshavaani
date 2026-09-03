"use client";

import React, { useState } from "react";
import { X, Settings, Globe, Compass, Check, Sparkles, Zap, ShieldCheck } from "lucide-react";

interface LanguageOption {
  code: string;
  label: string;
}

interface StarterPrompt {
  icon: string;
  title: string;
  subtitle: string;
  query: string;
  tier: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLang: LanguageOption;
  onSelectLang: (lang: LanguageOption) => void;
  languages: LanguageOption[];
  starterPrompts: StarterPrompt[];
  onSelectPrompt: (query: string) => void;
  tokensRemaining: number;
  tokensTotal: number;
  currentUser: any;
}

export default function SettingsModal({
  isOpen,
  onClose,
  selectedLang,
  onSelectLang,
  languages,
  starterPrompts,
  onSelectPrompt,
  tokensRemaining,
  tokensTotal,
  currentUser,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"language" | "queries" | "account">("language");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#070e1d] border border-white/10 rounded-3xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden text-slate-100 max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white tracking-tight">Mission Settings & Preferences</h3>
              <p className="text-[11px] font-mono text-slate-400">Configure response languages and curated space data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/[0.06] bg-white/[0.01]">
          <button
            onClick={() => setActiveTab("language")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "language"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Response Language</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {selectedLang.label}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("queries")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "queries"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Queries</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
              {starterPrompts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "account"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Telemetry & Quota</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {/* TAB 1: RESPONSE LANGUAGE */}
          {activeTab === "language" && (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-white">Target AI Response Language</h4>
                <p className="text-xs text-slate-400">
                  AntarikshaVaani will translate and ground its deep-space telemetry into your preferred Indic language or phonetic script.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLang(lang);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      selectedLang.code === lang.code
                        ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-950/30"
                        : "bg-white/[0.03] border-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.06] hover:border-white/10"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-mono font-bold">{lang.label}</p>
                      <p className="text-[10px] text-slate-400 font-mono capitalize">
                        {lang.code === "auto" ? "Contextual auto-detection" : `${lang.code} pipeline`}
                      </p>
                    </div>
                    {selectedLang.code === lang.code && (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CURATED SPACE QUERIES */}
          {activeTab === "queries" && (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-white">Curated Space Science Queries</h4>
                <p className="text-xs text-slate-400">
                  Select any pre-calibrated mission query to instantly analyze grounded PDS4 telemetry.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {starterPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectPrompt(prompt.query);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{prompt.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {prompt.title}
                          </h5>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                            {prompt.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {prompt.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      Launch ↗
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TELEMETRY & QUOTA */}
          {activeTab === "account" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Space Data Quota & Ground Truth</h4>
                <p className="text-xs text-slate-400">
                  Real-time researcher authentication and ground station telemetry pipeline status.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-slate-400">Researcher Tier:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {currentUser ? "Authenticated Lead Researcher" : "Guest Access (50 Tokens)"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-slate-400">Tokens Remaining:</span>
                  <span className="text-cyan-300 font-bold">{tokensRemaining} / {tokensTotal}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-slate-400">Ground Station Link:</span>
                  <span className="text-slate-200">IDSN Byalalu 32m Deep Space Radar</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PDS4 Calibration Engine:</span>
                  <span className="text-emerald-400">v2.4 Active & Calibrated</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <span className="text-[10px] font-mono text-slate-500">
            AntarikshaVaani v2.0 • Stackverse-labs
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
