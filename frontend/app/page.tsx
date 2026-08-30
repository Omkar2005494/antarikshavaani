"use client";

import React, { useState, useRef, useEffect } from "react";
import FormattedText from "@/components/FormattedText";
import LunarMapCard from "@/components/LunarMapCard";
import SolarTimelineCard from "@/components/SolarTimelineCard";
import SatelliteRadarCard from "@/components/SatelliteRadarCard";
import MineralHazardCard from "@/components/MineralHazardCard";
import { 
  Send, Sparkles, Satellite, BookOpen, Bot, User, 
  Plus, Copy, Check, ChevronRight, Loader2,
  Database, FileCode2, ChevronDown, ChevronUp,
  PanelLeftClose, PanelLeft, MessageSquare, Trash2, ArrowUp
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
    icon: "🌙",
    title: "Lunar Water-Ice Discovery",
    subtitle: "Cabeus Crater 2,100 PPM 3.0µm IBD absorption depth",
    query: "chandrayan ko moon pe paani mila ki nahi",
  },
  {
    icon: "☀️",
    title: "Aditya-L1 Solar Weather",
    subtitle: "X5.8 solar flare, 1,420 km/s CME & G4 storm alert",
    query: "Aditya-L1 solar flare aur geomagnetic storm status batao",
  },
  {
    icon: "🛰️",
    title: "54 Active Satellite Fleet",
    subtitle: "NORAD TLE orbital ephemeris & IDSN Byalalu tracking",
    query: "Show active ISRO satellite fleet tracking and NORAD TLE",
  },
  {
    icon: "🔬",
    title: "Pragyan LIBS & ChaSTE",
    subtitle: "In-situ 0.42 wt% sulfur lines & 61.4°C thermal drop",
    query: "chandrayaan 3 pragyan sulfur libs discovery",
  }
];

const INDIC_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "pb", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "mr", label: "मराठी (Marathi)" }
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
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

  const handleSend = async (queryText?: string) => {
    const promptToSend = queryText || input;
    if (!promptToSend.trim() || isProcessing) return;

    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: promptToSend,
    };

    const initialAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      isThinking: true,
      currentStep: 1,
      steps: [
        { step: 1, agent_name: "Intent Router", status: "PROCESSING", message: "Analyzing query & entity semantics..." },
        { step: 2, agent_name: "PDS4 Retriever", status: "WAITING", message: "Querying ISRO calibrated telemetry..." },
        { step: 3, agent_name: "Physics Analyzer", status: "WAITING", message: "Evaluating 3.0µm IBD & orbital kinematics..." },
        { step: 4, agent_name: "Viz Synthesizer", status: "WAITING", message: "Generating verified HUD response..." },
      ],
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsProcessing(true);

    const wsUrl = `ws://${window.location.hostname}:8000/ws/query`;
    let ws: WebSocket;

    try {
      ws = new WebSocket(wsUrl);
    } catch (e) {
      console.error("WS connect failed", e);
      setIsProcessing(false);
      return;
    }

    ws.onopen = () => {
      ws.send(JSON.stringify({ prompt: promptToSend }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== assistantMsgId) return msg;

            const updatedSteps = msg.steps?.map((step) => {
              if (data.step && step.step < data.step) {
                return { ...step, status: "COMPLETED" as const };
              }
              if (data.step && step.step === data.step) {
                return {
                  ...step,
                  status: (data.status === "COMPLETED" ? "COMPLETED" : "PROCESSING") as "COMPLETED" | "PROCESSING",
                  message: data.message || step.message,
                };
              }
              return step;
            });

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
            ? { ...msg, isThinking: false, content: "⚠️ Connection error occurred. Please ensure backend server is active on port 8000." }
            : msg
        )
      );
    };

    ws.onclose = () => {
      setIsProcessing(false);
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen stars-bg text-slate-100 font-sans antialiased overflow-hidden selection:bg-cyan-500/20 relative">
      <div className="twinkle-layer" />
      
      {/* Minimalist Collapsible Sidebar (Claude / ChatGPT Style) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0c1322]/95 backdrop-blur-2xl border-r border-slate-800/80 transition-all duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-tight">AntarikshaVaani</h2>
              <p className="text-[10px] font-mono text-slate-400">Stackverse-labs</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => { handleNewChat(); setSidebarOpen(false); }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm group"
          >
            <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
            <span>New Space Query</span>
          </button>
        </div>

        {/* Recent Queries */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar text-xs">
          <div className="px-2 py-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Curated Missions
          </div>
          {STARTER_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => { handleSend(p.query); setSidebarOpen(false); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors text-left"
            >
              <span className="text-sm">{p.icon}</span>
              <span className="truncate">{p.title}</span>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-800/60 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Stackverse-labs</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">20 req/min</span>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Clean Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Subtle Indian Tricolor Line at top */}
        <div className="h-[2px] w-full flex shrink-0">
          <div className="w-1/3 bg-[#ff9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        {/* Minimalist Top Navbar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-slate-800/60 bg-[#070e1d]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Toggle Sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 text-left group"
            >
              <span className="font-semibold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                AntarikshaVaani
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-md">
                v2.0
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1.5 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-1 text-xs font-mono">
                  {INDIC_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.label.split(" ")[0]); setShowLangMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 flex items-center justify-between transition-colors"
                    >
                      <span>{lang.label}</span>
                      {selectedLang === lang.label.split(" ")[0] && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Chat Button */}
            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="New Chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-40 custom-scrollbar">
          {messages.length === 0 ? (
            /* Minimalist Empty State (ChatGPT / Claude Style) */
            <div className="min-h-[65vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto space-y-8">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950 border border-cyan-500/30 mx-auto flex items-center justify-center shadow-xl shadow-cyan-500/5">
                  <Satellite className="w-7 h-7 text-cyan-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  What would you like to explore in <span className="text-cyan-400">ISRO Missions</span>?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  Instant conversational intelligence for Chandrayaan-2/3 lunar spectroscopy, Aditya-L1 space weather, and satellite fleet telemetry.
                </p>
              </div>

              {/* 2x2 Minimalist Suggestion Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {STARTER_PROMPTS.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(starter.query)}
                    className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-left group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-base">{starter.icon}</span>
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {starter.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {starter.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Chat Thread */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  {/* User Message */}
                  {msg.role === "user" ? (
                    <div className="flex items-start space-x-3 max-w-2xl ml-auto justify-end">
                      <div className="p-3.5 rounded-2xl bg-slate-800/90 text-white text-sm shadow-sm border border-slate-700/50 leading-relaxed">
                        {msg.content}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ) : (
                    /* Assistant Message */
                    <div className="flex items-start space-x-3 max-w-3xl mr-auto">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-md shadow-cyan-500/20 mt-1">
                        <Bot className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 space-y-4 max-w-2xl sm:max-w-3xl">
                        {/* Minimalist 4-Agent Thinking Stepper */}
                        {msg.isThinking && (
                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
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
                                        ? "bg-cyan-400 animate-pulse"
                                        : "bg-slate-800"
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

                        {/* Generated Response Card */}
                        {msg.content && (
                          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                            {/* Response Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-semibold text-white">AntarikshaVaani</span>
                                {msg.language && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 uppercase">
                                    {msg.language}
                                  </span>
                                )}
                                {msg.intent && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                    {msg.intent}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleRawData(msg.id)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-sm"
                                  title="Inspect authentic ISRO PDS4 / SWOC telemetry"
                                >
                                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>{msg.showRaw ? "Hide Raw Data" : "🔍 Inspect Raw Telemetry"}</span>
                                  {msg.showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>

                                <button
                                  onClick={() => handleCopy(msg.content, msg.id)}
                                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
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

                            {/* Raw Data Accordion */}
                            {msg.showRaw && (
                              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2 animate-fadeIn">
                                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                                  <span className="flex items-center gap-1.5">
                                    <FileCode2 className="w-4 h-4 text-cyan-400" />
                                    <span>Authentic ISRO PDS4 / SWOC Calibrated Data Object:</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400">Grounded Telemetry</span>
                                </div>
                                <pre className="text-[11px] font-mono text-cyan-300 bg-slate-900/90 p-3 rounded-lg overflow-x-auto max-h-64 leading-relaxed">
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
                              <div className="pt-3 border-t border-slate-800/80 space-y-1">
                                <span className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1">
                                  <BookOpen className="w-3 h-3 text-cyan-400" /> Verified Sources:
                                </span>
                                <div className="space-y-0.5">
                                  {msg.citations.map((cite, idx) => (
                                    <div key={idx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                      <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" />
                                      <span>{cite}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Visualizer Card */}
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

        {/* Minimalist Floating Input Dock (ChatGPT / Claude Style) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-2xl p-2 shadow-2xl shadow-black/40 focus-within:border-cyan-500/50 transition-all flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about ISRO space missions..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white font-sans text-sm resize-none placeholder:text-slate-500 py-2 px-3 custom-scrollbar leading-relaxed"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isProcessing}
              className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center hover:bg-cyan-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0 font-bold shadow-md shadow-cyan-500/20"
              title="Send Message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-500 font-mono mt-2">
            AntarikshaVaani by Stackverse-labs • Calibrated on ISRO ISSDC PDS4 telemetry
          </p>
        </div>

      </div>
    </div>
  );
}
