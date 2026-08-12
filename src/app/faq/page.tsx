"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NectarOrbs } from "@/components/nectar-orbs";
import { BottomNextNav } from "@/components/BottomNextNav";
import { ChevronDown } from "lucide-react";

const FAQ_DATA = [
  {"question":"What exactly is Nectar Engine?","answer":"Nectar Engine is the over-caffeinated sidekick that turns your risky affiliate offers into compliant, platform-ready social posts. It doesn't just generate fluff\u2014it scans, flags, rewrites, and occasionally side-eyes your sketchy wording so you can post without waking up to a banned account."},
  {"question":"How does the compliance scanner actually work?","answer":"It cross-checks your content against platform-specific risk rules (yes, even the unwritten ones we learned the hard way) and gives you a Pass, Warning, or Fail with an explanation and a safer rewrite. Think of it as the compliance officer who's seen too much but still wants you to win."},
  {"question":"Which platforms does this thing support?","answer":"All nine horsemen of the affiliate apocalypse: X, Instagram, Facebook, TikTok, Reddit, Pinterest, Snapchat, Discord, and Telegram. We even researched the subtle quirks of Discord's \u201cno overt selling unless you're clever\u201d and Telegram's \u201canything goes until it doesn't\u201d policies."},
  {"question":"What's this about an Offer-to-Output pipeline?","answer":"It's a six-stage creative funnel that turns a boring affiliate link into a full-blown campaign: Offer \u2192 Angles \u2192 Context \u2192 Campaign \u2192 Compliance \u2192 Output. It's the kind of structured thinking you'd have at 2 AM if you were both the marketer and the caffeine."},
  {"question":"Is it true that Nectar Engine was built during what you call a five-alarm creative burnout fire?","answer":"Absolutely. We started coding after our third straight late-night brainstorm where every 'safe' post felt like beige wallpaper. Nectar Engine was born from exhaustion, sarcasm, and the desperate need for a tool that understood why \u201ccompliant\u201d doesn't have to mean \u201cboring.\u201d"},
  {"question":"Will my content actually sound human or like a robot who just discovered emojis?","answer":"It's genuinely AI-generated but trained on the rhythm of late-night marketer rants and the regret of campaigns past. If it flops, you can still blame the algorithm\u2014we won't take it personally (okay, maybe a little)."},
  {"question":"Do you store or steal my secret affiliate sauce?","answer":"No. Your offers, angles, and that one weird sub-niche you don't tell your family about stay on your machine. We don't log prompts, we don't resell data, and we certainly don't need to know why you're pushing kale supplements to crypto bros."},
  {"question":"How much does it cost and what's the catch?","answer":"One price, lifetime access, via Gumroad\u2014buy once, cry once. No subscriptions, no credits, no 'premium pro max ultra' tiers. If we ever add a paid add-on (like a Risqu\u00e9 Filter), we'll be annoyingly transparent about it."},
  {"question":"What is the Protect / Check This Toolkit button?","answer":"It's the sober friend who reads your post before you hit send. It runs your generated content through the full compliance scanner and returns specific warnings, a rewrite, and a copy button, so your clever innuendo doesn't accidentally violate three platform policies at once."},
  {"question":"How do I reach support at 2 AM when everything is on fire?","answer":"Email the placeholder address (we'll replace it soon, promise). We can't guarantee an instant reply at 2 AM, but we've been there, and we'll respond with genuine empathy and maybe a GIF of a dumpster fire. You're not alone."}
];

const DEFAULT_OPEN = 4;

function FAQItem({ item, index, isOpen, onToggle }: {
  item: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-slate-700/50 bg-slate-800/60 overflow-hidden"
      style={{ borderLeft: '3px solid transparent', borderImage: 'linear-gradient(to bottom, #fbbf24, #ec4899, #a855f7) 1' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-slate-700/30 transition-colors"
      >
        <span className="text-sm sm:text-base font-semibold text-white leading-snug">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-zinc-400"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-zinc-300 leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
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
        <motion.p
          className="font-mono text-xs tracking-widest uppercase text-electric mb-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        >
          Got questions?
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          FAQ{' '}
          <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
            (Frequently Awkward Questions)
          </span>
        </motion.h1>
        <motion.p
          className="text-base text-muted-foreground mb-10"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
          Honest answers to the things people actually ask.
        </motion.p>

        <motion.div
          className="space-y-3"
          initial="hidden" animate="visible"
        >
          {FAQ_DATA.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } },
              }}
            >
              <FAQItem
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <BottomNextNav currentPage="/faq" />
    </>
  );
}
