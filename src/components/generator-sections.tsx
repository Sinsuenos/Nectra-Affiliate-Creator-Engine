"use client";

import { useState } from "react";
import { Check, Pencil, Copy, ShieldCheck } from "lucide-react";
import type { PromoAngle, SocialPost, Headline, CTA, ComplianceNote } from "@/lib/generator-toolkit";

/* ------------------------------------------------------------------ */
/*  EDITABLE CHIP                                                      */
/* ------------------------------------------------------------------ */
export function EditableChip({
  field,
  isDemo,
}: {
  field: { key: string; label: string; value: string };
  isDemo?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(field.value);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/60 px-4 py-2.5">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground w-28 shrink-0">
        {field.label}
      </span>
      {editing ? (
        <input
          className="flex-1 bg-transparent text-sm text-foreground font-mono outline-none border-b border-electric/40 pb-0.5"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-sm font-mono ${val ? "text-foreground" : "text-muted-foreground/50"}`}
        >
          {val || "—"}
        </span>
      )}
      {!isDemo && (
        <button
          onClick={() => setEditing(!editing)}
          className="shrink-0 p-1 rounded text-muted-foreground hover:text-electric transition-colors"
          aria-label={editing ? "Save" : "Edit"}
        >
          {editing ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Pencil className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  OUTPUT SECTION COMPONENTS                                          */
/* ------------------------------------------------------------------ */

export const OUTPUT_SECTIONS = [
  { id: "angles", label: "Angles" },
  { id: "posts", label: "Social Posts" },
  { id: "headlines", label: "Headlines" },
  { id: "body", label: "Body Copy" },
  { id: "ctas", label: "CTAs" },
  { id: "compliance", label: "Compliance" },
] as const;

export function PromoAnglesSection({ angles }: { angles: PromoAngle[] }) {
  return (
    <div id="gen-angles">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        Promo Angles
      </p>
      <div className="space-y-4">
        {angles.map((angle, i) => (
          <div
            key={angle.angle}
            className="rounded-lg bg-surface border border-border/40 p-5 hover:border-border/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] uppercase text-electric">
                Angle {i + 1}
              </span>
              <span className="h-px flex-1 bg-border/30" />
              <span className="font-mono text-xs text-foreground font-medium">
                {angle.angle}
              </span>
              <CopyButton text={`${angle.hook}\n\n${angle.body}`} />
            </div>
            <p className="text-sm text-foreground font-medium mb-2">
              {angle.hook}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {angle.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  "X": 280,
  "TikTok": 2200,
  "Instagram": 2200,
  "Facebook": 63206,
  "Reddit": 40000,
  "Pinterest": 500,
  "Snapchat": 250,
  "Discord": 2000,
  "Telegram": 4096,
};

function CharBadge({ count, platform }: { count: number; platform: string }) {
  const limit = PLATFORM_CHAR_LIMITS[platform];
  if (!limit) return <span className="font-mono text-[11px] text-muted-foreground/70">{count} chars</span>;
  const ratio = count / limit;
  const over = count > limit;
  const color = over ? "text-red-400 bg-red-500/10 border-red-500/20" : ratio > 0.85 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-mono text-[10px] font-semibold tracking-wide ${color}`}>
      {over && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />}
      {count}<span className="text-muted-foreground/50">/{limit}</span>
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono text-muted-foreground/60 hover:text-electric hover:bg-electric/[0.06] border border-transparent hover:border-electric/20 transition-all cursor-pointer"
      aria-label="Copy"
    >
      {copied ? <><Check className="h-3 w-3 text-emerald-400" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
    </button>
  );
}

export function SocialPostsSection({ posts }: { posts: SocialPost[] }) {
  return (
    <div id="gen-posts">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        Social Posts
      </p>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.platform}
            className="rounded-lg bg-surface border border-border/40 p-5 hover:border-border/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-electric font-semibold">
                {post.platform}
              </span>
              <span className="h-px flex-1 bg-border/30" />
              <CharBadge count={post.character_count} platform={post.platform} />
              <CopyButton text={post.text} />
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {post.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeadlinesSection({ headlines }: { headlines: Headline[] }) {
  return (
    <div id="gen-headlines">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        Headlines
      </p>
      <div className="space-y-4">
        {headlines.map((h) => (
          <div
            key={h.variant}
            className="rounded-lg bg-surface border border-border/40 p-5 hover:border-border/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] uppercase text-electric">
                Variant {h.variant}
              </span>
              <span className="h-px flex-1 bg-border/30" />
              <CopyButton text={h.text} />
            </div>
            <p className="text-sm text-foreground font-medium">{h.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BodyCopySection({ text }: { text: string }) {
  return (
    <div id="gen-body">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Body Copy
        </p>
        <CopyButton text={text} />
      </div>
      <div className="rounded-lg bg-surface border border-border/40 p-5 hover:border-border/60 transition-colors">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {text}
        </p>
      </div>
    </div>
  );
}

export function CTASection({ ctas }: { ctas: CTA[] }) {
  return (
    <div id="gen-ctas">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        CTA Variations
      </p>
      <div className="space-y-4">
        {ctas.map((cta) => (
          <div
            key={cta.id}
            className="rounded-lg bg-surface border border-border/40 p-5 hover:border-border/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] uppercase text-electric">
                {cta.id}
              </span>
              <span className="h-px flex-1 bg-border/30" />
              <span className="font-mono text-[10px] text-muted-foreground/70 bg-surface-raised px-2 py-0.5 rounded border border-border/30">
                {cta.tone}
              </span>
              <CopyButton text={cta.text} />
            </div>
            <p className="text-sm text-foreground font-medium">{cta.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const COMPLIANCE_RISK_MAP: Record<string, "LOW" | "MEDIUM" | "HIGH"> = {
  "X": "LOW",
  "TikTok": "MEDIUM",
  "Instagram": "MEDIUM",
  "Facebook": "MEDIUM",
  "Reddit": "HIGH",
  "Pinterest": "LOW",
  "Snapchat": "MEDIUM",
  "Discord": "MEDIUM",
  "Telegram": "MEDIUM",
  "Google Ads": "MEDIUM",
};

const RISK_BORDER: Record<string, string> = {
  LOW: "border-l-emerald-400/30",
  MEDIUM: "border-l-amber-400/30",
  HIGH: "border-l-red-400/40",
};

const RISK_DOT: Record<string, string> = {
  LOW: "bg-emerald-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-red-400",
};

const RISK_TEXT: Record<string, string> = {
  LOW: "text-emerald-400",
  MEDIUM: "text-amber-400",
  HIGH: "text-red-400",
};

export function ComplianceSection({ notes }: { notes: ComplianceNote[] }) {
  return (
    <div id="gen-compliance">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-4 w-4 text-amber-400" />
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Compliance Notes
        </p>
      </div>
      <div className="space-y-4">
        {notes.map((note) => {
          const platformKey = Object.keys(COMPLIANCE_RISK_MAP).find((k) =>
            note.platform.toLowerCase().includes(k.toLowerCase()),
          );
          const risk = platformKey ? COMPLIANCE_RISK_MAP[platformKey] : "MEDIUM";
          return (
            <div
              key={note.platform}
              className={`rounded-lg bg-surface border border-border/40 border-l-2 ${RISK_BORDER[risk]} p-5 hover:border-border/60 transition-colors`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-block h-2 w-2 rounded-full ${RISK_DOT[risk]}`} />
                <span className="font-mono text-xs text-foreground font-medium">
                  {note.platform}
                </span>
                <span className={`ml-auto font-mono text-[10px] font-semibold tracking-wider ${RISK_TEXT[risk]}`}>{risk}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {note.note}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
