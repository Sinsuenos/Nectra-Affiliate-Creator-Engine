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
/*  MODULE DATA                                                        */
/* ------------------------------------------------------------------ */
const MODULES = [
  {
    id: "M01",
    name: "Niche Intelligence",
    icon: Terminal,
    summary:
      "Scrapes search trends, competitor content, and audience signals across platforms to identify profitable niches with low saturation and high buyer intent.",
    inputs: ["Seed keywords", "Target geography", "Content category"],
    outputs: [
      "Niche score (0-100)",
      "Competitor gap analysis",
      "Audience persona draft",
    ],
  },
  {
    id: "M02",
    name: "Compliance Scanner",
    icon: ShieldCheck,
    summary:
      "Runs every generated piece of content against a reference ruleset of platform policies, FTC disclosure requirements, and network-specific restrictions.",
    inputs: ["Generated content", "Target platforms", "Offer category"],
    outputs: [
      "Pass/Warn/Fail per platform",
      "Specific policy violations",
      "Suggested rewrites",
    ],
  },
  {
    id: "M03",
    name: "Content Architecture",
    icon: Layers,
    summary:
      "Maps out a full content strategy: pillar topics, cluster articles, editorial cadence, and channel mix — all from the niche intelligence gathered in M01.",
    inputs: ["Niche intelligence output", "Content goals", "Channel preferences"],
    outputs: [
      "Content calendar (30/60/90 day)",
      "Pillar-cluster map",
      "Channel allocation plan",
    ],
  },
  {
    id: "M04",
    name: "Copy Generator",
    icon: Zap,
    summary:
      "Produces headlines, body copy, CTAs, and A/B variations calibrated to the target audience persona and platform format constraints from M03.",
    inputs: ["Content architecture", "Audience persona", "Platform specs"],
    outputs: [
      "4 headline variants",
      "Landing page body copy",
      "CTA variations",
    ],
  },
  {
    id: "M05",
    name: "Funnel Blueprint",
    icon: Layers,
    summary:
      "Designs the full conversion path: opt-in structure, lead magnet alignment, upsell sequence logic, and page hierarchy — without writing the pages themselves.",
    inputs: ["Offer details", "Content architecture", "Audience persona"],
    outputs: [
      "Funnel stage map",
      "Page hierarchy document",
      "Conversion point definitions",
    ],
  },
  {
    id: "M06",
    name: "Email Sequence Engine",
    icon: Mail,
    summary:
      "Generates multi-day email sequences with subject lines, preview text, body copy, and send-day cadence — all compliant with CAN-SPAM and platform sender rules.",
    inputs: ["Funnel blueprint", "Offer details", "Sequence length"],
    outputs: [
      "Subject line + preview pairs",
      "Full email body per send",
      "Send-day scheduling map",
    ],
  },
  {
    id: "M07",
    name: "Landing Page Builder",
    icon: Layout,
    summary:
      "Assembles structured landing page wireframes: section order, copy placement, CTA positioning, and responsive layout guidance — ready for final design.",
    inputs: ["Copy from M04", "Funnel blueprint from M05", "Brand tokens"],
    outputs: [
      "Section-by-section wireframe",
      "Copy placement map",
      "Mobile/desktop layout notes",
    ],
  },
  {
    id: "M08",
    name: "Analytics Framework",
    icon: BarChart3,
    summary:
      "Generates tracking plans: which events to fire, where to place UTM parameters, how to structure conversion goals, and what KPIs to measure at each funnel stage.",
    inputs: ["Funnel blueprint", "Landing page wireframe", "Traffic sources"],
    outputs: [
      "Event taxonomy",
      "UTM naming convention",
      "KPI dashboard spec",
    ],
  },
  {
    id: "M09",
    name: "Output Package",
    icon: Package,
    summary:
      "Collects all module outputs into a single organized, versioned deliverable — structured files ready for review, editing, and manual use across your chosen platforms.",
    inputs: ["All module outputs (M01-M08)", "Format preferences"],
    outputs: [
      "Consolidated output package",
      "Per-platform content sheets",
      "Compliance audit trail",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  SINGLE MODULE CARD                                                 */
/* ------------------------------------------------------------------ */
function ModuleCard({
  mod,
  index,
}: {
  mod: (typeof MODULES)[number];
  index: number;
}) {
  const Icon = mod.icon;
  return (
    <motion.article
      className="rounded-xl border border-border/60 bg-surface overflow-hidden"
      variants={fadeUp}
      custom={index}
    >
      {/* Header bar */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-surface-raised">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric/10">
          <Icon className="h-4 w-4 text-electric" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              {mod.id}
            </span>
            <span className="h-3 w-px bg-border" />
            <h3 className="text-base font-bold tracking-tight truncate">
              {mod.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {mod.summary}
        </p>

        {/* Inputs and Outputs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Inputs
            </p>
            <ul className="space-y-1">
              {mod.inputs.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-foreground/70"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Outputs
            </p>
            <ul className="space-y-1">
              {mod.outputs.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-foreground/70"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function ModulesPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        <motion.p
          className="font-mono text-xs tracking-widest uppercase text-electric mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Pipeline
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          The 9 Modules
        </motion.h1>
        <motion.p
          className="mt-4 text-muted-foreground max-w-xl text-base sm:text-lg leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Each module feeds the next. No manual handoffs, no broken
          chains — a closed-loop system from research to packaged output.
        </motion.p>
      </section>

      <Separator className="bg-border/40" />

      {/* Module cards */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          className="grid gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {MODULES.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </motion.div>
      </section>

      {/* Pipeline summary */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 sm:pb-28">
        <Separator className="bg-border/40 mb-16 sm:mb-20" />
        <motion.div
          className="rounded-xl border border-border/60 bg-surface p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold tracking-tight mb-3">
            How the Pipeline Flows
          </h3>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {MODULES.map((mod, i) => (
              <span key={mod.id} className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-electric/10 text-electric">
                  {mod.id}
                </span>
                {i < MODULES.length - 1 && (
                  <span className="text-muted-foreground/40">→</span>
                )}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            M01 through M08 each produce structured output that becomes the
            input for the next module. M09 consolidates everything into a
            single versioned package — ready for your review and manual
            use across chosen platforms.
          </p>
        </motion.div>
      </section>
    </>
  );
}
