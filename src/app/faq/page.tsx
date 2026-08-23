"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NectarOrbs } from "@/components/nectar-orbs";
import { BottomNavRow } from "@/components/BottomNavRow";
import { ChevronDown } from "lucide-react";

const FAQ_DATA = [
  {"question":"What exactly is Nectar Engine?","answer":"Nectar Engine is a specialized workflow tool that turns high-risk affiliate offers into platform-aware campaign content and checks the copy for platform-specific risk signals before publishing."},
  {"question":"How does the compliance scanner actually work?","answer":"It checks your content against the selected platform's risk rules and returns Pass, Warning, or Fail with exact flagged phrases and a safer rewrite when appropriate."},
  {"question":"Which platforms does this thing support?","answer":"X, Instagram, Facebook, TikTok, Reddit, Pinterest, Snapchat, Discord, and Telegram."},
  {"question":"What's this about an Offer-to-Output pipeline?","answer":"Nectar starts with the actual offer source, extracts useful structure and restrictions, develops campaign directions, creates platform-specific output, and checks the resulting copy before publishing."},
  {"question":"Is it true that Nectar Engine was built during what you call a five-alarm creative burnout fire?","answer":"Absolutely. It started from the frustration of trying to make restricted-vertical content useful without turning every post into beige compliance wallpaper."},
  {"question":"Will my content actually sound human or like a robot who just discovered emojis?","answer":"The generator varies structure, voice, and campaign angle while keeping factual claims grounded in the supplied offer."},
  {"question":"Do you store or steal my secret affiliate sauce?","answer":"The current website does not persist offer text in an account database. API inputs are processed to produce the requested response and are not intended as a permanent offer library."},
  {"question":"How much does it cost and what's the catch?","answer":"Nectar Engine is sold through Gumroad as a one-time purchase. The live Generator also provides three free generations so you can test the workflow before buying."},
  {"question":"What is the Protect / Check This Toolkit button?","answer":"It sends generated content through the compliance scanner so you can see platform-specific risk signals before publishing."},
  {"question":"How do I reach support at 2 AM when everything is on fire?","answer":"Email sinaloainspireddreams@gmail.com. We cannot promise an instant 2 AM reply, but technical and purchase questions have a real support address now."}
];

const DEFAULT_OPEN = 4;

function FAQItem({ item, isOpen, onToggle }: { item: { question: string; answer: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 overflow-hidden" style={{ borderLeft: '3px solid transparent', borderImage: 'linear-gradient(to bottom, #fbbf24, #ec4899, #a855f7) 1' }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-slate-700/30 transition-colors">
        <span className="text-lg sm:text-xl font-semibold text-white leading-snug">{item.question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-zinc-200"><ChevronDown className="h-4 w-4" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden"><p className="px-5 pb-5 text-lg text-zinc-100 leading-relaxed">{item.answer}</p></motion.div>}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number>(DEFAULT_OPEN);
  return (
    <>
      <NectarOrbs />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-20 pb-28">
        <motion.p className="font-mono text-base tracking-widest uppercase text-electric mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Got questions?</motion.p>
        <motion.h1 className="text-5xl sm:text-6xl md:text-6xl font-bold tracking-tight mb-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>FAQ <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">(Frequently Awkward Questions)</span></motion.h1>
        <motion.p className="text-xl text-muted-foreground mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>Honest answers to the things people actually ask.</motion.p>
        <motion.div className="space-y-3" initial="hidden" animate="visible">
          {FAQ_DATA.map((item, i) => <motion.div key={i} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } } }}><FAQItem item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} /></motion.div>)}
        </motion.div>
      </section>
      <BottomNavRow />
    </>
  );
}
