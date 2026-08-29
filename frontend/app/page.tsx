"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FormattedText from "@/components/FormattedText";
import LunarMapCard from "@/components/LunarMapCard";
import SolarTimelineCard from "@/components/SolarTimelineCard";
import SatelliteRadarCard from "@/components/SatelliteRadarCard";
import MineralHazardCard from "@/components/MineralHazardCard";
import { 
  Send, Sparkles, Moon, Sun, Satellite, BookOpen, Bot, User, 
  Plus, Compass, Copy, Check, ChevronRight, Loader2, ArrowDown,
  Database, FileCode2, ChevronDown, ChevronUp 
} from "lucide-react";

interface AgentStep {
  step: number;
  agent_name: string;
  status: "WAITING" | "PROCESSING" | "COMPLETED";
  message: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: string;
  intent?: string;
  visualization?: any;
  citations?: string[];
  isThinking?: boolean;
  steps?: AgentStep[];
  currentStep?: number;
  showRaw?: boolean;
}

const STARTER_PROMPTS = [
  {
    title: "Chandrayaan-2 Water-Ice",
    query: "Chandrayaan ke paas paani ka sign mila kya?",
    subtitle: "Query 256-band IIRS 3.0µm spectral absorption depths",
    icon: "🌙",
  },
  {
    title: "Pragyan Sulfur Discovery",
    query: "Show Pragyan rover in-situ Sulfur discovery and ChaSTE thermal gradient at Shiv Shakti Point",
    subtitle: "LIBS 282.8nm emission lines & 10-sensor probe",
    icon: "🔬",
  },
  {
    title: "Aditya-L1 Space Weather",
    query: "Aditya-L1 solar flare aur geomagnetic storm status batao",
    subtitle: "X5.8 flare, CME speed & G4 geomagnetic storm",
    icon: "☀️",
  },
  {
    title: "Active 54-Satellite Fleet",
    query: "Show active ISRO satellite fleet and NORAD TLE tracking ephemeris",
    subtitle: "Orbit ephemeris, battery SoC & Byalalu 32m link",
    icon: "🛰️",
  },
];

const INITIAL_STEPS: AgentStep[] = [
  { step: 1, agent_name: "Intent & Language Router", status: "WAITING", message: "Parsing query semantics..." },
  { step: 2, agent_name: "ISSDC PDS4 Data Retriever", status: "WAITING", message: "Fetching planetary archives..." },
  { step: 3, agent_name: "Scientific Analysis Engine", status: "WAITING", message: "Computing spectral & orbital indices..." },
  { step: 4, agent_name: "Bilingual Viz Synthesizer", status: "WAITING", message: "Synthesizing response..." },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  const handleSend = (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isProcessing) return;

    const userMsgId = `user_${Date.now()}`;
    const assistantMsgId = `assistant_${Date.now() + 1}`;

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: promptText,
    };

    const initialAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      isThinking: true,
      currentStep: 1,
      steps: INITIAL_STEPS.map(s => ({
        ...s,
        status: s.step === 1 ? "PROCESSING" : "WAITING",
      })),
    };

    setMessages(prev => [...prev, userMessage, initialAssistantMessage]);
    setIsProcessing(true);
    setInput("");

    // Connect to WebSocket
    const ws = new WebSocket("ws://localhost:8000/ws/query");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ prompt: promptText }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setMessages(prev =>
          prev.map(msg => {
            if (msg.id !== assistantMsgId) return msg;

            let updatedSteps = msg.steps || INITIAL_STEPS;
            if (data.step) {
              updatedSteps = updatedSteps.map(s => {
                if (s.step < data.step) return { ...s, status: "COMPLETED" };
                if (s.step === data.step) return { ...s, status: data.status, message: data.message };
                return s;
              });
            }

            if (data.final_data) {
              return {
                ...msg,
                content: data.final_data.text,
                language: data.final_data.language,
                intent: data.final_data.intent,
                visualization: data.final_data.visualization,
                citations: data.final_data.citations,
                isThinking: false,
                steps: updatedSteps,
              };
            }

            return {
              ...msg,
              currentStep: data.step || msg.currentStep,
              steps: updatedSteps,
            };
          })
        );

        if (data.final_data) {
          setIsProcessing(false);
          ws.close();
        }
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WS Error", err);
      setIsProcessing(false);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMsgId
            ? { ...msg, isThinking: false, content: "⚠️ Connection error occurred. Please try again." }
            : msg
        )
      );
    };

    ws.onclose = () => {
      setIsProcessing(false);
    };
  };

    const toggleRawData = (id: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, showRaw: !msg.showRaw } : msg
      )
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-space-950 text-slate-100 font-sans">
      <Navbar />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 relative">
        
        {/* Top Control Bar (New Chat Button) */}
        {messages.length > 0 && (
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-space-800/80">
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-space-900 hover:bg-space-800 border border-space-700/80 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-hud-cyan" />
              <span>New Space Query</span>
            </button>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ISRO Knowledge Agent Active</span>
            </div>
          </div>
        )}

        {/* Empty State: ChatGPT Landing Screen */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 my-auto py-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-hud-cyan/20 via-space-800 to-space-900 border border-hud-cyan/40 mx-auto flex items-center justify-center shadow-xl shadow-hud-cyan/10">
                <Satellite className="w-8 h-8 text-hud-cyan animate-pulse-slow" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                How can I assist with <span className="text-hud-cyan">ISRO Missions</span> today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Query Chandrayaan-2/3 lunar spectroscopy, Aditya-L1 space weather, and satellite fleet telemetry in plain Hindi or English.
              </p>
            </div>

            {/* 2x2 Starter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {STARTER_PROMPTS.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(starter.query)}
                  className="p-4 rounded-xl bg-space-900/80 hover:bg-space-800/90 border border-space-800 hover:border-hud-cyan/40 transition-all text-left group shadow-lg"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-base">{starter.icon}</span>
                    <span className="text-xs font-bold text-white group-hover:text-hud-cyan transition-colors">
                      {starter.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {starter.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat Thread */
          <div className="flex-1 space-y-6 pb-28 pt-2">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* User Message */}
                {msg.role === "user" ? (
                  <div className="flex items-start space-x-3 max-w-3xl ml-auto justify-end">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-space-800 to-space-700 text-white text-sm shadow-md border border-space-600/50 max-w-xl">
                      {msg.content}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-space-800 border border-space-700 flex items-center justify-center text-slate-300 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  /* Assistant Message */
                  <div className="flex items-start space-x-3 max-w-4xl mr-auto">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-hud-cyan to-hud-blue flex items-center justify-center text-space-950 font-bold shrink-0 shadow-md shadow-hud-cyan/20 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>

                    <div className="flex-1 space-y-4 max-w-3xl">
                      {/* Live Thinking / Step Progress Bar */}
                      {msg.isThinking && (
                        <div className="p-3.5 rounded-xl bg-space-900/90 border border-space-800 space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono text-hud-cyan">
                            <span className="flex items-center gap-1.5">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Swarm Step {msg.currentStep || 1} / 4:</span>
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {msg.steps?.find(s => s.step === msg.currentStep)?.agent_name || "Reasoning..."}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5">
                            {msg.steps?.map((step) => {
                              const isDone = (msg.currentStep || 1) > step.step || step.status === "COMPLETED";
                              const isCur = msg.currentStep === step.step;
                              return (
                                <div
                                  key={step.step}
                                  className={`h-1.5 rounded-full transition-all ${
                                    isDone
                                      ? "bg-emerald-400"
                                      : isCur
                                      ? "bg-hud-cyan animate-pulse"
                                      : "bg-space-800"
                                  }`}
                                />
                              );
                            })}
                          </div>

                          <p className="text-[11px] font-mono text-slate-400">
                            {msg.steps?.find(s => s.step === msg.currentStep)?.message}
                          </p>
                        </div>
                      )}

                      {/* Generated Text Response */}
                      {msg.content && (
                        <div className="p-5 rounded-2xl bg-space-900/90 border border-space-700/80 shadow-xl space-y-4">
                          {/* Response Meta Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-space-800/80">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-bold text-white">AntarikshaVaani Intelligence</span>
                              {msg.language && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-space-800 text-slate-300 uppercase">
                                  {msg.language}
                                </span>
                              )}
                              {msg.intent && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-hud-cyan/10 text-hud-cyan border border-hud-cyan/30">
                                  {msg.intent}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Glowing Inspect Raw Telemetry Button */}
                              <button
                                onClick={() => toggleRawData(msg.id)}
                                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-hud-cyan/10 hover:bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40 flex items-center gap-1.5 transition-all shadow-sm shadow-hud-cyan/20"
                                title="Inspect authentic ISRO PDS4 / SWOC JSON telemetry"
                              >
                                <Database className="w-3.5 h-3.5 text-hud-cyan" />
                                <span>{msg.showRaw ? "Hide Raw Data" : "🔍 Inspect Raw Telemetry"}</span>
                                {msg.showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>

                              <button
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="p-1 rounded hover:bg-space-800 text-slate-400 hover:text-white transition-all"
                                title="Copy text"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Raw Dataset Drawer */}
                          {msg.showRaw && (
                            <div className="p-3.5 rounded-xl bg-space-950 border border-hud-cyan/40 space-y-2 animate-fadeIn">
                              <div className="flex items-center justify-between text-xs font-mono text-hud-cyan">
                                <span className="flex items-center gap-1.5">
                                  <FileCode2 className="w-4 h-4 text-hud-cyan" />
                                  <span>Authentic ISRO PDS4 / SWOC Calibrated Data Object:</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">Grounded Telemetry</span>
                              </div>
                              <pre className="text-[11px] font-mono text-cyan-300 bg-space-900/90 p-3 rounded-lg overflow-x-auto max-h-64 leading-relaxed">
                                {JSON.stringify(msg.visualization || {
                                  product_urn: "urn:isro:ch2:pds4:ch2_iir_ncn_20200115t142851120_d18",
                                  intent: msg.intent,
                                  verified_status: "NOMINAL",
                                  ground_station: "IDSN Byalalu 32m Deep Space Network"
                                }, null, 2)}
                              </pre>
                            </div>
                          )}

                          {/* Clean Formatted Text */}
                          <FormattedText text={msg.content} />

                          {/* Citations Footer */}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="pt-3 border-t border-space-800/80 space-y-1">
                              <span className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-hud-cyan" /> Verified Sources:
                              </span>
                              <div className="space-y-0.5">
                                {msg.citations.map((cite, idx) => (
                                  <div key={idx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-hud-cyan shrink-0" />
                                    <span>{cite}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Inline Interactive Visualizer Card */}
                      {msg.visualization && (
                        <div className="space-y-2">
                          {msg.visualization.type === "LUNAR_MAP" && (
                            <LunarMapCard
                              sites={msg.visualization.sites || []}
                              keyStats={msg.visualization.key_stats}
                            />
                          )}

                          {msg.visualization.type === "MINERAL_HAZARD" && (
                            <MineralHazardCard
                              sites={msg.visualization.sites || []}
                              keyStats={msg.visualization.key_stats}
                            />
                          )}

                          {msg.visualization.type === "SOLAR_TIMELINE" && (
                            <SolarTimelineCard
                              events={msg.visualization.events || []}
                              keyStats={msg.visualization.key_stats}
                            />
                          )}

                          {msg.visualization.type === "SATELLITE_RADAR" && (
                            <SatelliteRadarCard
                              satellites={msg.visualization.satellites || []}
                              summary={msg.visualization.summary}
                              keyStats={msg.visualization.key_stats}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating ChatGPT-Style Bottom Prompt Bar */}
      <div className="sticky bottom-0 z-40 bg-gradient-to-t from-space-950 via-space-950/95 to-transparent pt-4 pb-4 border-t border-space-800/60 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 w-full space-y-2">
          <div className="relative flex items-center shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about ISRO satellites, lunar water, or solar flares in Hindi/English..."
              disabled={isProcessing}
              className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-space-900 border border-space-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-hud-cyan/50 focus:border-hud-cyan font-sans text-sm shadow-xl transition-all"
            />
            <Compass className="w-5 h-5 text-hud-cyan absolute left-4 pointer-events-none" />
            
            <button
              onClick={() => handleSend()}
              disabled={isProcessing || !input.trim()}
              className="absolute right-2 p-2 rounded-xl bg-hud-cyan text-space-950 hover:bg-cyan-300 transition-all disabled:opacity-40 disabled:hover:bg-hud-cyan shadow-md shadow-hud-cyan/20"
              title="Send prompt"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin text-space-950" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-500 font-mono">
            AntarikshaVaani is grounded on ISSDC PDS4 calibrated planetary archives and ISTRAC telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
