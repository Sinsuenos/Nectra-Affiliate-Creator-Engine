export type ComplianceRisk = "LOW" | "MEDIUM" | "HIGH";

export interface PlatformCompliance {
  id: string;
  name: string;
  risk: ComplianceRisk;
  bannedTriggers: string[];
  safeApproach: string;
  notes: string;
}

/**
 * Single source of truth for the 9-platform compliance matrix currently
 * published by the Nectar Engine compliance page.
 */
export const PLATFORM_MATRIX: readonly PlatformCompliance[] = [
  {
    id: "x",
    name: "X (Twitter)",
    risk: "LOW",
    bannedTriggers: [
      "Direct link shorteners in bio-only posts",
      "Multi-level marketing language",
      "Unmarked financial advice",
      "Adult content",
      "Gambling links",
    ],
    safeApproach:
      "Use #ad or the built-in Sponsored label. Avoid link shorteners that obscure the destination. Keep financial and health claims factual and cite sources.",
    notes:
      "3 to 5 posts per day is normal for active accounts. Avoid posting identical affiliate content more than once per 24 hours to prevent spam detection.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    risk: "MEDIUM",
    bannedTriggers: [
      "Branded content without the Branded Content toggle",
      "Before-and-after health claims",
      "Crypto or token promotions",
      "Adult themes",
      "Misleading weight-loss promises",
    ],
    safeApproach:
      "Always enable the Branded Content toggle before posting. Avoid hardcoded weight-loss or income claims. Use the disclosure tag in every video that includes a product link.",
    notes:
      "1 to 3 posts per day is the sweet spot. TikTok down-ranks repetitive content. Rotate angles and formats such as storytime, POV, or green-screen to maintain reach.",
  },
  {
    id: "instagram",
    name: "Instagram",
    risk: "MEDIUM",
    bannedTriggers: [
      "Affiliate links without Paid Partnership tag",
      "Health outcome guarantees",
      "Before-and-after transformations",
      "Crypto promotions",
      "Tobacco or alcohol targeting under-25",
    ],
    safeApproach:
      "Use the Paid Partnership label for all branded posts. Place disclaimers in the first line of captions rather than burying them. Avoid result-specific health language like 'will cure' or 'guaranteed to work.'",
    notes:
      "Feed posts: 3 to 5 per week. Stories: 5 to 10 per day is normal. Reels: 4 to 7 per week. Mix organic and affiliate content to avoid algorithmic penalty.",
  },
  {
    id: "facebook",
    name: "Facebook",
    risk: "LOW",
    bannedTriggers: [
      "Misleading health claims",
      "Fake urgency such as 'only 2 left'",
      "Crypto schemes",
      "Adult content",
      "Multi-level recruitment language",
      "Cloaked affiliate URLs in ads",
    ],
    safeApproach:
      "Use the Branded Content tag for all sponsored posts. In ads, use the Facebook transparency tools and avoid cloaked links. Health offers should avoid disease-specific claims.",
    notes:
      "1 to 2 posts per day for pages. Boosted posts: limit to 1 to 2 per week per offer to avoid ad fatigue. Group posts vary by community rules.",
  },
  {
    id: "reddit",
    name: "Reddit",
    risk: "HIGH",
    bannedTriggers: [
      "Self-promotion without community approval",
      "Affiliate links in top-level posts on most subs",
      "Karma-farming patterns",
      "Duplicate posts across subreddits",
      "Undisclosed brand affiliation",
    ],
    safeApproach:
      "Lead with value and genuine discussion. Place links only in comments when allowed by subreddit rules. Always disclose affiliation if asked. Check each subreddit wiki for self-promo policies before posting.",
    notes:
      "1 to 3 relevant posts per week maximum across subreddits. Never cross-post the same content to multiple subs within 24 hours. Build karma through genuine participation before any affiliate activity.",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    risk: "LOW",
    bannedTriggers: [
      "Health misinformation",
      "Misleading before-and-after pins",
      "Adult content",
      "Affiliate links in pin descriptions without disclosure",
      "Deceptive product claims",
    ],
    safeApproach:
      "Include FTC disclosure in the first line of every pin description. Use high-quality original images rather than stock. Link directly to the offer landing page rather than through redirect chains.",
    notes:
      "5 to 15 pins per day is standard for active accounts. Batch-pin content using scheduling tools. Avoid pinning the same URL more than once per board.",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    risk: "MEDIUM",
    bannedTriggers: [
      "Undisclosed sponsored content in Stories or Spotlight",
      "Adult content",
      "Gambling",
      "Tobacco or alcohol targeting minors",
      "Crypto promotions",
      "Misleading health claims",
    ],
    safeApproach:
      "Use the Sponsored label on all branded Story and Spotlight content. Keep health claims non-specific. Avoid direct affiliate links in public Snaps and use Stories with proper disclosure instead.",
    notes:
      "3 to 5 Stories per day. Spotlight: 1 to 2 per day. Avoid repetitive affiliate content in back-to-back Stories since Snapchat users swipe past ads quickly.",
  },
  {
    id: "discord",
    name: "Discord",
    risk: "HIGH",
    bannedTriggers: [
      "Unsolicited DMs with affiliate links",
      "Spam in non-designated channels",
      "Self-promotion without server permission",
      "Bot-driven mass messaging",
      "Phishing links",
    ],
    safeApproach:
      "Only post affiliate content in channels explicitly designated for it. Always disclose the relationship. Get server admin approval before sharing any commercial links. Never send affiliate DMs without prior consent.",
    notes:
      "Varies entirely by server rules. In designated promo channels: 1 post per 24 to 48 hours is safe. In general channels: zero affiliate posts unless explicitly allowed.",
  },
  {
    id: "telegram",
    name: "Telegram",
    risk: "MEDIUM",
    bannedTriggers: [
      "Spam reporting threshold triggers auto-ban",
      "Phishing or malware links",
      "Illegal content",
      "Unsolicited DM blasts to non-opted-in users",
      "Crypto scam patterns",
    ],
    safeApproach:
      "Only share affiliate links in channels where subscribers have opted in. Include clear disclosure. Avoid mass-adding users to groups. Use channel posts rather than group spam for link distribution.",
    notes:
      "Channels: 1 to 3 posts per day. Groups: match the existing conversation rhythm. Never post the same link to multiple groups simultaneously since Telegram spam filter will flag it.",
  },
] as const;

export const PLATFORM_MATRIX_BY_ID: Readonly<Record<string, PlatformCompliance>> =
  Object.fromEntries(PLATFORM_MATRIX.map((platform) => [platform.id, platform]));
