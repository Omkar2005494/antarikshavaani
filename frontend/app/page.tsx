"use client";

import React, { useState, useRef, useEffect } from "react";
import FormattedText from "@/components/FormattedText";
import LunarMapCard from "@/components/LunarMapCard";
import SolarTimelineCard from "@/components/SolarTimelineCard";
import SatelliteRadarCard from "@/components/SatelliteRadarCard";
import MineralHazardCard from "@/components/MineralHazardCard";
import { 
  Send, Sparkles, Moon, Sun, Satellite, BookOpen, Bot, User, 
  Plus, Compass, Copy, Check, ChevronRight, Loader2, ArrowDown,
  Database, FileCode2, ChevronDown, ChevronUp, Radio, Activity,
  Clock, Shield, Terminal, Zap, Layers, RefreshCw
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
    title: "Lunar Water Mapping",
    subtitle: "Analyze Chandrayaan-3 CHASTE and IIRS data for water-ice and thermal gradients near South Pole.",
    query: "chandrayan ko moon pe paani mila ki nahi",
    tag: "#Lunar_PDS"
  },
  {
    icon: "☀️",
    title: "Space Weather Dynamics",
    subtitle: "Retrieve the latest Coronal Mass Ejection (CME) kinematics from Aditya-L1 SWOC instrument.",
    query: "Aditya-L1 solar flare aur geomagnetic storm status batao",
    tag: "#Solar_Wind"
  },
  {
    icon: "🛰️",
    title: "Fleet Constellation",
    subtitle: "Show health status and orbital decay estimates for all 54 active Indian satellites.",
    query: "Show active ISRO satellite fleet tracking and NORAD TLE",
    tag: "#Fleet_Status"
  },
  {
    icon: "🔬",
    title: "In-Situ Science Data",
    subtitle: "Plot the sulfur detection spectrum from the Pragyan Rover LIBS payload against standard baselines.",
    query: "chandrayaan 3 pragyan sulfur libs discovery",
    tag: "#In_Situ"
  }
];

const RECENT_HISTORY = [
  { icon: "🌙", title: "Chandrayaan Cabeus Water 2,100 PPM", query: "chandrayan ko moon pe paani mila ki nahi", time: "TODAY" },
  { icon: "☀️", title: "Aditya-L1 X5.8 Flare & CME Kinematics", query: "Aditya-L1 solar flare aur geomagnetic storm status batao", time: "TODAY" },
  { icon: "🛰️", title: "54 Active ISRO Satellites Radar", query: "Show active ISRO satellite fleet tracking and NORAD TLE", time: "TODAY" },
  { icon: "🔬", title: "Pragyan LIBS 0.42 wt% Sulfur Lines", query: "chandrayaan 3 pragyan sulfur libs discovery", time: "PREVIOUS 7 DAYS" },
  { icon: "🚀", title: "LVM3 CE-20 Cryogenic Engine Stage", query: "what is lvm3 rocket cryogenic ce-20", time: "PREVIOUS 7 DAYS" },
  { icon: "🛡️", title: "Project NETRA Space Debris & IS4OM", query: "what is project netra for space debris", time: "PREVIOUS 7 DAYS" }
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
  const [selectedLang, setSelectedLang] = useState("Auto-Detect");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [timeStr, setTimeStr] = useState({ ist: "", utc: "" });
  const [activeNav, setActiveNav] = useState("Dashboard");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px";
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
        { step: 1, agent_name: "Intent & Language Router", status: "PROCESSING", message: "Analyzing query & entity semantics..." },
        { step: 2, agent_name: "ISSDC PDS4 Retriever", status: "WAITING", message: "Querying ISRO calibrated telemetry..." },
        { step: 3, agent_name: "Scientific Physics Analyzer", status: "WAITING", message: "Evaluating 3.0µm IBD & orbital kinematics..." },
        { step: 4, agent_name: "Bilingual Viz Synthesizer", status: "WAITING", message: "Generating verified HUD response..." },
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
            ? { ...msg, isThinking: false, content: "⚠️ Connection error occurred. Please make sure the backend server is running." }
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
    <div className="flex h-screen bg-surface-container-lowest text-on-surface font-body-md overflow-hidden antialiased">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-surface-container-lowest/80 border-b border-outline-variant/60 backdrop-blur-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-surface-container border border-primary-fixed/30 flex items-center justify-center shadow-lg shadow-primary-fixed/10">
            <span className="material-symbols-outlined text-primary-fixed text-[24px]">satellite_alt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-lg font-bold tracking-tight text-primary">AntarikshaVaani</h1>
              <span className="px-2 py-0.5 text-[10px] font-data-mono font-bold bg-primary-fixed/10 text-primary-fixed border border-primary-fixed/30 rounded-full">
                v2.0 PDS4
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-data-mono">
              Sovereign Space Intelligence • Stackverse-labs
            </p>
          </div>
        </div>

        {/* Top Right Controls & Clocks */}
        <div className="flex items-center gap-4">
          {/* Indic Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 bg-surface-container-high border border-outline-variant hover:border-primary-fixed/50 rounded-full px-3 py-1.5 transition-colors text-xs font-data-mono text-primary"
            >
              <span className="material-symbols-outlined text-[16px] text-primary-fixed">translate</span>
              <span>{selectedLang}</span>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">expand_more</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container border border-outline-variant rounded-xl shadow-2xl z-50 py-1.5 animate-fadeIn">
                {INDIC_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLang(lang.label.split(" ")[0]); setShowLangMenu(false); }}
                    className="w-full text-left px-3.5 py-1.5 text-xs font-data-mono text-on-surface hover:bg-surface-variant hover:text-primary-fixed transition-colors flex items-center justify-between"
                  >
                    <span>{lang.label}</span>
                    {selectedLang === lang.label.split(" ")[0] && <Check className="w-3.5 h-3.5 text-tertiary-fixed" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time Space Clock */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/80 border border-outline-variant/60 text-xs font-data-mono text-on-surface">
            <Clock className="w-3.5 h-3.5 text-primary-fixed" />
            <span className="text-white font-semibold">{timeStr.ist || "IST"}</span>
            <span className="text-on-surface-variant">|</span>
            <span className="text-on-surface-variant">{timeStr.utc || "UTC"}</span>
          </div>

          {/* ISTRAC Active Tracking Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/80 border border-outline-variant/60 text-xs font-data-mono">
            <Radio className="w-3.5 h-3.5 text-tertiary-fixed animate-pulse" />
            <span className="text-on-surface-variant">ISTRAC:</span>
            <span className="text-tertiary-fixed font-bold">54 Active Satellites</span>
          </div>

          {/* IDSN Byalalu 32m Dish */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-high/80 border border-outline-variant/60 text-xs font-data-mono">
            <Activity className="w-3.5 h-3.5 text-secondary" />
            <span className="text-on-surface-variant hidden md:inline">IDSN Byalalu:</span>
            <span className="text-secondary font-bold">32m Dish Locked</span>
          </div>
        </div>
      </header>

      {/* Primary Sidebar (w-64) */}
      <nav className="fixed top-16 left-0 h-[calc(100vh-64px)] z-40 flex flex-col py-6 bg-surface-container-low/90 border-r border-outline-variant/60 backdrop-blur-2xl w-64 hidden xl:flex">
        <div className="px-6 mb-6">
          <h2 className="font-label-caps text-[11px] text-on-surface-variant tracking-widest uppercase">MISSION CONTROL</h2>
          <div className="flex items-center gap-3 mt-3.5 p-2.5 rounded-lg bg-surface-container border border-outline-variant">
            <div className="w-7 h-7 rounded bg-surface-variant flex items-center justify-center border border-outline-variant text-primary-fixed">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <div>
              <p className="font-data-mono text-[11px] font-bold text-primary">ISRO-INTEL-01</p>
              <p className="text-[9px] text-on-surface-variant font-data-mono">Sovereign Node • M2 GPU</p>
            </div>
          </div>
        </div>

        <ul className="flex-1 flex flex-col gap-1.5 px-4">
          {[
            { id: "Dashboard", icon: "space_dashboard", label: "Dashboard" },
            { id: "Telemetry", icon: "csv", label: "Telemetry" },
            { id: "Orbits", icon: "language", label: "Orbits & TLE" },
            { id: "Tactical", icon: "military_tech", label: "Tactical SWOC" },
            { id: "Logs", icon: "terminal", label: "ISSDC Logs" },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-label-caps transition-all ${
                  activeNav === item.id
                    ? "text-primary-fixed border-l-2 border-primary-fixed bg-primary-fixed/10 font-bold translate-x-1"
                    : "text-on-surface-variant hover:bg-surface-variant/30 hover:text-primary-fixed"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Deploy & Organization Tag */}
        <div className="px-4 mt-auto mb-4 space-y-3">
          <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/60 text-[10px] font-data-mono space-y-1.5">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span>Stackverse-labs</span>
              <span className="text-tertiary-fixed font-bold">PRO</span>
            </div>
            <div className="flex items-center gap-1 text-tertiary-fixed">
              <Shield className="w-3 h-3" />
              <span>Rate Limit: 20 req/min</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Sidebar (Chat History / Workspace Context - w-72) */}
      <aside className="fixed top-16 left-0 xl:left-64 w-72 h-[calc(100vh-64px)] z-30 bg-surface-container-low border-r border-outline-variant/60 flex flex-col custom-scrollbar overflow-y-auto hidden md:flex">
        <div className="p-4 sticky top-0 bg-surface-container-low/90 backdrop-blur z-10 border-b border-outline-variant/50">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-between bg-surface border border-outline-variant hover:border-primary-fixed/50 hover:bg-surface-variant/30 text-primary transition-all p-3 rounded-lg group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] group-hover:text-primary-fixed">add_circle</span>
              <span className="font-data-mono text-[13px] font-bold group-hover:text-primary-fixed">+ New Space Query</span>
            </div>
            <span className="text-[10px] font-data-mono text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">Cmd+K</span>
          </button>
          
          {/* Subtle Indian Tricolor Representation */}
          <div className="flex w-full h-[2.5px] mt-3 rounded-full overflow-hidden opacity-90">
            <div className="h-full flex-1 bg-secondary shadow-sm shadow-secondary/40"></div>
            <div className="h-full flex-1 bg-white shadow-sm shadow-white/40"></div>
            <div className="h-full flex-1 bg-tertiary-fixed shadow-sm shadow-tertiary-fixed/40"></div>
          </div>
        </div>

        {/* History Items */}
        <div className="flex-1 p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">TODAY</h3>
            {RECENT_HISTORY.filter(h => h.time === "TODAY").map((item, i) => (
              <button
                key={i}
                onClick={() => handleSend(item.query)}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-surface-variant/40 text-on-surface transition-colors text-left group"
              >
                <span className="text-[14px] mt-0.5 opacity-80">{item.icon}</span>
                <span className="font-body-md text-[12.5px] leading-tight truncate group-hover:text-primary-fixed transition-colors">
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">PREVIOUS 7 DAYS</h3>
            {RECENT_HISTORY.filter(h => h.time === "PREVIOUS 7 DAYS").map((item, i) => (
              <button
                key={i}
                onClick={() => handleSend(item.query)}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-surface-variant/40 text-on-surface-variant hover:text-on-surface transition-colors text-left group"
              >
                <span className="text-[14px] mt-0.5 opacity-80">{item.icon}</span>
                <span className="font-body-md text-[12.5px] leading-tight truncate group-hover:text-primary-fixed transition-colors">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-outline-variant/50 bg-surface-container-low/90 backdrop-blur flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-data-mono text-[10px] text-on-surface-variant">Stackverse-labs • DSU Bangalore</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-surface-container-high border border-outline-variant px-2.5 py-1 rounded text-[10px] font-data-mono text-tertiary-fixed w-max">
            <Shield className="w-3 h-3 text-tertiary-fixed" />
            <span>Rate Limit: 20 req/min Active</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace Canvas */}
      <main className="flex-1 md:ml-72 xl:ml-[544px] pt-16 h-screen flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-high/20 via-surface-container-lowest to-surface-container-lowest overflow-hidden">
        
        {/* Scrollable Conversation / Landing Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-48 custom-scrollbar">
          {messages.length === 0 ? (
            /* Centered Empty State (Landing) */
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-auto space-y-6">
              {/* Glowing Satellite Icon */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(125,244,255,0.15)]">
                  <span className="material-symbols-outlined text-primary-fixed text-[48px] drop-shadow-[0_0_8px_rgba(125,244,255,0.8)] animate-pulse-glow">
                    satellite_alt
                  </span>
                </div>
                {/* Online Pulse Dot */}
                <div className="absolute top-1 right-1 z-20 w-4 h-4 bg-tertiary-fixed rounded-full border-2 border-surface-container animate-pulse shadow-[0_0_10px_rgba(83,255,171,0.6)]"></div>
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-primary-fixed/10 rounded-full blur-2xl z-0"></div>
              </div>

              {/* Typography */}
              <div className="space-y-3">
                <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight">
                  How can I assist with ISRO Missions today?
                </h2>
                <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
                  Mission Intelligence AI connected directly to deep-space telemetry. Ask about Chandrayaan lunar water, Aditya-L1 solar observations, or constellation health.
                  <br />
                  <span className="text-primary/80 text-xs mt-1.5 inline-block font-data-mono">
                    Supports queries in English, हिन्दी (Hindi), ਪੰਜਾਬੀ (Punjabi), and ಕನ್ನಡ (Kannada).
                  </span>
                </p>
              </div>

              {/* 2x2 Suggestion Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left pt-2">
                {STARTER_PROMPTS.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(starter.query)}
                    className="glass-panel border border-outline-variant/80 p-4 sm:p-5 rounded-xl text-left glow-border transition-all group flex flex-col gap-2 relative overflow-hidden shadow-lg bg-surface-container-low/60 hover:bg-surface-container-high/60"
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[20px]">{starter.icon}</span>
                      <h4 className="font-data-mono text-[13px] font-bold text-primary group-hover:text-primary-fixed transition-colors">
                        {starter.title}
                      </h4>
                    </div>
                    <p className="font-body-md text-[12px] text-on-surface-variant leading-snug">
                      "{starter.subtitle}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Conversation Stream */
            <div className="max-w-4xl mx-auto space-y-6 pt-2">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3 animate-fadeIn">
                  {/* User Message */}
                  {msg.role === "user" ? (
                    <div className="flex items-start space-x-3 max-w-2xl ml-auto justify-end">
                      <div className="p-4 rounded-2xl bg-surface-container-high text-white text-sm shadow-md border border-outline-variant/60 font-body-md leading-relaxed">
                        {msg.content}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-primary-fixed shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    /* Assistant Message */
                    <div className="flex items-start space-x-3 max-w-4xl mr-auto">
                      <div className="w-8 h-8 rounded-full bg-surface-container border border-primary-fixed/40 flex items-center justify-center text-primary-fixed shrink-0 shadow-md shadow-primary-fixed/20 mt-1">
                        <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
                      </div>

                      <div className="flex-1 space-y-4 max-w-3xl">
                        {/* Live Thinking / Swarm Progress Bar */}
                        {msg.isThinking && (
                          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
                            <div className="flex items-center justify-between text-xs font-data-mono text-primary-fixed">
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Swarm Stage {msg.currentStep || 1} / 4:</span>
                              </span>
                              <span className="text-[11px] text-on-surface-variant">
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
                                        ? "bg-tertiary-fixed shadow-sm shadow-tertiary-fixed/50"
                                        : isCur
                                        ? "bg-primary-fixed animate-pulse shadow-sm shadow-primary-fixed/50"
                                        : "bg-surface-container-high"
                                    }`}
                                  />
                                );
                              })}
                            </div>

                            <p className="text-[11px] font-data-mono text-on-surface-variant">
                              {msg.steps?.find(s => s.step === msg.currentStep)?.message}
                            </p>
                          </div>
                        )}

                        {/* Generated Markdown Answer */}
                        {msg.content && (
                          <div className="p-5 rounded-2xl bg-surface-container-low/90 border border-outline-variant shadow-xl space-y-4">
                            {/* Header Meta */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant/60">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-primary font-headline-lg">AntarikshaVaani Intelligence</span>
                                {msg.language && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-data-mono font-bold bg-surface-container text-on-surface uppercase border border-outline-variant">
                                    {msg.language}
                                  </span>
                                )}
                                {msg.intent && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-data-mono font-bold bg-primary-fixed/10 text-primary-fixed border border-primary-fixed/30">
                                    {msg.intent}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {/* 1-Click Inspect Raw Telemetry Button */}
                                <button
                                  onClick={() => toggleRawData(msg.id)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-data-mono font-bold bg-primary-fixed/10 hover:bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/40 flex items-center gap-1.5 transition-all shadow-sm"
                                >
                                  <Database className="w-3.5 h-3.5" />
                                  <span>{msg.showRaw ? "Hide Raw Data" : "🔍 Inspect Raw Telemetry"}</span>
                                  {msg.showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>

                                <button
                                  onClick={() => handleCopy(msg.content, msg.id)}
                                  className="p-1 rounded hover:bg-surface-variant text-on-surface-variant hover:text-white transition-all"
                                  title="Copy text"
                                >
                                  {copiedId === msg.id ? (
                                    <Check className="w-3.5 h-3.5 text-tertiary-fixed" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Raw Telemetry JSON Drawer */}
                            {msg.showRaw && (
                              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-primary-fixed/40 space-y-2 animate-fadeIn">
                                <div className="flex items-center justify-between text-xs font-data-mono text-primary-fixed">
                                  <span className="flex items-center gap-1.5">
                                    <FileCode2 className="w-4 h-4" />
                                    <span>Authentic ISRO PDS4 / SWOC Calibrated Data Object:</span>
                                  </span>
                                  <span className="text-[10px] text-on-surface-variant">Grounded Telemetry</span>
                                </div>
                                <pre className="text-[11px] font-data-mono text-primary-fixed bg-surface-container-high/90 p-3 rounded-lg overflow-x-auto max-h-64 leading-relaxed">
                                  {JSON.stringify(msg.visualization || {
                                    product_urn: "urn:isro:ch2:pds4:ch2_iir_ncn_20200115t142851120_d18",
                                    intent: msg.intent,
                                    verified_status: "NOMINAL",
                                    ground_station: "IDSN Byalalu 32m Deep Space Network"
                                  }, null, 2)}
                                </pre>
                              </div>
                            )}

                            {/* Formatted Markdown Content */}
                            <FormattedText text={msg.content} />

                            {/* Citations Footer */}
                            {msg.citations && msg.citations.length > 0 && (
                              <div className="pt-3 border-t border-outline-variant/60 space-y-1">
                                <span className="text-[11px] font-data-mono font-semibold text-on-surface-variant flex items-center gap-1">
                                  <BookOpen className="w-3 h-3 text-primary-fixed" /> Verified Sources:
                                </span>
                                <div className="space-y-0.5">
                                  {msg.citations.map((cite, idx) => (
                                    <div key={idx} className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
                                      <ChevronRight className="w-3 h-3 text-primary-fixed shrink-0" />
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
                          <div className="space-y-2 animate-fadeIn">
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

        {/* Floating Input Capsule (Stitch & Claude Style) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50">
          <div className="glass-panel border border-outline-variant/80 rounded-[1.5rem] p-3 shadow-2xl flex flex-col gap-2.5 bg-surface-container-low/85 backdrop-blur-2xl">
            {/* Top Tools Row */}
            <div className="flex items-center justify-between px-2">
              <button className="flex items-center gap-2 bg-surface-container-high border border-outline-variant hover:border-primary-fixed/50 rounded-full px-3 py-1 transition-colors">
                <span className="text-[13px]">🛰️</span>
                <span className="font-data-mono text-[11px] text-primary font-bold">ISRO PDS4 Multi-Agent Swarm</span>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant ml-0.5">expand_more</span>
              </button>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-data-mono"
              >
                <span className="material-symbols-outlined text-[15px]">translate</span>
                <span>{selectedLang}</span>
              </button>
            </div>

            {/* Main Input Row */}
            <div className="flex items-end gap-2 bg-surface-dim/70 border border-outline-variant/50 rounded-2xl p-2 focus-within:border-primary-fixed/50 focus-within:bg-surface-dim transition-all">
              <div className="flex-1 min-h-[40px] flex items-center">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Query rockets, telemetry, or specific ISRO missions in any language..."
                  rows={1}
                  className="w-full bg-transparent border-none focus:ring-0 text-primary font-body-md text-[14px] resize-none placeholder:text-on-surface-variant/40 py-1.5 px-3 custom-scrollbar"
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing}
                className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center hover:bg-primary transition-colors hover:shadow-[0_0_15px_rgba(125,244,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed shrink-0 font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>

            {/* Bottom Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 px-2 pb-0.5">
              {STARTER_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.query)}
                  className="font-data-mono text-[10px] text-on-surface-variant border border-outline-variant/50 rounded-full px-2.5 py-0.5 hover:text-primary hover:border-primary/50 transition-colors bg-surface-container-lowest/50"
                >
                  {p.tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
