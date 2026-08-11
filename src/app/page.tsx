"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
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

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-electric/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28 text-center">
          <motion.p
            className="font-mono text-xs tracking-widest uppercase text-electric mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Nectar Engine · Affiliate Content Transformation
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            One Offer.
            <br />
            <span className="text-electric">Many Angles. One Campaign.</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Paste an offer once. Nectar turns the same source into platform-ready
            angles and social content, then lets you check the copy before you post it.
            Campaign orchestration and contextual intelligence are the next layer.
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
              className="bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-sm cursor-pointer"
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
              className="h-12 px-7 border-border/70 hover:border-electric/40 hover:text-electric"
            >
              <Link href="/generator">
                Try the Generator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-electric" /> Offer-aware generation</span>
            <span className="inline-flex items-center gap-1.5"><WandSparkles className="h-3.5 w-3.5 text-electric" /> 9-platform output</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-electric" /> Compliance checking</span>
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
                className="group block h-full rounded-xl border border-border/60 bg-surface p-6 transition-all hover:-translate-y-1 hover:bg-surface-raised hover:border-electric/30 hover:shadow-lg hover:shadow-electric/5"
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
