"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NectarOrbs } from "@/components/nectar-orbs";
import { BottomNextNav } from "@/components/BottomNextNav";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: "easeOut" as const },
  }),
};

const MODULES = [
  {
    id: "M01", name: "Niche Intelligence", state: "NEXT",
    oneLiner: "Research layer for turning a niche, audience, and market context into structured inputs.",
    inputs: ["Seed keywords", "Target geography", "Content category"],
    outputs: ["Niche signals", "Audience context", "Research inputs"],
  },
  {
    id: "M02", name: "Compliance Scanner", state: "LIVE", link: "/scanner",
    oneLiner: "Checks generated copy for platform-specific risk signals and returns flagged phrases, reasons, and safer rewrites.",
    inputs: ["Generated content", "Target platforms", "Offer context"],
    outputs: ["Pass / Warn / Fail", "Flagged phrases", "Safer rewrite"],
  },
  {
    id: "M03", name: "Content Architecture", state: "NEXT",
    oneLiner: "Strategic layer for organizing themes, channels, and publishing structure around an offer.",
    inputs: ["Offer context", "Audience context", "Content goals"],
    outputs: ["Content structure", "Channel plan", "Topic directions"],
  },
  {
    id: "M04", name: "Copy Generator", state: "LIVE", link: "/generator",
    oneLiner: "Turns an offer into platform-aware social content with editable offer fields and character counts.",
    inputs: ["Offer details", "Audience", "Platform targets"],
    outputs: ["Angles", "Platform posts", "Character counts"],
  },
  {
    id: "M05", name: "Funnel Blueprint", state: "NEXT",
    oneLiner: "Campaign-design layer for mapping conversion paths around the generated content.",
    inputs: ["Offer details", "Content strategy", "Audience"],
    outputs: ["Journey map", "Page hierarchy", "Conversion points"],
  },
  {
    id: "M06", name: "Email Sequence Engine", state: "NEXT",
    oneLiner: "Long-form channel layer for drafting email sequences around an offer.",
    inputs: ["Offer details", "Audience", "Sequence goals"],
    outputs: ["Sequence structure", "Subject directions", "Email drafts"],
  },
  {
    id: "M07", name: "Landing Page Builder", state: "NEXT",
    oneLiner: "Presentation layer for turning strategy and copy into a landing-page structure.",
    inputs: ["Copy", "Campaign structure", "Brand direction"],
    outputs: ["Page structure", "Copy placement", "Layout guidance"],
  },
  {
    id: "M08", name: "Analytics Framework", state: "NEXT",
    oneLiner: "Measurement layer for defining events, attribution structure, and campaign signals.",
    inputs: ["Campaign structure", "Traffic sources", "Conversion goals"],
    outputs: ["Event plan", "UTM structure", "KPI definitions"],
  },
  {
    id: "M09", name: "Output Package", state: "PARTIAL",
    oneLiner: "The packaging concept behind Nectar — structured platform output with deeper campaign packaging next.",
    inputs: ["Generated content", "Compliance results", "Future campaign layers"],
    outputs: ["Usable content", "Platform variants", "Future campaign package"],
  },
];

/** Status badge styling — clean, no lock icons. */
const STATUS_STYLE: Record<string, { badge: string; border: string; glow: string }> = {
  LIVE: {
    badge: "border-electric/30 bg-electric/10 text-electric",
    border: "border-l-2 border-l-electric/40",
    glow: "",
  },
  PARTIAL: {
    badge: "border-amber-400/30 bg-amber-400/[0.08] text-amber-300",
    border: "border-l-2 border-l-amber-400/30",
    glow: "",
  },
  NEXT: {
    badge: "border-border/40 bg-background/80 text-muted-foreground",
    border: "border-l-2 border-l-border/30",
    glow: "",
  },
};

function ModuleCard({ mod, index }: { mod: (typeof MODULES)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const style = STATUS_STYLE[mod.state] || STATUS_STYLE.NEXT;

  return (
    <motion.article
      className={`rounded-xl border border-white/[0.06] bg-[#13121f]/80 backdrop-blur-sm overflow-hidden ${style.border}`}
      variants={fadeUp}
      custom={index}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3 group cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] text-muted-foreground/60">{mod.id}</span>
            <h3 className="text-sm font-bold tracking-tight text-foreground">{mod.name}</h3>
          </div>
          <p className="text-[13px] text-muted-foreground/80 leading-relaxed">{mod.oneLiner}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider ${style.badge}`}>
            {mod.state}
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground/50 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-5 pt-0">
          <div className="border-t border-white/[0.05] pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">Inputs</p>
                <ul className="space-y-1.5">
                  {mod.inputs.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-foreground/70">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">Outputs</p>
                <ul className="space-y-1.5">
                  {mod.outputs.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-foreground/70">
                      <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${mod.state === "LIVE" ? "bg-electric" : mod.state === "PARTIAL" ? "bg-amber-400" : "bg-muted-foreground/30"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {mod.link && (
              <Link
                href={mod.link}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-full border border-electric/25 bg-electric/[0.06] px-3 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-electric hover:bg-electric/15 transition-colors"
              >
                Open module
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      )}
    </motion.article>
  );
}

export default function ModulesPage() {
  return (
    <>
      {/* Full-page background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/nectar-bg-modules.png)' }}
        aria-hidden="true"
      />

      <NectarOrbs />
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-10">
        <motion.p className="font-mono text-xs tracking-widest uppercase text-electric mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Nectar Architecture</motion.p>
        <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>The system behind the transformation</motion.h1>
        <motion.p className="mt-4 text-muted-foreground max-w-2xl text-base sm:text-lg leading-relaxed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          Nectar is being built as a transformation engine, not nine disconnected tools. <strong className="text-foreground">LIVE</strong> means you can use it now. <strong className="text-foreground">PARTIAL</strong> means a working core with more to come. <strong className="text-foreground">NEXT</strong> means part of the product direction, not a shipped capability.
        </motion.p>
      </section>

      <Separator className="bg-border/30" />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {MODULES.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 sm:pb-28">
        <Separator className="bg-border/30 mb-12" />
        <motion.div
          className="relative rounded-2xl overflow-hidden p-[2px]"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-fuchsia-500 to-purple-500 rounded-2xl" aria-hidden="true" />
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-electric mb-3">The real product story</p>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">Offer → Angles → Output → Protection</h3>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
              Today, that core loop is real. Context intelligence and deeper campaign orchestration are the next expansion, which is why they are visible in the product story without being disguised as finished features.
            </p>
          </div>
        </motion.div>
      </section>
      <BottomNextNav currentPage="/modules" />
    </>
  );
}
