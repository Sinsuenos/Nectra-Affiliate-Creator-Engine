"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } }),
};

interface PlatformRow {
  platform: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  bannedTriggers: string;
  mitigation: string;
  frequencyAdvice: string;
}

const complianceData: PlatformRow[] = [
  { platform: "X (Twitter)", risk: "LOW", bannedTriggers: "Direct link shorteners in bio-only posts, multi-level marketing language, unmarked financial advice, adult content, gambling links", mitigation: "Use #ad or the built-in Sponsored label. Avoid link shorteners that obscure the destination. Keep financial and health claims factual and cite sources.", frequencyAdvice: "3 to 5 posts per day is normal for active accounts. Avoid posting identical affiliate content more than once per 24 hours to prevent spam detection." },
  { platform: "TikTok", risk: "MEDIUM", bannedTriggers: "Branded content without the Branded Content toggle, before-and-after health claims, crypto or token promotions, adult themes, misleading weight-loss promises", mitigation: "Always enable the Branded Content toggle before posting. Avoid hardcoded weight-loss or income claims. Use the disclosure tag in every video that includes a product link.", frequencyAdvice: "1 to 3 posts per day is the sweet spot. TikTok down-ranks repetitive content. Rotate angles and formats such as storytime, POV, or green-screen to maintain reach." },
  { platform: "Instagram", risk: "MEDIUM", bannedTriggers: "Affiliate links without Paid Partnership tag, health outcome guarantees, before-and-after transformations, crypto promotions, tobacco or alcohol targeting under-25", mitigation: "Use the Paid Partnership label for all branded posts. Place disclosures prominently. Avoid result-specific health language like 'will cure' or 'guaranteed to work.'", frequencyAdvice: "Feed posts: 3 to 5 per week. Stories: 5 to 10 per day is normal. Reels: 4 to 7 per week. Mix organic and affiliate content." },
  { platform: "Facebook", risk: "LOW", bannedTriggers: "Misleading health claims, fake urgency such as 'only 2 left', crypto schemes, adult content, multi-level recruitment language, cloaked affiliate URLs in ads", mitigation: "Use the Branded Content tag for sponsored posts. In ads, use platform transparency tools and avoid cloaked links. Health offers should avoid disease-specific claims.", frequencyAdvice: "1 to 2 posts per day for pages. Boosted posts: limit to 1 to 2 per week per offer to avoid ad fatigue. Group rules vary." },
  { platform: "Reddit", risk: "HIGH", bannedTriggers: "Self-promotion without community approval, affiliate links in top-level posts on most subs, karma-farming patterns, duplicate posts across subreddits, undisclosed brand affiliation", mitigation: "Lead with value and genuine discussion. Place links only where subreddit rules allow them. Check each community's rules before posting.", frequencyAdvice: "1 to 3 relevant posts per week maximum across subreddits. Never cross-post the same content to multiple subs within 24 hours." },
  { platform: "Pinterest", risk: "LOW", bannedTriggers: "Health misinformation, misleading before-and-after pins, adult content, affiliate links without disclosure, deceptive product claims", mitigation: "Include appropriate disclosure in pin descriptions. Use original or properly licensed images. Link directly to the relevant offer destination.", frequencyAdvice: "5 to 15 pins per day can be normal for active accounts. Avoid repetitive posting and follow current Pinterest guidance." },
  { platform: "Snapchat", risk: "MEDIUM", bannedTriggers: "Undisclosed sponsored content in Stories or Spotlight, adult content, gambling, tobacco, alcohol targeting minors, crypto promotions, misleading health claims", mitigation: "Use the appropriate sponsored-content disclosure. Keep health claims non-specific and avoid misleading outcomes.", frequencyAdvice: "Posting cadence varies by account and format. Avoid repetitive affiliate content in back-to-back Stories." },
  { platform: "Discord", risk: "HIGH", bannedTriggers: "Unsolicited DMs with affiliate links, spam in non-designated channels, self-promotion without server permission, bot-driven mass messaging, phishing links", mitigation: "Only post commercial content where server rules explicitly allow it. Get admin approval before sharing commercial links. Never send unsolicited affiliate DMs.", frequencyAdvice: "Follow each server's rules. Designated promo channels may have their own cadence; general channels should not be used for unsolicited promotion." },
  { platform: "Telegram", risk: "MEDIUM", bannedTriggers: "Spam reporting triggers, phishing or malware links, illegal content, unsolicited DM blasts to non-opted-in users, crypto scam patterns", mitigation: "Share affiliate links only with audiences that have opted in. Include clear disclosure. Avoid mass-adding users or repetitive link distribution.", frequencyAdvice: "Match the rhythm of the channel or group. Avoid simultaneous repetitive link posting across multiple communities." },
];

const riskColors: Record<string, { dot: string; text: string }> = {
  LOW: { dot: "bg-emerald-400", text: "text-emerald-400" },
  MEDIUM: { dot: "bg-amber-400", text: "text-amber-400" },
  HIGH: { dot: "bg-red-400", text: "text-red-400" },
};

export default function CompliancePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.header className="max-w-3xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-mono text-xs tracking-widest uppercase text-electric mb-4">Protect Before You Post</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Platform Compliance Matrix</h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            A strategic reference for the risk signals Nectar looks for across nine publishing environments. Use it to understand the kinds of language and behavior that deserve a second look before publishing.
          </p>
          <p className="text-sm text-electric hover:text-electric/80 transition-colors mb-3"><Link href="/scanner">Have content ready? Open the Scanner →</Link></p>
          <p className="text-sm text-muted-foreground/70 leading-relaxed rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3">
            This is educational guidance, not a guarantee of compliance. Platform rules and enforcement change, and requirements vary by region, account history, content category, and format. Always verify the current rules directly with the platform before publishing.
          </p>
        </motion.header>

        <Separator className="my-8 bg-border/60" />

        <motion.div className="overflow-x-auto rounded-xl border border-border/60" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-surface-raised"><tr>
              {['Platform','Risk Level','Risk Signals','Safer Approach','Posting Guidance'].map((heading) => <th key={heading} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">{heading}</th>)}
            </tr></thead>
            <tbody>{complianceData.map((row) => { const colors = riskColors[row.risk]; return (
              <tr key={row.platform} className="border-b border-border/30 last:border-0 hover:bg-surface-raised/50 transition-colors">
                <td className="px-5 py-4 text-foreground font-medium whitespace-nowrap">{row.platform}</td>
                <td className="px-5 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-2"><span className={`inline-block h-2 w-2 rounded-full ${colors.dot}`} /><span className={`${colors.text} font-medium`}>{row.risk}</span></span></td>
                <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">{row.bannedTriggers}</td>
                <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">{row.mitigation}</td>
                <td className="px-5 py-4 text-foreground/70 text-xs leading-relaxed max-w-xs">{row.frequencyAdvice}</td>
              </tr>
            ); })}</tbody>
          </table>
        </motion.div>

        <motion.p className="mt-6 font-mono text-xs text-muted-foreground/60" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          Reference data is maintained as strategic guidance. Verify current platform policies directly before publishing.
        </motion.p>
      </section>
    </>
  );
}
