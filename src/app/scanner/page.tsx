"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NectarOrbs } from "@/components/nectar-orbs";
import { BottomNavRow } from "@/components/BottomNavRow";
import {
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Copy,
  Check,
  FileText,
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
  hidden: { opacity: 0, y: 20, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
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
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-base font-semibold border ${pill}`}>
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-mono text-lg font-medium text-foreground">{result.platform}</span>
      </div>

      {isPass ? (
        <div className="flex items-center gap-2">
          <p className="text-lg text-muted-foreground">Clear to post.</p>
          <button
            onClick={() => handleCopy(result.reason || 'Clear to post.')}
            className="shrink-0 ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-mono text-muted-foreground/80 hover:text-electric hover:bg-electric/[0.06] border border-transparent hover:border-electric/20 transition-all cursor-pointer"
            aria-label="Copy"
          >
            {copied ? <><Check className="h-3 w-3 text-emerald-400" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {result.flagged_phrases.length > 0 && (
            <div>
              <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-1.5">Flagged Phrases</p>
              <div className="flex flex-wrap gap-1.5">
                {result.flagged_phrases.map((phrase, i) => (
                  <span key={i} className="inline-block rounded-md bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-base text-red-300 font-mono">
                    &ldquo;{phrase}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-lg text-muted-foreground leading-relaxed">{result.reason}</p>

          {result.safer_rewrite && result.safer_rewrite.trim() && (
            <div>
              <p className="font-mono text-sm uppercase tracking-wider text-electric mb-1.5">Safer Rewrite</p>
              <div className="rounded-lg bg-surface border border-border/40 p-4">
                <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">{result.safer_rewrite}</p>
              </div>
              <button
                onClick={() => handleCopy(result.safer_rewrite)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-5 h-9 text-base transition-colors cursor-pointer"
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
        ? "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-base font-mono font-medium border bg-electric/10 text-electric border-electric/30 transition-all cursor-pointer"
        : "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-base font-mono font-medium border bg-surface text-muted-foreground border-border/40 hover:text-foreground hover:border-border/60 transition-all cursor-pointer"}
    >
      <span className={selected ? "h-1.5 w-1.5 rounded-full bg-electric" : "h-1.5 w-1.5 rounded-full bg-muted-foreground/30"} />
      {platform}
    </button>
  );
}

function ScannerInner() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState("");
  const DEFAULT_PLATFORMS: PlatformName[] = ["TikTok", "Instagram", "Facebook"];
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformName>>(new Set(DEFAULT_PLATFORMS));
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<PlatformResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("nectar_scan_payload");
      if (raw) {
        const parsed = JSON.parse(raw) as { content?: string; platforms?: string[] };
        if (typeof parsed.content === "string" && parsed.content.trim().length >= 10) {
          setContent(parsed.content);
        }
        if (Array.isArray(parsed.platforms)) {
          const valid = parsed.platforms.filter((p) =>
            (ALL_PLATFORMS as readonly string[]).includes(p),
          ) as PlatformName[];
          if (valid.length > 0) setSelectedPlatforms(new Set(valid));
        }
      }
    } catch {
      /* sessionStorage unavailable */
    }

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
      let data: { error?: string; data?: PlatformResult[] };
      try {
        data = await res.json();
      } catch {
        throw new Error(`The server returned an invalid response (HTTP ${res.status}). Please try again.`);
      }
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
  const passCount = results?.filter((r) => r.status === "pass").length ?? 0;
  const warnCount = results?.filter((r) => r.status === "warn").length ?? 0;
  const failCount = results?.filter((r) => r.status === "fail").length ?? 0;

  const [allCopied, setAllCopied] = useState(false);
  function handleCopyAll() {
    if (!results) return;
    const lines = results.map((r) => {
      const icon = r.status === "pass" ? "PASS" : r.status === "warn" ? "WARN" : "FAIL";
      const line = `[${icon}] ${r.platform}`;
      if (r.status === "pass") return `${line}: Clear to post.`;
      let detail = `${line}: ${r.reason}`;
      if (r.flagged_phrases.length > 0) detail += '\n  Flagged: ' + r.flagged_phrases.map((p) => '\u201c' + p + '\u201d').join(', ');
      if (r.safer_rewrite && r.safer_rewrite.trim()) detail += `\n  Safer: ${r.safer_rewrite}`;
      return detail;
    });
    navigator.clipboard.writeText(lines.join("\n\n")).then(() => { setAllCopied(true); setTimeout(() => setAllCopied(false), 2000); });
  }

  return (
    <>
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/nectar-atmo-scanner.png)', backgroundColor: '#0f172a', filter: 'brightness(1.5)' }}
        />
        <div className="absolute inset-0 bg-[#121827]/[0.78]" />
      </div>

      <NectarOrbs />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-24 pb-8">
        <motion.h1 className="text-5xl sm:text-6xl md:text-6xl font-bold tracking-tight" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          Compliance Scanner
        </motion.h1>
        <motion.p className="mt-3 text-electric text-xl sm:text-2xl font-medium" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          Check it before you post.
        </motion.p>
        <motion.p className="mt-2 text-muted-foreground max-w-xl text-lg sm:text-xl leading-relaxed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          Pick the platforms. Get Pass, Warning, or Fail, plus a safer rewrite.
        </motion.p>
      </section>

      <Separator className="bg-border/40" />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div className="space-y-6" initial="hidden" animate="visible">
          <motion.div variants={fadeUp} custom={0}>
            <p className="font-mono text-base uppercase tracking-wider text-muted-foreground mb-3">Content</p>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setResults(null); }}
              className="w-full h-48 sm:h-56 rounded-xl border border-border/60 bg-surface text-foreground/95 font-mono text-lg p-5 resize-none focus:outline-none focus:ring-1 focus:ring-electric/30"
              placeholder={'Paste your social post, ad copy, or any content here...\n\nExample:\n"Lose weight fast with this guaranteed supplement! Act now - free trial, no risk. Click here to sign up and start seeing results today!"'}
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <p className="font-mono text-base uppercase tracking-wider text-muted-foreground mb-3">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {ALL_PLATFORMS.map((p) => <PlatformChip key={p} platform={p} selected={selectedPlatforms.has(p)} onToggle={togglePlatform} />)}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="w-full sm:w-auto bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-lg rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isScanning ? <><Loader2 className="h-4 w-4 animate-spin" />Checking...</> : <><ShieldCheck className="h-4 w-4" />Check Compliance</>}
              </button>
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
              </div>
            )}
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-lg text-red-400 font-medium">{error}</p>
            </motion.div>
          )}

          <p className="text-base text-muted-foreground/90 leading-relaxed">
            AI-generated compliance guidance is informational only. Platform policies can change, and final responsibility for posted content remains with the user.
          </p>
        </motion.div>
      </section>

      <AnimatePresence>
        {results && results.length > 0 && (
          <>
            <Separator className="bg-border/40" />
            <motion.section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                  <p className="font-mono text-base tracking-widest uppercase text-electric mb-3">Scan Results</p>
                  <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                    {issueCount === 0 ? `${totalScanned} of ${totalScanned} platforms - all clear` : `${issueCount} of ${totalScanned} platforms need changes before you post`}
                  </h2>
                  <p className="mt-2 text-base text-muted-foreground/90 leading-relaxed">
                    AI-generated compliance guidance is informational only. Platform policies can change, and final responsibility for posted content remains with the user.
                  </p>
                </div>
                <button
                  onClick={handleCopyAll}
                  className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-border/50 bg-surface hover:bg-surface-raised px-4 py-2.5 text-base font-mono font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {allCopied ? <><Check className="h-3.5 w-3.5 text-emerald-400" />Copied</> : <><FileText className="h-3.5 w-3.5" />Copy Report</>}
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 mb-6 p-3 rounded-xl border border-border/40 bg-surface/50">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-mono text-lg font-bold text-emerald-400">{passCount}</span>
                  <span className="text-xs font-mono text-emerald-400/70 uppercase hidden sm:inline">Pass</span>
                </div>
                {warnCount > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-mono text-lg font-bold text-amber-400">{warnCount}</span>
                    <span className="text-xs font-mono text-amber-400/70 uppercase hidden sm:inline">Warn</span>
                  </div>
                )}
                {failCount > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <ShieldX className="h-3.5 w-3.5 text-red-400" />
                    <span className="font-mono text-lg font-bold text-red-400">{failCount}</span>
                    <span className="text-xs font-mono text-red-400/70 uppercase hidden sm:inline">Fail</span>
                  </div>
                )}
                <div className="flex-1" />
                <div className="h-2 flex-1 max-w-[120px] rounded-full bg-border/30 overflow-hidden hidden sm:block">
                  <div className="h-full rounded-full bg-emerald-500/60 transition-all duration-500" style={{ width: `${totalScanned > 0 ? (passCount / totalScanned) * 100 : 0}%` }} />
                </div>
              </div>

              <div className="space-y-4">
                {results.map((result, i) => <ResultCard key={result.platform} result={result} index={i} />)}
              </div>

              {hasAnyFail && (
                <motion.p className="mt-6 text-lg text-red-400/90 font-medium text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  Fix these, then post. This is the difference between traffic and a ban.
                </motion.p>
              )}
            </motion.section>
          </>
        )}
      </AnimatePresence>
      <BottomNavRow />
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
