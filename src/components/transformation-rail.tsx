"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ClipboardPaste,
  Sparkles,
  ShieldCheck,
  LayoutList,
} from "lucide-react";

export interface RailStage {
  id: string;
  label: string;
  sublabel: string;
  description: string;
  icon: React.ElementType;
  live: boolean;
  href?: string;
}

export const RAIL_STAGES: RailStage[] = [
  { id: "offer", label: "OFFER", sublabel: "Paste raw offer details", description: "Drop in any affiliate offer — product, audience, angle — and Nectar extracts the structural signals.", icon: ClipboardPaste, live: true, href: "/generator" },
  { id: "angles", label: "ANGLES", sublabel: "Campaign directions", description: "The engine identifies distinct campaign angles so every platform gets a version that fits, not a copy-paste.", icon: Sparkles, live: true },
  { id: "compliance", label: "COMPLIANCE", sublabel: "Platform risk scanner", description: "Before you post, every piece of copy is checked against real platform policy patterns — pass, warn, or rewrite.", icon: ShieldCheck, live: true, href: "/scanner" },
  { id: "output", label: "OUTPUT", sublabel: "9-platform toolkit", description: "Structured, platform-ready content with character counts, compliance context, and editable fields — ready to publish.", icon: LayoutList, live: true },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const nodeVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

/** Per-card accent colors — each stage has a restrained glow while feeling like one system. */
const CARD_ACCENTS = {
  offer: {
    border: "from-amber-500/40 via-amber-400/20 to-transparent",
    glow: "bg-amber-500/[0.06]",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    dot: "bg-amber-400",
  },
  angles: {
    border: "from-fuchsia-500/40 via-fuchsia-400/20 to-transparent",
    glow: "bg-fuchsia-500/[0.06]",
    iconBg: "bg-fuchsia-500/10",
    iconText: "text-fuchsia-400",
    dot: "bg-fuchsia-400",
  },
  compliance: {
    border: "from-electric/40 via-electric/20 to-transparent",
    glow: "bg-electric/[0.06]",
    iconBg: "bg-electric/10",
    iconText: "text-electric",
    dot: "bg-electric",
  },
  output: {
    border: "from-lime-400/40 via-lime-400/20 to-transparent",
    glow: "bg-lime-400/[0.06]",
    iconBg: "bg-lime-400/10",
    iconText: "text-lime-400",
    dot: "bg-lime-400",
  },
} as const;

function PipelineCard({ stage, index }: { stage: RailStage; index: number }) {
  const Icon = stage.icon;
  const accent = CARD_ACCENTS[stage.id as keyof typeof CARD_ACCENTS];
  const card = (
    <motion.div
      className="group relative h-full"
      variants={nodeVariants}
      custom={index}
    >
      {/* Ambient glow behind card */}
      <div className={`absolute -inset-3 rounded-2xl ${accent.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} aria-hidden="true" />
      {/* Gradient top border line */}
      <div className={`absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r ${accent.border}`} aria-hidden="true" />
      <div className="relative rounded-xl border border-white/[0.08] bg-[#13121f]/90 backdrop-blur-sm p-5 sm:p-6 h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className={`shrink-0 flex items-center justify-center h-9 w-9 rounded-lg ${accent.iconBg} border border-white/[0.06]`}>
            <Icon className={`h-4 w-4 ${accent.iconText}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground/70 mb-0.5">{stage.label}</p>
            <p className="text-sm font-semibold text-foreground/90">{stage.sublabel}</p>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">{stage.description}</p>
        {/* Subtle data-line decoration */}
        <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
          <div className={`h-1 w-1 rounded-full ${accent.dot}`} />
          <div className={`h-px flex-1 bg-gradient-to-r ${accent.border}`} />
          <div className={`h-1 w-1 rounded-full ${accent.dot} opacity-40`} />
        </div>
      </div>
    </motion.div>
  );

  if (stage.href) {
    return <Link href={stage.href} className="hover:no-underline block h-full" tabIndex={-1}>{card}</Link>;
  }
  return <div className="h-full">{card}</div>;
}

export function TransformationRail() {
  return (
    <motion.div
      className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 sm:pb-28"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div className="font-mono text-sm tracking-widest uppercase text-electric mb-2 text-center" variants={nodeVariants}>
        The Pipeline
      </motion.div>
      <motion.p className="text-lg sm:text-xl text-muted-foreground/80 text-center mb-10 sm:mb-14 max-w-lg mx-auto" variants={nodeVariants}>
        From raw offer to campaign-ready content.
      </motion.p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {RAIL_STAGES.map((stage, i) => (
          <PipelineCard key={stage.id} stage={stage} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

export interface CompactRailProps { currentStep: number; }

function getStageState(stageId: string, currentStep: number): "done" | "active" | "next" | "locked" {
  if (stageId === "offer") return currentStep >= 1 ? (currentStep > 1 ? "done" : "active") : "next";
  if (stageId === "angles") return currentStep >= 3 ? "done" : currentStep === 2 ? "active" : "next";
  if (stageId === "output") return currentStep >= 3 ? "active" : "next";
  if (stageId === "compliance") return "next";
  return "locked";
}

function getProgressLabel(currentStep: number): string {
  if (currentStep >= 3) return "Output ready · 9 platforms";
  if (currentStep === 2) return "Generating campaign directions + platform copy...";
  if (currentStep === 1) return "Offer captured · ready to generate";
  return "";
}

function CompactNode({ stage, state }: { stage: RailStage; state: "done" | "active" | "next" | "locked" }) {
  const Icon = stage.icon;
  if (state === "locked") return <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full border border-fuchsia-400/20 text-fuchsia-200/65 select-none"><Icon className="h-3 w-3 shrink-0" /><span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-wider">{stage.label}</span><span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-widest px-1 sm:px-1.5 py-px rounded-full border border-fuchsia-400/25 text-fuchsia-200/75 bg-fuchsia-400/[0.06]">Next</span></div>;
  const styles = state === "active" ? "bg-electric/10 text-electric border border-electric/30 shadow-sm shadow-electric/10" : state === "done" ? "text-electric/75" : "text-muted-foreground/70";
  return <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full transition-colors ${styles}`}><Icon className="h-3.5 w-3.5 shrink-0" /><span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-wider">{stage.label}</span></div>;
}

export function CompactTransformationRail({ currentStep }: CompactRailProps) {
  const progressLabel = getProgressLabel(currentStep);
  return <div><div className="flex items-center gap-0.5 sm:gap-2 mt-6 mb-1 flex-wrap">{RAIL_STAGES.map((stage, i) => { const stageState = getStageState(stage.id, currentStep); return <div key={stage.id} className="flex items-center">{i > 0 && <span className={`h-px w-1.5 sm:w-4 mr-0.5 sm:mr-1 ${stageState === "locked" ? "bg-fuchsia-400/20" : stageState === "done" || stageState === "active" ? "bg-electric/55" : "bg-border/45"}`} />}{<CompactNode stage={stage} state={stageState} />}</div>; })}</div>{progressLabel && <p className="font-mono text-[10px] text-muted-foreground/75 mb-2">Current stage: <span className="text-electric">{progressLabel}</span></p>}</div>;
}