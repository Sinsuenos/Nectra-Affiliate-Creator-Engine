"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TransformationRail } from "@/components/transformation-rail";
import { BottomNavRow } from "@/components/BottomNavRow";

export default function Home() {
  return (
    <div>
      {/* Full-page background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.67]"
        style={{ backgroundImage: 'url(/nectar-bg-landing.png)' }}
        aria-hidden="true"
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.075]" style={{ backgroundImage: "linear-gradient(#22b8ff 1px, transparent 1px), linear-gradient(90deg, #22b8ff 1px, transparent 1px)", backgroundSize: "64px 64px" }} aria-hidden="true" />
        <div className="pointer-events-none absolute left-[8%] top-10 h-96 w-96 rounded-full bg-fuchsia-500/[0.13] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute right-[7%] top-24 h-[28rem] w-[28rem] rounded-full bg-electric/[0.16] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-[54%] h-80 w-80 -translate-x-1/2 rounded-full bg-lime-400/[0.07] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[620px] max-w-7xl overflow-hidden" aria-hidden="true">
          <img src="/nectar-atmosphere.svg" alt="" className="absolute right-[-18%] top-10 w-[72%] max-w-5xl opacity-[0.16] mix-blend-screen blur-[1px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <motion.p className="font-mono text-lg sm:text-xl tracking-widest uppercase text-electric mb-5 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>Nectar Engine · Affiliate Content Transformation</motion.p>
          <motion.h1 className="text-6xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.02] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.35)]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            One Offer.<br /><span className="bg-gradient-to-r from-electric via-fuchsia-300 to-lime-200 bg-clip-text text-transparent">Nine Platform-Ready Campaigns.</span>
          </motion.h1>
          <motion.p className="mx-auto mt-6 max-w-2xl text-xl sm:text-2xl text-zinc-100 leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>Paste an affiliate offer once. Nectar extracts what matters, turns the source into distinct campaign directions and platform-ready content, then checks the copy before you publish it.</motion.p>
          <div className="mt-6 space-y-1">
            <p className="text-4xl md:text-5xl font-light text-amber-400/90">
              Less beige corporate oatmeal.
            </p>
            <p className="text-4xl md:text-5xl font-light text-amber-400/90">
              Fewer five‑alarm compliance fires.
            </p>
          </div>
        </div>
      </section>

      {/* ── PIPELINE DIAGRAM (gradient border from removed Watch the Transformation box) ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-electric/35 via-fuchsia-400/25 to-lime-300/25 opacity-90" aria-hidden="true" />
          <div className="relative rounded-2xl border border-white/15 bg-[#171b26]/90 backdrop-blur-sm shadow-2xl shadow-black/40">
            <TransformationRail />
          </div>
        </div>
      </div>

      {/* ── FAQ SNIPPET (untouched) ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          className="relative rounded-2xl overflow-hidden p-[2px]"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 rounded-2xl" aria-hidden="true" />
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">🔥</span>
              From the FAQ: Five-Alarm Burnout
            </h3>
            <p className="text-lg font-semibold text-amber-300 mb-2">Is it true that Nectar Engine was built during what you call a five-alarm creative burnout fire?</p>
            <p className="text-lg text-zinc-100 leading-relaxed mb-5">Absolutely. We started coding after our third straight late-night brainstorm where every &apos;safe&apos; post felt like beige wallpaper. Nectar Engine was born from exhaustion, sarcasm, and the desperate need for a tool that understood why &ldquo;compliant&rdquo; doesn&apos;t have to mean &ldquo;boring.&rdquo;</p>
            <Link href="/faq" className="inline-flex items-center gap-1.5 text-lg font-semibold text-pink-400 hover:text-pink-300 transition-colors">
              Read all Frequently Awkward Questions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── MERGED FEATURE BLOCK (replaces two-column layout) ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-20">
        <motion.div
          className="relative rounded-2xl overflow-hidden p-[2px]"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 rounded-2xl" aria-hidden="true" />
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Your offer is the source material.
            </h3>
            <p className="text-lg text-zinc-100 leading-relaxed mb-3">
              Nectar Engine takes a raw affiliate offer and extracts its core value, angles, and compliance risks. Then it turns that into platform-specific content that actually works.
            </p>
            <p className="text-lg text-zinc-100 leading-relaxed">
              Less prompting. More producing. No more staring at a blank page trying to figure out what to say.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── BOTTOM NAV ROW ── */}
      <BottomNavRow />
    </div>
  );
}
