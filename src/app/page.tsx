"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, ShieldCheck, Sparkles, WandSparkles, ScanLine, Layers3 } from "lucide-react";
import Link from "next/link";
import { TransformationRail } from "@/components/transformation-rail";
import { GUMROAD_URL } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const previewStages = [
  { label: "OFFER", value: "OhChat · PPS", tone: "text-electric border-electric/40 bg-electric/[0.12] shadow-[0_0_24px_rgba(34,184,255,0.08)]" },
  { label: "DIRECTIONS", value: "3 campaign directions", tone: "text-fuchsia-200 border-fuchsia-400/30 bg-fuchsia-400/[0.09] shadow-[0_0_24px_rgba(217,70,239,0.07)]" },
  { label: "OUTPUT", value: "9 platform-ready posts", tone: "text-lime-200 border-lime-400/30 bg-lime-400/[0.08] shadow-[0_0_24px_rgba(163,230,53,0.06)]" },
  { label: "PROTECT", value: "Pass · Warn · Fail", tone: "text-amber-200 border-amber-400/30 bg-amber-400/[0.09] shadow-[0_0_24px_rgba(251,191,36,0.06)]" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.075]"
          style={{
            backgroundImage:
              "linear-gradient(#22b8ff 1px, transparent 1px), linear-gradient(90deg, #22b8ff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute left-[8%] top-10 h-96 w-96 rounded-full bg-fuchsia-500/[0.13] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute right-[7%] top-24 h-[28rem] w-[28rem] rounded-full bg-electric/[0.16] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-[54%] h-80 w-80 -translate-x-1/2 rounded-full bg-lime-400/[0.07] blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <motion.p
            className="font-mono text-xs tracking-widest uppercase text-electric mb-5 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Nectar Engine · Affiliate Content Transformation
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.02] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            One Offer.
            <br />
            <span className="bg-gradient-to-r from-electric via-fuchsia-300 to-lime-200 bg-clip-text text-transparent">
              Multiple Campaign Directions. Nine Platforms.
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Paste an affiliate offer once. Nectar extracts what matters, turns the source into distinct campaign directions and platform-ready content, then checks the copy before you publish it.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-electric hover:bg-sky-300 text-[#071019] font-bold tracking-wide px-8 h-12 text-sm cursor-pointer shadow-[0_0_30px_rgba(34,184,255,0.25)]"
            >
              <a href={GUMROAD_URL} target="_blank" rel="noreferrer">
                Get Nectar Engine
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-7 border-white/20 bg-white/[0.035] text-zinc-100 hover:border-electric/60 hover:bg-electric/[0.08] hover:text-white"
            >
              <Link href="/generator">
                Try the Generator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-electric" /> Offer-aware generation</span>
            <span className="inline-flex items-center gap-1.5"><WandSparkles className="h-3.5 w-3.5 text-fuchsia-300" /> 9-platform output</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-lime-300" /> Compliance checking</span>
          </motion.div>

          <motion.div
            className="relative mx-auto mt-12 max-w-5xl rounded-2xl border border-white/15 bg-[#171b26]/90 p-3 sm:p-5 shadow-2xl shadow-black/40 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-electric/35 via-fuchsia-400/25 to-lime-300/25 opacity-90" aria-hidden="true" />
            <div className="relative flex items-center gap-2 px-2 pb-3 text-left">
              <ScanLine className="h-4 w-4 text-electric" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-300">Watch the transformation</span>
            </div>
            <div className="relative grid gap-2 sm:grid-cols-4">
              {previewStages.map((stage, i) => (
                <div key={stage.label} className="relative">
                  <motion.div
                    className={`rounded-xl border px-3 py-3 text-left ${stage.tone}`}
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
                  >
                    <div className="font-mono text-[9px] tracking-[0.18em] opacity-80">{stage.label}</div>
                    <div className="mt-1 text-xs sm:text-sm font-semibold text-white">{stage.value}</div>
                  </motion.div>
                  {i < previewStages.length - 1 && (
                    <motion.div
                      className="hidden sm:block absolute top-1/2 -right-2 z-10 h-px w-3 bg-gradient-to-r from-electric via-fuchsia-400 to-lime-300 shadow-[0_0_8px_rgba(34,184,255,0.5)]"
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="relative mt-3 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              <Layers3 className="h-3 w-3 text-electric" /> One source, structured into usable decisions
            </div>
          </motion.div>
        </div>
      </section>

      <TransformationRail />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-4 pb-24 sm:pb-32">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              tag: "SEE THE SYSTEM",
              title: "How Nectar Works",
              desc: "See the architecture behind the transformation, with shipped capabilities separated from the next layer.",
              href: "/modules",
            },
            {
              tag: "SEE THE OUTPUT",
              title: "Sample Output",
              desc: "Explore a transparent example of the kind of structured content Nectar produces from one offer.",
              href: "/sample",
            },
            {
              tag: "PROTECT THE COPY",
              title: "Compliance Scanner",
              desc: "Check generated content for platform-specific risk signals and get a safer rewrite when needed.",
              href: "/scanner",
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
                className="group block h-full rounded-xl border border-white/12 bg-[#181c27] p-6 transition-all hover:-translate-y-1 hover:bg-[#202533] hover:border-electric/40 hover:shadow-lg hover:shadow-electric/10"
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-electric mb-2 font-semibold">
                  {card.tag}
                </p>
                <h3 className="text-lg font-bold tracking-tight mb-2 text-white group-hover:text-electric transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  {card.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-electric/80 group-hover:text-electric transition-colors font-semibold">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
