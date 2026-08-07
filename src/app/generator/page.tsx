"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardPaste,
  ChevronDown,
  ChevronRight,
  Pencil,
  Check,
  Tag,
  AlertTriangle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  ANIMATION                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  DEMO PASTE TEXT                                                    */
/* ------------------------------------------------------------------ */
const DEMO_PASTE = "GreenHealth Pro \u2014 Natural Sleep & Recovery Supplement\n" +
  "Network: MaxBounty | Offer ID: GH-4821\n" +
  "Vertical: Health & Wellness\n" +
  "Payout: $42 CPA (CC Submit)\n" +
  "Conversion Flow: Free Trial \u2192 CC Submit \u2192 Rebill $89/mo after 14 days\n" +
  "Top Geo: US, CA, UK, AU\n" +
  "Landing Page: https:\/\/example.com\/offer\/gh-pro\n" +
  "Banned Traffic: Incentivized, Bot, Brand Search, Email Spam, Craiglist\n" +
  "Sub-ID Format: {sub1}_{sub2}_{sub3}\n\n" +
  "Key product details:\n" +
  "- 3 active ingredients: Magnesium Glycinate 400mg, L-Theanine 200mg, Apigenin 50mg\n" +
  "- Non-GMO, vegan, no fillers, no proprietary blends\n" +
  "- Every batch third-party tested (lab reports on landing page)\n" +
  "- Free trial: 14-day supply, $4.95 S&H only\n" +
  "- Target audience: Adults 25-50 with stress/sleep issues\n" +
  "- Unique angle: full dosage transparency + lab-tested per batch (rare in this vertical)";

/* ------------------------------------------------------------------ */
/*  PARSED FIELD TYPES                                                 */
/* ------------------------------------------------------------------ */
interface ParsedField {
  key: string;
  label: string;
  value: string;
}

interface SubIDEntry {
  platform: string;
  tag: string;
}

/* ------------------------------------------------------------------ */
/*  DEMO PARSED FIELDS                                                */
/* ------------------------------------------------------------------ */
const DEMO_PARSED: ParsedField[] = [
  { key: "offer_name", label: "Offer Name", value: "GreenHealth Pro" },
  { key: "network_id", label: "Network ID", value: "GH-4821 (MaxBounty)" },
  { key: "vertical", label: "Vertical", value: "Health & Wellness" },
  {
    key: "payout_model",
    label: "Payout Model",
    value: "$42 CPA — CC Submit (Free Trial)",
  },
  {
    key: "conversion_flow",
    label: "Conversion Flow",
    value: "Free Trial → CC Submit → Rebill $89/mo after 14 days",
  },
  { key: "top_geo", label: "Top Geo", value: "US, CA, UK, AU" },
  {
    key: "landing_page",
    label: "Landing Page URL",
    value: "https://example.com/offer/gh-pro",
  },
  {
    key: "banned_traffic",
    label: "Banned Traffic Types",
    value: "Incentivized, Bot, Brand Search, Email Spam, Craiglist",
  },
  {
    key: "subid_format",
    label: "Sub-ID Format",
    value: "{sub1}_{sub2}_{sub3}",
  },
];

const DEMO_SUBIDS: SubIDEntry[] = [
  { platform: "X", tag: "x_{sub1}" },
  { platform: "TikTok", tag: "tt_{sub1}" },
  { platform: "Pinterest", tag: "pin_{sub1}" },
  { platform: "Reddit", tag: "rd_{sub1}" },
];

/* ------------------------------------------------------------------ */
/*  DEMO OUTPUT DATA                                                   */
/* ------------------------------------------------------------------ */
const DEMO_PROMO_ANGLES = [
  {
    angle: "Dosage Transparency",
    hook: "Every ingredient listed with exact mg — no proprietary blends, no guesswork.",
    body: "Most sleep supplements hide behind 'proprietary formulas' so you can't verify dosages. GreenHealth Pro prints the mg count for each of its 3 active ingredients right on the label. Magnesium Glycinate 400mg, L-Theanine 200mg, Apigenin 50mg — those are clinically-studied amounts, not pixie dust.",
  },
  {
    angle: "Batch Testing",
    hook: "Every production run gets independent third-party lab testing — reports are public.",
    body: "The supplement industry's dirty secret: most brands never test finished products, only raw ingredients. GreenHealth Pro tests every batch for heavy metals, microbial contamination, and labeled potency across 47 markers. The latest report is linked directly on their landing page.",
  },
  {
    angle: "Single-Category Formula",
    hook: "Three ingredients, one job: better sleep. No kitchen-sink filler.",
    body: "Instead of throwing 20 ingredients at the wall and hoping something sticks, GreenHealth Pro focuses on three compounds with strong evidence for sleep quality: Magnesium Glycinate (muscle relaxation + nervous system calming), L-Theanine (anxiety reduction without drowsiness), and Apigenin (a flavonoid found in chamomile that binds GABA receptors).",
  },
];

const DEMO_SOCIAL_POSTS = [
  {
    platform: "X",
    character_count: 263,
    text: "Supplement brands that hide ingredient dosages behind 'proprietary blends' don't trust their own formula enough to show you. Found one that lists every mg, tests every batch, and posts the lab report publicly. 3 ingredients, one purpose: sleep. This is how it should be done.",
  },
  {
    platform: "TikTok",
    character_count: 215,
    text: "POV: you stop taking a supplement with 20 mystery ingredients and switch to one that tells you exactly what's in each capsule — 400mg magnesium glycinate, 200mg l-theanine, 50mg apigenin. Two weeks later you're falling asleep in 20 minutes instead of staring at the ceiling for an hour.",
  },
  {
    platform: "Pinterest",
    character_count: 241,
    text: "The supplement aisle is overwhelming. Here's what to actually look for: exact mg counts on the label (not 'proprietary blend'), third-party batch testing you can verify, and a formula focused on one goal. GreenHealth Pro checks all three boxes for sleep support. Saved you 2 hours of label-reading.",
  },
  {
    platform: "Reddit",
    character_count: 408,
    text: "Does anyone know of sleep supplements that publish their third-party lab test results? I've been looking at GreenHealth Pro — they test every batch for 47 markers including heavy metals and microbial contamination and link the actual report on their site. The formula is only 3 ingredients (magnesium glycinate 400mg, l-theanine 200mg, apigenin 50mg) which seems more targeted than the 15-ingredient blends I usually see. Has anyone used this or found other brands that do the same level of verification? Trying to avoid another purchase where I'm just hoping the label is accurate.",
  },
];

/* ------------------------------------------------------------------ */
/*  EDITABLE CHIP                                                     */
/* ------------------------------------------------------------------ */
function EditableChip({
  field,
  isDemo,
}: {
  field: ParsedField;
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
          {editing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function GeneratorPage() {
  const [showSubIDs, setShowSubIDs] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  return (
    <>
      
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        <motion.p
          className="font-mono text-xs tracking-widest uppercase text-electric mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Smart Paste
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Paste Your Offer Details
        </motion.h1>
        <motion.p
          className="mt-4 text-muted-foreground max-w-xl text-base sm:text-lg leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Paste raw unstructured text from any source — network dashboards,
          emails, landing pages. The engine parses it and generates your
          content toolkit.
        </motion.p>
      </section>

      <Separator className="bg-border/40" />

      
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
        >
          
          <motion.div variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardPaste className="h-4 w-4 text-electric" />
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Raw Paste Input
              </p>
              <span className="font-mono text-[10px] uppercase text-electric/60 ml-auto">
                Demo Preview
              </span>
            </div>
            <textarea
              readOnly
              value={DEMO_PASTE}
              className="w-full h-56 sm:h-64 rounded-xl border border-border/60 bg-surface text-foreground/80 font-mono text-sm p-5 resize-none focus:outline-none focus:ring-1 focus:ring-electric/30"
              placeholder="Paste your offer details here..."
            />
          </motion.div>

          
          <motion.div variants={fadeUp} custom={1}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Parsed Fields — Review &amp; Edit
              </p>
            </div>
            <div className="grid gap-2.5">
              {DEMO_PARSED.map(function (item) {
                return <EditableChip key={item.key} field={item} isDemo={true}></EditableChip>;
              })}
            </div>
          </motion.div>

          
          <motion.div variants={fadeUp} custom={2}>
            <button
              onClick={() => setShowSubIDs(!showSubIDs)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Tag className="h-4 w-4 text-electric" />
              Platform Sub-IDs
              <span className="text-xs text-muted-foreground/60 font-mono">
                (optional)
              </span>
              <span className="ml-auto">
                {showSubIDs ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            </button>

            {showSubIDs && (
              <div className="mt-3 rounded-xl border border-border/60 bg-surface p-4 sm:p-5">
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Per-platform tracking tags appended to generated links. Edit
                  the tag format for each platform below.
                </p>
                <div className="grid gap-2.5">
                  {DEMO_SUBIDS.map((entry) => (
                    <EditableChip
                      key={entry.platform}
                      field={{
                        key: entry.platform,
                        label: entry.platform,
                        value: entry.tag,
                      }}
                      isDemo={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          
          <motion.div variants={fadeUp} custom={3}>
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="w-full sm:w-auto bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-sm rounded-lg transition-colors cursor-pointer"
            >
              {showOutput ? "Hide Demo Output" : "Generate Demo Output"}
            </button>
            <p className="mt-2 text-xs text-muted-foreground/50 font-mono">
              Demo mode — no real API calls. Shows sample output for the
              parsed offer above.
            </p>
          </motion.div>
        </motion.div>
      </section>

      
      {showOutput && (
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
                <span className="font-mono text-xs text-muted-foreground">
                  greenhealth_pro_toolkit_v1.0.json
                </span>
                <span className="font-mono text-[10px] uppercase text-electric/60 ml-auto">
                  Demo Preview
                </span>
              </div>

              
              <div className="space-y-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
                    Promo Angles
                  </p>
                  <div className="space-y-4">
                    {DEMO_PROMO_ANGLES.map((angle, i) => (
                      <div
                        key={angle.angle}
                        className="rounded-lg bg-surface border border-border/40 p-5"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-[11px] uppercase text-electric">
                            Angle {i + 1}
                          </span>
                          <span className="h-px flex-1 bg-border/40" />
                          <span className="font-mono text-xs text-foreground font-medium">
                            {angle.angle}
                          </span>
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

                
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
                    Social Posts
                  </p>
                  <div className="space-y-4">
                    {DEMO_SOCIAL_POSTS.map((post) => (
                      <div
                        key={post.platform}
                        className="rounded-lg bg-surface border border-border/40 p-5"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-xs text-electric font-semibold">
                            {post.platform}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {post.character_count} chars
                          </span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">
                          {post.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </>
      )}
    </>
  );
}
