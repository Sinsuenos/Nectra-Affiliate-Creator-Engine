"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { BottomNavRow } from "@/components/BottomNavRow";

const PLATFORMS = ["X", "TikTok", "Instagram", "Facebook", "Reddit", "Pinterest", "Snapchat", "Discord", "Telegram"];

const products = [
  {
    eyebrow: "FLAGSHIP",
    title: "Nectar Engine",
    price: "$47",
    description: "Take one raw affiliate offer and turn it into campaign angles, platform-specific content, CTAs, and compliance-aware risk signals across nine major platforms.",
    points: ["3 PDF guides", "Generator access", "9-platform Compliance Scanner", "Built for restricted verticals"],
    href: "https://sinaloainspired.gumroad.com/l/nectar-engine",
    primary: true,
  },
  {
    eyebrow: "DEFENSIVE",
    title: "Agent Deflection",
    price: "Creator security",
    description: "Defensive techniques for creators who publish with AI in the workflow and want stronger boundaries around instructions, prompts, and exposed content.",
    points: ["Defensive workflow patterns", "Prompt-boundary thinking", "Practical creator guidance", "Designed for real-world publishing"],
    href: "/security",
    primary: false,
  },
  {
    eyebrow: "PROTECTION",
    title: "Creator Security Toolkit",
    price: "Practical protection",
    description: "A focused collection of creator-facing protection resources for keeping digital work, public workflows, and AI-facing surfaces harder to abuse.",
    points: ["Security checklists", "Creator-facing guidance", "Workflow hardening", "Built for independent creators"],
    href: "/security",
    primary: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#070910] text-white">
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: "url(/nectar-bg-landing.png)" }} aria-hidden="true" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(34,184,255,.18),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(217,70,239,.14),transparent_30%),linear-gradient(180deg,rgba(7,9,16,.2),#070910_78%)]" aria-hidden="true" />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="font-mono text-sm font-bold tracking-[.22em] text-white/90">SINALOA SUEÑOS / TOOLS</Link>
        <nav className="hidden items-center gap-6 text-sm text-white/60 sm:flex">
          <Link href="#products" className="hover:text-white">Products</Link>
          <Link href="#workflow" className="hover:text-white">How it works</Link>
          <Link href="/security" className="hover:text-white">Security</Link>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-24">
          <div className="absolute right-[4%] top-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 font-mono text-xs uppercase tracking-[.2em] text-cyan-200"><Sparkles className="h-3.5 w-3.5" /> Creator tools for the messy internet</div>
              <h1 className="text-5xl font-black leading-[.98] tracking-[-.04em] sm:text-7xl md:text-8xl">Build faster.<br /><span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-lime-200 bg-clip-text text-transparent">Publish smarter.</span></h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70 sm:text-2xl sm:leading-9">Practical tools for creators, affiliates, and digital builders who need more than another blank chat box. Create campaign-ready content, understand platform risk, and put stronger defenses around the work you publish.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="https://sinaloainspired.gumroad.com/l/nectar-engine" target="_blank" rel="noopener noreferrer" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-7 font-bold text-black shadow-2xl shadow-cyan-500/10 hover:bg-cyan-50">Get Nectar Engine <ArrowRight className="h-4 w-4" /></a>
                <Link href="#products" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.04] px-7 font-bold text-white hover:bg-white/[.08]">See the toolkit <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <p className="mt-4 text-xs text-white/40">Original digital products. Transparent commercial content. No promises of guaranteed approval, reach, or revenue.</p>
            </motion.div>
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="mb-8 flex items-end justify-between gap-6"><div><p className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">THE STACK</p><h2 className="mt-2 text-3xl font-bold sm:text-5xl">Three products. One creator-first philosophy.</h2></div></div>
          <div className="grid gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.title} className={`group relative flex min-h-[500px] flex-col overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 ${product.primary ? "border-cyan-300/30 bg-gradient-to-b from-cyan-300/[.10] to-white/[.03] shadow-2xl shadow-cyan-500/10" : "border-white/10 bg-white/[.035]"}`}>
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-fuchsia-400/[.08] blur-3xl" />
                <div className="relative flex-1"><div className="flex items-center justify-between"><span className="font-mono text-[11px] font-bold tracking-[.22em] text-cyan-200">{product.eyebrow}</span><span className="text-xs text-white/40">{product.price}</span></div><h3 className="mt-6 text-3xl font-black tracking-tight">{product.title}</h3><p className="mt-4 leading-7 text-white/60">{product.description}</p><ul className="mt-7 space-y-3">{product.points.map((point) => <li key={point} className="flex gap-3 text-sm text-white/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{point}</li>)}</ul></div>
                <Link href={product.href} className={`relative mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl font-bold ${product.primary ? "bg-white text-black hover:bg-cyan-50" : "border border-white/15 bg-white/[.06] text-white hover:bg-white/[.1]"}`}>{product.primary ? "Get Nectar Engine" : "Explore protection"}<ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-7 sm:p-10"><p className="font-mono text-xs uppercase tracking-[.22em] text-fuchsia-300">NECTAR IN ONE GLANCE</p><h2 className="mt-3 text-3xl font-bold sm:text-5xl">One offer goes in. A campaign system comes out.</h2><div className="mt-8 grid gap-3 sm:grid-cols-3">{[["01","Extract","Find the useful core of the source material."],["02","Create","Build distinct angles and platform-aware copy."],["03","Check","Surface platform and offer risk before publishing."]].map(([n,t,d]) => <div key={n} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><span className="font-mono text-xs text-cyan-300">{n}</span><h3 className="mt-3 font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-white/50">{d}</p></div>)}</div></div>
            <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[.04] p-7 sm:p-10"><div className="flex items-center gap-3"><Zap className="h-5 w-5 text-cyan-300" /><p className="font-mono text-xs uppercase tracking-[.22em] text-cyan-200">9 PLATFORMS</p></div><div className="mt-6 flex flex-wrap gap-2">{PLATFORMS.map((platform) => <span key={platform} className="rounded-full border border-white/10 bg-white/[.05] px-3 py-2 text-sm text-white/70">{platform}</span>)}</div><div className="mt-8 flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" /><p className="text-sm leading-6 text-white/55">The scanner provides risk signals and source-aware guidance. It is not legal advice and cannot guarantee platform approval.</p></div></div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/[.05] to-white/[.02] p-8 text-center sm:p-12"><p className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">READY WHEN YOU ARE</p><h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black sm:text-5xl">Less staring at the blank page. More shipping the thing.</h2><p className="mx-auto mt-4 max-w-2xl text-white/55">Nectar Engine is the fastest route from a raw offer to a structured campaign you can actually work with.</p><a href="https://sinaloainspired.gumroad.com/l/nectar-engine" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 font-bold text-black">Get Nectar Engine <ArrowRight className="h-4 w-4" /></a></div>
        </section>
      </main>
      <BottomNavRow />
    </div>
  );
}
