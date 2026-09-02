"use client";

import React, { useState } from "react";
import { Satellite, Database, Sparkles, ChevronRight, ChevronLeft, X, Check, ArrowRight } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    step: 1,
    badge: "Welcome to AntarikshaVaani",
    title: "India's Sovereign Space AI Platform",
    description: "Developed by Team Stackverse-labs at Dayananda Sagar University. AntarikshaVaani delivers instant, conversational intelligence across ISRO missions with zero hallucination.",
    icon: Satellite,
    color: "from-cyan-500 to-blue-600",
    points: [
      "Multi-agent autonomous swarm powered by sovereign local LLMs",
      "Pan-India multilingual support across 12 Indic languages & dialects",
      "Air-gapped, privacy-first execution with enterprise security"
    ]
  },
  {
    step: 2,
    badge: "PDS4 Ground Truth",
    title: "Calibrated Telemetry, Not Guesses",
    description: "Unlike generic chatbots, every scientific claim is mathematically cross-referenced against authentic ISRO ISSDC PRADAN and SWOC calibrated archives.",
    icon: Database,
    color: "from-emerald-500 to-cyan-600",
    points: [
      "Chandrayaan-2/3 IIR 3.0µm water-ice absorption spectroscopy",
      "Aditya-L1 space weather alerts: X-class flares, CMEs & geomagnetic storms",
      "Real-time NORAD TLE ephemeris tracking 54 active ISRO satellites"
    ]
  },
  {
    step: 3,
    badge: "Studio Astrophotography",
    title: "8K Hyper-Realistic Space Imagery",
    description: "Generate studio-grade aerospace photography with calibrated physical materials: crinkled Kapton gold foil, titanium heat gradients, and vacuum lighting.",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    points: [
      "Prompt Director driven by local LLaMA 3.2 on Apple Silicon",
      "Zero cartoon or plastic artifacts with strict negative filters",
      "1-Click Full HD download and academic BibTeX citation export"
    ]
  }
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const current = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("antariksha_onboarding_completed", "true");
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("antariksha_onboarding_completed", "true");
    onClose();
  };

  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#0c1322] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close / Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Skip Walkthrough"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 mb-6">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentStep 
                  ? "w-8 bg-cyan-400" 
                  : idx < currentStep 
                  ? "w-4 bg-emerald-400" 
                  : "w-4 bg-slate-800"
              }`}
            />
          ))}
          <span className="text-[10px] font-mono text-slate-500 ml-2">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Step Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${current.color} flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 shrink-0`}>
              <IconComponent className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                {current.badge}
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                {current.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {current.description}
          </p>
        </div>

        {/* Value Points */}
        <div className="my-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
          {current.points.map((pt, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="w-4 h-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="leading-tight">{pt}</span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-lg shadow-cyan-500/25 group"
          >
            <span>{isLast ? "Start Exploring" : "Next Step"}</span>
            {isLast ? (
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
