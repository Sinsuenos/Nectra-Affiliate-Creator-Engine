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
    bannedTriggers: ["Direct link shorteners in bio-only posts", "Multi-level marketing language", "Unmarked financial advice", "Adult content", "Gambling links"],
    safeApproach: "Use #ad or the built-in Sponsored label. Avoid link shorteners that obscure the destination. Keep financial and health claims factual and cite sources.",
    notes: "3 to 5 posts per day is normal for active accounts. Avoid posting identical affiliate content more than once per 24 hours to prevent spam detection.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    risk: "MEDIUM",
    bannedTriggers: ["Branded content without the Branded Content toggle", "Before-and-after health claims", "Crypto or token promotions", "Adult themes", "Misleading weight-loss promises"],
    safeApproach: "Always enable the Branded Content toggle before posting. Avoid hardcoded weight-loss or income claims. Use the disclosure tag in every video that includes a product link.",
    notes: "1 to 3 posts per day is the sweet spot. TikTok down-ranks repetitive content. Rotate angles and formats such as storytime, POV, or green-screen to maintain reach.",
  },
  {
    id: "instagram",
    name: "Instagram",
    risk: "MEDIUM",
    bannedTriggers: ["Affiliate links without Paid Partnership tag", "Health outcome guarantees", "Before-and-after transformations", "Crypto promotions", "Tobacco or alcohol targeting under-25"],
    safeApproach: "Use the Paid Partnership label for all branded posts. Place disclaimers in the first line of captions rather than burying them. Avoid result-specific health language like 'will cure' or 'guaranteed to work.'",
    notes: "Feed posts: 3 to 5 per week. Stories: 5 to 10 per day is normal. Reels: 4 to 7 per week. Mix organic and affiliate content to avoid algorithmic penalty.",
  },
  {
    id: "facebook",
    name: "Facebook",
    risk: "MEDIUM",
    bannedTriggers: ["Misleading health claims", "Fake urgency such as 'only 2 left'", "Crypto schemes", "Adult content", "Multi-level recruitment language", "Cloaked affiliate URLs in ads"],
    safeApproach: "Use the Branded Content tag for all sponsored posts. In ads, use Meta's transparency tools and avoid cloaked links. Health offers should avoid disease-specific claims.",
    notes: "Treat Facebook as a MEDIUM-risk environment for affiliate content. Ad review, disclosure requirements, deceptive-claims enforcement, and restricted vertical rules can all affect delivery. Check the current Meta policy before publishing.",
  },
  {
    id: "reddit",
    name: "Reddit",
    risk: "HIGH",
    bannedTriggers: ["Self-promotion without community approval", "Affiliate links in top-level posts on most subs", "Karma-farming patterns", "Duplicate posts across subreddits", "Undisclosed brand affiliation"],
    safeApproach: "Lead with value and genuine discussion. Place links only in comments when allowed by subreddit rules. Always disclose affiliation if asked. Check each subreddit wiki for self-promo policies before posting.",
    notes: "1 to 3 relevant posts per week maximum across subreddits. Never cross-post the same content to multiple subs within 24 hours. Build karma through genuine participation before any affiliate activity.",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    risk: "LOW",
    bannedTriggers: ["Health misinformation", "Misleading before-and-after pins", "Adult content", "Affiliate links in pin descriptions without disclosure", "Deceptive product claims"],
    safeApproach: "Include FTC disclosure in the first line of every pin description. Use high-quality original images rather than stock. Link directly to the offer landing page rather than through redirect chains.",
    notes: "5 to 15 pins per day is standard for active accounts. Batch-pin content using scheduling tools. Avoid pinning the same URL more than once per board.",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    risk: "MEDIUM",
    bannedTriggers: ["Explicit sexual content or references to sexual activity", "Sex work, pornography, or nudity", "Dating services emphasizing casual sexual encounters", "Sponsored lenses with suggestive content", "Undisclosed sponsored content in Stories or Spotlight", "Content targeting under-18 without age-gate"],
    safeApproach: "Age-gate all dating-vertical content 18+. Keep the dating angle emotional and lifestyle-focused (companionship, connection) rather than sexual. Use the Sponsored label on all branded Story and Spotlight content. Avoid 'casual encounters' framing entirely.",
    notes: "More permissive than most platforms for legitimate dating offers if content stays non-explicit and age-gated. 3 to 5 Stories/day. Spotlight: 1 to 2/day. Snapchat users swipe quickly so front-load the value.",
  },
  {
    id: "discord",
    name: "Discord",
    risk: "MEDIUM",
    bannedTriggers: ["Explicit or implicit adult sexual content", "Compensated sexual acts or escort service references", "Intimate massage or sex work references", "Products shaped like intimate body parts", "Unsolicited DMs with affiliate links", "Bot-driven mass messaging"],
    safeApproach: "Safe within private, consent-based servers discussing dating/relationships in non-explicit terms. Avoid direct escort or compensated-sex framing. Only post affiliate content in channels designated for it. Get server admin approval. Do not promote via public Discord discovery features.",
    notes: "MEDIUM risk because enforcement is structurally contained to closed communities, not broadcast/discovery risk. Server rules control everything. In designated promo channels: 1 post/24 to 48 hours. No public profile or algorithmic feed to exploit.",
  },
  {
    id: "telegram",
    name: "Telegram",
    risk: "MEDIUM",
    bannedTriggers: ["Adult materials on the official Telegram Ads product", "Illegal pornographic content on publicly viewable channels", "Phishing or malware links", "Unsolicited DM blasts to non-opted-in users", "Crypto scam patterns", "Content that could trigger app-store policy crackdowns"],
    safeApproach: "Do not use Telegram's paid Ads product for adult-adjacent dating content. For organic channels, use opted-in audiences, clear disclosure, and factual content. Treat organic promotion as MEDIUM-HIGH in practice, with the paid Ads product separately treated as HIGH-risk.",
    notes: "Overall affiliate-content risk: MEDIUM for this matrix, but Telegram's official paid Ads product is HIGH-risk for adult content. Organic channel/group promotion sits between MEDIUM and HIGH because enforcement is inconsistent. Verify current Telegram rules before publishing.",
  },
] as const;

export const PLATFORM_MATRIX_BY_ID: Readonly<Record<string, PlatformCompliance>> =
  Object.fromEntries(PLATFORM_MATRIX.map((platform) => [platform.id, platform]));