"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NectarOrbs } from "@/components/nectar-orbs";
import {
  ClipboardPaste,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Copy,
  Check,
} from "lucide-react";

interface PlatformResult {
  platform: string;
  status: "pass" | "warn" | "fail";
  flagged_phrases: string[];
  reason: string;
  safer_rewrite: string;
}

const ALL_PLATFORMS = [
  "TikTok",
  "Instagram",
  "Facebook",
  "Reddit",
  "X",
  "Pinterest",
  "Snapchat",
  "Discord",
  "Telegram",
] as const;

type PlatformName = (typeof ALL_PLATFORMS)[number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

const STATUS_PILL = {
  pass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  warn: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  fail: "bg-red-500/15 text-red-400 border-red-500/25",
};

const STATUS_ICON = {
  pass: ShieldCheck,
  warn: ShieldAlert,
  fail: ShieldX,
};

const STATUS_LABEL = {
  pass: "Pass",
  warn: "Warning",
  fail: "Fail",
};

function ResultCard({
  result,
  index,
}: {
  result: PlatformResult;
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isPass = result.status === "pass";
  const Icon = STATUS_ICON[result.status];
  const pill = STATUS_PILL[result.status];
  const label = STATUS_LABEL[result.status];

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className={
        isPass
          ? "rounded-xl border border-border/40 border-l-2 border-l-emerald-500/30 bg-surface p-5 sm:p-6"
          : result.status === "fail"
            ? "rounded-xl border border-red-500/20 border-l-2 border-l-red-500/50 bg-red-500/[0.03] p-5 sm:p-6"
            : "rounded-xl border border-amber-500/20 border-l-2 border-l-amber-500/40 bg-amber-500/[0.03] p-5 sm:p-6"
      }
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${pill}`}>
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-mono text-sm font-medium text-foreground">{result.platform}</span>
      </div>

      {isPass ? (
        <p className="text-sm text-muted-foreground">Clear to post.</p>
      ) : (
        <div className="space-y-3">
          {result.flagged_phrases.length > 0 && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Flagged Phrases</p>
              <div className="flex flex-wrap gap-1.5">
                {result.flagged_phrases.map((phrase, i) => (
                  <span key={i} className="inline-block rounded-md bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs text-red-300 font-mono">
                    &ldquo;{phrase}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">{result.reason}</p>

          {result.safer_rewrite && result.safer_rewrite.trim() && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-electric mb-1.5">Safer Rewrite</p>
              <div className="rounded-lg bg-surface border border-border/40 p-4">
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{result.safer_rewrite}</p>
              </div>
              <button
                onClick={() => handleCopy(result.safer_rewrite)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-5 h-9 text-xs transition-colors cursor-pointer"
              >
                {copied ? <><Check className="h-3.5 w-3.5" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy Safer Version</>}
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function PlatformChip({
  platform,
  selected,
  onToggle,
}: {
  platform: PlatformName;
  selected: boolean;
  onToggle: (p: PlatformName) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(platform)}
      className={selected
        ? "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border bg-electric/10 text-electric border-electric/30 transition-all cursor-pointer"
        : "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border bg-surface text-muted-foreground border-border/40 hover:text-foreground hover:border-border/60 transition-all cursor-pointer"}
    >
      <span className={selected ? "h-1.5 w-1.5 rounded-full bg-electric" : "h-1.5 w-1.5 rounded-full bg-muted-foreground/30"} />
      {platform}
    </button>
  );
}

function ScannerInner() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformName>>(new Set(ALL_PLATFORMS));
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<PlatformResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prefill = searchParams.get("content");
    if (prefill) {
      try {
        setContent(decodeURIComponent(prefill));
      } catch {
        /* invalid encoding */
      }
    }

    const platforms = searchParams.get("platforms");
    if (platforms) {
      try {
        const parsed = JSON.parse(decodeURIComponent(platforms)) as string[];
        const valid = parsed.filter((p) => (ALL_PLATFORMS as readonly string[]).includes(p)) as PlatformName[];
        if (valid.length > 0) setSelectedPlatforms(new Set(valid));
      } catch {
        /* invalid JSON */
      }
    }
  }, [searchParams]);

  function togglePlatform(p: PlatformName) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
    setResults(null);
  }

  async function handleScan() {
    if (isScanning) return;
    if (content.trim().length < 10) {
      setError("Please paste at least 10 characters of content to scan.");
      return;
    }
    if (selectedPlatforms.size === 0) {
      setError("Please select at least one platform.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), platforms: Array.from(selectedPlatforms) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed with status ${res.status}`);
      if (data.data) setResults(data.data);
      else throw new Error("No data received from the scan endpoint.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Scan failed.");
    } finally {
      setIsScanning(false);
    }
  }

  const hasAnyFail = results?.some((r) => r.status === "fail") ?? false;
  const issueCount = results?.filter((r) => r.status !== "pass").length ?? 0;
  const totalScanned = results?.length ?? 0;

  return (
    <>
      <NectarOrbs />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-24 pb-8">
        <motion.p className="font-mono text-xs tracking-widest uppercase text-electric mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Compliance Scanner
        </motion.p>
        <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          Paste a post. Pick platforms. Get Pass / Warning / Fail + a safer rewrite.
        </motion.h1>
        <motion.p className="mt-4 text-muted-foreground max-w-xl text-base sm:text-lg leading-relaxed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          Check before you post. One bad phrase can cost the account.
        </motion.p>
      </section>

      <Separator className="bg-border/40" />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div className="space-y-6" initial="hidden" animate="visible">
          <motion.div variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardPaste className="h-4 w-4 text-electric" />
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Paste Your Content</p>
            </div>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setResults(null); }}
              className="w-full h-48 sm:h-56 rounded-xl border border-border/60 bg-surface text-foreground/80 font-mono text-sm p-5 resize-none focus:outline-none focus:ring-1 focus:ring-electric/30"
              placeholder={'Paste your social post, ad copy, or any content here...\n\nExample:\n"Lose weight fast with this guaranteed supplement! Act now - free trial, no risk. Click here to sign up and start seeing results today!"'}
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Select Platforms</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlatforms(selectedPlatforms.size === ALL_PLATFORMS.length ? new Set() : new Set(ALL_PLATFORMS));
                  setResults(null);
                }}
                className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {selectedPlatforms.size === ALL_PLATFORMS.length ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_PLATFORMS.map((p) => <PlatformChip key={p} platform={p} selected={selectedPlatforms.has(p)} onToggle={togglePlatform} />)}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="w-full sm:w-auto bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isScanning ? <><Loader2 className="h-4 w-4 animate-spin" />Scanning {selectedPlatforms.size} platforms...</> : <><ShieldCheck className="h-4 w-4" />Scan {selectedPlatforms.size} Platform{selectedPlatforms.size !== 1 ? "s" : ""}</>}
              </button>
              {!isScanning && selectedPlatforms.size > 0 && (
                <span className="text-xs text-muted-foreground/60 font-mono hidden sm:inline">One AI check · usually under 45s</span>
              )}
            </div>

            {isScanning && (
              <div className="space-y-2">
                <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                  <motion.div
                    className="h-full w-1/3 rounded-full bg-electric"
                    initial={{ x: "-100%" }}
                    animate={{ x: "300%" }}
                    transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground/60 font-mono">One grounded AI request is checking the selected platforms together.</p>
              </div>
            )}
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      <AnimatePresence>
        {results && results.length > 0 && (
          <>
            <Separator className="bg-border/40" />
            <motion.section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-8">
                <p className="font-mono text-xs tracking-widest uppercase text-electric mb-3">Scan Results</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {issueCount === 0 ? `${totalScanned} of ${totalScanned} platforms - all clear` : `${issueCount} of ${totalScanned} platforms need changes before you post`}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground/70 leading-relaxed">This is guidance based on observed platform patterns, not a guarantee of approval. Always verify current platform policies before publishing.</p>
              </div>

              <div className="space-y-4">
                {results.map((result, i) => <ResultCard key={result.platform} result={result} index={i} />)}
              </div>

              {hasAnyFail && (
                <motion.p className="mt-6 text-sm text-red-400/90 font-medium text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  Fix these, then post. This is the difference between traffic and a ban.
                </motion.p>
              )}
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-6 w-6 animate-spin text-electric" /></div>}>
      <ScannerInner />
    </Suspense>
  );
}
