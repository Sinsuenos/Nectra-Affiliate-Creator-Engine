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
/*  COMPLIANCE DATA                                                    */
/* ------------------------------------------------------------------ */
interface PlatformRow {
  platform: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  bannedTriggers: string;
  mitigation: string;
  frequencyAdvice: string;
}

const complianceData: PlatformRow[] = [
  {
    platform: "X (Twitter)",
    risk: "LOW",
    bannedTriggers:
      "Direct link shorteners in bio-only posts, multi-level marketing language, unmarked financial advice, adult content, gambling links",
    mitigation:
      "Use #ad or the built-in Sponsored label. Avoid link shorteners that obscure the destination. Keep financial and health claims factual and cite sources.",
    frequencyAdvice:
      "3 to 5 posts per day is normal for active accounts. Avoid posting identical affiliate content more than once per 24 hours to prevent spam detection.",
  },
  {
    platform: "TikTok",
    risk: "MEDIUM",
    bannedTriggers:
      "Branded content without the Branded Content toggle, before-and-after health claims, crypto or token promotions, adult themes, misleading weight-loss promises",
    mitigation:
      "Always enable the Branded Content toggle before posting. Avoid hardcoded weight-loss or income claims. Use the disclosure tag in every video that includes a product link.",
    frequencyAdvice:
      "1 to 3 posts per day is the sweet spot. TikTok down-ranks repetitive content. Rotate angles and formats such as storytime, POV, or green-screen to maintain reach.",
  },
  {
    platform: "Instagram",
    risk: "MEDIUM",
    bannedTriggers:
      "Affiliate links without Paid Partnership tag, health outcome guarantees, before-and-after transformations, crypto promotions, tobacco or alcohol targeting under-25",
    mitigation:
      "Use the Paid Partnership label for all branded posts. Place disclaimers in the first line of captions rather than burying them. Avoid result-specific health language like 'will cure' or 'guaranteed to work.'",
    frequencyAdvice:
      "Feed posts: 3 to 5 per week. Stories: 5 to 10 per day is normal. Reels: 4 to 7 per week. Mix organic and affiliate content to avoid algorithmic penalty.",
  },
  {
    platform: "Facebook",
    risk: "LOW",
    bannedTriggers:
      "Misleading health claims, fake urgency such as 'only 2 left', crypto schemes, adult content, multi-level recruitment language, cloaked affiliate URLs in ads",
    mitigation:
      "Use the Branded Content tag for all sponsored posts. In ads, use the Facebook transparency tools and avoid cloaked links. Health offers should avoid disease-specific claims.",
    frequencyAdvice:
      "1 to 2 posts per day for pages. Boosted posts: limit to 1 to 2 per week per offer to avoid ad fatigue. Group posts vary by community rules.",
  },
  {
    platform: "Reddit",
    risk: "HIGH",
    bannedTriggers:
      "Self-promotion without community approval, affiliate links in top-level posts on most subs, karma-farming patterns, duplicate posts across subreddits, undisclosed brand affiliation",
    mitigation:
      "Lead with value and genuine discussion. Place links only in comments when allowed by subreddit rules. Always disclose affiliation if asked. Check each subreddit wiki for self-promo policies before posting.",
    frequencyAdvice:
      "1 to 3 relevant posts per week maximum across subreddits. Never cross-post the same content to multiple subs within 24 hours. Build karma through genuine participation before any affiliate activity.",
  },
  {
    platform: "Pinterest",
    risk: "LOW",
    bannedTriggers:
      "Health misinformation, misleading before-and-after pins, adult content, affiliate links in pin descriptions without disclosure, deceptive product claims",
    mitigation:
      "Include FTC disclosure in the first line of every pin description. Use high-quality original images rather than stock. Link directly to the offer landing page rather than through redirect chains.",
    frequencyAdvice:
      "5 to 15 pins per day is standard for active accounts. Batch-pin content using scheduling tools. Avoid pinning the same URL more than once per board.",
  },
  {
    platform: "Snapchat",
    risk: "MEDIUM",
    bannedTriggers:
      "Undisclosed sponsored content in Stories or Spotlight, adult content, gambling, tobacco, alcohol targeting minors, crypto promotions, misleading health claims",
    mitigation:
      "Use the Sponsored label on all branded Story and Spotlight content. Keep health claims non-specific. Avoid direct affiliate links in public Snaps and use Stories with proper disclosure instead.",
    frequencyAdvice:
      "3 to 5 Stories per day. Spotlight: 1 to 2 per day. Avoid repetitive affiliate content in back-to-back Stories since Snapchat users swipe past ads quickly.",
  },
  {
    platform: "Discord",
    risk: "HIGH",
    bannedTriggers:
      "Unsolicited DMs with affiliate links, spam in non-designated channels, self-promotion without server permission, bot-driven mass messaging, phishing links",
    mitigation:
      "Only post affiliate content in channels explicitly designated for it. Always disclose the relationship. Get server admin approval before sharing any commercial links. Never send affiliate DMs without prior consent.",
    frequencyAdvice:
      "Varies entirely by server rules. In designated promo channels: 1 post per 24 to 48 hours is safe. In general channels: zero affiliate posts unless explicitly allowed.",
  },
  {
    platform: "Telegram",
    risk: "MEDIUM",
    bannedTriggers:
      "Spam reporting threshold triggers auto-ban, phishing or malware links, illegal content, unsolicited DM blasts to non-opted-in users, crypto scam patterns",
    mitigation:
      "Only share affiliate links in channels where subscribers have opted in. Include clear disclosure. Avoid mass-adding users to groups. Use channel posts rather than group spam for link distribution.",
    frequencyAdvice:
      "Channels: 1 to 3 posts per day. Groups: match the existing conversation rhythm. Never post the same link to multiple groups simultaneously since Telegram spam filter will flag it.",
  },
];

const riskColors: Record<string, { dot: string; text: string }> = {
  LOW: { dot: "bg-emerald-400", text: "text-emerald-400" },
  MEDIUM: { dot: "bg-amber-400", text: "text-amber-400" },
  HIGH: { dot: "bg-red-400", text: "text-red-400" },
};

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function CompliancePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.header
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs tracking-widest uppercase text-electric mb-4">
            Risk Assessment
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Platform Compliance Matrix
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            This matrix is a static reference summarizing the key risk vectors
            the Nectar Engine evaluates for every supported destination, based on
            platform advertising, affiliate, and community policies as of 2025.
          </p>

          <p className="text-sm text-muted-foreground/70 leading-relaxed rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3">
            This matrix is educational and strategic guidance only, not a
            guarantee of compliance. Platform terms of service change without
            notice, and enforcement varies by region, account history, and
            content category. Always verify current policies directly on each
            platform before publishing.
          </p>
        </motion.header>

        <Separator className="my-8 bg-border/60" />

        <motion.div
          className="overflow-x-auto rounded-xl border border-border/60"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-surface-raised">
              <tr>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">
                  Platform
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">
                  Risk Level
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">
                  Banned Triggers
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">
                  Mitigation
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">
                  Posting Frequency Advice
                </th>
              </tr>
            </thead>

            <tbody>
              {complianceData.map((row) => {
                const colors = riskColors[row.risk];
                return (
                  <tr
                    key={row.platform}
                    className="border-b border-border/30 last:border-0 hover:bg-surface-raised/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-foreground font-medium whitespace-nowrap">
                      {row.platform}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${colors.dot}`}
                        />
                        <span className={`${colors.text} font-medium`}>
                          {row.risk}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">
                      {row.bannedTriggers}
                    </td>
                    <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">
                      {row.mitigation}
                    </td>
                    <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">
                      {row.frequencyAdvice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          className="mt-6 font-mono text-xs text-muted-foreground/60"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          Data reflects policies as of 2025. Users should verify
          current platform policies directly before publishing.
        </motion.p>
      </section>
    </>
  );
}
