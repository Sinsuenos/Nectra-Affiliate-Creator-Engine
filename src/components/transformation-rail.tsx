"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ClipboardPaste,
  Sparkles,
  Globe,
  CalendarDays,
  ShieldCheck,
  LayoutList,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  STAGE DEFINITIONS                                                   */
/* ------------------------------------------------------------------ */

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
  {
    id: "offer",
    label: "OFFER",
    sublabel: "Paste raw offer details",
    tooltipLine: "",
    icon: ClipboardPaste,
    live: true,
    href: "/generator",
  },
  {
    id: "angles",
    label: "ANGLES",
    sublabel: "AI extracts promo angles",
    tooltipLine: "",
    icon: Sparkles,
    live: true,
  },
  {
    id: "context",
    label: "CONTEXT",
    sublabel: "Geo + seasonal intelligence",
    tooltipLine: "Geo & seasonal context - next",
    icon: Globe,
    live: false,
  },
  {
    id: "campaign",
    label: "CAMPAIGN",
    sublabel: "Schedule + sequence builder",
    tooltipLine: "Campaign building - next",
    icon: CalendarDays,
    live: false,
  },
  {
    id: "compliance",
    label: "COMPLIANCE",
    sublabel: "Platform risk scanner",
    tooltipLine: "",
    icon: ShieldCheck,
    live: true,
    href: "/scanner",
  },
  {
    id: "output",
    label: "OUTPUT",
    sublabel: "6-platform toolkit",
    tooltipLine: "",
    icon: LayoutList,
    live: true,
  },
];

/* ------------------------------------------------------------------ */
/*  ANIMATION                                                           */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const connectorVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  CONNECTOR                                                           */
/* ------------------------------------------------------------------ */

function Connector({ index }: { index: number }) {
  const stage = RAIL_STAGES[index];
  const nextStage = RAIL_STAGES[index + 1];
  const bothLive = stage.live && nextStage?.live;
  const eitherLive = stage.live || nextStage?.live;

  return (
    <motion.div
      className="hidden sm:flex items-center justify-center shrink-0 w-8 lg:w-12"
      variants={connectorVariants}
      style={{ originX: 0 }}
    >
      {bothLive ? (
        <div className="relative w-full h-px">
          <div className="absolute inset-0 bg-electric/30" />
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-electric"
            animate={{ x: ["0%", "100%", "0%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
          />
        </div>
      ) : eitherLive ? (
        /* Adjacent to at least one live stage - keep the spine visible */
        <div className="relative w-full h-px">
          <div className="absolute inset-0 bg-electric/15" />\n          <motion.div
            className="absolute inset-y-0 left-0 w-1/3 bg-electric/50"
            animate={{ x: ["0%", "200%", "0%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          />
        </div>
      ) : (
        <div className="w-full h-px bg-border/30" />
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  NEXT STAGE NODE (roadmap stage - confident, intentional)             */
/* ------------------------------------------------------------------ */

function NextStageNode({ stage }: { stage: RailStage }) {
  const [open, setOpen] = useState(false);
  const Icon = stage.icon;

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <motion.div
          className="relative flex flex-col items-center gap-2 cursor-default select-none px-2 sm:px-0"
          variants={nodeVariants}
          onClick={() => setOpen(true)}
        >
          <div className="relative">
            {/* Subtle electric glow behind the node */}
            <div className="absolute -inset-2 rounded-2xl bg-electric/[0.03] pointer-events-none" />
            <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-electric/15 bg-surface">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-electric/40" />
            </div>
          </div>
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-foreground/50">
            {stage.label}
          </span>
          {/* Always-visible NEXT badge */}
          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-electric/20 text-electric/50 bg-electric/[0.06]">
            Next
          </span>
          <span className="hidden sm:block text-[10px] text-muted-foreground/40 text-center leading-tight max-w-[100px]">
            {stage.sublabel}
          </span>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-surface border-border/60 text-muted-foreground text-xs font-mono"
      >
        {stage.tooltipLine}
      </TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  LIVE STAGE NODE                                                     */
/* ------------------------------------------------------------------ */

function LiveStageNode({ stage }: { stage: RailStage }) {
  const Icon = stage.icon;

  const content = (
    <motion.div
      className="relative flex flex-col items-center gap-2 group px-2 sm:px-0"
      variants={nodeVariants}
    >
      {/* Glow behind icon on desktop */}
      <div className="hidden sm:block absolute -inset-3 rounded-2xl bg-electric/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-electric/20 bg-surface">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-electric" />
      </div>
      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-electric">
        {stage.label}
      </span>
      <span className="hidden sm:block text-[10px] text-muted-foreground/60 text-center leading-tight max-w-[100px]">
        {stage.sublabel}
      </span>
    </motion.div>
  );

  if (stage.href) {
    return (
      <Link href={stage.href} className="hover:no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

/* ------------------------------------------------------------------ */
/*  STAGE NODE (router)                                                 */
/* ------------------------------------------------------------------ */

function StageNode({ stage }: { stage: RailStage }) {
  if (!stage.live) return <NextStageNode stage={stage} />;
  return <LiveStageNode stage={stage} />;
}

/* ------------------------------------------------------------------ */
/*  MOBILE CONNECTOR (vertical chevron for small screens)               */
/* ------------------------------------------------------------------ */

function MobileConnector() {
  return (
    <div className="flex sm:hidden items-center justify-center py-1">
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/20 rotate-90" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FULL RAIL (homepage)                                                */
/* ------------------------------------------------------------------ */

export function TransformationRail() {
  return (
    <motion.div
      className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 sm:pb-28"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {/* Section label */}
      <motion.div
        className="font-mono text-xs tracking-widest uppercase text-electric/70 mb-2 text-center"
        variants={nodeVariants}
      >
        The Pipeline
      </motion.div>

      <motion.div
        className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 sm:mb-16"
        variants={nodeVariants}
      >
        One Offer.
        <span className="text-electric"> Many Angles.</span> One Campaign.
      </motion.div>

      {/* Rail row - desktop */}
      <div className="hidden sm:flex items-center justify-center">
        {RAIL_STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            <StageNode stage={stage} />
            {i < RAIL_STAGES.length - 1 && <Connector index={i} />}
          </div>
        ))}
      </div>

      {/* Rail grid - mobile (2 columns wrapping) */}
      <div className="sm:hidden grid grid-cols-2 gap-x-4 gap-y-2 justify-items-center">
        {RAIL_STAGES.map((stage, i) => (
          <div key={stage.id}>
            <StageNode stage={stage} />
            {i < RAIL_STAGES.length - 1 && i % 2 === 1 && <MobileConnector />}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPACT RAIL (generator progress indicator)                         */
/* ------------------------------------------------------------------ */

export interface CompactRailProps {
  /** 1=paste, 2=generating, 3=review/output */
  currentStep: number;
}

function getStageState(
  stageId: string,
  currentStep: number
): "done" | "active" | "next" | "locked" {
  if (stageId === "offer") {
    return currentStep >= 1 ? (currentStep > 1 ? "done" : "active") : "next";
  }
  if (stageId === "angles") {
    return currentStep >= 3 ? "done" : currentStep === 2 ? "active" : "next";
  }
  if (stageId === "output") {
    return currentStep >= 3 ? "active" : "next";
  }
  if (stageId === "compliance") {
    return "next";
  }
  return "locked";
}

function getProgressLabel(currentStep: number): string {
  if (currentStep >= 3) return "Output";
  if (currentStep === 2) return "Generating...";
  if (currentStep === 1) return "Offer";
  return "";
}

function CompactNode({
  stage,
  state,
}: {
  stage: RailStage;
  state: "done" | "active" | "next" | "locked";
}) {
  const Icon = stage.icon;

  if (state === "locked") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-electric/10 text-electric/35 select-none">
        <Icon className="h-3 w-3" />
        <span className="font-mono text-[10px] uppercase tracking-wider hidden md:inline">
          {stage.label}
        </span>
        <span className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-px rounded-full border border-electric/15 text-electric/40 bg-electric/[0.05]">
          Next
        </span>
      </div>
    );
  }

  const styles =
    state === "active"
      ? "bg-electric/10 text-electric border border-electric/20"
      : state === "done"
        ? "text-electric/60"
        : "text-muted-foreground/40";

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${styles}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="font-mono text-[10px] uppercase tracking-wider hidden md:inline">
        {stage.label}
      </span>
    </div>
  );
}

export function CompactTransformationRail({ currentStep }: CompactRailProps) {
  const progressLabel = getProgressLabel(currentStep);

  return (
    <div>
      <div className="flex items-center gap-1 sm:gap-2 mt-6 mb-1 flex-wrap">
        {RAIL_STAGES.map((stage, i) => {
          const stageState = getStageState(stage.id, currentStep);
          return (
            <div key={stage.id} className="flex items-center">
              {i > 0 && (
                <span
                  className={`h-px w-3 sm:w-4 mr-1 sm:mr-1 ${
                    stageState === "locked"
                      ? "bg-electric/10"
                      : stageState === "done" || stageState === "active"
                        ? "bg-electric/40"
                        : "bg-border/30"
                  }`}
                />
              )}
              <CompactNode stage={stage} state={stageState} />
            </div>
          );
        })}
      </div>
      {progressLabel && (
        <p className="font-mono text-[10px] text-muted-foreground/50 mb-2">
          Current stage: {progressLabel}
        </p>
      )}
    </div>
  );
}
