"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BottomNavRow } from "@/components/BottomNavRow";

const PLATFORMS = [
  ["X", "LOW"], ["TikTok", "MEDIUM"], ["Instagram", "MEDIUM"],
  ["Facebook", "MEDIUM"], ["Reddit", "HIGH"], ["Pinterest", "LOW"],
  ["Snapchat", "MEDIUM"], ["Discord", "MEDIUM"], ["Telegram", "MEDIUM"],
];

export default function Home() {
  return (
    <div>
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.67]" style={{ backgroundImage: "url(/nectar-bg-landing.png)" }} aria-hidden="true" />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#22b8ff 1px, transparent 1px), linear-gradient(90deg, #22b8ff 1px, transparent 1px)", backgroundSize: "64px 64px" }} aria-hidden="true" />
        <div className="pointer-events-none absolute right-[7%] top-24 h-[28rem] w-[28rem] rounded-full bg-electric/[0.14] blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <motion.p className="font-mono text-base sm:text-lg tracking-widest uppercase text-electric mb-5 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Nectar Engine · High-Risk Affiliate Engine</motion.p>
          <motion.h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.02] text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            One Offer.<br /><span className="bg-gradient-to-r from-electric via-fuchsia-300 to-lime-200 bg-clip-text text-transparent">Platform-aware campaigns. Risk-checked before you post.</span>
          </motion.h1>
          <motion.p className="mx-auto mt-6 max-w-3xl text-xl sm:text-2xl text-zinc-100 leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Paste a raw affiliate offer. Nectar extracts what matters, surfaces restrictions stated in the source, generates distinct content for nine platforms, and checks the copy for platform-specific risk signals before you publish.
          </motion.p>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <a href="https://sinaloainspired.gumroad.com/l/nectar-engine" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-electric px-7 h-12 text-lg font-semibold text-background hover:bg-electric/90">Get Nectar Engine <ArrowRight className="h-4 w-4" /></a>
            <Link href="/generator" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-black/20 px-7 h-12 text-lg font-semibold text-white hover:border-electric/50">Try the free Generator</Link>
          </div>
          <p className="mt-3 text-sm text-zinc-300">Free Generator: 3 generations, no signup. Paid Nectar Engine: full workflow + Compliance Scanner.</p>
          <div className="mt-7 space-y-1"><p className="text-2xl md:text-3xl font-light text-amber-400/90">Less beige corporate oatmeal.</p><p className="text-2xl md:text-3xl font-light text-amber-400/90">Fewer five-alarm compliance fires.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-2xl border border-white/15 bg-[#171b26]/90 p-6 sm:p-8 shadow-2xl">
          <p className="font-mono text-sm uppercase tracking-widest text-electric">Watch it work</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">One offer in. Angles, content, and compliance signals out.</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-5 font-mono text-sm text-zinc-300">
              <p className="text-electric mb-3">RAW OFFER</p>
              <p>Vertical: High-risk affiliate</p><p>Network: [network]</p><p>Offer: [offer]</p><p>Payout: [source value]</p><p className="mt-3 text-amber-300">Restrictions:</p><p>• [source restriction]</p><p>• [source restriction]</p><p>• [source restriction]</p>
            </div>
            <div className="rounded-xl border border-electric/20 bg-electric/[0.04] p-5">
              <p className="text-electric font-mono text-sm mb-3">NECTAR RETURNS</p>
              <p className="text-white font-semibold">Multiple campaign directions</p><p className="mt-1 text-zinc-300">Distinct platform-specific copy, not nine copies of the same post.</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300"><ShieldCheck className="h-4 w-4" /> Risk signals checked before publishing</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-14">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 sm:p-8">
          <p className="font-mono text-sm uppercase tracking-widest text-electric">Nine platforms, one source of truth</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">The same offer, different platform realities.</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PLATFORMS.map(([name, risk]) => <div key={name} className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 flex justify-between gap-3"><span className="font-mono text-sm text-zinc-200">{name}</span><span className="font-mono text-xs text-zinc-400">{risk}</span></div>)}
          </div>
          <Link href="/compliance" className="mt-5 inline-flex items-center gap-1.5 text-electric font-semibold">See the full Compliance Matrix <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-14">
        <div className="rounded-2xl border border-amber-500/20 bg-slate-900/80 p-6 sm:p-8">
          <p className="font-mono text-sm uppercase tracking-widest text-amber-300">Built for restricted verticals</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">The messy part is the point.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-200">Nectar is built for affiliates working where generic copy tools can miss platform rules, offer restrictions, or the difference between a clever angle and a costly mistake. The scanner gives you risk signals, not a magic compliance certificate.</p>
          <Link href="/faq" className="mt-5 inline-flex items-center gap-1.5 text-electric font-semibold">Read the FAQ <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="rounded-2xl border border-white/10 bg-[#171b26]/90 p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div><p className="font-mono text-sm uppercase tracking-widest text-electric">Free Generator</p><p className="mt-2 text-xl text-white font-semibold">3 free generations</p><p className="mt-2 text-zinc-300">A working taste of the offer-to-output engine, no signup.</p></div>
            <div><p className="font-mono text-sm uppercase tracking-widest text-electric">Nectar Engine · $47</p><p className="mt-2 text-xl text-white font-semibold">Generator + Compliance Scanner</p><p className="mt-2 text-zinc-300">The full workflow for turning source material into platform-aware campaigns and checking the copy before publishing.</p></div>
          </div>
          <a href="https://sinaloainspired.gumroad.com/l/nectar-engine" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-electric px-7 h-12 text-lg font-semibold text-background">Get Nectar Engine <ArrowRight className="h-4 w-4" /></a>
          <p className="mt-6 text-sm text-zinc-400">Nectar Engine provides strategic risk signals, not legal advice, guaranteed approval, reach, conversions, or immunity from platform moderation.</p>
        </div>
      </section>
      <BottomNavRow />
    </div>
  );
}
