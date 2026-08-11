"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" as const } }),
};

const angleExamples = [
  { label: "ANGLE 01", title: "Problem-led", hook: "Start with the problem the buyer already recognizes, then introduce the offer as one possible solution." },
  { label: "ANGLE 02", title: "Education-led", hook: "Teach the audience what to look for before asking them to consider the offer." },
  { label: "ANGLE 03", title: "Comparison-led", hook: "Frame the offer around a concrete buying decision, without inventing superiority claims." },
];

const platformExamples = [
  { platform: "X", text: "A concise, conversational version built for a fast-moving feed, with the offer context preserved." },
  { platform: "Instagram", text: "A more visual caption structure with a stronger opening line and room for disclosure." },
  { platform: "TikTok", text: "A short spoken-hook direction that can become a video script without turning the offer into hype." },
  { platform: "Reddit", text: "A discussion-first version that avoids pretending an affiliate recommendation is independent advice." },
  { platform: "Facebook", text: "A readable post variation that keeps the offer clear without manufactured urgency." },
  { platform: "Pinterest", text: "A compact discovery-oriented version suited to a pin title and description." },
];

const scanExamples = [
  { platform: "TikTok", status: "WARN", detail: "Example: a guarantee or unsupported outcome claim would be surfaced for review." },
  { platform: "Reddit", status: "PASS", detail: "Example: discussion-first copy with transparent commercial context." },
  { platform: "Instagram", status: "PASS", detail: "Example: disclosure-aware copy without invented results." },
];

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="rounded-xl bg-background/60 border border-border/40 p-5 sm:p-6"><p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">{label}</p>{children}</div>;
}

export default function SamplePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
      <motion.header initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <p className="font-mono text-xs tracking-widest uppercase text-electric mb-3">Transformation Preview</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Watch one offer become usable content.</h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          This page is a visual example of the transformation Nectar is designed to perform. It uses intentionally generic language so we never pass invented testimonials, ratings, clinical results, or product facts off as real data.
        </p>
      </motion.header>

      <Separator className="my-8 bg-border/60" />

      <motion.div className="grid gap-5" initial="hidden" animate="visible">
        <motion.div variants={fadeUp} custom={1}>
          <Block label="01 · Offer Input">
            <div className="grid sm:grid-cols-3 gap-3 font-mono text-sm">
              <div className="rounded-lg border border-border/40 bg-surface p-4"><span className="text-muted-foreground block text-xs mb-1">offer</span>Example Product</div>
              <div className="rounded-lg border border-border/40 bg-surface p-4"><span className="text-muted-foreground block text-xs mb-1">audience</span>Defined by the seller</div>
              <div className="rounded-lg border border-border/40 bg-surface p-4"><span className="text-muted-foreground block text-xs mb-1">goal</span>Platform-ready promotion</div>
            </div>
          </Block>
        </motion.div>

        <motion.div variants={fadeUp} custom={2}>
          <Block label="02 · Angle Prism">
            <div className="grid md:grid-cols-3 gap-4">
              {angleExamples.map((angle) => (
                <div key={angle.label} className="rounded-xl border border-electric/20 bg-electric/[0.03] p-5">
                  <p className="font-mono text-[10px] tracking-widest text-electric mb-2">{angle.label}</p>
                  <h2 className="font-bold mb-2">{angle.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{angle.hook}</p>
                </div>
              ))}
            </div>
          </Block>
        </motion.div>

        <motion.div variants={fadeUp} custom={3}>
          <Block label="03 · Platform Output">
            <div className="grid sm:grid-cols-2 gap-3">
              {platformExamples.map((item) => (
                <div key={item.platform} className="rounded-lg border border-border/40 bg-surface p-4">
                  <div className="flex items-center justify-between mb-2"><span className="font-mono text-sm text-electric">{item.platform}</span><ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </Block>
        </motion.div>

        <motion.div variants={fadeUp} custom={4}>
          <Block label="04 · Protect Before You Post">
            <div className="grid md:grid-cols-3 gap-3">
              {scanExamples.map((item) => (
                <div key={item.platform} className="rounded-lg border border-border/40 bg-surface p-4">
                  <div className="flex items-center gap-2 mb-2"><ShieldCheck className="h-4 w-4 text-electric" /><span className="font-mono text-sm">{item.platform}</span><span className={`ml-auto text-[10px] font-mono font-semibold ${item.status === "WARN" ? "text-amber-400" : "text-emerald-400"}`}>{item.status}</span></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </Block>
        </motion.div>

        <motion.div variants={fadeUp} custom={5}>
          <div className="rounded-xl border border-electric/20 bg-electric/[0.03] p-6 sm:p-8">
            <div className="flex items-start gap-3"><Sparkles className="h-5 w-5 text-electric mt-0.5 shrink-0" /><div><p className="font-mono text-[11px] uppercase tracking-wider text-electric mb-2">Important</p><h2 className="text-xl font-bold mb-2">The data stays yours.</h2><p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">When you paste a real offer into the Generator, use its actual details as the source of truth. Nectar should not manufacture reviews, clinical evidence, guarantees, or other facts to make copy sound more convincing.</p></div></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
