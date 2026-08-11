"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NectarOrbs } from "@/components/nectar-orbs";
import { CompactTransformationRail } from "@/components/transformation-rail";
import { GUMROAD_URL } from "@/lib/constants";
import {
  ClipboardPaste,
  ChevronDown,
  ChevronRight,
  Pencil,
  Check,
  Tag,
  Loader2,
  FileText,
  ShieldCheck,
  Send,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import {
  extractFields,
  slugify,
  SUBID_PLATFORMS,
  type SubIDEntry,
} from "@/lib/offer-parser";

/* ------------------------------------------------------------------ */
/*  ANIMATION                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  DEMO PASTE TEXT (Cozy 50+ offer)                                   */
/* ------------------------------------------------------------------ */
const DEMO_PASTE =
  "Cozy 50+ — Mature Dating & Companionship Platform\n" +
  "Network: ClickDealer | Offer ID: CZ-5021\n" +
  "Vertical: Dating / Mature\n" +
  "Payout: $55 CPA (CC Submit)\n" +
  "Conversion Flow: Free Account Registration → CC Age Verification → $1 Trial → Rebill $49.99/mo\n" +
  "Top Geo: US, CA, UK, AU, NZ\n" +
  "Landing Page: https://example.com/offer/cozy50\n" +
  "Banned Traffic: Incentivized, Bot, Brand Search, Email Spam, Craigslist, Craigslist-adjacent, Social Sprinkling\n" +
  "Sub-ID Format: {sub1}_{sub2}_{sub3}\n\n" +
  "Key offer details:\n" +
  "- 2.4M+ active members, 58% female demographic aged 45-65\n" +
  "- AI-powered compatibility matching with 89% satisfaction rate\n" +
  "- Verified profile badges, photo verification, and real-time chat\n" +
  "- Free trial: 7-day full access, $1 age verification charge\n" +
  "- Target audience: Adults 45+ seeking companionship or serious dating after divorce/widowhood\n" +
  "- Unique angle: highest female-to-male ratio in the mature dating vertical (3.2:1)\n" +
  "- Content restriction: NO explicit or sexually suggestive language. Frame as companionship, connection, and meeting new people.\n" +
  "- Affiliate/redirect link: https://track.clickdealer.com/?a=1234&sub1={sub1}&sub2={sub2}";

/* ------------------------------------------------------------------ */
/*  VALIDATE OFFER INPUT                                               */
/* ------------------------------------------------------------------ */
function validateOfferInput(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return "Please paste your offer details before generating.";
  if (trimmed.length < 20) return "Input is too short — paste at least a full offer description.";
  const lower = trimmed.toLowerCase();
  const offerSignals = ["offer", "payout", "network", "vertical", "cpa", "cpl", "revshare", "conversion flow", "geo", "landing page", "trial", "affiliate", "traffic"];
  const signalCount = offerSignals.filter((s) => lower.includes(s)).length;
  if (signalCount === 0) return "This doesn't look like an affiliate offer. Include details like payout, network, vertical, and conversion flow.";
  return null;
}

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
interface PromoAngle {
  angle: string;
  hook: string;
  body: string;
}

interface SocialPost {
  platform: string;
  character_count: number;
  text: string;
}

interface Headline {
  variant: string;
  text: string;
}

interface CTA {
  id: string;
  text: string;
  tone: string;
}

interface ComplianceNote {
  platform: string;
  note: string;
}

interface GeneratedToolkit {
  promo_angles: PromoAngle[];
  social_posts: SocialPost[];
  headlines: Headline[];
  body_copy: string;
  cta_variations: CTA[];
  compliance_notes: ComplianceNote[];
}

/* ------------------------------------------------------------------ */
/*  DEMO TOOLKIT (fallback with Cozy 50+ data — 6 social posts)       */
/* ------------------------------------------------------------------ */
const DEMO_TOOLKIT: GeneratedToolkit = {
  promo_angles: [
    {
      angle: "Demographic Advantage",
      hook: "3.2 women for every man — the best gender ratio of any mature dating platform.",
      body: "Most dating platforms skew heavily male. Cozy 50+ has built a 3.2:1 female-to-male ratio through years of targeted marketing to women 45-65. For affiliates pushing dating offers, this single stat is the most compelling angle — it addresses the #1 objection men have about dating sites ('there are no real women here').",
    },
    {
      angle: "Companionship Framing",
      hook: "Not everyone over 50 is looking for romance — many just want someone to talk to.",
      body: "The mature dating vertical's biggest compliance risk is framing that sounds like casual hookups. Cozy 50+ has built its brand around companionship, connection, and genuine relationships. This angle works across all platforms because it sidesteps content restrictions while speaking directly to the emotional reality of the target audience: loneliness after divorce, widowhood, or kids leaving home.",
    },
    {
      angle: "Low-Commitment Entry",
      hook: "$1 for 7 days of full access — see who's actually in your area before committing.",
      body: "The $1 trial removes the biggest conversion barrier: paying full price for a platform you haven't verified. Users can browse profiles, use the compatibility matching, and chat with real verified members for a full week. The 89% satisfaction rate from AI matching means most trial users find enough value to convert to the $49.99/mo plan.",
    },
  ],
  social_posts: [
    {
      platform: "X",
      character_count: 275,
      text: "Most dating sites are 80% men fighting for attention. Found one where it's the opposite — 3.2 women for every man, all 45+. $1 to browse for a week and see who's nearby. The age verification is a one-time charge.",
    },
    {
      platform: "TikTok",
      character_count: 284,
      text: "POV: your mom joined a dating site and actually found someone normal to get coffee with. That site is Cozy 50+ — it's built for people over 45 who want real connection, not swiping games. $1 week trial, verified profiles, and surprisingly more women than men.",
    },
    {
      platform: "Pinterest",
      character_count: 479,
      text: "Dating after 50 doesn't have to feel hopeless. The biggest complaint I hear is that most dating apps feel designed for 25-year-olds and are 80% men. Cozy 50+ is different: 3.2:1 female-to-male ratio, AI matching based on compatibility (not just photos), and everyone is verified. They have a $1 week trial so you can actually browse real profiles before paying. Saved you the research.",
    },
    {
      platform: "Reddit",
      character_count: 463,
      text: "Has anyone here tried dating sites specifically for people over 50? A friend mentioned Cozy 50+ has a surprisingly high number of women compared to most platforms. I've been hesitant to try dating apps because they all seem geared toward younger people and I've heard the male-to-female ratio is brutal on most of them. This one claims 3.2:1 female-to-male and has a $1 week trial. Curious if anyone has actual experience with it or if the ratio claim is marketing.",
    },
    {
      platform: "Instagram",
      character_count: 377,
      text: "Dating after 50 gets a bad reputation because most apps aren't built for it. Found one that is — Cozy 50+ has more women than men (rare in dating), verified profiles so you know who's real, and AI matching that's about compatibility, not just swiping. $1 for a 7-day trial to see if it's actually different.",
    },
    {
      platform: "Facebook",
      character_count: 391,
      text: "If you're single and over 45, you already know most dating apps feel like they're not made for you. Cozy 50+ was built specifically for this age group — real profiles, real people looking for actual connection. They have a 7-day trial for $1 so you can browse without committing. The compatibility matching is surprisingly good.",
    },
    {
      platform: "Snapchat",
      character_count: 312,
      text: "Story time: my aunt tried every dating app and said they were all the same — 80% guys, nobody real. Then she found Cozy 50+. It's built for people over 45 who want actual connection. 3.2 women for every man. She's been on 3 real coffee dates in a month. $1 to try it for a week.",
    },
    {
      platform: "Discord",
      character_count: 298,
      text: "For anyone in the 45+ dating communities here — has anyone tried Cozy 50+? It claims a 3.2:1 female-to-male ratio and AI compatibility matching. I've seen it mentioned in a few other servers. Curious about real experiences before I sign up for the $1 trial.",
    },
    {
      platform: "Telegram",
      character_count: 315,
      text: "Cozy 50+ is a dating platform built specifically for adults 45+. Unlike most apps that skew 80% male, it has a 3.2:1 female-to-male ratio with verified profiles and AI compatibility matching. $1 for a 7-day trial with full access to browse and message real members.",
    },
  ],
  headlines: [
    { variant: "A", text: "The Dating Platform Where Women Outnumber Men 3 to 1" },
    { variant: "B", text: "Dating After 50 Doesn't Have to Feel Hopeless" },
    { variant: "C", text: "$1 to See Who's Actually Looking for Someone Like You" },
    { variant: "D", text: "Built for 45+ — Not Another Swiping App for 25-Year-Olds" },
  ],
  body_copy:
    "Most dating platforms are built for a younger demographic and it shows — endless swiping, emphasis on photos over substance, and a user base that skews 70-80% male. For adults 45+ who are re-entering the dating world after divorce or widowhood, that experience is frustrating and alienating.\n\n" +
    "Cozy 50+ addresses this directly. The platform has built a 3.2:1 female-to-male ratio through years of targeted acquisition in the mature demographic. Every profile goes through photo verification and earns a verified badge. The AI-powered compatibility matching system reports an 89% satisfaction rate, focusing on lifestyle alignment, communication preferences, and relationship goals rather than just appearance.\n\n" +
    "The $1 seven-day trial gives full access to browse profiles, use the matching system, and message real members. The trial converts to $49.99/month, but the low-commitment entry point removes the biggest objection: paying for a platform before verifying it has real, active members in your area.",
  cta_variations: [
    { id: "CTA-1", text: "Start Your 7-Day Trial — Just $1", tone: "Offer-direct" },
    { id: "CTA-2", text: "See Who's Near You — Browse Verified Profiles for $1", tone: "Curiosity-driven" },
    { id: "CTA-3", text: "Real People, Real Connection — Try 7 Days for $1", tone: "Trust-focused" },
    { id: "CTA-4", text: "Stop Swiping. Start Matching — 7 Days Full Access, $1", tone: "Contrast-positioning" },
  ],
  compliance_notes: [
    {
      platform: "Facebook / Instagram",
      note: "Dating offers are restricted. Avoid language implying sexual encounters or hookups. Frame entirely around companionship, connection, and meeting new people. Avoid 'hot,' 'sexy,' or any explicit framing.",
    },
    {
      platform: "Google Ads",
      note: "Dating/personal ads policies are strict. Disclose the rebill structure ($49.99/mo after trial) clearly. Avoid 'free' language since the $1 verification charge exists. Do not target under-45 demographics.",
    },
    {
      platform: "TikTok",
      note: "Dating content is heavily moderated. Use the POV/storytelling format rather than direct promotion. Focus on the companionship angle. Avoid any suggestion of the platform being for casual encounters.",
    },
    {
      platform: "Reddit",
      note: "Affiliate marketing is community-reported frequently. Posts must read as genuine questions or experiences, not marketing. Never include affiliate links directly in posts — use DM or profile bio funnels only.",
    },
    {
      platform: "X",
      note: "Character limit forces concise messaging. Avoid claims about member counts or ratios that can't be verified. The 3.2:1 ratio claim should be attributed to the platform's reported data.",
    },
    {
      platform: "Snapchat",
      note: "Dating ads are permitted if non-explicit and age-gated 18+. Keep the companionship angle, never 'casual encounters.' Use the Sponsored label on all branded Stories.",
    },
    {
      platform: "Discord",
      note: "MEDIUM risk - enforcement is server-level, not algorithmic. Post only in designated promo channels. Get admin approval. The question format works well here.",
    },
    {
      platform: "Telegram",
      note: "HIGH risk - do NOT use Telegram's paid ads for dating content. Organic channel posts carry inconsistent risk. Keep content factual and disclosure-clear.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  EDITABLE CHIP                                                      */
/* ------------------------------------------------------------------ */
function EditableChip({
  field,
  isDemo,
}: {
  field: { key: string; label: string; value: string };
  isDemo?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(field.value);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/60 px-4 py-2.5">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground w-28 shrink-0">
        {field.label}
      </span>
      {editing ? (
        <input
          className="flex-1 bg-transparent text-sm text-foreground font-mono outline-none border-b border-electric/40 pb-0.5"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-sm font-mono ${val ? "text-foreground" : "text-muted-foreground/50"}`}
        >
          {val || "—"}
        </span>
      )}
      {!isDemo && (
        <button
          onClick={() => setEditing(!editing)}
          className="shrink-0 p-1 rounded text-muted-foreground hover:text-electric transition-colors"
          aria-label={editing ? "Save" : "Edit"}
        >
          {editing ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Pencil className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  OUTPUT SECTION COMPONENTS                                          */
/* ------------------------------------------------------------------ */

function PromoAnglesSection({ angles }: { angles: PromoAngle[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        Promo Angles
      </p>
      <div className="space-y-4">
        {angles.map((angle, i) => (
          <div
            key={angle.angle}
            className="rounded-lg bg-surface border border-border/40 p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] uppercase text-electric">
                Angle {i + 1}
              </span>
              <span className="h-px flex-1 bg-border/40" />
              <span className="font-mono text-xs text-foreground font-medium">
                {angle.angle}
              </span>
            </div>
            <p className="text-sm text-foreground font-medium mb-2">
              {angle.hook}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {angle.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialPostsSection({ posts }: { posts: SocialPost[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        Social Posts
      </p>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.platform}
            className="rounded-lg bg-surface border border-border/40 p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-electric font-semibold">
                {post.platform}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {post.character_count} chars
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {post.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadlinesSection({ headlines }: { headlines: Headline[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        Headlines
      </p>
      <div className="space-y-4">
        {headlines.map((h) => (
          <div
            key={h.variant}
            className="rounded-lg bg-surface border border-border/40 p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] uppercase text-electric">
                Variant {h.variant}
              </span>
              <span className="h-px flex-1 bg-border/40" />
            </div>
            <p className="text-sm text-foreground font-medium">{h.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BodyCopySection({ text }: { text: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        Body Copy
      </p>
      <div className="rounded-lg bg-surface border border-border/40 p-5">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {text}
        </p>
      </div>
    </div>
  );
}

function CTASection({ ctas }: { ctas: CTA[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
        CTA Variations
      </p>
      <div className="space-y-4">
        {ctas.map((cta) => (
          <div
            key={cta.id}
            className="rounded-lg bg-surface border border-border/40 p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] uppercase text-electric">
                {cta.id}
              </span>
              <span className="h-px flex-1 bg-border/40" />
              <span className="font-mono text-[11px] text-muted-foreground">
                {cta.tone}
              </span>
            </div>
            <p className="text-sm text-foreground font-medium">{cta.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceSection({ notes }: { notes: ComplianceNote[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-4 w-4 text-amber-400" />
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Compliance Notes
        </p>
      </div>
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.platform}
            className="rounded-lg bg-surface border border-border/40 p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-foreground font-medium">
                {note.platform}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {note.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
const FREE_GENERATION_LIMIT = 3;
const STORAGE_KEY = "nectar_generation_count";

export default function GeneratorPage() {
  const router = useRouter();
  const [showSubIDs, setShowSubIDs] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolkit, setToolkit] = useState<GeneratedToolkit | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  /* --- Restore generation count from localStorage on mount --- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setGenerationCount(Number(stored) || 0);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  /* --- Derived state --- */
  const limitReached = generationCount >= FREE_GENERATION_LIMIT;

  const currentStep = hasGenerated ? 3 : isGenerating ? 2 : 1;

  const offerName = hasGenerated
    ? pasteText.split("\n")[0].replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 40)
    : "demo";

  /* --- Generate handler --- */
  async function handleGenerate() {
    if (isGenerating) return;

    if (limitReached) return;

    const validationError = validateOfferInput(pasteText);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setHasGenerated(false);
    setUsedFallback(false);
    setToolkit(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerText: pasteText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      if (data.data) {
        setToolkit(data.data);
        setHasGenerated(true);
        /* Increment generation count */
        const next = generationCount + 1;
        setGenerationCount(next);
        try {
          localStorage.setItem(STORAGE_KEY, String(next));
        } catch {
          /* localStorage unavailable */
        }
      } else {
        throw new Error("No data received from the generation endpoint.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed.";
      setError(msg);
      /* Fall back to demo content so the experience isn't broken */
      setToolkit(DEMO_TOOLKIT);
      setHasGenerated(true);
      setUsedFallback(true);
    } finally {
      setIsGenerating(false);
    }
  }

  /* --- Derived display data --- */
  const displayToolkit = toolkit || DEMO_TOOLKIT;
  const parsedFields = extractFields(pasteText);
  const offerSlug = slugify(pasteText);
  const dynamicSubIDs: SubIDEntry[] = SUBID_PLATFORMS.map((p) => ({
    platform: p.platform,
    tag: `${p.prefix}_${offerSlug}_${p.prefix}_sub`,
  }));

  const remainingGenerations = FREE_GENERATION_LIMIT - generationCount;

  return (
    <>
      {/* Background orbs */}
      <NectarOrbs />

      {/* ---- SECTION 1: HEADING ---- */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        <motion.p
          className="font-mono text-xs tracking-widest uppercase text-electric mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Smart Paste
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Paste Your Offer Details
        </motion.h1>
        <motion.p
          className="mt-4 text-muted-foreground max-w-xl text-base sm:text-lg leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The generator needs offer-level context to produce relevant content.
          Paste everything you have — network dashboards, emails, landing-page
          copy, offer sheets — and the engine will parse the fields.
        </motion.p>

        {/* Transformation Rail - compact progress indicator */}
        <CompactTransformationRail currentStep={currentStep} />
      </section>

      {/* Info box: what to include */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-8">
        <div className="rounded-lg border border-border/40 bg-surface/60 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-electric" />
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Include details like
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            {[
              "Offer name",
              "Network",
              "Vertical",
              "Payout",
              "Target audience",
              "Key features",
              "Banned traffic",
              "Landing-page angle",
              "Affiliate/redirect link",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-electric/50" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border/40" />

      {/* ---- SECTION 2: FORM ---- */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
        >
          {/* (a) Textarea with Load Example button */}
          <motion.div variants={fadeUp} custom={0}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="h-4 w-4 text-electric" />
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Raw Paste Input
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPasteText(DEMO_PASTE)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-electric/30 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Load Example
              </button>
            </div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full h-56 sm:h-64 rounded-xl border border-border/60 bg-surface text-foreground/80 font-mono text-sm p-5 resize-none focus:outline-none focus:ring-1 focus:ring-electric/30"
              placeholder={"Offer Name — Product Description\nNetwork: NetworkName | Offer ID: XX-0001\nVertical: Health & Wellness\nPayout: $40 CPA (CC Submit)\nConversion Flow: Free Trial → CC Submit → Rebill\nTop Geo: US, CA, UK\nLanding Page: https://...\nBanned Traffic: Incentivized, Bot, Brand Search\nSub-ID Format: {sub1}_{sub2}_{sub3}\n\nKey product details:\n- Feature 1\n- Feature 2\n- Target audience: ...\n- Unique angle: ..."}
            />
          </motion.div>

          {/* (b) Remaining generations count */}
          <motion.div variants={fadeUp} custom={1}>
            <p className="font-mono text-xs text-muted-foreground">
              {remainingGenerations > 0
                ? `${remainingGenerations} free generation${remainingGenerations === 1 ? "" : "s"} remaining`
                : "Free generation limit reached"}
            </p>
          </motion.div>

          {/* (c) Parsed Fields section */}
          <motion.div variants={fadeUp} custom={2}>
            {parsedFields.length > 0 &&
              parsedFields.some((f) => f.value !== "Not detected") && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <ClipboardPaste className="h-4 w-4 text-electric" />
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Parsed Fields
                    </p>
                  </div>
                  <div className="grid gap-2.5">
                    {parsedFields.map((item) => (
                      <EditableChip key={item.key} field={item} />
                    ))}
                  </div>
                </>
              )}
          </motion.div>

          {/* (d) Sub-ID accordion */}
          <motion.div variants={fadeUp} custom={3}>
            <button
              onClick={() => setShowSubIDs(!showSubIDs)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Tag className="h-4 w-4 text-electric" />
              Platform Sub-IDs
              <span className="text-xs text-muted-foreground/60 font-mono">
                (optional)
              </span>
              <span className="ml-auto">
                {showSubIDs ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            </button>

            {/* (e) Sub-ID details */}
            {showSubIDs && (
              <div className="mt-3 rounded-xl border border-border/60 bg-surface p-4 sm:p-5">
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Per-platform tracking tags appended to generated links. Edit
                  the tag format for each platform below.
                </p>
                <div className="grid gap-2.5">
                  {dynamicSubIDs.map((entry) => (
                    <EditableChip
                      key={entry.platform}
                      field={{
                        key: entry.platform,
                        label: entry.platform,
                        value: entry.tag,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* (f) Generate button (or limit-reached CTA) */}
          <motion.div variants={fadeUp} custom={4}>
            {limitReached ? (
              <div className="rounded-xl border border-electric/20 bg-electric/5 p-6 text-center space-y-3">
                <p className="text-sm text-foreground font-medium">
                  You've used all {FREE_GENERATION_LIMIT} free generations.
                </p>
                <a
                  href={GUMROAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-sm rounded-lg transition-colors"
                >
                  GET NECTAR ENGINE
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {hasGenerated ? "Regenerate" : "Generate Toolkit"}
                  </>
                )}
              </button>
            )}
            {usedFallback && (
              <p className="mt-2 text-xs text-amber-400/80 font-mono">
                API unavailable — showing demo content as fallback.
              </p>
            )}
          </motion.div>

          {/* (g) Error display (only when error && !usedFallback) */}
          {error && !usedFallback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/30 bg-red-500/5 p-4"
            >
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ---- SECTION 3: OUTPUT ---- */}
      {hasGenerated && displayToolkit && (
        <>
          <Separator className="bg-border/40" />
          <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Filename header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-3 w-3 rounded-full bg-electric" />
                <span className="font-mono text-xs text-muted-foreground">
                  {offerName}_toolkit_v1.0.json
                </span>
                {usedFallback && (
                  <span className="font-mono text-[10px] uppercase text-amber-400/60 ml-auto">
                    Demo Fallback
                  </span>
                )}
                {!usedFallback && (
                  <span className="font-mono text-[10px] uppercase text-electric/60 ml-auto">
                    AI Generated
                  </span>
                )}
              </div>

              {/* Output sections */}
              <div className="space-y-8">
                <PromoAnglesSection angles={displayToolkit.promo_angles} />
                <SocialPostsSection posts={displayToolkit.social_posts} />
                <HeadlinesSection headlines={displayToolkit.headlines} />
                <BodyCopySection text={displayToolkit.body_copy} />
                <CTASection ctas={displayToolkit.cta_variations} />
                <ComplianceSection notes={displayToolkit.compliance_notes} />

                {/* Check This Toolkit → scanner button */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <button
                    onClick={() => {
                      try {
                        const posts = displayToolkit.social_posts;
                        const contentText = posts
                          .map((p) => `[${p.platform}] ${p.text}`)
                          .join("\n\n");
                        const platforms = JSON.stringify(
                          posts.map((p) => p.platform),
                        );
                        const params = new URLSearchParams({
                          content: contentText,
                          platforms,
                        });
                        router.push(`/scanner?${params.toString()}`);
                      } catch {
                        router.push("/scanner");
                      }
                    }}
                    className="w-full sm:w-auto bg-electric hover:bg-electric/90 text-background font-semibold tracking-wide px-8 h-12 text-sm rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Check This Toolkit
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </section>
        </>
      )}
    </>
  );
}
