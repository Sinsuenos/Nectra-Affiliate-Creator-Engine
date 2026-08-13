"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, ShieldCheck, Sparkles, WandSparkles, ScanLine, Layers3, BookOpen, Zap } from "lucide-react";
import Link from "next/link";
import { TransformationRail } from "@/components/transformation-rail";
import { BottomNextNav } from "@/components/BottomNextNav";
import { GUMROAD_URL } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } }),
};

const previewStages = [
  { label: "OFFER", value: "OhChat · PPS", tone: "text-electric border-electric/40 bg-electric/[0.12] shadow-[0_0_24px_rgba(34,184,255,0.08)]" },
  { label: "DIRECTIONS", value: "3 campaign directions", tone: "text-fuchsia-200 border-fuchsia-400/30 bg-fuchsia-400/[0.09] shadow-[0_0_24px_rgba(217,70,239,0.07)]" },
  { label: "OUTPUT", value: "9 platform-ready posts", tone: "text-lime-200 border-lime-400/30 bg-lime-400/[0.08] shadow-[0_0_24px_rgba(163,230,53,0.06)]" },
  { label: "PROTECT", value: "Pass · Warn · Fail", tone: "text-amber-200 border-amber-400/30 bg-amber-400/[0.09] shadow-[0_0_24px_rgba(251,191,36,0.06)]" },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#0b0a12] to-[#12101f]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.075]" style={{ backgroundImage: "linear-gradient(#22b8ff 1px, transparent 1px), linear-gradient(90deg, #22b8ff 1px, transparent 1px)", backgroundSize: "64px 64px" }} aria-hidden="true" />
        <div className="pointer-events-none absolute left-[8%] top-10 h-96 w-96 rounded-full bg-fuchsia-500/[0.13] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute right-[7%] top-24 h-[28rem] w-[28rem] rounded-full bg-electric/[0.16] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-[54%] h-80 w-80 -translate-x-1/2 rounded-full bg-lime-400/[0.07] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[620px] max-w-7xl overflow-hidden" aria-hidden="true">
          <img src="/nectar-atmosphere.svg" alt="" className="absolute right-[-18%] top-10 w-[72%] max-w-5xl opacity-[0.16] mix-blend-screen blur-[1px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <motion.p className="font-mono text-xs tracking-widest uppercase text-electric mb-5 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>Nectar Engine · Affiliate Content Transformation</motion.p>
          <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.02] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.35)]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            One Offer.<br /><span className="bg-gradient-to-r from-electric via-fuchsia-300 to-lime-200 bg-clip-text text-transparent">Multiple <span className="text-amber-400">Campaign</span> Directions. Nine Platforms.</span>
          </motion.h1>
          <motion.p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-200 leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>Paste an affiliate offer once. Nectar extracts what matters, turns the source into distinct campaign directions and platform-ready content, then checks the copy before you publish it.</motion.p>
          <div className="mt-6 space-y-1">
            <p className="text-2xl md:text-3xl font-light text-amber-400/90">
              Less beige corporate oatmeal.
            </p>
            <p className="text-2xl md:text-3xl font-light text-amber-400/90">
              Fewer five‑alarm compliance fires.
            </p>
          </div>
          <motion.div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}>
            <Button asChild size="lg" className="bg-electric hover:bg-sky-300 text-[#071019] font-bold tracking-wide px-8 h-12 text-sm cursor-pointer shadow-[0_0_30px_rgba(34,184,255,0.25)]"><a href={GUMROAD_URL} target="_blank" rel="noreferrer">Get Nectar Engine<ChevronRight className="ml-2 h-4 w-4" /></a></Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 border-white/20 bg-white/[0.035] text-zinc-100 hover:border-electric/60 hover:bg-electric/[0.08] hover:text-white"><Link href="/generator">Try the Generator<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </motion.div>
          <motion.div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }}>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-electric" /> Offer-aware generation</span><span className="inline-flex items-center gap-1.5"><WandSparkles className="h-3.5 w-3.5 text-fuchsia-300" /> 9-platform output</span><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-lime-300" /> Compliance checking</span>
          </motion.div>
          <motion.div className="relative mx-auto mt-12 max-w-5xl rounded-2xl border border-white/15 bg-[#171b26]/90 p-3 sm:p-5 shadow-2xl shadow-black/40 backdrop-blur-sm" initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.65 }}>
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-electric/35 via-fuchsia-400/25 to-lime-300/25 opacity-90" aria-hidden="true" />
            <div className="relative flex items-center gap-2 px-2 pb-3 text-left"><ScanLine className="h-4 w-4 text-electric" /><span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-200">Watch the transformation</span></div>
            <div className="relative grid gap-2 sm:grid-cols-4">{previewStages.map((stage, i) => <div key={stage.label} className="relative"><motion.div className={`rounded-xl border px-3 py-3 text-left ${stage.tone}`} animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}><div className="font-mono text-[10px] tracking-[0.18em] opacity-80">{stage.label}</div><div className="mt-1 text-sm sm:text-base font-semibold text-white">{stage.value}</div></motion.div>{i < previewStages.length - 1 && <motion.div className="hidden sm:block absolute top-1/2 -right-2 z-10 h-px w-3 bg-gradient-to-r from-electric via-fuchsia-400 to-lime-300 shadow-[0_0_8px_rgba(34,184,255,0.5)]" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }} />}</div>)}</div>
            <div className="relative mt-3 flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-widest text-zinc-300"><Layers3 className="h-3 w-3 text-electric" /> One source, structured into usable decisions</div>
          </motion.div>
        </div>
      </section>

      <TransformationRail />

      {/* FAQ Snippet */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          className="relative rounded-2xl overflow-hidden p-[2px]"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 rounded-2xl" aria-hidden="true" />
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-4 flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">🔥</span>
              From the FAQ: Five-Alarm Burnout
            </h3>
            <p className="text-sm font-semibold text-amber-300 mb-2">Is it true that Nectar Engine was built during what you call a five-alarm creative burnout fire?</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-5">Absolutely. We started coding after our third straight late-night brainstorm where every 'safe' post felt like beige wallpaper. Nectar Engine was born from exhaustion, sarcasm, and the desperate need for a tool that understood why &ldquo;compliant&rdquo; doesn't have to mean &ldquo;boring.&rdquo;</p>
            <Link href="/faq" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors">
              Read all Frequently Awkward Questions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] items-stretch">
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0a0f19] min-h-[320px] shadow-2xl shadow-black/30">
            <img src="/nectar-glow.svg" alt="Nectar campaign atmosphere" className="absolute inset-0 h-full w-full object-cover opacity-90" /><div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/90 via-[#070b14]/45 to-transparent" />
            <div className="relative z-10 flex h-full max-w-lg flex-col justify-end p-7 sm:p-10 text-left"><p className="font-mono text-xs tracking-[0.2em] uppercase text-electric font-semibold">The Nectar layer</p><h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">Your offer is the source material.</h2><p className="mt-4 text-base leading-relaxed text-zinc-200">Nectar turns the facts you already have into usable campaign decisions, platform-specific copy, and a protection pass before publishing.</p></div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-[#141a27] p-7 sm:p-10 text-left flex flex-col justify-center"><p className="font-mono text-xs tracking-[0.2em] uppercase text-fuchsia-200 font-semibold">Built for the real workflow</p><h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">Less prompting. More producing.</h2><p className="mt-4 text-base leading-relaxed text-zinc-200">Start with factual offer details from your CPA network. Get structured campaign directions, nine-platform output, and compliance checks from the same source.</p><Link href="/generator" className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-electric px-5 py-3 text-sm font-bold text-[#071019] hover:bg-sky-300 transition-colors">Try the Generator <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 sm:pb-28"><div className="relative overflow-hidden rounded-2xl border border-electric/25 bg-[#080c15] min-h-[250px]"><img src="/nectar-cta.svg" alt="Nectar visual" className="absolute inset-0 h-full w-full object-cover opacity-85" /><div className="absolute inset-0 bg-gradient-to-r from-[#070a12] via-[#070a12]/65 to-transparent" /><div className="relative z-10 max-w-xl p-8 sm:p-12 text-left"><p className="font-mono text-xs tracking-[0.2em] uppercase text-lime-200 font-semibold">Ready when the offer is</p><h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">Turn the offer on.</h2><p className="mt-4 text-base text-zinc-200 leading-relaxed">Bring the facts. Nectar handles the transformation.</p><a href={GUMROAD_URL} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-electric px-6 py-3 text-sm font-bold text-[#071019] hover:bg-sky-300 transition-colors">Get Nectar Engine <ChevronRight className="h-4 w-4" /></a></div></div></section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-2 pb-24 sm:pb-32"><div className="grid gap-4 sm:grid-cols-3">{[{ tag: "SEE THE SYSTEM", title: "How Nectar Works", desc: "See the architecture behind the transformation, with shipped capabilities separated from the next layer.", href: "/modules", icon: BookOpen }, { tag: "SEE THE OUTPUT", title: "Sample Output", desc: "Explore a transparent example of the kind of structured content Nectar produces from one offer.", href: "/sample", icon: Layers3 }, { tag: "PROTECT THE COPY", title: "Compliance Scanner", desc: "Check generated content for platform-specific risk signals and get a safer rewrite when needed.", href: "/scanner", icon: Zap }].map((card, i) => { const CardIcon = card.icon; return <motion.div key={card.href} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}><Link href={card.href} className="group block h-full rounded-xl border border-white/12 bg-[#181c27] p-6 transition-all hover:-translate-y-1 hover:bg-[#202533] hover:border-electric/40 hover:shadow-lg hover:shadow-electric/10"><div className="mb-4 flex items-center justify-between"><p className="font-mono text-[11px] uppercase tracking-widest text-electric font-semibold">{card.tag}</p><CardIcon className="h-4 w-4 text-electric/25 group-hover:text-electric/60 transition-colors" /></div><h3 className="text-lg font-bold tracking-tight mb-2 text-white group-hover:text-electric transition-colors">{card.title}</h3><p className="text-sm text-zinc-200 leading-relaxed mb-4">{card.desc}</p><span className="inline-flex items-center gap-1 text-xs text-electric/80 group-hover:text-electric transition-colors font-semibold">Explore <ArrowRight className="h-3 w-3" /></span></Link></motion.div>; })}</div></section>
      <BottomNextNav currentPage="/" />
    </div>
  );
}
