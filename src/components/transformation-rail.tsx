"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ClipboardPaste,
  Sparkles,
  Globe,
  CalendarDays,
  ShieldCheck,
  LayoutList,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export interface RailStage {
  id: string;
  label: string;
  sublabel: string;
  tooltipLine: string;
  icon: React.ElementType;
  live: boolean;
  href?: string;
}

export const RAIL_STAGES: RailStage[] = [
  { id: "offer", label: "OFFER", sublabel: "Paste raw offer details", tooltipLine: "", icon: ClipboardPaste, live: true, href: "/generator" },
  { id: "angles", label: "ANGLES", sublabel: "AI extracts promo angles", tooltipLine: "", icon: Sparkles, live: true },
  { id: "context", label: "CONTEXT", sublabel: "Geo + seasonal intelligence", tooltipLine: "Geo & seasonal context - next", icon: Globe, live: false },
  { id: "campaign", label: "CAMPAIGN", sublabel: "Schedule + sequence builder", tooltipLine: "Campaign building - next", icon: CalendarDays, live: false },
  { id: "compliance", label: "COMPLIANCE", sublabel: "Platform risk scanner", tooltipLine: "", icon: ShieldCheck, live: true, href: "/scanner" },
  { id: "output", label: "OUTPUT", sublabel: "9-platform toolkit", tooltipLine: "", icon: LayoutList, live: true },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const nodeVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };
const connectorVariants = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.4, ease: "easeOut" as const } } };

function Connector({ index }: { index: number }) {
  const stage = RAIL_STAGES[index];
  const nextStage = RAIL_STAGES[index + 1];
  const bothLive = stage.live && nextStage?.live;
  const eitherLive = stage.live || nextStage?.live;

  return (
    <motion.div className="hidden sm:flex items-center justify-center shrink-0 w-8 lg:w-12" variants={connectorVariants} style={{ originX: 0 }}>
      {bothLive ? (
        <div className="relative w-full h-px overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-electric/25 via-fuchsia-400/35 to-lime-300/25" />
          <motion.div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-electric via-fuchsia-400 to-lime-300" animate={{ x: ["-100%", "220%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }} />
        </div>
      ) : eitherLive ? (
        <div className="relative w-full h-px overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-electric/15" />
          <motion.div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-electric/70 to-fuchsia-400/40" animate={{ x: ["-100%", "320%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }} />
        </div>
      ) : <div className="w-full h-px bg-border/40" />}
    </motion.div>
  );
}

function NextStageNode({ stage }: { stage: RailStage }) {
  const [open, setOpen] = useState(false);
  const Icon = stage.icon;
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <motion.div className="relative flex flex-col items-center gap-2 cursor-default select-none px-2 sm:px-0" variants={nodeVariants} onClick={() => setOpen(true)}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-fuchsia-400/[0.035] blur-md pointer-events-none" />
            <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-electric/15 bg-surface">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-electric/40" />
            </div>
          </div>
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-foreground/50">{stage.label}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-fuchsia-400/20 text-fuchsia-300/70 bg-fuchsia-400/[0.05]">Next</span>
          <span className="hidden sm:block text-[10px] text-muted-foreground/40 text-center leading-tight max-w-[100px]">{stage.sublabel}</span>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-surface border-border/60 text-muted-foreground text-xs font-mono">{stage.tooltipLine}</TooltipContent>
    </Tooltip>
  );
}

function LiveStageNode({ stage }: { stage: RailStage }) {
  const Icon = stage.icon;
  const content = (
    <motion.div className="relative flex flex-col items-center gap-2 group px-1 sm:px-0" variants={nodeVariants}>
      <div className="hidden sm:block absolute -inset-3 rounded-2xl bg-electric/[0.045] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-electric/25 bg-surface shadow-lg shadow-electric/5">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-electric" />
      </div>
      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-electric">{stage.label}</span>
      <span className="hidden sm:block text-[10px] text-muted-foreground/60 text-center leading-tight max-w-[100px]">{stage.sublabel}</span>
    </motion.div>
  );
  return stage.href ? <Link href={stage.href} className="hover:no-underline">{content}</Link> : content;
}

function StageNode({ stage }: { stage: RailStage }) {
  return stage.live ? <LiveStageNode stage={stage} /> : <NextStageNode stage={stage} />;
}

export function TransformationRail() {
  return (
    <motion.div className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 sm:pb-28" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
      <motion.div className="font-mono text-xs tracking-widest uppercase text-electric/70 mb-2 text-center" variants={nodeVariants}>The Pipeline</motion.div>
      <motion.div className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 sm:mb-16" variants={nodeVariants}>One Offer.<span className="bg-gradient-to-r from-electric via-fuchsia-400 to-lime-300 bg-clip-text text-transparent"> Many Angles.</span> One Campaign.</motion.div>
      <div className="hidden sm:flex items-center justify-center">
        {RAIL_STAGES.map((stage, i) => <div key={stage.id} className="flex items-center"><StageNode stage={stage} />{i < RAIL_STAGES.length - 1 && <Connector index={i} />}</div>)}
      </div>
      <div className="sm:hidden grid grid-cols-2 gap-x-3 gap-y-8 justify-items-center">
        {RAIL_STAGES.map((stage) => <div key={stage.id} className="w-full flex justify-center"><StageNode stage={stage} /></div>)}
      </div>
      <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45">
        <ArrowRight className="h-3 w-3 text-electric/50" /> Live now: Offer · Angles · Compliance · Output
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
  if (currentStep === 2) return "Generating angles + platform copy...";
  if (currentStep === 1) return "Offer captured · ready to generate";
  return "";
}

function CompactNode({ stage, state }: { stage: RailStage; state: "done" | "active" | "next" | "locked" }) {
  const Icon = stage.icon;
  if (state === "locked") return <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full border border-fuchsia-400/10 text-fuchsia-300/35 select-none"><Icon className="h-3 w-3 shrink-0" /><span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-wider">{stage.label}</span><span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-widest px-1 sm:px-1.5 py-px rounded-full border border-fuchsia-400/15 text-fuchsia-300/45 bg-fuchsia-400/[0.04]">Next</span></div>;
  const styles = state === "active" ? "bg-electric/10 text-electric border border-electric/20 shadow-sm shadow-electric/10" : state === "done" ? "text-electric/60" : "text-muted-foreground/50";
  return <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full transition-colors ${styles}`}><Icon className="h-3.5 w-3.5 shrink-0" /><span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-wider">{stage.label}</span></div>;
}

export function CompactTransformationRail({ currentStep }: CompactRailProps) {
  const progressLabel = getProgressLabel(currentStep);
  return <div><div className="flex items-center gap-0.5 sm:gap-2 mt-6 mb-1 flex-wrap">{RAIL_STAGES.map((stage, i) => { const stageState = getStageState(stage.id, currentStep); return <div key={stage.id} className="flex items-center">{i > 0 && <span className={`h-px w-1.5 sm:w-4 mr-0.5 sm:mr-1 ${stageState === "locked" ? "bg-fuchsia-400/10" : stageState === "done" || stageState === "active" ? "bg-electric/40" : "bg-border/30"}`} />}{<CompactNode stage={stage} state={stageState} />}</div>; })}</div>{progressLabel && <p className="font-mono text-[10px] text-muted-foreground/60 mb-2">Current stage: <span className="text-electric/80">{progressLabel}</span></p>}</div>;
}
