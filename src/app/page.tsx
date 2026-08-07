"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Terminal,
  ShieldCheck,
  Layers,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  ANIMATION HELPERS                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  MODULE DATA (names only — content comes in Section 2)             */
/* ------------------------------------------------------------------ */
const MODULES = [
  { id: "M01", name: "Niche Intelligence", icon: Terminal },
  { id: "M02", name: "Compliance Scanner", icon: ShieldCheck },
  { id: "M03", name: "Content Architecture", icon: Layers },
  { id: "M04", name: "Copy Generator", icon: Zap },
  { id: "M05", name: "Funnel Blueprint", icon: Layers },
  { id: "M06", name: "Email Sequence Engine", icon: Terminal },
  { id: "M07", name: "Landing Page Builder", icon: Layers },
  { id: "M08", name: "Analytics Framework", icon: ShieldCheck },
  { id: "M09", name: "Deployment Pipeline", icon: Zap },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* ---- NAV ---- */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
            <span className="inline-block h-5 w-5 rounded-sm bg-electric" aria-hidden="true" />
            Nectra
          </span>
          <span className="hidden sm:inline text-xs font-mono text-muted-foreground tracking-wide">
            v1.0.0 — Section 1
          </span>
        </nav>
      </header>

      {/* ---- MAIN ---- */}
      <main className="flex-1">
        {/* ============================================================ */
        /*  HERO                                                        */
        /* ============================================================ */}
        <section className="relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-24 sm:py-36 text-center">
            <motion.p
              className="font-mono text-xs tracking-widest uppercase text-electric mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Affiliate Content Architecture System
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Stop Building Funnels.
              <br />
              <span className="text-electric">Start Deploying Systems.</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              A 9-module engine that architects, generates, and deploys
              compliant affiliate content systems. Built for operators who
              need infrastructure, not templates.
            </motion.p>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Button
                size="lg"
                className="bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-sm cursor-pointer"
              >
                Request Early Access
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <Separator className="bg-border/40" />

        {/* ============================================================ */
        /*  THE 9 MODULES                                                */
        /* ============================================================ */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.p
              className="font-mono text-xs tracking-widest uppercase text-electric mb-3"
              variants={fadeUp}
              custom={0}
            >
              Pipeline
            </motion.p>
            <motion.h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              variants={fadeUp}
              custom={1}
            >
              The 9 Modules
            </motion.h2>
            <motion.p
              className="mt-3 text-muted-foreground max-w-lg"
              variants={fadeUp}
              custom={2}
            >
              Each module feeds the next. No manual handoffs, no broken
              chains — a closed-loop system from research to deployment.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative grid gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {/* Vertical connector line */}
            <div
              className="pointer-events-none absolute left-[19px] top-3 bottom-3 w-px bg-border"
              aria-hidden="true"
            />

            {MODULES.map((mod, i) => (
              <motion.div
                key={mod.id}
                className="group relative flex items-center gap-4 rounded-lg border border-border/60 bg-surface px-5 py-4 transition-colors hover:bg-surface-raised hover:border-electric/20"
                variants={fadeUp}
                custom={i}
              >
                {/* Dot on the line */}
                <span className="relative z-10 flex h-[10px] w-[10px] shrink-0 rounded-full border-2 border-electric bg-background" />

                <span className="font-mono text-[11px] text-muted-foreground w-8 shrink-0">
                  {mod.id}
                </span>

                <mod.icon className="h-4 w-4 text-electric/60 shrink-0" />

                <span className="text-sm sm:text-base font-medium tracking-tight">
                  {mod.name}
                </span>

                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/40 group-hover:text-electric/60 transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <Separator className="bg-border/40" />

        {/* ============================================================ */
        /*  SAMPLE OUTPUT BLOCK (placeholder)                            */
        /* ============================================================ */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.p
              className="font-mono text-xs tracking-widest uppercase text-electric mb-3"
              variants={fadeUp}
              custom={0}
            >
              Output Preview
            </motion.p>
            <motion.h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              variants={fadeUp}
              custom={1}
            >
              What the Engine Produces
            </motion.h2>
            <motion.p
              className="mt-3 text-muted-foreground max-w-lg"
              variants={fadeUp}
              custom={2}
            >
              Every output is structured, versioned, and ready for review.
              Content arrives in standardized blocks — not loose drafts.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-10 rounded-xl border border-border/60 bg-surface p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Placeholder output block */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 rounded-full bg-electric/60" />
              <span className="font-mono text-xs text-muted-foreground">
                output_block_v1.0.json
              </span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground/60 uppercase">
                Placeholder
              </span>
            </div>

            <div className="space-y-4 font-mono text-sm">
              <div className="rounded-lg bg-background/60 border border-border/40 p-4">
                <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">
                  Headline
                </p>
                <p className="text-foreground/80">
                  [Generated headline will appear here]
                </p>
              </div>

              <div className="rounded-lg bg-background/60 border border-border/40 p-4">
                <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">
                  Body Copy
                </p>
                <p className="text-foreground/80">
                  [Generated body copy will appear here]
                </p>
              </div>

              <div className="rounded-lg bg-background/60 border border-border/40 p-4">
                <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">
                  CTA
                </p>
                <p className="text-foreground/80">
                  [Generated call-to-action will appear here]
                </p>
              </div>

              <div className="rounded-lg bg-background/60 border border-border/40 p-4">
                <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">
                  Compliance Flags
                </p>
                <p className="text-foreground/80">
                  [Compliance scan results will appear here]
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground/60 font-mono">
              Real output samples arrive in Section 2
            </p>
          </motion.div>
        </section>

        <Separator className="bg-border/40" />

        {/* ============================================================ */
        /*  COMPLIANCE MATRIX TEASER                                     */
        /* ============================================================ */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.p
              className="font-mono text-xs tracking-widest uppercase text-electric mb-3"
              variants={fadeUp}
              custom={0}
            >
              Compliance
            </motion.p>
            <motion.h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              variants={fadeUp}
              custom={1}
            >
              Built-In Compliance Matrix
            </motion.h2>
            <motion.p
              className="mt-3 text-muted-foreground max-w-lg"
              variants={fadeUp}
              custom={2}
            >
              Every piece of content is checked against platform policies,
              FTC guidelines, and network rules before it reaches you.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-10 overflow-x-auto rounded-xl border border-border/60"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-border/60 bg-surface-raised">
                  <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Checkpoint
                  </th>
                  <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Platform
                  </th>
                  <th className="text-center px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/30 last:border-0 hover:bg-surface-raised/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-foreground/70">
                      [Checkpoint {i + 1}]
                    </td>
                    <td className="px-5 py-3 text-foreground/70">
                      [Platform {i + 1}]
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-block h-2 w-2 rounded-full bg-electric/40" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-5 py-3 border-t border-border/40 bg-surface-raised">
              <p className="text-center text-[11px] text-muted-foreground/50 font-mono">
                Full compliance data and rule sets arrive in Section 3
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ============================================================ */
      /*  FOOTER                                                      */
      /* ============================================================ */}
      <footer className="mt-auto border-t border-border/60 bg-surface">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <span
                className="inline-block h-4 w-4 rounded-sm bg-electric"
                aria-hidden="true"
              />
              Nectra Engine
            </span>

            <nav
              className="flex items-center gap-6 text-xs text-muted-foreground"
              aria-label="Footer navigation"
            >
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Refund Policy
              </a>
            </nav>
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground/40 font-mono">
            &copy; {new Date().getFullYear()} Nectra Engine. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
