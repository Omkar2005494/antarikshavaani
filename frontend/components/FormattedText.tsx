"use client";

import React from "react";

export default function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");

  const parseInline = (lineText: string) => {
    // Replace **bold** with <strong>
    const parts = lineText.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-space-800 text-hud-cyan font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-2.5 text-sm text-slate-300 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header style for opening line
        if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("•")) {
          return (
            <div key={idx} className="text-base font-bold text-white tracking-tight pb-1 border-b border-space-800/80">
              {parseInline(trimmed)}
            </div>
          );
        }

        // Bullet point style
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const content = trimmed.replace(/^[•-]\s*/, "");
          return (
            <div key={idx} className="flex items-start space-x-2.5 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan mt-2 shrink-0 shadow-sm shadow-hud-cyan/50" />
              <div className="flex-1 text-slate-300">{parseInline(content)}</div>
            </div>
          );
        }

        // Numbered list
        if (/^\d+\./.test(trimmed)) {
          return (
            <div key={idx} className="flex items-start space-x-2.5 pl-1">
              <span className="text-xs font-mono font-bold text-hud-saffron shrink-0 mt-0.5">
                {trimmed.match(/^\d+\./)?.[0]}
              </span>
              <div className="flex-1 text-slate-300">
                {parseInline(trimmed.replace(/^\d+\.\s*/, ""))}
              </div>
            </div>
          );
        }

        return <p key={idx}>{parseInline(trimmed)}</p>;
      })}
    </div>
  );
}
