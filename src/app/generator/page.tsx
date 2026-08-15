"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NectarOrbs } from "@/components/nectar-orbs";
import { CompactTransformationRail } from "@/components/transformation-rail";
import { BottomNavRow } from "@/components/BottomNavRow";
import { GUMROAD_URL } from "@/lib/constants";
import {
  ClipboardPaste,
  ChevronDown,
  ChevronRight,
  Tag,
  Loader2,
  FileText,
  ShieldCheck,
  Send,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Copy,
} from "lucide-react";
import {
  extractFields,
  slugify,
  SUBID_PLATFORMS,
  type SubIDEntry,
} from "@/lib/offer-parser";
import {
  DEMO_PASTE,
  validateOfferInput,
  buildFullToolkitText,
  countToolkitBlocks,
  type GeneratedToolkit,
} from "@/lib/generator-toolkit";
import {
  OUTPUT_SECTIONS,
  EditableChip,
  PromoAnglesSection,
  SocialPostsSection,
  HeadlinesSection,
  BodyCopySection,
  CTASection,
  ComplianceSection,
} from "@/components/generator-sections";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

const FREE_GENERATION_LIMIT = 3;
const STORAGE_KEY = "nectar_generation_count";
const UNLOCK_STORAGE_KEY = "nectar_access_unlocked";
const ACCESS_TOKEN = "xf7-bk3m-qd82-pz14-wr59";
const TOOLKIT_STORAGE_KEY = "nectar_last_toolkit";
const SCAN_PAYLOAD_KEY = "nectar_scan_payload";

export default function GeneratorPage() {
  const router = useRouter();
  const [showSubIDs, setShowSubIDs] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolkit, setToolkit] = useState<GeneratedToolkit | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setGenerationCount(Number(stored) || 0);

      // Check persisted unlock first
      const unlockStored = localStorage.getItem(UNLOCK_STORAGE_KEY);
      if (unlockStored === "true") {
        setIsUnlocked(true);
      } else {
        // Check for access token in URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("access");
        if (token === ACCESS_TOKEN) {
          localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
          setIsUnlocked(true);
        }
      }

      const saved = localStorage.getItem(TOOLKIT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { toolkit?: GeneratedToolkit; pasteText?: string };
        if (parsed?.toolkit?.social_posts?.length) {
          setToolkit(parsed.toolkit);
          setHasGenerated(true);
          if (typeof parsed.pasteText === "string" && parsed.pasteText) setPasteText(parsed.pasteText);
        }
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const limitReached = !isUnlocked && generationCount >= FREE_GENERATION_LIMIT;
  const currentStep = hasGenerated ? 3 : isGenerating ? 2 : 1;
  const offerName = hasGenerated
    ? pasteText.split("\n")[0].replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 40)
    : "demo";

  async function handleGenerate() {
    if (isGenerating) return;
    if (limitReached) return;

    const validationError = validateOfferInput(pasteText);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setHasGenerated(false);
    setUsedFallback(false);
    setToolkit(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerText: pasteText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      if (data.data) {
        setToolkit(data.data);
        setHasGenerated(true);
        setUsedFallback(false);
        const next = generationCount + 1;
        setGenerationCount(next);
        try {
          localStorage.setItem(STORAGE_KEY, String(next));
          localStorage.setItem(
            TOOLKIT_STORAGE_KEY,
            JSON.stringify({ toolkit: data.data, pasteText, savedAt: Date.now() }),
          );
        } catch {
          /* localStorage unavailable */
        }
      } else {
        throw new Error("No data received from the generation endpoint.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed.";
      setError(msg);
      setToolkit(null);
      setHasGenerated(false);
      setUsedFallback(false);
    } finally {
      setIsGenerating(false);
    }
  }

  const displayToolkit = toolkit;
  const parsedFields = extractFields(pasteText);
  const offerSlug = slugify(pasteText);
  const dynamicSubIDs: SubIDEntry[] = SUBID_PLATFORMS.map((p) => ({
    platform: p.platform,
    tag: `${p.prefix}_${offerSlug}_${p.prefix}_sub`,
  }));

  const remainingGenerations = FREE_GENERATION_LIMIT - generationCount;

  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/nectar-bg-generator.png)" }}
        aria-hidden="true"
      />

      <NectarOrbs />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        <motion.p
          className="font-mono text-base tracking-widest uppercase text-electric mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Smart Paste
        </motion.p>
        <motion.h1
          className="text-5xl sm:text-6xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Paste Your Offer Details
        </motion.h1>
        <motion.p
          className="mt-4 text-muted-foreground max-w-xl text-xl sm:text-2xl leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The generator needs offer-level context to produce relevant content.
          Paste everything you have: network dashboards, emails, landing-page
          copy, or offer sheets, and the engine will parse the fields.
        </motion.p>

        <CompactTransformationRail currentStep={currentStep} />
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-8">
        <div className="rounded-lg border border-border/40 bg-surface/60 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-electric" />
            <p className="font-mono text-base uppercase tracking-wider text-muted-foreground">
              For best results, include:
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-lg text-muted-foreground">
            {[
              "Offer name",
              "Network",
              "Vertical",
              "Payout",
              "Target audience",
              "Key features",
              "Banned traffic",
              "Landing-page angle",
              "Affiliate/redirect link",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-electric/50" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border/40" />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div className="space-y-6" initial="hidden" animate="visible">
          <motion.div variants={fadeUp} custom={0}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="h-4 w-4 text-electric" />
                <p className="font-mono text-base uppercase tracking-wider text-muted-foreground">
                  Raw Paste Input
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPasteText(DEMO_PASTE)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-base font-mono text-muted-foreground hover:text-foreground hover:border-electric/30 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Load Example
              </button>
            </div>
            <p className="text-lg text-muted-foreground mb-3 leading-relaxed">
              This is where you paste YOUR offer. Drop in the raw details from your network dashboard, email, or offer page below.
            </p>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full h-56 sm:h-64 rounded-xl border border-border/60 bg-surface text-foreground/95 font-mono text-lg p-5 resize-none focus:outline-none focus:ring-1 focus:ring-electric/30"
              placeholder={"Offer Name \u2014 Product Description\nNetwork: NetworkName | Offer ID: XX-0001\nVertical: Health & Wellness\nPayout: $40 CPA (CC Submit)\nConversion Flow: Free Trial → CC Submit → Rebill\nAvailable Countries: US, CA, UK\nLanding Page: https://...\nBanned Traffic: Incentivized, Bot, Brand Search\nSub-ID Format: {sub1}_{sub2}_{sub3}\n\nKey product details:\n- Feature 1\n- Feature 2\n- Target audience: ...\n- Unique angle: ..."}
            />
          </motion.div>

          {!isUnlocked && (
          <motion.div variants={fadeUp} custom={1}>
            <p className="font-mono text-base text-muted-foreground">
              {remainingGenerations > 0
                ? `${remainingGenerations} free generation${remainingGenerations === 1 ? "" : "s"} remaining`
                : "Free generation limit reached"}
            </p>
          </motion.div>
          )}

          <motion.div variants={fadeUp} custom={2}>
            {parsedFields.length > 0 &&
              parsedFields.some((f) => f.value !== "Not detected") && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <ClipboardPaste className="h-4 w-4 text-electric" />
                    <p className="font-mono text-base uppercase tracking-wider text-muted-foreground">
                      Parsed Fields
                    </p>
                  </div>
                  <div className="grid gap-2.5">
                    {parsedFields.map((item) => (
                      <EditableChip key={item.key} field={item} />
                    ))}
                  </div>
                </>
              )}
          </motion.div>

          <motion.div variants={fadeUp} custom={3}>
            <button
              onClick={() => setShowSubIDs(!showSubIDs)}
              className="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Tag className="h-4 w-4 text-electric" />
              Platform Sub-IDs
              <span className="text-base text-muted-foreground/80 font-mono">(optional)</span>
              <span className="ml-auto">
                {showSubIDs ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </span>
            </button>

            {showSubIDs && (
              <div className="mt-3 rounded-xl border border-border/60 bg-surface p-4 sm:p-5">
                <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                  Per-platform tracking tags appended to generated links. Edit
                  the tag format for each platform below.
                </p>
                <div className="grid gap-2.5">
                  {dynamicSubIDs.map((entry) => (
                    <EditableChip
                      key={entry.platform}
                      field={{
                        key: entry.platform,
                        label: entry.platform,
                        value: entry.tag,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUp} custom={4}>
            {limitReached ? (
              <div className="rounded-xl border border-electric/20 bg-electric/5 p-6 text-center space-y-3">
                <p className="text-lg text-foreground font-medium">
                  You've used all {FREE_GENERATION_LIMIT} free generations.
                </p>
                <a
                  href={GUMROAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-lg rounded-lg transition-colors"
                >
                  GET NECTAR ENGINE
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-lg rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {hasGenerated ? "Regenerate" : "Generate Toolkit"}
                  </>
                )}
              </button>
            )}
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/30 bg-red-500/5 p-4"
            >
              <p className="text-lg text-red-400 font-medium">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {hasGenerated && displayToolkit && (
        <>
          <Separator className="bg-border/40" />
          <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-3 w-3 rounded-full bg-electric" />
                <span className="font-mono text-base text-muted-foreground">
                  {offerName}_toolkit_v1.0.json
                </span>
                <span className="font-mono text-xs uppercase text-electric/80 ml-auto">
                  AI Generated
                </span>
              </div>

              <div className="sticky top-[72px] z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 mb-6 -mt-2 bg-[#121827]/90 backdrop-blur-md border-b border-border/30 rounded-b-xl">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {OUTPUT_SECTIONS.map((s) => (
                    <a
                      key={s.id}
                      href={`#gen-${s.id}`}
                      className="shrink-0 px-3 py-1.5 rounded-md text-sm font-mono font-medium text-muted-foreground/90 hover:text-electric hover:bg-electric/[0.06] transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-10 scroll-mt-28">
                <PromoAnglesSection angles={displayToolkit.promo_angles} />
                <SocialPostsSection posts={displayToolkit.social_posts} />
                <HeadlinesSection headlines={displayToolkit.headlines} />
                <BodyCopySection text={displayToolkit.body_copy} />
                <CTASection ctas={displayToolkit.cta_variations} />
                <ComplianceSection notes={displayToolkit.compliance_notes} />

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="space-y-3"
                >
                  <p className="text-base text-muted-foreground font-mono">
                    {countToolkitBlocks(displayToolkit)} blocks in this toolkit · saved in this browser
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        try {
                          const contentText = buildFullToolkitText(displayToolkit);
                          const platforms = (displayToolkit.social_posts || []).map((p) => p.platform);
                          sessionStorage.setItem(
                            SCAN_PAYLOAD_KEY,
                            JSON.stringify({ content: contentText, platforms, savedAt: Date.now() }),
                          );
                          const params = new URLSearchParams({ from: "generator" });
                          router.push(`/scanner?${params.toString()}`);
                        } catch {
                          router.push("/scanner");
                        }
                      }}
                      className="w-full sm:w-auto bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-lg rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Check This Toolkit
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(buildFullToolkitText(displayToolkit));
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-surface hover:bg-surface-raised px-6 h-12 text-lg font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Full Toolkit
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>
        </>
      )}
      <BottomNavRow />
    </>
  );
}
