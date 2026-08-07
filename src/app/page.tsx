"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

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
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
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
            <span className="text-electric">Start Architecting Systems.</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Built for affiliates working high-risk, tightly-restricted verticals
            — where generic AI copy gets accounts banned.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-sm cursor-pointer"
            >
            {/* PLACEHOLDER CTA — Christopher will provide real Gumroad URL once listing is live */}
              <a href="#">
                Get Nectar Engine
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */
      /*  SECTION TEASERS                                              */
      /* ============================================================ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-24 sm:pb-32">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              tag: "Pipeline",
              title: "The 9 Modules",
              desc: "A closed-loop system from research to packaged output. Each module feeds the next.",
              href: "/modules",
            },
            {
              tag: "Output",
              title: "Sample Output",
              desc: "See a full toolkit generated for a generic demo offer — headlines, copy, sequences, and more.",
              href: "/sample",
            },
            {
              tag: "Risk",
              title: "Compliance Matrix",
              desc: "Real platform-by-platform risk data across X, TikTok, Instagram, Facebook, and 5 more.",
              href: "/compliance",
            },
          ].map((card, i) => (
            <motion.div
              key={card.href}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <Link
                href={card.href}
                className="group block rounded-xl border border-border/60 bg-surface p-6 transition-colors hover:bg-surface-raised hover:border-electric/20"
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-electric mb-2">
                  {card.tag}
                </p>
                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-electric transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {card.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-electric/70 group-hover:text-electric transition-colors font-medium">
                  View <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
