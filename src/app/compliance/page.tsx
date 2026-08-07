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
  affiliatePolicy: string;
  disclosureRequired: string;
  restrictedCategories: string;
  contentFormatLimits: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
}

const complianceData: PlatformRow[] = [
  {
    platform: "X (Twitter)",
    affiliatePolicy: "Allowed with disclosure",
    disclosureRequired: "Yes — #ad or Sponsored label",
    restrictedCategories: "Financial, adult, gambling",
    contentFormatLimits: "280 chars, image/video attachments",
    risk: "LOW",
  },
  {
    platform: "TikTok",
    affiliatePolicy: "Allowed with Branded Content toggle",
    disclosureRequired: "Yes — mandatory branded content tag",
    restrictedCategories: "Adult, gambling, weapons, crypto",
    contentFormatLimits: "15–60s video, caption up to 2200 chars",
    risk: "MEDIUM",
  },
  {
    platform: "Instagram",
    affiliatePolicy: "Allowed via Paid Partnership tag",
    disclosureRequired: "Yes — paid partnership label required",
    restrictedCategories: "Adult, tobacco, gambling, crypto (US)",
    contentFormatLimits: "Reels 90s, Stories 15s, feed 2200 chars",
    risk: "MEDIUM",
  },
  {
    platform: "Facebook",
    affiliatePolicy: "Allowed with Branded Content tag",
    disclosureRequired: "Yes — branded content tag required",
    restrictedCategories: "Adult, misleading health, crypto",
    contentFormatLimits: "Reels 90s, posts 63,206 chars, ads with restrictions",
    risk: "LOW",
  },
  {
    platform: "Reddit",
    affiliatePolicy: "Allowed in some subs, restricted in many",
    disclosureRequired: "Yes — recommended by FTC, enforced in some subs",
    restrictedCategories: "Varies by subreddit, self-promo limited",
    contentFormatLimits: "Title 300 chars, post 40,000 chars, karma required",
    risk: "HIGH",
  },
  {
    platform: "Pinterest",
    affiliatePolicy: "Allowed with disclosure",
    disclosureRequired: "Yes — FTC disclosure required",
    restrictedCategories: "Adult, misleading claims, health misinformation",
    contentFormatLimits: "Pin description 500 chars, idea pins up to 60s video",
    risk: "LOW",
  },
  {
    platform: "Snapchat",
    affiliatePolicy: "Allowed with Sponsored label",
    disclosureRequired: "Yes — sponsored tag on Story/Spotlight",
    restrictedCategories: "Adult, gambling, tobacco, alcohol targeting minors",
    contentFormatLimits: "Story 60s, Spotlight 60s, Snap Ads 10s",
    risk: "MEDIUM",
  },
  {
    platform: "Discord",
    affiliatePolicy: "Allowed in designated channels only",
    disclosureRequired: "Yes — server rules often require it",
    restrictedCategories: "Spam, unsolicited DMs, adult in SFW servers",
    contentFormatLimits: "Embeds, threads, server-specific rules apply",
    risk: "HIGH",
  },
  {
    platform: "Telegram",
    affiliatePolicy: "Allowed with disclosure",
    disclosureRequired: "Yes — FTC guidelines apply",
    restrictedCategories: "Spam, phishing, illegal content",
    contentFormatLimits: "Channel posts unlimited, group messages 4096 chars",
    risk: "MEDIUM",
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
        {/* ============================================================ */}
        {/*  HEADER                                                      */}
        {/* ============================================================ */}
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

          <p className="text-base text-muted-foreground leading-relaxed">
            Before any output is generated, the Nectar Engine checks content
            against each platform&apos;s current advertising, affiliate, and
            community policies. This matrix summarizes the key risk vectors the
            engine evaluates for every supported destination.
          </p>
        </motion.header>

        <Separator className="my-8 bg-border/60" />

        {/* ============================================================ */}
        {/*  COMPLIANCE TABLE                                            */}
        {/* ============================================================ */}
        <motion.div
          className="overflow-x-auto rounded-xl border border-border/60"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <table className="w-full text-sm font-mono">
            <thead className="border-b border-border/60 bg-surface-raised">
              <tr>
                {[
                  "Platform",
                  "Affiliate Link Policy",
                  "Disclosure Required",
                  "Restricted Categories",
                  "Content Format Limits",
                  "Overall Risk",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-left px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {complianceData.map((row, idx) => {
                const colors = riskColors[row.risk];
                return (
                  <tr
                    key={row.platform}
                    className="border-b border-border/30 last:border-0 hover:bg-surface-raised/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-foreground font-medium whitespace-nowrap">
                      {row.platform}
                    </td>
                    <td className="px-5 py-4 text-foreground/70">
                      {row.affiliatePolicy}
                    </td>
                    <td className="px-5 py-4 text-foreground/70">
                      {row.disclosureRequired}
                    </td>
                    <td className="px-5 py-4 text-foreground/70">
                      {row.restrictedCategories}
                    </td>
                    <td className="px-5 py-4 text-foreground/70">
                      {row.contentFormatLimits}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* ============================================================ */}
        {/*  FOOTNOTE                                                    */}
        {/* ============================================================ */}
        <motion.p
          className="mt-6 font-mono text-xs text-muted-foreground/60"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          Data reflects policies as of 2025. Nectar Engine re-scans rules on
          each run to stay current.
        </motion.p>
      </section>
    </>
  );
}
