"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

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
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const offerContext = {
  offer_name: "Demo Offer",
  niche: "Health & Wellness",
  target_audience: "Adults 25-45 interested in natural supplements",
  content_goal: "Educate and convert via long-form content",
};

const headlines = [
  { variant: "A", text: "The Natural Supplement Backed by Over 1,200 Five-Star Reviews" },
  { variant: "B", text: "Why This Supplement Prints Every Dosage on the Label" },
  { variant: "C", text: "Feel the Difference in 14 Days or Your Money Back" },
  { variant: "D", text: "Energy. Sleep. Clarity. One Formula, Three Results." },
];

const bodyCopy =
  "Most people don’t realize that the supplements they pick off the shelf are often filled with fillers, synthetic binders, and ingredients their body can’t even absorb. That’s the problem Demo Offer was designed to solve. Every capsule uses a clinically-studied blend of plant-derived compounds manufactured in an FDA-registered facility, so you get exactly what’s on the label \u2014 nothing more, nothing less.\n\n" +
  "The formula targets three core areas that matter most as you age: sustained energy throughout the day, deeper and more restorative sleep at night, and a noticeable improvement in mental clarity within the first two weeks. Users frequently report that the afternoon slump simply disappears, and they stop reaching for their third cup of coffee by day ten.\n\n" +
  "Unlike products that rely on proprietary blends with hidden dosages, Demo Offer lists every ingredient and its exact milligram count. Transparency isn’t a marketing angle here \u2014 it’s the foundation of the entire product philosophy. Every batch is third-party tested for purity and potency, and those lab reports are available on request.";

const emailSequence = [
  {
    day: "Day 1",
    subject_line: "Your wellness routine is missing something",
    preview_text: "Here’s why most supplements don’t work \u2014 and what to look for instead.",
    body: "If you’ve tried supplements before and felt nothing change, you’re not alone. The problem usually isn’t the ingredient \u2014 it’s the dosage, the form, and the fillers. Demo Offer takes a different approach: full transparency on every ingredient, clinically-backed dosages, and zero synthetic binders.\n\nThis isn’t another wellness fad. It’s a formula built on published research and third-party testing.",
  },
  {
    day: "Day 3",
    subject_line: "What 1,200+ reviewers noticed after 14 days",
    preview_text: "Energy, sleep, focus \u2014 the three pillars that shifted for real people.",
    body: "We looked at every verified review and the pattern was impossible to ignore. Within the first two weeks, the most common improvements people reported were: no more afternoon energy crashes, falling asleep faster and waking up actually rested, and a clarity of thought they described as ‘turning on a light switch.’\n\nThose aren’t marketing claims. That’s what people said on their own.",
  },
  {
    day: "Day 7",
    subject_line: "The lab reports are in \u2014 here’s what they show",
    preview_text: "Full transparency: every batch tested, every result published.",
    body: "Every production run of Demo Offer goes through independent third-party testing. We check for heavy metals, microbial contamination, and verify that each active ingredient meets its labeled potency. The latest batch report is clean across all 47 tested markers.\n\nIf a supplement company won’t show you the lab work, ask yourself why. Demo Offer puts it front and center.",
  },
];

const socialPosts = [
  {
    platform: "X",
    character_count: 247,
    text: "Tried a new daily wellness formula last month. No proprietary blends, full ingredient transparency, and every batch is third-party tested. Two weeks in and the afternoon crash is just... gone. Rare to find a supplement that actually does what it says on the label.",
  },
  {
    platform: "Instagram",
    character_count: 347,
    text: "Most supplements are white-labeled from the same few contract factories, then rebranded with different labels and marketing stories. Demo Offer is made in a single FDA-registered facility that tests every production run across 47 quality markers — heavy metals, microbial contamination, labeled potency. Lab reports are available on request, not buried behind a support form. That level of manufacturing traceability is uncommon enough that it caught my attention.",
  },
  {
    platform: "TikTok",
    character_count: 192,
    text: "Okay so I’ve been testing this wellness supplement for two weeks and honestly the biggest change is I stopped needing coffee at 2pm. Full transparency on ingredients, no proprietary blends. Lab tested. Check it out if you’re tired of supplements that do nothing.",
  },
  {
    platform: "Reddit",
    character_count: 387,
    text: "Is there actually a supplement brand that lists exact mg per ingredient instead of hiding behind \"proprietary blends\"? I’ve been comparing labels across a dozen products and almost all of them are opaque about dosages. Found one called Demo Offer that does full disclosure and third-party batch testing — their label shows every ingredient with the specific amount. Wondering if anyone here has experience with them or knows of other brands doing the same level of transparency. Not trying to shill anything, just genuinely trying to find products where I can verify what I’m actually putting in my body.",
  },
];

const ctaVariations = [
  { id: "CTA-1", text: "See the Full Ingredient Breakdown" },
  { id: "CTA-2", text: "Read What 1,200 Reviewers Reported After 14 Days" },
  { id: "CTA-3", text: "Compare This Label Against the Competition" },
  { id: "CTA-4", text: "View Third-Party Lab Results" },
];

const complianceResult = {
  overall_status: "PASS",
  warnings: [] as string[],
  platform_flags: [
    { platform: "X", status: "CLEAN" },
    { platform: "TikTok", status: "CLEAN" },
    { platform: "Instagram", status: "CLEAN" },
    { platform: "Facebook", status: "CLEAN" },
    { platform: "Reddit", status: "CLEAN" },
    { platform: "Pinterest", status: "CLEAN" },
    { platform: "Snapchat", status: "CLEAN" },
    { platform: "Discord", status: "CLEAN" },
    { platform: "Telegram", status: "CLEAN" },
  ],
};

/* ------------------------------------------------------------------ */
/*  SUB-BLOCK COMPONENT                                                */
/* ------------------------------------------------------------------ */
function SubBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-background/60 border border-border/40 p-4">
      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3">{label}</p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function SamplePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      {/* PAGE HEADER */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <p className="font-mono text-xs tracking-widest uppercase text-electric mb-3">
          Output Preview
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Sample Output: Demo Offer
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          This is a full content toolkit as produced by the Nectar Engine for a
          generic demo offer. Each block represents one output module from the
          9-module pipeline, from offer context through compliance scanning.
          All content is AI-generated and ready for human review.
        </p>
      </motion.header>

      <Separator className="my-8 bg-border/60" />

      {/* OUTPUT BLOCK */}
      <motion.div
        className="rounded-xl border border-border/60 bg-surface p-5 sm:p-8 space-y-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* OFFER CONTEXT */}
        <motion.div variants={fadeUp} custom={1}>
          <SubBlock label="Offer Context">
            <div className="font-mono text-sm space-y-1.5">
              <p>
                <span className="text-muted-foreground">offer_name:</span>{" "}
                <span className="text-electric">&quot;{offerContext.offer_name}&quot;</span>
              </p>
              <p>
                <span className="text-muted-foreground">niche:</span>{" "}
                <span className="text-foreground">&quot;{offerContext.niche}&quot;</span>
              </p>
              <p>
                <span className="text-muted-foreground">target_audience:</span>{" "}
                <span className="text-foreground">&quot;{offerContext.target_audience}&quot;</span>
              </p>
              <p>
                <span className="text-muted-foreground">content_goal:</span>{" "}
                <span className="text-foreground">&quot;{offerContext.content_goal}&quot;</span>
              </p>
            </div>
          </SubBlock>
        </motion.div>

        {/* HEADLINES */}
        <motion.div variants={fadeUp} custom={2}>
          <SubBlock label="Headlines">
            <div className="font-mono text-sm space-y-3">
              {headlines.map((h) => (
                <p key={h.variant}>
                  <span className="text-electric mr-2">[{h.variant}]</span>
                  <span className="text-foreground">&quot;{h.text}&quot;</span>
                </p>
              ))}
            </div>
          </SubBlock>
        </motion.div>

        {/* BODY COPY */}
        <motion.div variants={fadeUp} custom={3}>
          <SubBlock label="Body Copy">
            <div className="font-mono text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {bodyCopy}
            </div>
          </SubBlock>
        </motion.div>

        {/* EMAIL SEQUENCE */}
        <motion.div variants={fadeUp} custom={4}>
          <SubBlock label="Email Sequence">
            <div className="font-mono text-sm space-y-5">
              {emailSequence.map((email) => (
                <div key={email.day} className="space-y-1.5">
                  <p className="text-electric font-semibold">{email.day}</p>
                  <p>
                    <span className="text-muted-foreground">subject_line:</span>{" "}
                    <span className="text-foreground">&quot;{email.subject_line}&quot;</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">preview_text:</span>{" "}
                    <span className="text-foreground/80">&quot;{email.preview_text}&quot;</span>
                  </p>
                  <p className="text-muted-foreground">body:</p>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-border/60">
                    {email.body}
                  </p>
                </div>
              ))}
            </div>
          </SubBlock>
        </motion.div>

        {/* SOCIAL POSTS */}
        <motion.div variants={fadeUp} custom={5}>
          <SubBlock label="Social Posts">
            <div className="font-mono text-sm space-y-5">
              {socialPosts.map((post) => (
                <div key={post.platform} className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-electric font-semibold">{post.platform}</span>
                    <span className="text-muted-foreground text-xs">{post.character_count} chars</span>
                  </div>
                  <p className="text-foreground/90 leading-relaxed">{post.text}</p>
                </div>
              ))}
            </div>
          </SubBlock>
        </motion.div>

        {/* CTA VARIATIONS */}
        <motion.div variants={fadeUp} custom={6}>
          <SubBlock label="CTA Variations">
            <div className="font-mono text-sm space-y-2">
              {ctaVariations.map((cta) => (
                <div key={cta.id} className="flex items-center gap-3">
                  <span className="text-electric shrink-0">{cta.id}</span>
                  <span className="text-foreground">{cta.text}</span>
                </div>
              ))}
            </div>
          </SubBlock>
        </motion.div>

        {/* COMPLIANCE SCAN RESULT */}
        <motion.div variants={fadeUp} custom={7}>
          <SubBlock label="Compliance Scan Result">
            <div className="font-mono text-sm space-y-4">
              <p>
                <span className="text-muted-foreground">overall_status:</span>{" "}
                <span className="text-emerald-400 font-semibold">{complianceResult.overall_status}</span>
              </p>
              <p>
                <span className="text-muted-foreground">warnings:</span>{" "}
                <span className="text-foreground">[]</span>
              </p>
              <div>
                <p className="text-muted-foreground mb-2">platform_flags:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {complianceResult.platform_flags.map((pf) => (
                    <p
                      key={pf.platform}
                      className="flex items-center justify-between rounded bg-background/60 border border-border/30 px-3 py-1.5"
                    >
                      <span className="text-foreground">{pf.platform}</span>
                      <span className="text-emerald-400 text-xs font-semibold">{pf.status}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </SubBlock>
        </motion.div>
      </motion.div>
    </div>
  );
}
