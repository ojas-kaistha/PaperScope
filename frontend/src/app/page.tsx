"use client";

import { useState, FormEvent, ChangeEvent, useRef, useEffect, ReactNode } from "react";
import { jsPDF } from "jspdf";

// --- Minimalist SVG Icons ---
function PaperScopeBrandIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z" stroke="#e07a5f" strokeWidth="6" strokeLinejoin="round"/>
      <circle cx="50" cy="50" r="18" stroke="#4f5d53" strokeWidth="6"/>
      <path d="M47 32V68H60C68.2843 68 75 61.2843 75 53C75 44.7157 68.2843 38 60 38H47Z" stroke="#4f5d53" strokeWidth="6" strokeLinejoin="round"/>
      <circle cx="50" cy="50" r="8" fill="#faf9f6" stroke="#4f5d53" strokeWidth="2"/>
    </svg>
  );
}

function SparklesIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}

function FileTextIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      <path d="M10 9H8"/>
      <path d="M16 13H8"/>
      <path d="M16 17H8"/>
    </svg>
  );
}

function UploadCloudIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
      <path d="M12 12v9"/>
      <path d="m16 16-4-4-4 4"/>
    </svg>
  );
}

function ArrowUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m5 12 7-7 7 7"/>
      <path d="M12 19V5"/>
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  );
}

function SidebarIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function CopyIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"/>
      <path d="M12 5v14"/>
    </svg>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  );
}

function MessageSquareIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  );
}

function renderInlineFormatted(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} style={{ fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            color: "#C8503A",
            padding: "0.1rem 0.35rem",
            borderRadius: "4px",
            fontSize: "0.85em",
            fontFamily: "monospace",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
  );
}

function VolumeIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SquareIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function HeadphonesIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function CitationIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
    </svg>
  );
}

function CompareIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function BoxingIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 12a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v5a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-5Z" />
      <path d="M5 13h5" />
      <path d="M14 8V6a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function MathIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19h4l4-14h4" />
      <line x1="16" y1="9" x2="21" y2="9" />
      <line x1="16" y1="15" x2="21" y2="15" />
    </svg>
  );
}

function TargetIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function FormattedMessage({ content }: { content: string }) {
  const rawLines = content.split("\n");

  type Block = { type: "table"; rows: string[][] } | { type: "line"; text: string };
  const blocks: Block[] = [];
  let currentTableRows: string[][] = [];

  for (let idx = 0; idx < rawLines.length; idx++) {
    const line = rawLines[idx].trim();
    if (line.startsWith("|") && line.endsWith("|")) {
      const isDivider = line.replace(/\|/g, "").replace(/[\s-:]/g, "").length === 0;
      if (!isDivider) {
        const cells = line.split("|").slice(1, -1).map((c) => c.trim());
        currentTableRows.push(cells);
      }
    } else {
      if (currentTableRows.length > 0) {
        blocks.push({ type: "table", rows: currentTableRows });
        currentTableRows = [];
      }
      blocks.push({ type: "line", text: line });
    }
  }
  if (currentTableRows.length > 0) {
    blocks.push({ type: "table", rows: currentTableRows });
  }

  return (
    <div style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
      {blocks.map((block, bi) => {
        if (block.type === "table") {
          const [header, ...body] = block.rows;
          return (
            <div key={`table-${bi}`} style={{ overflowX: "auto", margin: "0.85rem 0", borderRadius: "8px", border: "1px solid rgba(124, 147, 129, 0.25)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", textAlign: "left" }}>
                {header && (
                  <thead>
                    <tr style={{ backgroundColor: "rgba(200, 80, 58, 0.12)", borderBottom: "1px solid rgba(124, 147, 129, 0.3)" }}>
                      {header.map((col, ci) => (
                        <th key={ci} style={{ padding: "0.55rem 0.75rem", fontWeight: 700, color: "#C8503A" }}>
                          {renderInlineFormatted(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: ri < body.length - 1 ? "1px solid rgba(124, 147, 129, 0.15)" : "none", backgroundColor: ri % 2 === 1 ? "rgba(0,0,0,0.02)" : "transparent" }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: "0.5rem 0.75rem", verticalAlign: "top" }}>
                          {renderInlineFormatted(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        const trimmed = block.text.trim();
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
          const bulletText = trimmed.replace(/^[-*•]\s+/, "");
          return (
            <div key={bi} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.3rem", paddingLeft: "0.4rem" }}>
              <span style={{ color: "#C8503A", userSelect: "none" }}>•</span>
              <div>{renderInlineFormatted(bulletText)}</div>
            </div>
          );
        }
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={bi} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.3rem", paddingLeft: "0.4rem" }}>
              <span style={{ color: "#C9A84C", fontWeight: 600, minWidth: "16px", userSelect: "none" }}>{numMatch[1]}.</span>
              <div>{renderInlineFormatted(numMatch[2])}</div>
            </div>
          );
        }
        if (!trimmed) {
          return <div key={bi} style={{ height: "0.45rem" }} />;
        }
        return (
          <p key={bi} style={{ marginBottom: "0.4rem" }}>
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// --- Types ---
interface SourceCitation {
  page: number;
  snippet: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[];
  timestamp: string;
  title?: string;
}

const makeChatTitle = (text: string): string => {
  const clean = text.replace(/^[#*>\s]+/, "").trim();
  if (!clean) return "New Chat";
  const words = clean.split(/\s+/);
  if (words.length <= 7) return clean;
  return words.slice(0, 7).join(" ") + "…";
};

const cleanTextForSpeech = (text: string): string => {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, " code omitted ")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove markdown bold / italic
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    // Remove markdown headers
    .replace(/^#+\s+/gm, "")
    // Remove markdown bullet points
    .replace(/^[-*•]\s+/gm, "")
    // Remove numbered list prefixes
    .replace(/^\d+\.\s+/gm, "")
    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove citations like (Page 3) or [p. 3]
    .replace(/\(p\.\s*\d+\)/gi, "")
    .replace(/\[p\.\s*\d+\]/gi, "")
    // Remove common emojis
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, "")
    // Collapse multiple newlines/spaces
    .replace(/\n+/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const getBestVoice = (
  voiceList: SpeechSynthesisVoice[],
  preferredURI?: string
): SpeechSynthesisVoice | undefined => {
  if (!voiceList || voiceList.length === 0) return undefined;

  if (preferredURI) {
    const match = voiceList.find((v) => v.voiceURI === preferredURI);
    if (match) return match;
  }

  // Filter out robotic voices like Microsoft Sam, Desktop SAPI voices
  const filtered = voiceList.filter((v) => {
    const name = v.name.toLowerCase();
    return (
      !name.includes("sam") &&
      !name.includes("desktop") &&
      !name.includes("david") &&
      !name.includes("espeak")
    );
  });
  const pool = filtered.length > 0 ? filtered : voiceList;

  // 1. Prioritize Edge/Windows "Online (Natural)" or "Natural" voices (Jenny, Aria, Guy, Christopher, Sonia)
  const natural = pool.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.toLowerCase().includes("online (natural)") ||
        v.name.toLowerCase().includes("natural"))
  );
  if (natural) return natural;

  // 2. High-grade Google voices
  const google = pool.find(
    (v) =>
      v.lang.startsWith("en") &&
      v.name.includes("Google") &&
      !v.name.toLowerCase().includes("sam")
  );
  if (google) return google;

  // 3. Known pleasant neural voices (Jenny, Aria, Guy, Samantha, Daniel, Serena, Ava, Zira)
  const pleasant = pool.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Jenny") ||
        v.name.includes("Aria") ||
        v.name.includes("Guy") ||
        v.name.includes("Samantha") ||
        v.name.includes("Daniel") ||
        v.name.includes("Serena") ||
        v.name.includes("Ava") ||
        v.name.includes("Zira"))
  );
  if (pleasant) return pleasant;

  // 4. Any English voice that is not Sam
  const anyEnglish = pool.find((v) => v.lang.startsWith("en"));
  if (anyEnglish) return anyEnglish;

  return pool[0];
};

interface CitationMetadata {
  title: string;
  authors: string;
  year: string;
  journal: string;
  pages: string;
  doi: string;
}

function parsePaperMetadata(filename: string, pages: number = 10): CitationMetadata {
  let clean = filename.replace(/\.pdf$/i, "").replace(/[_-]/g, " ").trim();
  clean = clean.replace(/^\d{4}\.\d{4,5}\s*/, "");
  let year = "2026";
  const yearMatch = filename.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) {
    year = yearMatch[1];
  }
  return {
    title: clean || "Scientific Research Paper",
    authors: "Author(s) et al.",
    year: year,
    journal: "PaperScope Indexed Archive",
    pages: `1--${pages || 10}`,
    doi: "10.48550/arXiv." + (filename.match(/\d{4}\.\d{4,5}/)?.[0] || "paperscope"),
  };
}

function formatBibTeX(meta: CitationMetadata): string {
  const citeKey = (meta.title.split(" ")[0] || "paper").toLowerCase().replace(/[^a-z0-9]/g, "") + meta.year;
  return `@article{${citeKey},
  title   = {${meta.title}},
  author  = {${meta.authors}},
  journal = {${meta.journal}},
  year    = {${meta.year}},
  pages   = {${meta.pages}}${meta.doi ? `,\n  doi     = {${meta.doi}}` : ""}
}`;
}

function formatAPA(meta: CitationMetadata): string {
  return `${meta.authors} (${meta.year}). ${meta.title}. ${meta.journal}, pp. ${meta.pages.replace("--", "-")}.${meta.doi ? ` https://doi.org/${meta.doi}` : ""}`;
}

function formatMLA(meta: CitationMetadata): string {
  return `${meta.authors}. "${meta.title}." ${meta.journal}, ${meta.year}, pp. ${meta.pages.replace("--", "-")}.`;
}

function formatIEEE(meta: CitationMetadata): string {
  return `[1] ${meta.authors}, "${meta.title}," ${meta.journal}, pp. ${meta.pages.replace("--", "-")}, ${meta.year}.`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface LoadedDoc {
  id: string;
  filename: string;
  pages: number;
  chunks: number;
  pdfUrl: string;
}

const defaultGreeting: Message[] = [
  {
    id: "initial-greeting",
    role: "assistant",
    content: `👋 **Hi there! Welcome to PaperScope!** I'm your cheerful AI research companion, and I'm super excited to read and explore scientific papers with you today! 🚀\n\nEverything here runs **100% locally on your machine** — completely private with zero cloud calls!\n\n**Here's how we can get started:**\n1. Select or drop any research paper PDF on the left 📄\n2. Click **"Executive Summary"** to get the big ideas in a flash ⚡\n3. Ask me any question — from methods to findings — and I'll break it down with direct, clickable page citations!\n\nWhat exciting research are we diving into today? ✨`,
    timestamp: "",
  },
];

export default function PaperScopeUI() {
  const [messages, setMessages] = useState<Message[]>(defaultGreeting);
  const [inputQuery, setInputQuery] = useState("");
  const [currentDoc, setCurrentDoc] = useState<LoadedDoc | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [uploadingFile, setUploadingFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [savedHistory, setSavedHistory] = useState<Message[][]>([]);
  const [isClient, setIsClient] = useState(false);

  // Theme: Warm Sand vs Midnight Dark Mode
  const [theme, setTheme] = useState<"sand" | "midnight">("sand");
  const styles = getStyles(theme);

  // Research Tone / Depth Mode Selector
  const [depthMode, setDepthMode] = useState<"plain" | "rigorous" | "metrics">("plain");

  // Citation & BibTeX Modal State
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [citationTab, setCitationTab] = useState<"bibtex" | "apa" | "mla" | "ieee">("bibtex");
  const [citationCopied, setCitationCopied] = useState(false);
  const [showMetaEdit, setShowMetaEdit] = useState(false);
  const [citationMeta, setCitationMeta] = useState<CitationMetadata>({
    title: "Scientific Research Paper",
    authors: "Author(s) et al.",
    year: "2026",
    journal: "PaperScope Indexed Archive",
    pages: "1--10",
    doi: "10.48550/arXiv.paperscope",
  });

  // Visual Bounding Box & Grounded Citation Spotlight
  const [viewMode, setViewMode] = useState<"pdf" | "highlight_canvas">("pdf");
  const [activeCitationSnippet, setActiveCitationSnippet] = useState<string | null>(null);
  const [activeCitationBbox, setActiveCitationBbox] = useState<Array<{ left: number; top: number; width: number; height: number }>>([]);
  const [showBboxSpotlight, setShowBboxSpotlight] = useState(false);

  // Specialized Academic Modes & Modals
  const [reviewingAudit, setReviewingAudit] = useState(false);
  const [showMathModal, setShowMathModal] = useState(false);
  const [mathFormulaInput, setMathFormulaInput] = useState("");
  const [dissectingMath, setDissectingMath] = useState(false);

  // Multi-Paper Head-to-Head Comparison
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [indexedDocs, setIndexedDocs] = useState<Array<any>>([]);
  const [compareDocA, setCompareDocA] = useState<string>("");
  const [compareDocB, setCompareDocB] = useState<string>("");
  const [compareFocus, setCompareFocus] = useState<"general" | "benchmarks" | "methodology" | "tradeoffs">("general");
  const [comparingPapers, setComparingPapers] = useState(false);

  const toggleTheme = () => {
    const next = theme === "sand" ? "midnight" : "sand";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("paperScopeTheme", next);
    }
  };

  const handleSetDepthMode = (mode: "rigorous" | "plain" | "metrics") => {
    setDepthMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("paperScopeDepthMode", mode);
    }
  };

  const getActiveCitationText = (): string => {
    switch (citationTab) {
      case "bibtex":
        return formatBibTeX(citationMeta);
      case "apa":
        return formatAPA(citationMeta);
      case "mla":
        return formatMLA(citationMeta);
      case "ieee":
        return formatIEEE(citationMeta);
      default:
        return formatBibTeX(citationMeta);
    }
  };

  const handleCopyCitation = () => {
    const text = getActiveCitationText();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCitationCopied(true);
      setTimeout(() => setCitationCopied(false), 2000);
    }
  };

  const downloadBibTeX = () => {
    const bib = formatBibTeX(citationMeta);
    const blob = new Blob([bib], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(citationMeta.title.split(" ")[0] || "paper").toLowerCase()}_citation.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Local Offline Speech Synthesis State
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");

  // Populate Voices via onvoiceschanged & filter out robotic Sam
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      // Filter and sort: English voices first, natural voices at top, robotic Sam excluded
      const englishVoices = allVoices.filter((v) => v.lang.startsWith("en"));
      const list = englishVoices.length > 0 ? englishVoices : allVoices;

      // Filter out Sam and desktop robotic voices from available choices
      const nonRobotic = list.filter(
        (v) =>
          !v.name.toLowerCase().includes("sam") &&
          !v.name.toLowerCase().includes("desktop")
      );
      const pool = nonRobotic.length > 0 ? nonRobotic : list;

      const sorted = [...pool].sort((a, b) => {
        const aNat = a.name.toLowerCase().includes("natural") ? -1 : 1;
        const bNat = b.name.toLowerCase().includes("natural") ? -1 : 1;
        return aNat - bNat;
      });

      setAvailableVoices(sorted);

      const savedURI = localStorage.getItem("paperScopeVoiceURI");
      if (savedURI && sorted.some((v) => v.voiceURI === savedURI)) {
        setSelectedVoiceURI(savedURI);
      } else {
        const best = getBestVoice(sorted);
        if (best) {
          setSelectedVoiceURI(best.voiceURI);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleVoiceChange = (newURI: string) => {
    setSelectedVoiceURI(newURI);
    if (typeof window !== "undefined") {
      localStorage.setItem("paperScopeVoiceURI", newURI);
    }
    if (speakingId) {
      stopSpeech();
    }
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  const handleToggleSpeech = (text: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Local Speech Synthesis is not supported in this browser.");
      return;
    }

    if (speakingId === id) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    const pool = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const chosenVoice = getBestVoice(pool, selectedVoiceURI);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onend = () => {
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
    };

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCycleSpeed = (currentText: string, id: string) => {
    const nextRate = speechRate === 1 ? 1.25 : speechRate === 1.25 ? 1.5 : 1;
    setSpeechRate(nextRate);
    if (speakingId === id && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleaned = cleanTextForSpeech(currentText);
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = nextRate;
      utterance.pitch = 1.0;
      const pool = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      const chosenVoice = getBestVoice(pool, selectedVoiceURI);
      if (chosenVoice) utterance.voice = chosenVoice;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAudioBriefing = () => {
    if (speakingId) {
      stopSpeech();
      return;
    }
    const latestAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (latestAssistant) {
      handleToggleSpeech(latestAssistant.content, latestAssistant.id);
    } else {
      handleSummarize();
    }
  };

  // Load user preferences safely after client mount (starts with a clean session)
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      try {
        // Clear any old session locks so reload / close starts completely fresh
        localStorage.removeItem('paperScopeCurrentDoc');
        localStorage.removeItem('paperScopeMessages');

        const savedHist = localStorage.getItem('paperScopeHistory');
        if (savedHist) {
          setSavedHistory(JSON.parse(savedHist));
        }
        const savedTheme = localStorage.getItem('paperScopeTheme');
        if (savedTheme === 'midnight' || savedTheme === 'sand') {
          setTheme(savedTheme);
        }
        const savedDepth = localStorage.getItem('paperScopeDepthMode');
        if (savedDepth === 'rigorous' || savedDepth === 'plain' || savedDepth === 'metrics') {
          setDepthMode(savedDepth);
        }
      } catch (e) {
        console.error('Failed to load local storage', e);
      }
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const loadChat = (chat: Message[]) => {
    stopSpeech();
    setMessages(chat);
    setShowHistory(false);
  };

  const handleDeleteChat = (idx: number) => {
    stopSpeech();
    const updated = savedHistory.filter((_, i) => i !== idx);
    setSavedHistory(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('paperScopeHistory', JSON.stringify(updated));
    }
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleClearAllHistory = () => {
    if (confirm("Are you sure you want to clear all chat history?")) {
      stopSpeech();
      setSavedHistory([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("paperScopeHistory");
      }
    }
  };

  const [exportingPdf, setExportingPdf] = useState(false);

  const exportChat = () => {
    if (messages.length <= 1 || exportingPdf) return;
    setExportingPdf(true);

    try {
      const docTitle = currentDoc ? currentDoc.filename : "PaperScope-Research-Session";
      const cleanTitle = (currentDoc?.filename || "research-notes")
        .replace(/\.pdf$/i, "")
        .replace(/[^a-zA-Z0-9_\-\.]/g, "_");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin - 12) {
          pdf.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // Header Banner
      pdf.setFillColor(74, 96, 88); // Deep Sage #4A6058
      pdf.rect(margin, y, contentWidth, 18, "F");

      pdf.setTextColor(250, 249, 246);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("PaperScope · Research Notes", margin + 5, y + 7.5);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text("100% Local Private Research Synthesis", margin + 5, y + 13.5);

      pdf.setTextColor(230, 230, 230);
      pdf.setFontSize(8);
      const dateStr = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      pdf.text(dateStr, pageWidth - margin - 5, y + 10.5, { align: "right" });

      y += 24;

      // Document Metadata Box
      pdf.setFillColor(252, 250, 246); // Warm Sand Tint
      pdf.setDrawColor(229, 227, 220); // Border #e5e3dc
      pdf.rect(margin, y, contentWidth, 14, "FD");

      pdf.setTextColor(79, 93, 83);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("Analyzed Document:", margin + 4, y + 5.5);

      pdf.setFont("helvetica", "normal");
      const truncatedDocTitle = docTitle.length > 68 ? docTitle.slice(0, 65) + "..." : docTitle;
      pdf.text(truncatedDocTitle, margin + 42, y + 5.5);

      if (currentDoc) {
        pdf.setFontSize(8);
        pdf.setTextColor(124, 147, 129);
        pdf.text(`${currentDoc.pages} Pages Indexed • 0 Cloud Calls • Pure Local Inference`, margin + 4, y + 10.5);
      }

      y += 20;

      // Q&A Exchanges
      messages.forEach((m) => {
        if (m.id === "initial-greeting") return;

        const isUser = m.role === "user";
        checkPageBreak(12);

        if (isUser) {
          // User Query Indicator
          pdf.setFillColor(200, 80, 58); // Terracotta #C8503A
          pdf.rect(margin, y, 3, 7, "F");

          pdf.setTextColor(200, 80, 58);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(9.5);
          pdf.text("USER QUERY", margin + 6, y + 5.5);
          y += 8;

          pdf.setTextColor(50, 50, 50);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(9.5);

          const queryLines = pdf.splitTextToSize(m.content, contentWidth - 6);
          queryLines.forEach((line: string) => {
            checkPageBreak(5);
            pdf.text(line, margin + 6, y + 4);
            y += 5;
          });

          y += 4;
        } else {
          // Assistant Synthesis Indicator
          pdf.setFillColor(74, 96, 88); // Deep Sage #4A6058
          pdf.rect(margin, y, 3, 7, "F");

          pdf.setTextColor(74, 96, 88);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(9.5);
          pdf.text("PAPERSCOPE SYNTHESIS", margin + 6, y + 5.5);
          y += 8;

          // Clean Markdown formatting for PDF output
          const cleanContent = m.content
            .replace(/^#{1,4}\s+/gm, "")
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/`([^`]+)`/g, "$1");

          const rawParagraphs = cleanContent.split("\n");

          pdf.setTextColor(60, 60, 60);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);

          rawParagraphs.forEach((para) => {
            const trimmed = para.trim();
            if (!trimmed) {
              y += 2.5;
              return;
            }

            const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");
            const bulletText = isBullet ? trimmed.replace(/^[-*•]\s+/, "") : trimmed;
            const lines = pdf.splitTextToSize(bulletText, isBullet ? contentWidth - 12 : contentWidth - 6);

            lines.forEach((line: string, lineIdx: number) => {
              checkPageBreak(4.5);
              if (isBullet && lineIdx === 0) {
                pdf.setTextColor(200, 80, 58);
                pdf.text("•", margin + 6, y + 3.8);
                pdf.setTextColor(60, 60, 60);
                pdf.text(line, margin + 11, y + 3.8);
              } else if (isBullet) {
                pdf.text(line, margin + 11, y + 3.8);
              } else {
                pdf.text(line, margin + 6, y + 3.8);
              }
              y += 4.5;
            });
          });

          // Citations Box if present
          if (m.sources && m.sources.length > 0) {
            y += 2;
            checkPageBreak(12);

            pdf.setFillColor(247, 246, 242);
            pdf.setDrawColor(229, 227, 220);

            const citationTexts = m.sources.map((s) => `[Page ${s.page}]: "${s.snippet.trim()}"`);
            let citLinesCount = 0;
            const allCitSplitLines: string[][] = citationTexts.map((ct) => {
              const split = pdf.splitTextToSize(ct, contentWidth - 12);
              citLinesCount += split.length;
              return split;
            });

            const boxHeight = 7 + citLinesCount * 4.2;
            checkPageBreak(boxHeight);

            pdf.rect(margin + 4, y, contentWidth - 8, boxHeight, "FD");

            pdf.setTextColor(124, 147, 129);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(7.5);
            pdf.text("GROUNDED CITATIONS & PAGE VERIFICATION", margin + 8, y + 4.5);

            let citY = y + 8.5;
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(90, 90, 90);
            pdf.setFontSize(7.5);

            allCitSplitLines.forEach((splitLines) => {
              splitLines.forEach((cline) => {
                pdf.text(cline, margin + 8, citY);
                citY += 4.2;
              });
            });

            y += boxHeight + 4;
          }

          // Turn separator
          checkPageBreak(6);
          pdf.setDrawColor(229, 227, 220);
          pdf.setLineWidth(0.3);
          pdf.line(margin, y + 2, pageWidth - margin, y + 2);
          y += 8;
        }
      });

      // Page numbers footer on every page
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          "PaperScope — 100% Local Research Assistant · Zero Cloud Calls",
          margin,
          pageHeight - 8
        );
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 8,
          { align: "right" }
        );
      }

      // Download the PDF file directly
      pdf.save(`${cleanTitle}-research-notes.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setExportingPdf(false);
    }
  };

  // Global Keyboard Shortcuts (Ctrl+K for history, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowHistory((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowHistory(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // PDF Viewer State
  const [activePage, setActivePage] = useState<number>(1);
  const [jumpFeedback, setJumpFeedback] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pdfFrameRef = useRef<HTMLIFrameElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, summarizing]);

  // Messages are held in active React state for the current session

  const jumpToPage = (pageNumber: number, snippet?: string) => {
    if (!currentDoc) return;
    const boundedPage = Math.max(1, Math.min(pageNumber, currentDoc.pages || 9999));
    setActivePage(boundedPage);

    setJumpFeedback(`Navigated to Page ${boundedPage}`);
    const timer = setTimeout(() => setJumpFeedback(""), 2800);

    if (snippet) {
      setActiveCitationSnippet(snippet);
      setShowBboxSpotlight(true);
      fetch(`${API_BASE}/api/citation_bbox?doc_id=${currentDoc.id}&page=${boundedPage}&snippet=${encodeURIComponent(snippet)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data.rects && data.rects.length > 0) {
            setActiveCitationBbox(data.rects);
          } else {
            setActiveCitationBbox([]);
          }
        })
        .catch(() => setActiveCitationBbox([]));
    }

    if (pdfFrameRef.current && currentDoc.pdfUrl) {
      const baseUrl = currentDoc.pdfUrl.split("#")[0];
      const searchParam = snippet ? `&search=${encodeURIComponent(snippet.slice(0, 45))}` : "";
      pdfFrameRef.current.src = `${baseUrl}#page=${boundedPage}&view=FitH${searchParam}`;
    }

    return () => clearTimeout(timer);
  };

  const uploadFileObject = (file: File) => {
    stopSpeech();
    setUploading(true);
    setUploadProgress(12);
    setUploadStage("Uploading document bytes...");
    setUploadingFile({
      name: file.name,
      size: formatFileSize(file.size),
    });
    setUploadStatus(`Indexing "${file.name}" locally...`);

    const localBlobUrl = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    let indexInterval: NodeJS.Timeout | null = null;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.min(35, 12 + Math.round((event.loaded / event.total) * 23));
        setUploadProgress(percent);
      }
    };

    xhr.upload.onload = () => {
      setUploadProgress(38);
      setUploadStage("Extracting text layers & page structure...");

      let currentPercent = 38;
      indexInterval = setInterval(() => {
        currentPercent += 2;
        if (currentPercent >= 96) {
          currentPercent = 96;
          if (indexInterval) clearInterval(indexInterval);
        } else if (currentPercent === 54) {
          setUploadStage("Chunking document sections...");
        } else if (currentPercent === 72) {
          setUploadStage("Generating neural vector embeddings...");
        } else if (currentPercent === 88) {
          setUploadStage("Storing into local vector index...");
        }
        setUploadProgress(currentPercent);
      }, 240);
    };

    xhr.onload = () => {
      if (indexInterval) clearInterval(indexInterval);

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setUploadProgress(100);
          setUploadStage("Successfully indexed! Loading workspace...");

          const rawPdfUrl = data.pdf_url || `/api/pdf/${data.doc_id}`;
          const serverPdfUrl = rawPdfUrl.replace(/^https?:\/\/(127\.0\.0\.1|localhost):8000/, "");

          const docObj: LoadedDoc = {
            id: data.doc_id,
            filename: data.filename,
            pages: data.total_pages,
            chunks: data.total_chunks,
            pdfUrl: serverPdfUrl || localBlobUrl,
          };

          setTimeout(() => {
            setCurrentDoc(docObj);
            setCitationMeta(parsePaperMetadata(data.filename, data.total_pages));
            setActivePage(1);
            setUploadStatus("");
            setUploading(false);
            setUploadingFile(null);
            setUploadProgress(0);

            setMessages((prev) => [
              ...prev,
              {
                id: `welcome-paper-${Date.now()}`,
                role: "assistant",
                content: `🎉 **Woohoo! "${data.filename}" is loaded and ready!**\n\nI just indexed all **${data.total_pages} pages** (${data.total_chunks} vector chunks) into local memory in record time ⚡\n\nYou can read along in the viewer on the left, click **"Executive Summary"** above for an instant briefing, or ask me any question below. What would you like to explore first? 🔍`,
                timestamp: "",
              },
            ]);
          }, 350);
        } catch (err: any) {
          console.error(err);
          setUploadStatus("Failed to parse backend response.");
          setUploading(false);
          setUploadingFile(null);
          setUploadProgress(0);
        }
      } else {
        let errorMsg = "Upload failed";
        try {
          const errData = JSON.parse(xhr.responseText);
          errorMsg = errData.detail || errorMsg;
        } catch {}
        setUploadStatus(errorMsg);
        setUploading(false);
        setUploadingFile(null);
        setUploadProgress(0);
      }
    };

    xhr.onerror = () => {
      if (indexInterval) clearInterval(indexInterval);
      setUploadStatus("Failed to connect to local backend. Please ensure the server is running.");
      setUploading(false);
      setUploadingFile(null);
      setUploadProgress(0);
    };

    xhr.ontimeout = () => {
      if (indexInterval) clearInterval(indexInterval);
      setUploadStatus("Upload request timed out. Please try again.");
      setUploading(false);
      setUploadingFile(null);
      setUploadProgress(0);
    };

    xhr.onabort = () => {
      if (indexInterval) clearInterval(indexInterval);
      setUploadStatus("Upload cancelled.");
      setUploading(false);
      setUploadingFile(null);
      setUploadProgress(0);
    };

    xhr.open("POST", `${API_BASE}/api/upload`);
    xhr.send(formData);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFileObject(file);
    }
    e.target.value = "";
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".pdf")) {
      uploadFileObject(file);
    }
  };

  const handleSummarize = async () => {
    if (!currentDoc || summarizing || loading) return;

    setSummarizing(true);
    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: `Generate an executive scientific summary of this research paper (${depthMode === "rigorous" ? "Deep-Dive" : depthMode === "plain" ? "Plain English" : "Key Metrics"}).`,
      timestamp: "",
    };
    const isFirstUserMessage = !messages.some((m) => m.role === "user");
    if (isFirstUserMessage && messages.length > 0) {
      setMessages((prev) => [
        { ...prev[0], title: "Executive Scientific Summary" },
        ...prev.slice(1),
        userMsg,
      ]);
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }

    try {
      const res = await fetch(`${API_BASE}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: currentDoc.id, mode: depthMode }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Summarization failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: data.summary,
          sources: data.sources || [],
          timestamp: "",
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: `Error: ${err.message || "Failed to generate summary with local LLM."}`,
          timestamp: "",
        },
      ]);
    } finally {
      setSummarizing(false);
    }
  };

  const handleNewChat = () => {
    stopSpeech();
    try {
      const hasUserMessages = messages.some((m) => m.role === "user");
      if (hasUserMessages) {
        const updatedHistory = [...savedHistory, messages];
        setSavedHistory(updatedHistory);
        if (typeof window !== 'undefined') {
          localStorage.setItem('paperScopeHistory', JSON.stringify(updatedHistory));
        }
      }
    } catch (e) {
      console.error('Failed to save chat history', e);
    }

    // Completely unload the previous document & reset chat
    setCurrentDoc(null);
    setMessages(defaultGreeting);
    setInputQuery("");
    setActivePage(1);
    setActiveCitationBbox([]);
    setActiveCitationSnippet(null);
    setShowBboxSpotlight(false);
    setUploadStatus("");
    setUploading(false);
    setUploadingFile(null);
    setUploadProgress(0);

    if (typeof window !== "undefined") {
      localStorage.removeItem("paperScopeCurrentDoc");
      localStorage.removeItem("paperScopeMessages");
    }

    fetch(`${API_BASE}/api/reset`, { method: "POST" }).catch(() => {});
  };

  const handleCloseDoc = () => {
    stopSpeech();
    try {
      const hasUserMessages = messages.some((m) => m.role === "user");
      if (hasUserMessages) {
        const updatedHistory = [...savedHistory, messages];
        setSavedHistory(updatedHistory);
        if (typeof window !== 'undefined') {
          localStorage.setItem('paperScopeHistory', JSON.stringify(updatedHistory));
        }
      }
    } catch (e) {}

    setCurrentDoc(null);
    setMessages(defaultGreeting);
    setInputQuery("");
    setActivePage(1);
    setActiveCitationBbox([]);
    setActiveCitationSnippet(null);
    setShowBboxSpotlight(false);
    setUploadStatus("");
    setUploading(false);
    setUploadingFile(null);
    setUploadProgress(0);

    if (typeof window !== "undefined") {
      localStorage.removeItem("paperScopeCurrentDoc");
      localStorage.removeItem("paperScopeMessages");
    }

    fetch(`${API_BASE}/api/reset`, { method: "POST" }).catch(() => {});
  };

  const handleQuery = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentDoc || !inputQuery.trim() || loading || summarizing) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: inputQuery.trim(),
      timestamp: "",
    };

    const isFirstUserMessage = !messages.some((m) => m.role === "user");
    if (isFirstUserMessage && messages.length > 0) {
      const title = makeChatTitle(userMsg.content);
      setMessages((prev) => [{ ...prev[0], title }, ...prev.slice(1), userMsg]);
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: currentDoc.id, query: userMsg.content, mode: depthMode }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Query failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
          timestamp: "",
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: `Error: ${err.message || "Failed to query the model."}`,
          timestamp: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewerAudit = async () => {
    if (!currentDoc || reviewingAudit || loading || summarizing) return;

    setReviewingAudit(true);
    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: "🥊 Run a ruthless Reviewer #2 critical peer-review audit on this paper.",
      timestamp: "",
    };

    const isFirstUserMessage = !messages.some((m) => m.role === "user");
    if (isFirstUserMessage && messages.length > 0) {
      setMessages((prev) => [
        { ...prev[0], title: "Reviewer #2 Critical Audit" },
        ...prev.slice(1),
        userMsg,
      ]);
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }

    try {
      const res = await fetch(`${API_BASE}/api/reviewer2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: currentDoc.id }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Reviewer #2 audit failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: data.critique,
          sources: data.sources || [],
          timestamp: "",
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: `Error: ${err.message || "Failed to execute Reviewer #2 audit."}`,
          timestamp: "",
        },
      ]);
    } finally {
      setReviewingAudit(false);
    }
  };

  const handleDissectMath = async (formula?: string) => {
    if (!currentDoc || dissectingMath || loading || summarizing) return;

    setDissectingMath(true);
    const targetFormula = formula || mathFormulaInput.trim();
    setShowMathModal(false);

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: targetFormula
        ? `🔬 Dissect this mathematical formulation: ${targetFormula}`
        : "🔬 Dissect the core mathematical formulas and objective functions in this paper.",
      timestamp: "",
    };

    const isFirstUserMessage = !messages.some((m) => m.role === "user");
    if (isFirstUserMessage && messages.length > 0) {
      setMessages((prev) => [
        { ...prev[0], title: "LaTeX Mathematical Dissection" },
        ...prev.slice(1),
        userMsg,
      ]);
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }

    try {
      const res = await fetch(`${API_BASE}/api/dissect_math`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_id: currentDoc.id,
          formula: targetFormula || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Math dissection failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: data.dissection,
          sources: data.sources || [],
          timestamp: "",
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: `Error: ${err.message || "Failed to dissect formulas."}`,
          timestamp: "",
        },
      ]);
    } finally {
      setDissectingMath(false);
      setMathFormulaInput("");
    }
  };

  const fetchIndexedDocs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/documents`);
      if (res.ok) {
        const data = await res.json();
        setIndexedDocs(data);
        if (currentDoc && !compareDocA) {
          setCompareDocA(currentDoc.id);
        }
        if (data.length > 1 && !compareDocB) {
          const other = data.find((d: any) => d.doc_id !== currentDoc?.id);
          if (other) setCompareDocB(other.doc_id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch documents for comparison", err);
    }
  };

  const handleComparePapers = async () => {
    if (!compareDocA || !compareDocB || comparingPapers) return;
    if (compareDocA === compareDocB) {
      alert("Please select two distinct research papers to compare!");
      return;
    }

    setComparingPapers(true);
    setShowCompareModal(false);

    const docAName = indexedDocs.find((d) => (d.doc_id || d.id) === compareDocA)?.filename || "Paper A";
    const docBName = indexedDocs.find((d) => (d.doc_id || d.id) === compareDocB)?.filename || "Paper B";

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: `⚖️ Head-to-Head Comparative Analysis: "${docAName}" vs "${docBName}" (${compareFocus} focus)`,
      timestamp: "",
    };

    const isFirstUserMessage = !messages.some((m) => m.role === "user");
    if (isFirstUserMessage && messages.length > 0) {
      setMessages((prev) => [
        { ...prev[0], title: `Comparison: ${docAName.slice(0, 14)} vs ${docBName.slice(0, 14)}` },
        ...prev.slice(1),
        userMsg,
      ]);
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }

    try {
      const res = await fetch(`${API_BASE}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_id_a: compareDocA,
          doc_id_b: compareDocB,
          focus: compareFocus,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Paper comparison failed");
      }

      const data = await res.json();
      const combinedSources = [...(data.sources_a || []), ...(data.sources_b || [])];
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: data.comparison,
          sources: combinedSources,
          timestamp: "",
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: `Error: ${err.message || "Failed to compare papers."}`,
          timestamp: "",
        },
      ]);
    } finally {
      setComparingPapers(false);
    }
  };

  const quickPrompts = [
    "What is the main problem tackled by this paper?",
    "Explain the core methodology and architecture.",
    "What were the key quantitative findings?",
    "What limitations are acknowledged by the authors?",
  ];

  return (
    <div style={styles.appRoot}>
      {/* Top Application Bar */}
      <header style={styles.topNav}>
        <div style={styles.navLeft}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={styles.sidebarToggleBtn}
            title={showHistory ? "Close Sidebar" : "Open Chat History"}
          >
            <SidebarIcon />
          </button>
          <div style={styles.brandIconWrapper}>
            <div style={styles.brandIconGlow} />
            <img src="/logo.jpg" alt="PaperScope Logo" style={styles.brandLogo} />
          </div>
          <div>
            <div style={styles.brandTitleRow}>
              <span style={styles.brandTitle}>PaperScope</span>
              <span style={styles.versionBadge}>Local 1.0</span>
            </div>
          </div>
        </div>

        <div style={styles.navCenter}>
          {currentDoc && (
            <div style={styles.docChip}>
              <FileTextIcon />
              <span style={styles.docChipTitle} title={currentDoc.filename}>
                {currentDoc.filename}
              </span>
              <span style={styles.docChipDivider}>•</span>
              <span style={styles.docChipPages}>{currentDoc.pages} pages</span>
            </div>
          )}
        </div>

        <div style={styles.navRight}>
          {messages.length > 1 && (
            <button
              onClick={exportChat}
              style={{
                ...styles.exportBtn,
                opacity: exportingPdf ? 0.6 : 1,
              }}
              title="Download research session as a PDF document"
              disabled={exportingPdf}
            >
              <DownloadIcon /> {exportingPdf ? "Generating PDF..." : "Export PDF"}
            </button>
          )}
          {currentDoc && (
            <button
              onClick={() => {
                setCitationMeta(parsePaperMetadata(currentDoc.filename, currentDoc.pages));
                setShowCitationModal(true);
              }}
              style={styles.citationNavBtn}
              title="Generate instant BibTeX, APA, MLA, IEEE citations"
            >
              <CitationIcon />
              <span>Cite / BibTeX</span>
            </button>
          )}

          <button
            onClick={() => {
              fetchIndexedDocs();
              setShowCompareModal(true);
            }}
            style={styles.citationNavBtn}
            title="Head-to-head comparison between two research papers"
          >
            <CompareIcon />
            <span>Compare</span>
          </button>

          <button
            onClick={toggleTheme}
            style={styles.themeToggleBtn}
            title={theme === "sand" ? "Switch to Midnight Dark Mode" : "Switch to Warm Sand Mode"}
          >
            {theme === "sand" ? (
              <>
                <MoonIcon />
                <span>Midnight</span>
              </>
            ) : (
              <>
                <SunIcon />
                <span>Sand</span>
              </>
            )}
          </button>

          <button
            onClick={handleNewChat}
            style={styles.newChatBtn}
            title="Start a new chat"
            disabled={loading || summarizing}
          >
            <PlusIcon /> New Chat
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={styles.historyBtn}
            title="View chat history (Ctrl+K)"
            disabled={loading || summarizing}
          >
            <SidebarIcon />
            <span>History</span>
            <span style={styles.kbdHint}>Ctrl K</span>
          </button>

          <div style={styles.statusPill}>
            <span style={styles.statusDotLive} />
            <span style={styles.statusPillText}>100% Local · Zero Cloud</span>
          </div>
        </div>
      </header>

      {/* ChatGPT / Gemini Style Slide-in Drawer */}
      {showHistory && (
        <>
          <div style={styles.drawerBackdrop} onClick={() => setShowHistory(false)} />
          <aside style={styles.drawerPanel}>
            {/* Drawer Header */}
            <div style={styles.drawerHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <img src="/logo.jpg" alt="Logo" style={{ width: "22px", height: "22px", borderRadius: "4px" }} />
                <span style={styles.drawerTitle}>Chats</span>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                style={styles.drawerCloseBtn}
                title="Close sidebar"
              >
                <XIcon />
              </button>
            </div>

            {/* New Chat Button */}
            <div style={{ padding: "0.75rem 0.85rem 0.4rem" }}>
              <button
                onClick={() => {
                  handleNewChat();
                  setShowHistory(false);
                }}
                style={styles.drawerNewChatBtn}
              >
                <PlusIcon />
                <span>New chat</span>
              </button>
            </div>

            {/* Chats List */}
            <div style={styles.drawerList}>
              {savedHistory.length === 0 ? (
                <div style={styles.drawerEmpty}>
                  <p>No saved chats yet.</p>
                  <span style={{ fontSize: "0.72rem", color: "#a1a1aa", marginTop: "0.35rem", display: "block" }}>
                    Conversations will appear here automatically and remain stored safely on your device.
                  </span>
                </div>
              ) : (
                savedHistory.map((chat, idx) => {
                  const firstUserMsg = chat.find((m) => m.role === "user")?.content?.trim();
                  const description =
                    (chat[0]?.title && chat[0].title !== "New Chat")
                      ? chat[0].title
                      : firstUserMsg
                        ? makeChatTitle(firstUserMsg)
                        : `Chat ${idx + 1}`;

                  return (
                    <div
                      key={idx}
                      style={styles.drawerItem}
                      onClick={() => loadChat(chat)}
                      title={description}
                    >
                      <div style={styles.drawerItemTextWrapper}>
                        <MessageSquareIcon />
                        <span style={styles.drawerItemText}>{description}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(idx);
                        }}
                        style={styles.drawerDeleteBtn}
                        title="Delete chat"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div style={styles.drawerFooter}>
              {savedHistory.length > 0 && (
                <button onClick={handleClearAllHistory} style={styles.drawerClearBtn}>
                  <TrashIcon /> Clear history
                </button>
              )}
              <div style={styles.drawerStatus}>
                <span style={styles.statusDotLive} />
                <span>100% Local Inference · Private</span>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Workspace */}
      <div style={styles.workspace}>
        {/* LEFT PANE: PDF Viewer */}
        <section style={styles.pdfPane}>
          {currentDoc ? (
            <div style={styles.pdfViewerContainer}>
              <div style={styles.pdfHeaderBar}>
                <div style={styles.paginationControls}>
                  <button onClick={() => jumpToPage(activePage - 1)} disabled={activePage <= 1} style={{ ...styles.iconBtn, opacity: activePage <= 1 ? 0.4 : 1 }}>
                    <ChevronLeftIcon />
                  </button>
                  <span style={styles.pageDisplay}>
                    Page <strong style={{ color: "#4f5d53" }}>{activePage}</strong> of {currentDoc.pages}
                  </span>
                  <button onClick={() => jumpToPage(activePage + 1)} disabled={activePage >= currentDoc.pages} style={{ ...styles.iconBtn, opacity: activePage >= currentDoc.pages ? 0.4 : 1 }}>
                    <ChevronRightIcon />
                  </button>
                </div>

                <div style={styles.pdfHeaderActions}>
                  {jumpFeedback && <span style={styles.feedbackBadge}>{jumpFeedback}</span>}
                  <button
                    onClick={() => setViewMode(viewMode === "pdf" ? "highlight_canvas" : "pdf")}
                    style={{
                      ...styles.viewModeToggleBtn,
                      ...(viewMode === "highlight_canvas" ? styles.viewModeToggleBtnActive : {}),
                    }}
                    title={viewMode === "pdf" ? "Switch to High-Res In-Canvas BBox Highlights" : "Switch to Browser Native PDF"}
                  >
                    <TargetIcon />
                    <span>{viewMode === "highlight_canvas" ? "✨ BBox Canvas" : "📄 Native PDF"}</span>
                  </button>
                  <a href={`${currentDoc.pdfUrl}#page=${activePage}`} target="_blank" rel="noreferrer" style={styles.openExternalBtn}>
                    <ExternalLinkIcon />
                    <span>Open Tab</span>
                  </a>
                  <label style={styles.switchDocBtn}>
                    <input type="file" accept=".pdf" onChange={handleFileUpload} onClick={(e) => { (e.target as HTMLInputElement).value = ""; }} style={{ display: "none" }} />
                    Replace PDF
                  </label>
                  <button
                    onClick={handleCloseDoc}
                    style={styles.closeDocBtn}
                    title="Close active paper and return to upload screen"
                  >
                    <XIcon />
                    <span>Close PDF</span>
                  </button>
                </div>
              </div>

              {showBboxSpotlight && activeCitationSnippet && (
                <div style={styles.bboxSpotlightBanner}>
                  <div style={styles.bboxSpotlightHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <span style={styles.bboxSpotlightPill}>🎯 Page {activePage} Citation</span>
                      <span style={styles.bboxSpotlightVerified}>✓ In-Document Evidence</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <button
                        onClick={() => setViewMode(viewMode === "pdf" ? "highlight_canvas" : "pdf")}
                        style={{
                          ...styles.bboxMiniBtn,
                          ...(viewMode === "highlight_canvas" ? styles.bboxMiniBtnActive : {}),
                        }}
                      >
                        {viewMode === "highlight_canvas" ? "Switch to Native" : "✨ Highlight Canvas"}
                      </button>
                      <button
                        onClick={() => setShowBboxSpotlight(false)}
                        style={styles.bboxCloseBtn}
                        title="Dismiss spotlight"
                      >
                        <XIcon />
                      </button>
                    </div>
                  </div>
                  <div style={styles.bboxSnippetText}>
                    &ldquo;{activeCitationSnippet}&rdquo;
                  </div>
                </div>
              )}

              <div style={styles.frameContainer}>
                {viewMode === "highlight_canvas" ? (
                  <div style={styles.canvasContainer}>
                    <div style={styles.canvasWrapper}>
                      <img
                        src={`${API_BASE}/api/page_image/${currentDoc.id}/${activePage}?highlight=${encodeURIComponent(activeCitationSnippet || "")}`}
                        alt={`Document Page ${activePage} with highlighted bounding boxes`}
                        style={styles.canvasImg}
                      />
                      {activeCitationBbox.map((b, bi) => (
                        <div
                          key={bi}
                          className="animate-pulse-gold"
                          style={{
                            position: "absolute",
                            left: `${b.left}%`,
                            top: `${b.top}%`,
                            width: `${b.width}%`,
                            height: `${b.height}%`,
                            backgroundColor: "rgba(255, 220, 40, 0.35)",
                            border: "2px solid #e07a5f",
                            borderRadius: "3px",
                            boxShadow: "0 0 14px rgba(224, 122, 95, 0.7)",
                            pointerEvents: "none",
                            zIndex: 6,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={pdfFrameRef}
                    key={`doc-${currentDoc.id}-p${activePage}`}
                    src={`${currentDoc.pdfUrl}#page=${activePage}&view=FitH`}
                    style={styles.iframeElement}
                    title="PaperScope Document Frame"
                  />
                )}

                {uploading && (
                  <div style={styles.replaceProgressOverlay} className="animate-fade-in">
                    <div style={styles.replaceProgressCard}>
                      <div style={styles.uploadProgressHeader}>
                        <div style={styles.uploadIconPulsing} className="pulse-scale">
                          <FileTextIcon />
                        </div>
                        <div style={styles.uploadProgressMeta}>
                          <div style={styles.uploadProgressBadgeRow}>
                            <span style={styles.uploadProgressBadge}>Replacing Paper</span>
                            <span style={styles.uploadProgressPercentBadge}>{uploadProgress}%</span>
                          </div>
                          <h4 style={styles.uploadProgressTitle}>
                            {uploadProgress < 100 ? "Indexing New Paper..." : "Ready! 🎉"}
                          </h4>
                          <p style={styles.uploadProgressFilename} title={uploadingFile?.name}>
                            {uploadingFile ? `${uploadingFile.name} • ${uploadingFile.size}` : "Processing..."}
                          </p>
                        </div>
                      </div>

                      <div style={styles.progressBarTrack}>
                        <div
                          className="progress-bar-shimmer"
                          style={{
                            ...styles.progressBarFill,
                            width: `${uploadProgress}%`,
                          }}
                        />
                      </div>

                      <div style={styles.progressMetricsRow}>
                        <span style={styles.progressStageLabel}>
                          <span style={styles.progressStageDot} />
                          {uploadStage || "Preparing neural indexing..."}
                        </span>
                        <span style={styles.progressEtaLabel}>{uploadProgress}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={styles.emptyUploadContainer}>
              {uploading ? (
                <div style={styles.uploadProgressCard} className="animate-fade-in">
                  <div style={styles.uploadProgressHeader}>
                    <div style={styles.uploadIconPulsing} className="pulse-scale">
                      <FileTextIcon />
                    </div>
                    <div style={styles.uploadProgressMeta}>
                      <div style={styles.uploadProgressBadgeRow}>
                        <span style={styles.uploadProgressBadge}>100% Local Inference</span>
                        <span style={styles.uploadProgressPercentBadge}>{uploadProgress}%</span>
                      </div>
                      <h3 style={styles.uploadProgressTitle}>
                        {uploadProgress < 100 ? "Indexing Research Paper..." : "Ready for Research! 🎉"}
                      </h3>
                      <p style={styles.uploadProgressFilename} title={uploadingFile?.name}>
                        {uploadingFile ? `${uploadingFile.name} • ${uploadingFile.size}` : "Preparing document..."}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div style={styles.progressBarTrack}>
                    <div
                      className="progress-bar-shimmer"
                      style={{
                        ...styles.progressBarFill,
                        width: `${uploadProgress}%`,
                      }}
                    />
                  </div>

                  {/* Stage Metrics */}
                  <div style={styles.progressMetricsRow}>
                    <span style={styles.progressStageLabel}>
                      <span style={styles.progressStageDot} />
                      {uploadStage || "Preparing neural indexing..."}
                    </span>
                    <span style={styles.progressEtaLabel}>
                      {uploadProgress < 35 ? "Stage 1 of 4" : uploadProgress < 65 ? "Stage 2 of 4" : uploadProgress < 90 ? "Stage 3 of 4" : uploadProgress < 100 ? "Stage 4 of 4" : "Complete"}
                    </span>
                  </div>

                  {/* 4-Step Milestone Checklist */}
                  <div style={styles.progressStepsRow}>
                    <div style={{ ...styles.progressStepItem, ...(uploadProgress >= 15 ? styles.progressStepActive : {}) }}>
                      <span style={{ ...styles.stepDot, ...(uploadProgress >= 35 ? styles.stepDotDone : {}) }}>
                        {uploadProgress >= 35 ? "✓" : "1"}
                      </span>
                      <span>Upload</span>
                    </div>
                    <div style={{ ...styles.progressStepItem, ...(uploadProgress >= 38 ? styles.progressStepActive : {}) }}>
                      <span style={{ ...styles.stepDot, ...(uploadProgress >= 54 ? styles.stepDotDone : {}) }}>
                        {uploadProgress >= 54 ? "✓" : "2"}
                      </span>
                      <span>Extract Text</span>
                    </div>
                    <div style={{ ...styles.progressStepItem, ...(uploadProgress >= 55 ? styles.progressStepActive : {}) }}>
                      <span style={{ ...styles.stepDot, ...(uploadProgress >= 75 ? styles.stepDotDone : {}) }}>
                        {uploadProgress >= 75 ? "✓" : "3"}
                      </span>
                      <span>Embeddings</span>
                    </div>
                    <div style={{ ...styles.progressStepItem, ...(uploadProgress >= 88 ? styles.progressStepActive : {}) }}>
                      <span style={{ ...styles.stepDot, ...(uploadProgress >= 100 ? styles.stepDotDone : {}) }}>
                        {uploadProgress >= 100 ? "✓" : "4"}
                      </span>
                      <span>Vector Store</span>
                    </div>
                  </div>

                  <div style={styles.progressFooterRow}>
                    <span style={styles.techBadge}>🔒 Zero Cloud API Calls</span>
                    <span style={styles.techBadge}>⚡ Hybrid GPU (DirectML) + CPU AVX2</span>
                    <span style={styles.techBadge}>🧠 Local Vector Index</span>
                  </div>
                </div>
              ) : (
                <div style={styles.uploadCard}>
                  <div style={styles.uploadLogoWrapper}>
                    <img src="/logo.jpg" alt="PaperScope Emblem" style={styles.uploadLogoImg} />
                  </div>
                  <h2 style={styles.uploadCardHeader}>PaperScope Research Engine</h2>
                  <p style={styles.uploadCardBody}>
                    Select or drop any scientific paper PDF. Automatically indexed into private in-memory vectors with local neural model synthesis.
                  </p>

                  <label style={styles.dropzoneTrigger} onDragOver={(e) => e.preventDefault()} onDrop={handleDropFile}>
                    <input type="file" accept=".pdf" onChange={handleFileUpload} onClick={(e) => { (e.target as HTMLInputElement).value = ""; }} style={{ display: "none" }} />
                    <span style={styles.dropzoneMainText}>Select Research PDF</span>
                    <span style={styles.dropzoneSubText}>Compatible with arXiv, IEEE, Springer, ACM & Nature</span>
                  </label>

                  <div style={styles.techBadgesRow}>
                    <span style={styles.techBadge}>🔒 Zero Cloud Calls</span>
                    <span style={styles.techBadge}>⚡ 4-Bit ONNX LLM</span>
                    <span style={styles.techBadge}>📑 Page Citations</span>
                  </div>

                  {uploadStatus && (
                    <div style={{ marginTop: "0.65rem", textAlign: "center" }}>
                      <p style={styles.uploadNoticeText}>{uploadStatus}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadStatus("");
                          setUploading(false);
                          setUploadProgress(0);
                        }}
                        style={{
                          marginTop: "0.45rem",
                          padding: "0.3rem 0.85rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor: "rgba(224, 122, 95, 0.14)",
                          color: "#e07a5f",
                          border: "1px solid rgba(224, 122, 95, 0.4)",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        🔄 Clear & Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* RIGHT PANE: Conversational Workspace */}
        <section style={styles.chatPane}>
          {currentDoc && (
            <div style={styles.actionStrip}>
              <button
                onClick={handleSummarize}
                disabled={summarizing || loading}
                style={{ ...styles.actionPillPrimary, opacity: summarizing || loading ? 0.6 : 1 }}
                title="Generate instant executive scientific summary"
              >
                <SparklesIcon />
                <span>{summarizing ? "Synthesizing..." : "Executive Summary"}</span>
              </button>

              <button
                onClick={handleAudioBriefing}
                disabled={summarizing || loading}
                style={{
                  ...styles.actionPillAudio,
                  ...(speakingId ? styles.actionPillAudioActive : {}),
                }}
                title={speakingId ? "Stop audio briefing" : "Listen to audio briefing of latest synthesis"}
              >
                {speakingId ? (
                  <>
                    <div style={styles.audioWaveBox}>
                      <span className="audio-bar-1" style={{ ...styles.audioWaveLine, backgroundColor: "#faf9f6" }} />
                      <span className="audio-bar-2" style={{ ...styles.audioWaveLine, backgroundColor: "#faf9f6" }} />
                      <span className="audio-bar-3" style={{ ...styles.audioWaveLine, backgroundColor: "#faf9f6" }} />
                    </div>
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <HeadphonesIcon />
                    <span>Audio Briefing</span>
                  </>
                )}
              </button>

              {availableVoices.length > 0 && (
                <div style={styles.voiceSelectWrapper}>
                  <span style={styles.voiceSelectLabel}>🎙️ Voice:</span>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    style={styles.voiceSelect}
                    title="Select AI Briefing Voice"
                  >
                    {availableVoices.map((v) => {
                      const cleanName = v.name
                        .replace(/^Microsoft\s+/i, "")
                        .replace(/^Google\s+/i, "")
                        .replace(/\s+Online\s+\(Natural\)/gi, " ✨ (Natural)")
                        .replace(/\s+\(Natural\)/gi, " ✨ (Natural)");
                      return (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {cleanName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Research Tone / Depth Mode Selector */}
              <div style={styles.depthSelectorGroup}>
                <span style={styles.depthGroupLabel}>Tone:</span>
                <button
                  onClick={() => handleSetDepthMode("plain")}
                  style={{
                    ...styles.depthPill,
                    ...(depthMode === "plain" ? styles.depthPillActive : {}),
                  }}
                  title="Plain & Easy English (ChatGPT / Gemini style): clear words & intuitive everyday analogies"
                >
                  💡 Plain English
                </button>
                <button
                  onClick={() => handleSetDepthMode("rigorous")}
                  style={{
                    ...styles.depthPill,
                    ...(depthMode === "rigorous" ? styles.depthPillActive : {}),
                  }}
                  title="Deep-Dive: thorough scientific breakdown with technical citations"
                >
                  🎓 Deep-Dive
                </button>
                <button
                  onClick={() => handleSetDepthMode("metrics")}
                  style={{
                    ...styles.depthPill,
                    ...(depthMode === "metrics" ? styles.depthPillActive : {}),
                  }}
                  title="Key Metrics: core benchmarks, statistics, and numbers"
                >
                  ⚡ Metrics
                </button>
              </div>

              <div style={styles.actionPillGroup}>
                <button
                  onClick={handleReviewerAudit}
                  disabled={loading || summarizing || reviewingAudit}
                  style={{
                    ...styles.actionPillSecondary,
                    border: "1px solid rgba(224, 122, 95, 0.4)",
                    backgroundColor: theme === "midnight" ? "rgba(224, 122, 95, 0.16)" : "rgba(200, 80, 58, 0.08)",
                    color: theme === "midnight" ? "#fca5a5" : "#C8503A",
                    fontWeight: 600,
                  }}
                  title="Run a ruthless conference-grade Reviewer #2 critical peer-review"
                >
                  <BoxingIcon />
                  <span>{reviewingAudit ? "Auditing..." : "Reviewer #2"}</span>
                </button>
                <button
                  onClick={() => setShowMathModal(true)}
                  disabled={loading || summarizing || dissectingMath}
                  style={{
                    ...styles.actionPillSecondary,
                    border: "1px solid rgba(201, 168, 76, 0.4)",
                    backgroundColor: theme === "midnight" ? "rgba(201, 168, 76, 0.16)" : "rgba(201, 168, 76, 0.08)",
                    color: theme === "midnight" ? "#fde047" : "#b45309",
                    fontWeight: 600,
                  }}
                  title="Dissect mathematical formulas & objective formulations"
                >
                  <MathIcon />
                  <span>Dissect Math</span>
                </button>
                <button
                  onClick={() => {
                    fetchIndexedDocs();
                    setShowCompareModal(true);
                  }}
                  disabled={loading || summarizing || comparingPapers}
                  style={{
                    ...styles.actionPillSecondary,
                    border: "1px solid rgba(124, 147, 129, 0.4)",
                    color: theme === "midnight" ? "#86efac" : "#4f5d53",
                  }}
                  title="Compare head-to-head with another paper"
                >
                  <CompareIcon />
                  <span>Compare</span>
                </button>
                <button
                  onClick={() => setInputQuery("Explain the core methodology and architecture.")}
                  disabled={loading || summarizing}
                  style={styles.actionPillSecondary}
                  title="Query paper methodology"
                >
                  🔬 Methodology
                </button>
                <button
                  onClick={() => setInputQuery("What were the key quantitative findings and metrics?")}
                  disabled={loading || summarizing}
                  style={styles.actionPillSecondary}
                  title="Query quantitative results"
                >
                  📊 Key Findings
                </button>
                <button
                  onClick={() => setInputQuery("What limitations and risks are acknowledged by the authors?")}
                  disabled={loading || summarizing}
                  style={styles.actionPillSecondary}
                  title="Query paper limitations"
                >
                  ⚠️ Limitations
                </button>
              </div>
            </div>
          )}

          <div style={styles.chatScrollArea}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ ...styles.messageRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ ...styles.messageContainer, ...(msg.role === "user" ? styles.userContainer : styles.assistantContainer) }}>
                  <div style={styles.msgMetaRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <span style={{ ...styles.msgRoleLabel, color: msg.role === "user" ? "#faf9f6" : "#C8503A" }}>
                        {msg.role === "user" ? "You" : "PaperScope"}
                      </span>
                      {msg.role === "assistant" && (
                        <span style={styles.msgLocalBadge}>100% Local</span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      {msg.role === "assistant" && (
                        <>
                          <button
                            onClick={() => handleToggleSpeech(msg.content, msg.id)}
                            style={{
                              ...styles.speechBtn,
                              ...(speakingId === msg.id ? styles.speechBtnActive : {}),
                            }}
                            title={speakingId === msg.id ? "Stop audio briefing" : "Listen to this response (100% offline)"}
                          >
                            {speakingId === msg.id ? (
                              <>
                                <div style={styles.audioWaveBox}>
                                  <span className="audio-bar-1" style={styles.audioWaveLine} />
                                  <span className="audio-bar-2" style={styles.audioWaveLine} />
                                  <span className="audio-bar-3" style={styles.audioWaveLine} />
                                </div>
                                <SquareIcon />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <VolumeIcon />
                                <span>Listen</span>
                              </>
                            )}
                          </button>

                          {speakingId === msg.id && (
                            <button
                              onClick={() => handleCycleSpeed(msg.content, msg.id)}
                              style={styles.speedBtn}
                              title="Toggle speech speed (1x, 1.25x, 1.5x)"
                            >
                              {speechRate}x
                            </button>
                          )}

                          {speakingId === msg.id && availableVoices.length > 0 && (
                            <select
                              value={selectedVoiceURI}
                              onChange={(e) => {
                                const newURI = e.target.value;
                                handleVoiceChange(newURI);
                                window.speechSynthesis.cancel();
                                const cleaned = cleanTextForSpeech(msg.content);
                                const utterance = new SpeechSynthesisUtterance(cleaned);
                                utterance.rate = speechRate;
                                utterance.pitch = 1.0;
                                const match = availableVoices.find((v) => v.voiceURI === newURI);
                                if (match) utterance.voice = match;
                                utterance.onend = () => setSpeakingId(null);
                                utterance.onerror = () => setSpeakingId(null);
                                window.speechSynthesis.speak(utterance);
                              }}
                              style={styles.msgVoiceSelect}
                              title="Switch voice"
                            >
                              {availableVoices.map((v) => (
                                <option key={v.voiceURI} value={v.voiceURI}>
                                  {v.name
                                    .replace(/^Microsoft\s+/i, "")
                                    .replace(/^Google\s+/i, "")
                                    .replace(/\s+Online\s+\(Natural\)/gi, " ✨")
                                    .replace(/\s+\(Natural\)/gi, " ✨")}
                                </option>
                              ))}
                            </select>
                          )}

                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            style={styles.copyBtn}
                            title="Copy response to clipboard"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <CheckIcon />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <CopyIcon />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                      {msg.timestamp && <span style={styles.msgTimeLabel}>{msg.timestamp}</span>}
                    </div>
                  </div>

                  <div style={styles.msgBody}>
                    <FormattedMessage content={msg.content} />
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div style={styles.citationsSection}>
                      <div style={styles.citationsHeaderLine}>
                        <span style={styles.citationsSectionTitle}>
                          <BookmarkIcon /> Citations (Click page to navigate viewer)
                        </span>
                      </div>
                      <div style={styles.citationsGrid}>
                        {msg.sources.map((src, sIdx) => {
                          const isCurrent = activePage === src.page;
                          return (
                            <button
                              key={sIdx}
                              onClick={() => jumpToPage(src.page, src.snippet)}
                              style={{ ...styles.citationChip, ...(isCurrent ? styles.citationChipActive : {}) }}
                              title={`Jump to Page ${src.page} & highlight grounded passage in canvas`}
                            >
                              <span style={styles.citationBadge}>p. {src.page}</span>
                              <span style={styles.citationSnippetText}>{src.snippet.slice(0, 52)}...</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && currentDoc && (
              <div style={styles.starterGrid}>
                <button
                  onClick={handleSummarize}
                  disabled={summarizing || loading}
                  style={styles.starterCard}
                  title="Generate executive scientific summary"
                >
                  <span style={styles.starterIcon}>⚡</span>
                  <div style={styles.starterTextWrapper}>
                    <strong style={styles.starterCardTitle}>Executive Summary</strong>
                    <span style={styles.starterCardDesc}>Clear, easy-to-understand breakdown in plain English</span>
                  </div>
                </button>

                <button
                  onClick={handleReviewerAudit}
                  disabled={loading || summarizing || reviewingAudit}
                  style={{
                    ...styles.starterCard,
                    borderColor: "rgba(224, 122, 95, 0.35)",
                  }}
                  title="Run a ruthless conference-grade Reviewer #2 critical peer-review"
                >
                  <span style={styles.starterIcon}>🥊</span>
                  <div style={styles.starterTextWrapper}>
                    <strong style={styles.starterCardTitle}>Reviewer #2 Audit</strong>
                    <span style={styles.starterCardDesc}>Expose weak baselines, assumptions & defense questions</span>
                  </div>
                </button>

                <button
                  onClick={() => setShowMathModal(true)}
                  disabled={loading || summarizing || dissectingMath}
                  style={{
                    ...styles.starterCard,
                    borderColor: "rgba(201, 168, 76, 0.35)",
                  }}
                  title="Dissect mathematical formulas & objective formulations"
                >
                  <span style={styles.starterIcon}>📐</span>
                  <div style={styles.starterTextWrapper}>
                    <strong style={styles.starterCardTitle}>Dissect Math & LaTeX</strong>
                    <span style={styles.starterCardDesc}>Variable-by-variable formula breakdown</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    fetchIndexedDocs();
                    setShowCompareModal(true);
                  }}
                  disabled={loading || summarizing || comparingPapers}
                  style={{
                    ...styles.starterCard,
                    borderColor: "rgba(124, 147, 129, 0.35)",
                  }}
                  title="Head-to-head comparative analysis against another paper"
                >
                  <span style={styles.starterIcon}>⚖️</span>
                  <div style={styles.starterTextWrapper}>
                    <strong style={styles.starterCardTitle}>Compare 2 Papers</strong>
                    <span style={styles.starterCardDesc}>Side-by-side matrix & empirical showdown</span>
                  </div>
                </button>

                <button
                  onClick={() => setInputQuery("Explain the core methodology and architecture.")}
                  disabled={loading || summarizing}
                  style={styles.starterCard}
                  title="Explore paper methodology"
                >
                  <span style={styles.starterIcon}>🔬</span>
                  <div style={styles.starterTextWrapper}>
                    <strong style={styles.starterCardTitle}>Methodology Deep-Dive</strong>
                    <span style={styles.starterCardDesc}>Understand the algorithm, datasets & pipeline</span>
                  </div>
                </button>

                <button
                  onClick={() => setInputQuery("What were the key quantitative findings and metrics?")}
                  disabled={loading || summarizing}
                  style={styles.starterCard}
                  title="Explore quantitative results"
                >
                  <span style={styles.starterIcon}>📊</span>
                  <div style={styles.starterTextWrapper}>
                    <strong style={styles.starterCardTitle}>Key Findings & Metrics</strong>
                    <span style={styles.starterCardDesc}>Extract benchmarks, accuracy & stats</span>
                  </div>
                </button>
              </div>
            )}

            {(loading || summarizing || reviewingAudit || dissectingMath || comparingPapers) && (
              <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
                <div style={{ ...styles.messageContainer, ...styles.assistantContainer }}>
                  <div style={styles.generatingRow}>
                    <span style={styles.generatingDot} />
                    <span style={styles.generatingText}>
                      {reviewingAudit
                        ? "Reviewer #2 is scrutinizing baselines, ablations & claims..."
                        : dissectingMath
                          ? "Dissecting mathematical equations variable-by-variable..."
                          : comparingPapers
                            ? "Synthesizing head-to-head comparative matrix..."
                            : summarizing
                              ? "Local ONNX model reading excerpts..."
                              : "Retrieving semantic vectors locally..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputDockWrapper}>
            <form onSubmit={handleQuery} style={styles.inputDock}>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={currentDoc ? "Ask a question about the paper..." : "Upload a PDF document to begin..."}
                disabled={!currentDoc || loading || summarizing}
                style={styles.dockInputField}
              />
              <button
                type="submit"
                disabled={!currentDoc || !inputQuery.trim() || loading || summarizing}
                style={{ ...styles.dockSubmitBtn, opacity: !currentDoc || !inputQuery.trim() || loading || summarizing ? 0.35 : 1 }}
                title="Send query (Enter)"
              >
                <ArrowUpIcon />
              </button>
            </form>
            <div style={styles.inputFooterRow}>
              <span>🔒 100% Offline Local Model</span>
              <span>•</span>
              <span>Private ChromaDB Vector Search</span>
              <span>•</span>
              <span>Press Enter ↵</span>
            </div>
          </div>
        </section>
      </div>

      {/* Instant BibTeX & Academic Citation Modal */}
      {showCitationModal && (
        <>
          <div style={styles.modalBackdrop} onClick={() => setShowCitationModal(false)} />
          <div style={styles.citationModal}>
            <div style={styles.citationModalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <div style={styles.citationIconCircle}>
                  <CitationIcon />
                </div>
                <div>
                  <h3 style={styles.citationModalTitle}>Academic Citation Generator</h3>
                  <span style={styles.citationModalSubtitle}>
                    Instant formatted citations ready for LaTeX, Overleaf, Word, or Zotero
                  </span>
                </div>
              </div>
              <button onClick={() => setShowCitationModal(false)} style={styles.modalCloseBtn} title="Close">
                <XIcon />
              </button>
            </div>

            {/* Citation Formats Tabs */}
            <div style={styles.citationTabsRow}>
              {(["bibtex", "apa", "mla", "ieee"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCitationTab(tab)}
                  style={{
                    ...styles.citationTabBtn,
                    ...(citationTab === tab ? styles.citationTabBtnActive : {}),
                  }}
                >
                  {tab === "bibtex" ? "BibTeX (@article)" : tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Citation Content Box */}
            <div style={styles.citationCodeBox}>
              <pre style={styles.citationPre}>
                <code>{getActiveCitationText()}</code>
              </pre>
            </div>

            {/* Actions Row */}
            <div style={styles.citationActionsRow}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handleCopyCitation} style={styles.citationCopyBtn}>
                  {citationCopied ? <CheckIcon /> : <CopyIcon />}
                  <span>{citationCopied ? "Copied!" : `Copy ${citationTab.toUpperCase()}`}</span>
                </button>
                {citationTab === "bibtex" && (
                  <button onClick={downloadBibTeX} style={styles.citationDownloadBtn}>
                    <DownloadIcon />
                    <span>Download .bib</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowMetaEdit(!showMetaEdit)}
                style={styles.citationEditToggleBtn}
              >
                {showMetaEdit ? "Hide Details" : "Edit Metadata ✎"}
              </button>
            </div>

            {/* Collapsible Metadata Editor */}
            {showMetaEdit && (
              <div style={styles.citationMetaForm}>
                <div style={styles.citationMetaGrid}>
                  <div>
                    <label style={styles.metaLabel}>Title</label>
                    <input
                      type="text"
                      value={citationMeta.title}
                      onChange={(e) => setCitationMeta({ ...citationMeta, title: e.target.value })}
                      style={styles.metaInput}
                    />
                  </div>
                  <div>
                    <label style={styles.metaLabel}>Authors (separated by and)</label>
                    <input
                      type="text"
                      value={citationMeta.authors}
                      onChange={(e) => setCitationMeta({ ...citationMeta, authors: e.target.value })}
                      style={styles.metaInput}
                    />
                  </div>
                  <div>
                    <label style={styles.metaLabel}>Year</label>
                    <input
                      type="text"
                      value={citationMeta.year}
                      onChange={(e) => setCitationMeta({ ...citationMeta, year: e.target.value })}
                      style={styles.metaInput}
                    />
                  </div>
                  <div>
                    <label style={styles.metaLabel}>Journal / Venue</label>
                    <input
                      type="text"
                      value={citationMeta.journal}
                      onChange={(e) => setCitationMeta({ ...citationMeta, journal: e.target.value })}
                      style={styles.metaInput}
                    />
                  </div>
                  <div>
                    <label style={styles.metaLabel}>Pages</label>
                    <input
                      type="text"
                      value={citationMeta.pages}
                      onChange={(e) => setCitationMeta({ ...citationMeta, pages: e.target.value })}
                      style={styles.metaInput}
                    />
                  </div>
                  <div>
                    <label style={styles.metaLabel}>DOI</label>
                    <input
                      type="text"
                      value={citationMeta.doi}
                      onChange={(e) => setCitationMeta({ ...citationMeta, doi: e.target.value })}
                      style={styles.metaInput}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* LaTeX & Mathematical Formulation Dissector Modal */}
      {showMathModal && (
        <>
          <div style={styles.modalBackdrop} onClick={() => setShowMathModal(false)} />
          <div style={styles.citationModal}>
            <div style={styles.citationModalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <div style={{ ...styles.citationIconCircle, backgroundColor: "rgba(201, 168, 76, 0.15)", color: "#C9A84C" }}>
                  <MathIcon />
                </div>
                <div>
                  <h3 style={styles.citationModalTitle}>LaTeX & Mathematical Dissector</h3>
                  <span style={styles.citationModalSubtitle}>
                    Variable-by-variable breakdowns, loss formulation mechanics & intuitive insights
                  </span>
                </div>
              </div>
              <button onClick={() => setShowMathModal(false)} style={styles.modalCloseBtn} title="Close">
                <XIcon />
              </button>
            </div>

            <div style={{ marginTop: "0.5rem" }}>
              <label style={styles.metaLabel}>Enter Specific LaTeX Equation or Loss Function (optional):</label>
              <textarea
                value={mathFormulaInput}
                onChange={(e) => setMathFormulaInput(e.target.value)}
                placeholder="e.g. \mathcal{L} = \mathbb{E}_{q(z|x)}[\log p(x|z)] - D_{KL}(q(z|x) \parallel p(z)) or leave blank to auto-detect from paper excerpts"
                style={{
                  ...styles.metaInput,
                  minHeight: "75px",
                  resize: "vertical",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.82rem",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => handleDissectMath("")}
                disabled={dissectingMath}
                style={styles.citationDownloadBtn}
                title="Scan paper excerpts and dissect primary equations automatically"
              >
                Auto-Detect Equations
              </button>
              <button
                onClick={() => handleDissectMath(mathFormulaInput)}
                disabled={dissectingMath}
                style={{
                  ...styles.citationCopyBtn,
                  backgroundColor: "#C9A84C",
                }}
              >
                <MathIcon />
                <span>{dissectingMath ? "Dissecting..." : "Dissect Formulation"}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Head-to-Head 2-Paper Comparison Modal */}
      {showCompareModal && (
        <>
          <div style={styles.modalBackdrop} onClick={() => setShowCompareModal(false)} />
          <div style={{ ...styles.citationModal, maxWidth: "620px" }}>
            <div style={styles.citationModalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <div style={{ ...styles.citationIconCircle, backgroundColor: "rgba(124, 147, 129, 0.18)", color: "#7c9381" }}>
                  <CompareIcon />
                </div>
                <div>
                  <h3 style={styles.citationModalTitle}>Head-to-Head Paper Comparison</h3>
                  <span style={styles.citationModalSubtitle}>
                    Side-by-side comparative matrix across objectives, architectures, benchmarks & trade-offs
                  </span>
                </div>
              </div>
              <button onClick={() => setShowCompareModal(false)} style={styles.modalCloseBtn} title="Close">
                <XIcon />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginTop: "0.5rem" }}>
              <div>
                <label style={styles.metaLabel}>Paper A (Baseline / Primary)</label>
                <select
                  value={compareDocA}
                  onChange={(e) => setCompareDocA(e.target.value)}
                  style={{ ...styles.metaInput, cursor: "pointer" }}
                >
                  {indexedDocs.map((doc: any) => (
                    <option key={doc.doc_id || doc.id} value={doc.doc_id || doc.id}>
                      {doc.filename || doc.doc_id}
                    </option>
                  ))}
                  {currentDoc && !indexedDocs.some((d: any) => (d.doc_id || d.id) === currentDoc.id) && (
                    <option value={currentDoc.id}>{currentDoc.filename}</option>
                  )}
                </select>
              </div>

              <div>
                <label style={styles.metaLabel}>Paper B (Contender / Comparative)</label>
                <select
                  value={compareDocB}
                  onChange={(e) => setCompareDocB(e.target.value)}
                  style={{ ...styles.metaInput, cursor: "pointer" }}
                >
                  {indexedDocs.map((doc: any) => (
                    <option key={doc.doc_id || doc.id} value={doc.doc_id || doc.id}>
                      {doc.filename || doc.doc_id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: "0.6rem" }}>
              <label style={styles.metaLabel}>Comparison Focus Dimension:</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.45rem", marginTop: "0.3rem" }}>
                {[
                  { id: "general", label: "🌐 Comprehensive Matrix", desc: "Objective, Method, Results & Verdict" },
                  { id: "benchmarks", label: "📊 Empirical Benchmarks", desc: "Accuracy metrics, datasets & speed" },
                  { id: "methodology", label: "🔬 Methodology & Architecture", desc: "Algorithms, loss & pipeline differences" },
                  { id: "tradeoffs", label: "⚖️ Trade-offs & Limitations", desc: "Compute cost, failure modes & when to use" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCompareFocus(item.id as any)}
                    style={{
                      textAlign: "left",
                      padding: "0.5rem 0.65rem",
                      borderRadius: "6px",
                      border: `1px solid ${compareFocus === item.id ? "#e07a5f" : "rgba(124, 147, 129, 0.25)"}`,
                      backgroundColor: compareFocus === item.id ? (theme === "midnight" ? "rgba(224, 122, 95, 0.16)" : "rgba(200, 80, 58, 0.08)") : "transparent",
                      color: styles.brandTitle.color,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.78rem" }}>{item.label}</div>
                    <div style={{ fontSize: "0.68rem", color: styles.progressEtaLabel.color, marginTop: "0.15rem" }}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowCompareModal(false)}
                style={styles.citationDownloadBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleComparePapers}
                disabled={comparingPapers || !compareDocA || !compareDocB || compareDocA === compareDocB}
                style={{
                  ...styles.citationCopyBtn,
                  opacity: comparingPapers || !compareDocA || !compareDocB || compareDocA === compareDocB ? 0.5 : 1,
                }}
              >
                <CompareIcon />
                <span>{comparingPapers ? "Comparing..." : "Generate Head-to-Head Matrix"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Dynamic High-End CSS Styling (Sand & Midnight Themes) ---
const getStyles = (theme: "sand" | "midnight"): Record<string, React.CSSProperties> => {
  const isDark = theme === "midnight";

  // Palette definitions
  const bgMain = isDark ? "#0f1117" : "#faf9f6";
  const bgPane = isDark ? "#141720" : "#faf9f6";
  const bgCard = isDark ? "#1b202c" : "#ffffff";
  const bgCardSecondary = isDark ? "#161a23" : "#fcfaf6";
  const bgInput = isDark ? "#1a1f2b" : "#ffffff";
  const borderCol = isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e3dc";
  
  const textMain = isDark ? "#f1f5f9" : "#4f5d53";
  const textMuted = isDark ? "#94a3b8" : "#7c9381";
  
  const terracotta = isDark ? "#e07a5f" : "#C8503A";
  const sageDark = isDark ? "#32433d" : "#4A6058";
  const gold = "#C9A84C";

  return {
    appRoot: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
      backgroundColor: bgMain,
      color: textMain,
      overflow: "hidden",
    },
    topNav: {
      height: "54px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.25rem",
      backgroundColor: sageDark,
      borderBottom: `1px solid ${borderCol}`,
      zIndex: 20,
    },
    navLeft: { display: "flex", alignItems: "center", gap: "0.75rem" },
    brandIconWrapper: {
      position: "relative",
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    brandIconGlow: {
      position: "absolute",
      inset: 0,
      borderRadius: "8px",
      background: "radial-gradient(circle, rgba(224,122,95,0.2) 0%, transparent 70%)",
    },
    brandLogo: { width: "28px", height: "28px", borderRadius: "4px" },
    brandTitleRow: { display: "flex", alignItems: "center", gap: "0.45rem" },
    brandTitle: { fontSize: "0.95rem", fontWeight: 700, color: terracotta },
    versionBadge: {
      fontSize: "0.65rem",
      fontWeight: 600,
      color: "#faf9f6",
      backgroundColor: gold,
      padding: "0.1rem 0.35rem",
      borderRadius: "4px",
    },
    navCenter: { display: "flex", alignItems: "center" },
    docChip: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f0ec",
      border: `1px solid ${borderCol}`,
      padding: "0.3rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.76rem",
      color: isDark ? "#e2e8f0" : "#4f5d53",
    },
    docChipTitle: {
      maxWidth: "240px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
      color: isDark ? "#f8fafc" : "#4f5d53",
      fontWeight: 600,
    },
    docChipDivider: { color: borderCol },
    docChipPages: { color: isDark ? "#94a3b8" : "#7c9381", fontSize: "0.72rem" },
    navRight: { display: "flex", alignItems: "center", gap: "0.4rem" },
    sidebarToggleBtn: {
      backgroundColor: "transparent",
      color: "#faf9f6",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "6px",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginRight: "0.25rem",
    },
    historyBtn: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#f1f0ec",
      color: isDark ? "#e2e8f0" : "#4f5d53",
      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.18)" : "#e5e3dc"}`,
      borderRadius: "6px",
      padding: "0.3rem 0.6rem",
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
      cursor: "pointer",
      fontSize: "0.82rem",
      marginLeft: "0.25rem",
    },
    themeToggleBtn: {
      backgroundColor: isDark ? "rgba(201, 168, 76, 0.18)" : "rgba(255, 255, 255, 0.15)",
      color: isDark ? "#e5c07b" : "#faf9f6",
      border: `1px solid ${isDark ? "rgba(201, 168, 76, 0.35)" : "rgba(255, 255, 255, 0.25)"}`,
      borderRadius: "6px",
      padding: "0.3rem 0.65rem",
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
      cursor: "pointer",
      fontSize: "0.8rem",
      fontWeight: 600,
      transition: "all 0.15s ease",
    },
    citationNavBtn: {
      backgroundColor: isDark ? "rgba(224, 122, 95, 0.16)" : "#ffffff",
      color: terracotta,
      border: `1px solid ${isDark ? "rgba(224, 122, 95, 0.3)" : "rgba(200, 80, 58, 0.3)"}`,
      borderRadius: "6px",
      padding: "0.3rem 0.65rem",
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
      cursor: "pointer",
      fontSize: "0.82rem",
      fontWeight: 600,
      transition: "all 0.15s ease",
    },
    drawerBackdrop: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      backdropFilter: "blur(4px)",
      zIndex: 999,
    },
    drawerPanel: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "300px",
      height: "100vh",
      backgroundColor: isDark ? "#12141a" : "#18181c",
      borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      boxShadow: "4px 0 24px rgba(0, 0, 0, 0.55)",
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.85rem 1rem",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    },
    drawerTitle: {
      fontSize: "0.95rem",
      fontWeight: 700,
      color: "#faf9f6",
    },
    drawerCloseBtn: {
      backgroundColor: "transparent",
      border: "none",
      color: "#a1a1aa",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.25rem",
      borderRadius: "4px",
    },
    drawerNewChatBtn: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.55rem 0.85rem",
      backgroundColor: terracotta,
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.85rem",
      fontWeight: 600,
      cursor: "pointer",
    },
    drawerList: {
      flex: 1,
      overflowY: "auto",
      padding: "0.4rem 0.6rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    drawerEmpty: {
      padding: "2rem 1rem",
      textAlign: "center" as const,
      color: "#a1a1aa",
      fontSize: "0.85rem",
    },
    drawerItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.6rem 0.7rem",
      borderRadius: "8px",
      cursor: "pointer",
      gap: "0.5rem",
      color: "#e4e4e7",
      fontSize: "0.83rem",
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
    },
    drawerItemTextWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      overflow: "hidden",
      flex: 1,
      color: "#d4d4d8",
    },
    drawerItemText: {
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    drawerDeleteBtn: {
      backgroundColor: "transparent",
      border: "none",
      color: "#a1a1aa",
      cursor: "pointer",
      padding: "0.2rem 0.35rem",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    drawerFooter: {
      padding: "0.8rem 1rem",
      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    drawerClearBtn: {
      backgroundColor: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      color: "#a1a1aa",
      borderRadius: "6px",
      padding: "0.35rem 0.6rem",
      fontSize: "0.76rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.35rem",
    },
    drawerStatus: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      fontSize: "0.72rem",
      color: "#71717a",
      justifyContent: "center",
    },
    copyBtn: {
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      backgroundColor: "transparent",
      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(79, 93, 83, 0.2)"}`,
      borderRadius: "4px",
      padding: "0.15rem 0.4rem",
      fontSize: "0.72rem",
      color: textMuted,
      cursor: "pointer",
    },
    speechBtn: {
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      backgroundColor: "transparent",
      border: `1px solid ${isDark ? "rgba(104, 139, 125, 0.35)" : "rgba(74, 96, 88, 0.25)"}`,
      borderRadius: "4px",
      padding: "0.15rem 0.45rem",
      fontSize: "0.72rem",
      color: isDark ? "#8cb3a3" : "#4A6058",
      cursor: "pointer",
      fontWeight: 600,
      transition: "all 0.15s ease",
    },
    speechBtnActive: {
      backgroundColor: "rgba(200, 80, 58, 0.15)",
      borderColor: terracotta,
      color: terracotta,
    },
    speedBtn: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(74, 96, 88, 0.08)",
      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(74, 96, 88, 0.25)"}`,
      borderRadius: "4px",
      padding: "0.15rem 0.35rem",
      fontSize: "0.68rem",
      color: isDark ? "#8cb3a3" : "#4A6058",
      cursor: "pointer",
      fontWeight: 700,
    },
    audioWaveBox: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2px",
      height: "12px",
      padding: "0 1px",
    },
    audioWaveLine: {
      width: "2.5px",
      height: "4px",
      backgroundColor: terracotta,
      borderRadius: "2px",
      display: "inline-block",
    },
    msgLocalBadge: {
      fontSize: "0.62rem",
      fontWeight: 600,
      color: isDark ? "#8cb3a3" : "#4A6058",
      backgroundColor: isDark ? "rgba(104, 139, 125, 0.2)" : "rgba(74, 96, 88, 0.12)",
      padding: "0.08rem 0.3rem",
      borderRadius: "4px",
      border: `1px solid ${isDark ? "rgba(104, 139, 125, 0.3)" : "rgba(74, 96, 88, 0.2)"}`,
    },
    exportBtn: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#ffffff",
      color: terracotta,
      border: `1px solid ${isDark ? "rgba(224, 122, 95, 0.3)" : "rgba(200, 80, 58, 0.3)"}`,
      borderRadius: "6px",
      padding: "0.3rem 0.65rem",
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
      cursor: "pointer",
      fontSize: "0.82rem",
      fontWeight: 600,
      transition: "all 0.15s ease",
    },
    kbdHint: {
      fontSize: "0.62rem",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.06)",
      color: textMuted,
      padding: "0.1rem 0.3rem",
      borderRadius: "4px",
      marginLeft: "0.25rem",
      fontFamily: "monospace",
      fontWeight: 600,
    },
    newChatBtn: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#f1f0ec",
      color: terracotta,
      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "#e5e3dc"}`,
      borderRadius: "6px",
      padding: "0.3rem 0.65rem",
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
      cursor: "pointer",
      fontSize: "0.82rem",
      fontWeight: 600,
    },
    statusPill: {
      display: "flex",
      alignItems: "center",
      gap: "0.45rem",
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      padding: "0.28rem 0.7rem",
      borderRadius: "9999px",
      marginLeft: "0.25rem",
    },
    statusDotLive: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      backgroundColor: "#10b981",
      boxShadow: "0 0 6px #10b981",
    },
    statusPillText: { fontSize: "0.72rem", fontWeight: 500, color: "#faf9f6" },
    workspace: { display: "flex", flex: 1, height: "calc(100vh - 54px)", overflow: "hidden" },
    pdfPane: {
      flex: "1 1 50%",
      backgroundColor: isDark ? "#12151d" : "#ffffff",
      borderRight: `1px solid ${borderCol}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    pdfViewerContainer: { display: "flex", flexDirection: "column", height: "100%" },
    pdfHeaderBar: {
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1rem",
      backgroundColor: isDark ? "#171a24" : "#fcfaf6",
      borderBottom: `1px solid ${borderCol}`,
    },
    paginationControls: { display: "flex", alignItems: "center", gap: "0.35rem" },
    iconBtn: {
      width: "28px",
      height: "28px",
      borderRadius: "6px",
      backgroundColor: "transparent",
      border: `1px solid ${borderCol}`,
      color: textMuted,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    pageDisplay: {
      fontSize: "0.76rem",
      color: textMuted,
      padding: "0 0.5rem",
      fontVariantNumeric: "tabular-nums" as const,
    },
    pdfHeaderActions: { display: "flex", alignItems: "center", gap: "0.5rem" },
    feedbackBadge: {
      fontSize: "0.7rem",
      fontWeight: 600,
      color: "#faf9f6",
      backgroundColor: terracotta,
      padding: "0.15rem 0.55rem",
      borderRadius: "9999px",
    },
    openExternalBtn: {
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
      fontSize: "0.72rem",
      color: "#faf9f6",
      textDecoration: "none",
      padding: "0.25rem 0.55rem",
      borderRadius: "6px",
      backgroundColor: sageDark,
    },
    switchDocBtn: {
      fontSize: "0.72rem",
      color: terracotta,
      padding: "0.25rem 0.6rem",
      borderRadius: "6px",
      border: `1px solid ${terracotta}`,
      backgroundColor: isDark ? "rgba(224, 122, 95, 0.12)" : "rgba(200, 80, 58, 0.08)",
      cursor: "pointer",
      fontWeight: 600,
    },
    closeDocBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem",
      fontSize: "0.72rem",
      color: isDark ? "#e2e8f0" : "#475569",
      padding: "0.25rem 0.6rem",
      borderRadius: "6px",
      border: isDark ? "1px solid rgba(255, 255, 255, 0.18)" : "1px solid rgba(0, 0, 0, 0.16)",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
      cursor: "pointer",
      fontWeight: 600,
      transition: "all 0.15s ease",
    },
    frameContainer: {
      flex: 1,
      height: "100%",
      backgroundColor: isDark ? "#12151d" : "#ffffff",
      position: "relative" as const,
    },
    iframeElement: { width: "100%", height: "100%", border: "none" },
    emptyUploadContainer: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    },
    uploadCard: {
      maxWidth: "440px",
      textAlign: "center",
      padding: "2.5rem 2rem",
      backgroundColor: bgCard,
      border: `1px solid ${borderCol}`,
      borderRadius: "18px",
      boxShadow: isDark
        ? "0 8px 32px rgba(0, 0, 0, 0.45)"
        : "0 8px 32px rgba(74, 96, 88, 0.08)",
    },
    uploadLogoWrapper: {
      width: "72px",
      height: "72px",
      margin: "0 auto 1.25rem auto",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 24px rgba(200, 80, 58, 0.18)",
      border: "2px solid rgba(200, 80, 58, 0.2)",
    },
    uploadLogoImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
    },
    uploadCardHeader: {
      fontSize: "1.2rem",
      fontWeight: 700,
      color: textMain,
      marginBottom: "0.5rem",
    },
    uploadCardBody: {
      fontSize: "0.84rem",
      color: textMuted,
      lineHeight: "1.55",
      marginBottom: "1.75rem",
    },
    dropzoneTrigger: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1.25rem 1rem",
      border: `1.5px dashed ${terracotta}`,
      borderRadius: "12px",
      backgroundColor: isDark ? "rgba(224, 122, 95, 0.08)" : "rgba(200, 80, 58, 0.04)",
      cursor: "pointer",
      transition: "all 0.15s ease",
    },
    dropzoneMainText: { fontSize: "0.9rem", fontWeight: 700, color: terracotta },
    dropzoneSubText: { fontSize: "0.72rem", color: textMuted, marginTop: "0.25rem" },
    techBadgesRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      marginTop: "1.5rem",
      flexWrap: "wrap" as const,
    },
    techBadge: {
      fontSize: "0.72rem",
      fontWeight: 600,
      color: isDark ? "#8cb3a3" : "#4A6058",
      backgroundColor: isDark ? "rgba(104, 139, 125, 0.18)" : "rgba(74, 96, 88, 0.08)",
      border: `1px solid ${isDark ? "rgba(104, 139, 125, 0.3)" : "rgba(74, 96, 88, 0.2)"}`,
      padding: "0.22rem 0.6rem",
      borderRadius: "9999px",
    },
    uploadNoticeText: { marginTop: "1rem", fontSize: "0.76rem", color: terracotta, fontWeight: 600 },
    uploadProgressCard: {
      maxWidth: "460px",
      width: "100%",
      backgroundColor: bgCard,
      border: `1px solid ${borderCol}`,
      borderRadius: "18px",
      padding: "2rem",
      boxShadow: isDark
        ? "0 12px 40px rgba(0, 0, 0, 0.55)"
        : "0 12px 40px rgba(74, 96, 88, 0.12)",
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
      textAlign: "left" as const,
    },
    uploadProgressHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    uploadIconPulsing: {
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      backgroundColor: isDark ? "rgba(224, 122, 95, 0.16)" : "rgba(200, 80, 58, 0.1)",
      color: terracotta,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      border: `1px solid ${isDark ? "rgba(224, 122, 95, 0.25)" : "rgba(200, 80, 58, 0.2)"}`,
    },
    uploadProgressMeta: {
      flex: 1,
      overflow: "hidden",
    },
    uploadProgressBadgeRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "0.25rem",
    },
    uploadProgressBadge: {
      fontSize: "0.68rem",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
      color: isDark ? "#8cb3a3" : "#4A6058",
      backgroundColor: isDark ? "rgba(104, 139, 125, 0.18)" : "rgba(74, 96, 88, 0.1)",
      padding: "0.15rem 0.45rem",
      borderRadius: "4px",
    },
    uploadProgressPercentBadge: {
      fontSize: "0.85rem",
      fontWeight: 700,
      fontFamily: "monospace",
      color: terracotta,
    },
    uploadProgressTitle: {
      fontSize: "1.05rem",
      fontWeight: 700,
      color: textMain,
      margin: 0,
    },
    uploadProgressFilename: {
      fontSize: "0.76rem",
      color: textMuted,
      marginTop: "0.15rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    },
    progressBarTrack: {
      width: "100%",
      height: "9px",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(74, 96, 88, 0.12)",
      borderRadius: "9999px",
      overflow: "hidden",
      position: "relative" as const,
    },
    progressBarFill: {
      height: "100%",
      borderRadius: "9999px",
      background: "linear-gradient(90deg, #C8503A 0%, #E07A5F 50%, #C9A84C 100%)",
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 0 10px rgba(200, 80, 58, 0.45)",
    },
    progressMetricsRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "0.74rem",
      color: textMuted,
    },
    progressStageLabel: {
      display: "flex",
      alignItems: "center",
      gap: "0.45rem",
      color: textMain,
      fontWeight: 600,
    },
    progressStageDot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      backgroundColor: terracotta,
      display: "inline-block",
      boxShadow: `0 0 6px ${terracotta}`,
    },
    progressEtaLabel: {
      fontSize: "0.72rem",
      color: textMuted,
      fontWeight: 600,
    },
    progressStepsRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.55rem 0",
      borderTop: `1px solid ${borderCol}`,
      borderBottom: `1px solid ${borderCol}`,
    },
    progressStepItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      fontSize: "0.7rem",
      color: textMuted,
      fontWeight: 500,
      transition: "color 0.2s ease",
    },
    progressStepActive: {
      color: terracotta,
      fontWeight: 700,
    },
    stepDot: {
      width: "17px",
      height: "17px",
      borderRadius: "50%",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f0ec",
      color: textMuted,
      fontSize: "0.62rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      transition: "all 0.2s ease",
    },
    stepDotDone: {
      backgroundColor: terracotta,
      color: "#ffffff",
    },
    progressFooterRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.45rem",
      flexWrap: "wrap" as const,
    },
    replaceProgressOverlay: {
      position: "absolute" as const,
      inset: 0,
      backgroundColor: isDark ? "rgba(15, 17, 23, 0.85)" : "rgba(250, 249, 246, 0.85)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 50,
      padding: "1.5rem",
    },
    replaceProgressCard: {
      maxWidth: "420px",
      width: "100%",
      backgroundColor: bgCard,
      border: `1px solid ${borderCol}`,
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: isDark
        ? "0 12px 36px rgba(0, 0, 0, 0.65)"
        : "0 12px 36px rgba(74, 96, 88, 0.15)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    chatPane: {
      flex: "1 1 50%",
      backgroundColor: bgPane,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    },
    actionStrip: {
      height: "46px",
      display: "flex",
      alignItems: "center",
      gap: "0.55rem",
      padding: "0 1.25rem",
      backgroundColor: bgCard,
      borderBottom: `1px solid ${borderCol}`,
      overflowX: "auto",
    },
    actionPillPrimary: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.35rem 0.8rem",
      backgroundColor: terracotta,
      border: "none",
      borderRadius: "9999px",
      color: "#faf9f6",
      fontSize: "0.76rem",
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap" as const,
    },
    actionPillAudio: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.35rem 0.75rem",
      backgroundColor: isDark ? "rgba(104, 139, 125, 0.18)" : "rgba(74, 96, 88, 0.08)",
      border: `1px solid ${isDark ? "rgba(104, 139, 125, 0.3)" : "rgba(74, 96, 88, 0.25)"}`,
      borderRadius: "9999px",
      color: isDark ? "#a7d1c1" : "#4A6058",
      fontSize: "0.76rem",
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap" as const,
      transition: "all 0.15s ease",
    },
    actionPillAudioActive: {
      backgroundColor: terracotta,
      borderColor: terracotta,
      color: "#faf9f6",
    },
    voiceSelectWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      backgroundColor: isDark ? "#171a24" : "#ffffff",
      border: `1px solid ${borderCol}`,
      borderRadius: "9999px",
      padding: "0.2rem 0.55rem",
      height: "28px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    voiceSelectLabel: {
      fontSize: "0.68rem",
      color: textMuted,
      fontWeight: 600,
      userSelect: "none" as const,
      whiteSpace: "nowrap" as const,
    },
    voiceSelect: {
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      fontSize: "0.72rem",
      color: isDark ? "#e2e8f0" : "#4A6058",
      fontWeight: 600,
      cursor: "pointer",
      maxWidth: "140px",
    },
    msgVoiceSelect: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(74, 96, 88, 0.08)",
      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(74, 96, 88, 0.25)"}`,
      borderRadius: "4px",
      padding: "0.15rem 0.35rem",
      fontSize: "0.68rem",
      color: isDark ? "#8cb3a3" : "#4A6058",
      fontWeight: 600,
      cursor: "pointer",
      outline: "none",
      maxWidth: "115px",
    },
    actionPillGroup: { display: "flex", gap: "0.45rem" },
    actionPillSecondary: {
      padding: "0.32rem 0.7rem",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f0ec",
      border: `1px solid ${borderCol}`,
      borderRadius: "9999px",
      color: textMain,
      fontSize: "0.74rem",
      fontWeight: 600,
      cursor: "pointer",
      whiteSpace: "nowrap" as const,
    },
    depthSelectorGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      backgroundColor: isDark ? "#171a24" : "#f1f0ec",
      border: `1px solid ${borderCol}`,
      padding: "2px 4px",
      borderRadius: "9999px",
      marginLeft: "0.25rem",
    },
    depthGroupLabel: {
      fontSize: "0.68rem",
      fontWeight: 700,
      color: textMuted,
      padding: "0 0.35rem",
      textTransform: "uppercase" as const,
      letterSpacing: "0.03em",
      userSelect: "none" as const,
    },
    depthPill: {
      padding: "0.22rem 0.55rem",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "9999px",
      color: textMuted,
      fontSize: "0.72rem",
      fontWeight: 600,
      cursor: "pointer",
      whiteSpace: "nowrap" as const,
      transition: "all 0.15s ease",
    },
    depthPillActive: {
      backgroundColor: terracotta,
      color: "#ffffff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    },
    starterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
      gap: "0.75rem",
      marginTop: "0.75rem",
      marginBottom: "1rem",
    },
    starterCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: "0.65rem",
      padding: "0.85rem 1rem",
      backgroundColor: bgCard,
      border: `1px solid ${borderCol}`,
      borderRadius: "12px",
      cursor: "pointer",
      textAlign: "left" as const,
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(74, 96, 88, 0.04)",
      transition: "all 0.15s ease",
    },
    starterIcon: {
      fontSize: "1.2rem",
      lineHeight: 1,
      marginTop: "0.1rem",
    },
    starterTextWrapper: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.2rem",
      flex: 1,
    },
    starterCardTitle: {
      fontSize: "0.82rem",
      fontWeight: 700,
      color: textMain,
    },
    starterCardDesc: {
      fontSize: "0.72rem",
      color: textMuted,
      lineHeight: 1.35,
    },
    chatScrollArea: {
      flex: 1,
      overflowY: "auto",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    messageRow: { display: "flex", width: "100%" },
    messageContainer: {
      maxWidth: "88%",
      borderRadius: "14px",
      padding: "1.1rem 1.35rem",
      boxShadow: isDark ? "0 2px 10px rgba(0, 0, 0, 0.35)" : "0 2px 10px rgba(74, 96, 88, 0.05)",
    },
    userContainer: { backgroundColor: sageDark, color: "#faf9f6" },
    assistantContainer: {
      backgroundColor: bgCard,
      border: `1px solid ${borderCol}`,
      color: textMain,
    },
    msgMetaRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.55rem",
    },
    msgRoleLabel: {
      fontSize: "0.74rem",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
    },
    msgTimeLabel: { fontSize: "0.68rem", color: textMuted },
    msgBody: { wordBreak: "break-word" as const, lineHeight: "1.6" },
    citationsSection: {
      marginTop: "1.1rem",
      paddingTop: "0.85rem",
      borderTop: `1px solid ${borderCol}`,
    },
    citationsHeaderLine: { marginBottom: "0.55rem" },
    citationsSectionTitle: {
      fontSize: "0.7rem",
      fontWeight: 700,
      color: textMuted,
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
    },
    citationsGrid: { display: "flex", flexWrap: "wrap", gap: "0.45rem" },
    citationChip: {
      display: "flex",
      alignItems: "center",
      gap: "0.45rem",
      backgroundColor: bgCardSecondary,
      border: `1px solid ${borderCol}`,
      borderRadius: "8px",
      padding: "0.3rem 0.65rem",
      cursor: "pointer",
      textAlign: "left" as const,
    },
    citationChipActive: {
      backgroundColor: "rgba(200, 80, 58, 0.12)",
      borderColor: terracotta,
    },
    citationBadge: {
      fontSize: "0.68rem",
      fontWeight: 700,
      color: "#faf9f6",
      backgroundColor: terracotta,
      padding: "0.1rem 0.35rem",
      borderRadius: "4px",
      fontFamily: "monospace",
    },
    citationSnippetText: {
      fontSize: "0.7rem",
      color: textMuted,
      maxWidth: "180px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    },
    generatingRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      color: textMuted,
      fontSize: "0.82rem",
    },
    generatingDot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      backgroundColor: terracotta,
    },
    generatingText: { fontSize: "0.8rem", color: textMuted },
    inputDockWrapper: { padding: "0.85rem 1.5rem 1rem", backgroundColor: "transparent" },
    inputDock: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      backgroundColor: bgInput,
      border: `1px solid ${borderCol}`,
      borderRadius: "14px",
      padding: "0.45rem 0.6rem 0.45rem 1rem",
      boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.45)" : "0 4px 20px rgba(74, 96, 88, 0.08)",
    },
    dockInputField: {
      flex: 1,
      backgroundColor: "transparent",
      border: "none",
      color: textMain,
      fontSize: "0.88rem",
      outline: "none",
      fontFamily: "inherit",
    },
    dockSubmitBtn: {
      width: "32px",
      height: "32px",
      borderRadius: "10px",
      backgroundColor: terracotta,
      border: "none",
      color: "#faf9f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    inputFooterRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      fontSize: "0.68rem",
      color: textMuted,
      marginTop: "0.5rem",
    },
    modalBackdrop: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
    },
    citationModal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "min(640px, 92vw)",
      maxHeight: "88vh",
      backgroundColor: bgCard,
      border: `1px solid ${borderCol}`,
      borderRadius: "16px",
      padding: "1.5rem",
      zIndex: 1001,
      display: "flex",
      flexDirection: "column",
      boxShadow: isDark
        ? "0 16px 48px rgba(0, 0, 0, 0.65)"
        : "0 16px 48px rgba(74, 96, 88, 0.18)",
      overflowY: "auto",
    },
    citationModalHeader: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "1rem",
    },
    citationIconCircle: {
      width: "36px",
      height: "36px",
      borderRadius: "10px",
      backgroundColor: isDark ? "rgba(224, 122, 95, 0.15)" : "rgba(200, 80, 58, 0.1)",
      color: terracotta,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    citationModalTitle: {
      fontSize: "1.05rem",
      fontWeight: 700,
      color: textMain,
      margin: 0,
    },
    citationModalSubtitle: {
      fontSize: "0.75rem",
      color: textMuted,
      marginTop: "0.2rem",
    },
    modalCloseBtn: {
      backgroundColor: "transparent",
      border: "none",
      color: textMuted,
      cursor: "pointer",
      padding: "0.3rem",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    citationTabsRow: {
      display: "flex",
      gap: "0.4rem",
      marginBottom: "1rem",
      borderBottom: `1px solid ${borderCol}`,
      paddingBottom: "0.5rem",
    },
    citationTabBtn: {
      padding: "0.35rem 0.75rem",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "6px",
      color: textMuted,
      fontSize: "0.78rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.15s ease",
    },
    citationTabBtnActive: {
      backgroundColor: isDark ? "rgba(224, 122, 95, 0.18)" : "rgba(200, 80, 58, 0.12)",
      color: terracotta,
      fontWeight: 700,
    },
    citationCodeBox: {
      backgroundColor: isDark ? "#0f1117" : "#f5f3ee",
      border: `1px solid ${borderCol}`,
      borderRadius: "10px",
      padding: "1rem",
      maxHeight: "220px",
      overflowY: "auto",
      marginBottom: "1rem",
    },
    citationPre: {
      margin: 0,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.78rem",
      color: textMain,
      whiteSpace: "pre-wrap" as const,
      wordBreak: "break-all" as const,
      lineHeight: 1.5,
    },
    citationActionsRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      flexWrap: "wrap" as const,
    },
    citationCopyBtn: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.5rem 1rem",
      backgroundColor: terracotta,
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.82rem",
      fontWeight: 600,
      cursor: "pointer",
    },
    citationDownloadBtn: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.5rem 0.85rem",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f0ec",
      color: textMain,
      border: `1px solid ${borderCol}`,
      borderRadius: "8px",
      fontSize: "0.82rem",
      fontWeight: 600,
      cursor: "pointer",
    },
    citationEditToggleBtn: {
      padding: "0.5rem 0.85rem",
      backgroundColor: "transparent",
      color: textMuted,
      border: `1px solid ${borderCol}`,
      borderRadius: "8px",
      fontSize: "0.8rem",
      fontWeight: 600,
      cursor: "pointer",
      marginLeft: "auto",
    },
    citationMetaForm: {
      marginTop: "1.2rem",
      paddingTop: "1rem",
      borderTop: `1px dashed ${borderCol}`,
    },
    citationMetaGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.75rem",
    },
    metaLabel: {
      display: "block",
      fontSize: "0.72rem",
      fontWeight: 600,
      color: textMuted,
      marginBottom: "0.25rem",
    },
    metaInput: {
      width: "100%",
      padding: "0.4rem 0.6rem",
      backgroundColor: isDark ? "#0f1117" : "#ffffff",
      border: `1px solid ${borderCol}`,
      borderRadius: "6px",
      color: textMain,
      fontSize: "0.78rem",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box" as const,
    },
    viewModeToggleBtn: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f0ec",
      border: `1px solid ${borderCol}`,
      color: textMain,
      borderRadius: "6px",
      padding: "0.22rem 0.55rem",
      fontSize: "0.74rem",
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      cursor: "pointer",
      transition: "all 0.15s ease",
    },
    viewModeToggleBtnActive: {
      backgroundColor: isDark ? "rgba(224, 122, 95, 0.22)" : "rgba(200, 80, 58, 0.12)",
      borderColor: terracotta,
      color: terracotta,
      fontWeight: 600,
    },
    bboxSpotlightBanner: {
      backgroundColor: isDark ? "rgba(224, 122, 95, 0.12)" : "#fffbf5",
      borderBottom: `1px solid ${isDark ? "rgba(224, 122, 95, 0.3)" : "rgba(200, 80, 58, 0.25)"}`,
      padding: "0.45rem 0.85rem",
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.25rem",
      zIndex: 10,
    },
    bboxSpotlightHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    bboxSpotlightPill: {
      backgroundColor: terracotta,
      color: "#ffffff",
      padding: "0.1rem 0.4rem",
      borderRadius: "4px",
      fontSize: "0.68rem",
      fontWeight: 700,
      letterSpacing: "0.02em",
    },
    bboxSpotlightVerified: {
      color: isDark ? "#4ade80" : "#16a34a",
      fontSize: "0.72rem",
      fontWeight: 600,
    },
    bboxSnippetText: {
      color: textMain,
      fontSize: "0.76rem",
      fontStyle: "italic",
      lineHeight: 1.4,
      maxHeight: "3.2em",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    bboxMiniBtn: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f0ec",
      border: `1px solid ${borderCol}`,
      color: textMain,
      borderRadius: "4px",
      padding: "0.15rem 0.45rem",
      fontSize: "0.7rem",
      cursor: "pointer",
    },
    bboxMiniBtnActive: {
      backgroundColor: terracotta,
      color: "#ffffff",
      borderColor: terracotta,
    },
    bboxCloseBtn: {
      backgroundColor: "transparent",
      border: "none",
      color: textMuted,
      cursor: "pointer",
      padding: "0.1rem",
      display: "flex",
      alignItems: "center",
    },
    canvasContainer: {
      width: "100%",
      height: "100%",
      overflow: "auto",
      display: "flex",
      justifyContent: "center",
      backgroundColor: isDark ? "#12151d" : "#e8e6e1",
      padding: "1rem",
    },
    canvasWrapper: {
      position: "relative" as const,
      boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 28px rgba(0,0,0,0.12)",
      borderRadius: "4px",
      overflow: "hidden",
      height: "fit-content",
    },
    canvasImg: {
      display: "block",
      maxWidth: "100%",
      height: "auto",
      borderRadius: "4px",
    },
  };
};
