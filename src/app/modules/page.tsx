"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import {
  Terminal,
  ShieldCheck,
  Layers,
  Zap,
  FileOutput,
  Mail,
  Layout,
  BarChart3,
  Package,
  LockKeyhole,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

const MODULES = [
  {
    id: "M01", name: "Niche Intelligence", icon: Terminal, state: "NEXT",
    summary: "The planned research layer for turning a niche, audience, and market context into structured inputs.",
    inputs: ["Seed keywords", "Target geography", "Content category"],
    outputs: ["Niche signals", "Audience context", "Research inputs"],
  },
  {
    id: "M02", name: "Compliance Scanner", icon: ShieldCheck, state: "LIVE",
    summary: "Checks generated copy for platform-specific risk signals and can return flagged phrases, a reason, and a safer rewrite.",
    inputs: ["Generated content", "Target platforms", "Offer context"],
    outputs: ["Pass / Warn / Fail", "Flagged phrases", "Safer rewrite"],
  },
  {
    id: "M03", name: "Content Architecture", icon: Layers, state: "NEXT",
    summary: "The planned strategic layer for organizing themes, channels, and publishing structure around an offer.",
    inputs: ["Offer context", "Audience context", "Content goals"],
    outputs: ["Content structure", "Channel plan", "Topic directions"],
  },
  {
    id: "M04", name: "Copy Generator", icon: Zap, state: "LIVE",
    summary: "The current engine turns an offer into platform-aware social content with editable offer fields and character counts.",
    inputs: ["Offer details", "Audience", "Platform targets"],
    outputs: ["Angles", "Platform posts", "Character counts"],
  },
  {
    id: "M05", name: "Funnel Blueprint", icon: Layers, state: "NEXT",
    summary: "A planned campaign-design layer for mapping conversion paths around the generated content.",
    inputs: ["Offer details", "Content strategy", "Audience"],
    outputs: ["Journey map", "Page hierarchy", "Conversion points"],
  },
  {
    id: "M06", name: "Email Sequence Engine", icon: Mail, state: "NEXT",
    summary: "A planned long-form channel layer. It is not presented as a shipped automated email system today.",
    inputs: ["Offer details", "Audience", "Sequence goals"],
    outputs: ["Sequence structure", "Subject directions", "Email drafts"],
  },
  {
    id: "M07", name: "Landing Page Builder", icon: Layout, state: "NEXT",
    summary: "A planned presentation layer for turning strategy and copy into a landing-page structure.",
    inputs: ["Copy", "Campaign structure", "Brand direction"],
    outputs: ["Page structure", "Copy placement", "Layout guidance"],
  },
  {
    id: "M08", name: "Analytics Framework", icon: BarChart3, state: "NEXT",
    summary: "A planned measurement layer for defining events, attribution structure, and useful campaign signals.",
    inputs: ["Campaign structure", "Traffic sources", "Conversion goals"],
    outputs: ["Event plan", "UTM structure", "KPI definitions"],
  },
  {
    id: "M09", name: "Output Package", icon: Package, state: "PARTIAL",
    summary: "The packaging concept behind Nectar. Current generation already produces structured platform output; deeper campaign packaging is next.",
    inputs: ["Generated content", "Compliance results", "Future campaign layers"],
    outputs: ["Usable content", "Platform variants", "Future campaign package"],
  },
];

function ModuleCard({ mod, index }: { mod: (typeof MODULES)[number]; index: number }) {
  const Icon = mod.icon;
  const live = mod.state === "LIVE";
  return (
    <motion.article
      className={`rounded-xl border overflow-hidden ${live ? "border-electric/30 bg-surface shadow-lg shadow-electric/5" : "border-border/50 bg-surface/70"}`}
      variants={fadeUp}
      custom={index}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-surface-raised">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${live ? "bg-electric/10" : "bg-background"}`}>
          <Icon className={`h-4 w-4 ${live ? "text-electric" : "text-muted-foreground"}`} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">{mod.id}</span>
            <span className="h-3 w-px bg-border" />
            <h3 className="text-base font-bold tracking-tight truncate">{mod.name}</h3>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider ${live ? "border-electric/30 bg-electric/10 text-electric" : "border-border/50 bg-background text-muted-foreground"}`}>
          {!live && <LockKeyhole className="h-3 w-3" />}
          {mod.state}
        </span>
      </div>

      <div className="px-5 py-5 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">{mod.summary}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Inputs</p>
            <ul className="space-y-1">
              {mod.inputs.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-foreground/70"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric/50" />{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Outputs</p>
            <ul className="space-y-1">
              {mod.outputs.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-foreground/70"><span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${live ? "bg-electric" : "bg-muted-foreground/40"}`} />{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ModulesPage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        <motion.p className="font-mono text-xs tracking-widest uppercase text-electric mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Nectar Architecture</motion.p>
        <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>The system behind the transformation</motion.h1>
        <motion.p className="mt-4 text-muted-foreground max-w-2xl text-base sm:text-lg leading-relaxed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          Nectar is being built as a transformation engine, not nine disconnected tools. The badges below make the boundary explicit: <strong className="text-foreground">LIVE</strong> means you can use it now, <strong className="text-foreground">NEXT</strong> means it is part of the product direction, not a shipped capability.
        </motion.p>
      </section>

      <Separator className="bg-border/40" />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <motion.div className="grid gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {MODULES.map((mod, i) => <ModuleCard key={mod.id} mod={mod} index={i} />)}
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 sm:pb-28">
        <Separator className="bg-border/40 mb-12" />
        <motion.div className="rounded-xl border border-electric/20 bg-electric/[0.03] p-6 sm:p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-mono text-[11px] uppercase tracking-widest text-electric mb-3">The real product story</p>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">Offer → Angles → Output → Protection</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Today, that core loop is real. Context intelligence and deeper campaign orchestration are the next expansion, which is why they are visible in the product story without being disguised as finished features.
          </p>
        </motion.div>
      </section>
    </>
  );
}
