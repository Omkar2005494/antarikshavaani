"use client";

import React from "react";
import { ShieldCheck, BookOpen, ExternalLink } from "lucide-react";

interface FormattedTextProps {
  text: string;
}

export default function FormattedText({ text }: FormattedTextProps) {
  if (!text) return null;

  const rawLines = text.split("\n");

  const parseInline = (lineText: string): React.ReactNode[] => {
    const parts = lineText.split(/(\*\*.*?\*\*|`.*?`|\$\$.*?\$\$|\$.*?\$)/g);
    
    return parts.map((part, i) => {
      if (!part) return null;

      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        return (
          <strong key={i} className="text-white font-semibold tracking-tight">
            {inner}
          </strong>
        );
      }

      if (part.startsWith("`") && part.endsWith("`")) {
        const codeContent = part.slice(1, -1);
        const isUrn = codeContent.startsWith("urn:isro");
        return (
          <code
            key={i}
            className={`px-1.5 py-0.5 rounded font-mono text-[11px] border transition-colors ${
              isUrn
                ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-bold"
                : "bg-white/[0.06] text-amber-300 border-white/10"
            }`}
          >
            {codeContent}
          </code>
        );
      }

      if (part.startsWith("$") && part.endsWith("$") && !part.startsWith("$$")) {
        return (
          <span
            key={i}
            className="px-1.5 py-0.5 rounded bg-cyan-950/50 text-cyan-200 font-mono text-xs border border-cyan-500/30 italic"
          >
            {part.slice(1, -1)}
          </span>
        );
      }

      if (part.startsWith("$$") && part.endsWith("$$")) {
        return (
          <span
            key={i}
            className="block my-2 p-3 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs border border-cyan-500/30 text-center shadow-inner font-semibold"
          >
            {part.slice(2, -2)}
          </span>
        );
      }

      return part;
    });
  };

  const blocks: { type: "header" | "callout" | "table" | "list" | "math" | "paragraph"; lines: string[] }[] = [];
  let currentTable: string[] = [];
  let inTable = false;

  rawLines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      currentTable.push(trimmed);
      inTable = true;
      return;
    } else if (inTable) {
      blocks.push({ type: "table", lines: [...currentTable] });
      currentTable = [];
      inTable = false;
    }

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      blocks.push({ type: "header", lines: [trimmed] });
    } else if (trimmed.startsWith("> ")) {
      blocks.push({ type: "callout", lines: [trimmed.replace(/^>\s*/, "")] });
    } else if (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length > 4) {
      blocks.push({ type: "math", lines: [trimmed.slice(2, -2)] });
    } else if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\./.test(trimmed)) {
      blocks.push({ type: "list", lines: [trimmed] });
    } else if (trimmed) {
      blocks.push({ type: "paragraph", lines: [trimmed] });
    }
  });

  if (inTable && currentTable.length > 0) {
    blocks.push({ type: "table", lines: [...currentTable] });
  }

  return (
    <div className="space-y-3.5 text-sm text-slate-200 leading-relaxed font-sans select-text">
      {blocks.map((block, bIdx) => {
        if (block.type === "header") {
          const rawHeader = block.lines[0];
          const level = rawHeader.startsWith("### ") ? 3 : rawHeader.startsWith("## ") ? 2 : 1;
          const headerText = rawHeader.replace(/^#{1,3}\s*/, "");

          return (
            <div
              key={bIdx}
              className={`pt-3 pb-1 border-b border-white/[0.08] flex items-center justify-between gap-2 ${
                level === 1 ? "text-lg font-bold text-white font-display" : level === 2 ? "text-base font-bold text-white font-display" : "text-sm font-semibold text-cyan-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-cyan-400" />
                <h4 className="tracking-tight">{parseInline(headerText)}</h4>
              </div>
              <span className="text-[9px] font-mono text-cyan-400/70 uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                PDS4 Ground Truth
              </span>
            </div>
          );
        }

        if (block.type === "callout") {
          return (
            <div
              key={bIdx}
              className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900/80 border border-cyan-500/30 shadow-lg shadow-cyan-950/30 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Executive Mission Briefing</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                {parseInline(block.lines[0])}
              </p>
            </div>
          );
        }

        if (block.type === "table") {
          const tableRows = block.lines.map((l) =>
            l
              .split("|")
              .map((c) => c.trim())
              .filter((c, idx, arr) => idx > 0 && idx < arr.length)
          );

          if (tableRows.length < 2) return null;

          const headerRow = tableRows[0];
          const dataRows = tableRows.slice(1).filter((r) => !r.every((c) => c.startsWith("-")));

          return (
            <div key={bIdx} className="overflow-x-auto my-3 rounded-2xl border border-white/10 bg-[#02050e] shadow-xl custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-white/[0.05] border-b border-white/10 text-cyan-300">
                    {headerRow.map((cell, cIdx) => (
                      <th key={cIdx} className="px-4 py-2.5 font-bold tracking-wider uppercase text-[10px]">
                        {parseInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {dataRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-cyan-500/[0.05] transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2.5 text-slate-200 whitespace-nowrap">
                          {parseInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "math") {
          return (
            <div
              key={bIdx}
              className="p-3.5 my-2 rounded-2xl bg-[#02050e] border border-cyan-500/30 text-cyan-300 font-mono text-xs sm:text-sm text-center shadow-inner flex flex-col items-center justify-center gap-1"
            >
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                Physics Formulation / Calibration Proof
              </span>
              <div className="font-semibold text-white tracking-wide py-1">
                {block.lines[0]}
              </div>
            </div>
          );
        }

        if (block.type === "list") {
          const line = block.lines[0];
          const isNum = /^\d+\./.test(line);
          const content = isNum ? line.replace(/^\d+\.\s*/, "") : line.replace(/^[•\-*]\s*/, "");
          const numMatch = line.match(/^\d+\./)?.[0];

          return (
            <div key={bIdx} className="flex items-start gap-2.5 pl-1 my-1.5">
              {isNum ? (
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold shrink-0 mt-0.5 border border-cyan-500/25">
                  {numMatch}
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-sm shadow-cyan-400/50" />
              )}
              <div className="flex-1 text-slate-300 leading-relaxed text-xs sm:text-sm">
                {parseInline(content)}
              </div>
            </div>
          );
        }

        return (
          <p key={bIdx} className="text-slate-300 leading-relaxed text-xs sm:text-sm">
            {parseInline(block.lines[0])}
          </p>
        );
      })}
    </div>
  );
}
