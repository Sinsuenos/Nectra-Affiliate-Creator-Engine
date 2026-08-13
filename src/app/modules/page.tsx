"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NectarOrbs } from "@/components/nectar-orbs";
import { BottomNavRow } from "@/components/BottomNavRow";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

const LIVE_MODULES = [
  {
    id: "M02",
    name: "Compliance Scanner",
    link: "/scanner",
    oneLiner: "Checks generated copy for platform-specific risk signals and returns flagged phrases, reasons, and safer rewrites.",
    capabilities: ["Pass / Warn / Fail per platform", "Flagged phrase extraction", "Safer rewrite suggestions"],
  },
  {
    id: "M04",
    name: "Copy Generator",
    link: "/generator",
    oneLiner: "Turns an offer into platform-aware social content with editable offer fields and character counts.",
    capabilities: ["Multi-angle generation", "Platform-specific posts", "Character count validation"],
  },
];

const PARTIAL_MODULE = {
  id: "M09",
  name: "Output Package",
  oneLiner: "The packaging concept behind Nectar — structured platform output with deeper campaign packaging next.",
  capabilities: ["Usable content output", "Platform variants"],
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
  }),
};

function LiveModuleCard({ mod, index }: { mod: (typeof LIVE_MODULES)[number]; index: number }) {
  return (
    <motion.article
      className="rounded-xl border border-electric/20 border-l-2 border-l-electric/40 bg-[#13121f]/80 backdrop-blur-sm overflow-hidden"
      variants={fadeUp}
      custom={index}
    >
      <div className="px-5 sm:px-6 py-5 sm:py-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-mono text-[11px] text-electric/70">{mod.id}</span>
              <span className="inline-flex items-center rounded-full border border-electric/30 bg-electric/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-electric">LIVE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{mod.name}</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{mod.oneLiner}</p>
        <div className="mb-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">Capabilities</p>
          <ul className="space-y-1.5">
            {mod.capabilities.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-foreground/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={mod.link}
          className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/[0.06] px-4 py-2 font-mono text-[11px] font-semibold tracking-wider text-electric hover:bg-electric/15 transition-colors"
        >
          Open module
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
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
        <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>What Nectar does today</motion.h1>
        <motion.p className="mt-4 text-muted-foreground max-w-2xl text-base sm:text-lg leading-relaxed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          Two modules are live and ready to use. A third is in progress. Everything else is on the drawing board — not advertised as coming soon, not behind a paywall, just future product direction.
        </motion.p>
      </section>

      <Separator className="bg-border/30" />

      {/* LIVE modules — prominent */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {LIVE_MODULES.map((mod, i) => (
            <LiveModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </motion.div>
      </section>

      {/* PARTIAL module — de-emphasized */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
        <motion.div
          className="rounded-xl border border-amber-400/15 border-l-2 border-l-amber-400/25 bg-[#13121f]/60 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
        >
          <div className="px-5 sm:px-6 py-5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-mono text-[11px] text-amber-400/60">{PARTIAL_MODULE.id}</span>
              <span className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/[0.08] px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-amber-300">PARTIAL</span>
            </div>
            <h3 className="text-base font-bold tracking-tight text-foreground mb-2">{PARTIAL_MODULE.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{PARTIAL_MODULE.oneLiner}</p>
            <div>
              <ul className="space-y-1.5">
                {PARTIAL_MODULE.capabilities.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-foreground/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NEXT modules — single condensed line */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
        <motion.p
          className="text-xs text-muted-foreground/50 leading-relaxed"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          <Layers className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-muted-foreground/40" aria-hidden="true" />
          Additional modules in development: Niche Intelligence, Content Architecture, Funnel Blueprint, Email Sequence Engine, Landing Page Builder, and Analytics Framework.
        </motion.p>
      </section>

      {/* Closing statement — keep intact */}
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
            <p className="text-sm text-zinc-200 leading-relaxed max-w-3xl">
              Today, that core loop is real. Context intelligence and deeper campaign orchestration are the next expansion, which is why they are visible in the product story without being disguised as finished features.
            </p>
          </div>
        </motion.div>
      </section>
      <BottomNavRow />
    </>
  );
}