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
  /*
   * Source: Snap Advertising Policies + Snap Commercial Content Policy
   * (snap.com/ad-policies, snap.com/terms/commercial-content), current 2026
   *
   * Key finding: Dating ads ARE explicitly permitted as long as there are no
   * references to sexual activity. Suggestive content must be age-gated 18+.
   * Snapchat is MORE permissive for legitimate dating-vertical content than
   * most platforms, provided content stays non-explicit and is properly age-gated.
   */
  {
    id: "snapchat",
    name: "Snapchat",
    risk: "MEDIUM",
    bannedTriggers: [
      "Explicit sexual content or references to sexual activity",
      "Sex work, pornography, or nudity",
      "Dating services emphasizing casual sexual encounters",
      "Sponsored lenses with suggestive content",
      "Undisclosed sponsored content in Stories or Spotlight",
      "Content targeting under-18 without age-gate",
    ],
    safeApproach:
      "Age-gate all dating-vertical content 18+. Keep the dating angle emotional and lifestyle-focused (companionship, connection) rather than sexual. Use the Sponsored label on all branded Story and Spotlight content. Avoid 'casual encounters' framing entirely.",
    notes:
      "More permissive than most platforms for legitimate dating offers if content stays non-explicit and age-gated. 3 to 5 Stories/day. Spotlight: 1 to 2/day. Snapchat users swipe quickly so front-load the value.",
  },
  /*
   * Source: Discord Ads Policy (support.discord.com/hc/en-us/articles/25516720403223),
   * current as of ~March 2026
   *
   * Key finding: Discord has NO public profile, NO algorithmic feed, NO
   * 'going viral' mechanism. Servers are largely invite-only/opt-in
   * communities. Risk is therefore server-level ToS enforcement and
   * community moderation, NOT algorithmic account suppression like
   * TikTok/Instagram. Enforcement is real but structurally contained
   * to closed communities rather than broadcast/discovery risk.
   */
  {
    id: "discord",
    name: "Discord",
    risk: "MEDIUM",
    bannedTriggers: [
      "Explicit or implicit adult sexual content",
      "Compensated sexual acts or escort service references",
      "Intimate massage or sex work references",
      "Products shaped like intimate body parts",
      "Unsolicited DMs with affiliate links",
      "Bot-driven mass messaging",
    ],
    safeApproach:
      "Safe within private, consent-based servers discussing dating/relationships in non-explicit terms. Avoid direct escort or compensated-sex framing. Only post affiliate content in channels designated for it. Get server admin approval. Do not promote via public Discord discovery features.",
    notes:
      "MEDIUM risk because enforcement is structurally contained to closed communities, not broadcast/discovery risk. Server rules control everything. In designated promo channels: 1 post/24 to 48 hours. No public profile or algorithmic feed to exploit.",
  },
  /*
   * Source: Telegram Ads Guide (ads.telegram.org policies, via
   * umnico.com/blog/telegram-ads), Telegram ToS re: illegal
   * pornographic content on public channels, current 2026
   *
   * Key finding: Telegram's OFFICIAL ads platform (ads.telegram.org)
   * explicitly disallows advertising for 'adult materials' outright.
   * However, broader content moderation is comparatively hands-off
   * for organic channel/group promotion. There is a real gap between
   * formal ad platform rules and actual enforcement. Not a safe
   * long-term bet due to app-store pressure (Apple/Google) forcing
   * periodic crackdowns on adult content channels.
   */
  {
    id: "telegram",
    name: "Telegram",
    risk: "HIGH",
    bannedTriggers: [
      "Adult materials on the official Telegram Ads product",
      "Illegal pornographic content on publicly viewable channels",
      "Phishing or malware links",
      "Unsolicited DM blasts to non-opted-in users",
      "Crypto scam patterns",
      "Content that could trigger app-store policy crackdowns",
    ],
    safeApproach:
      "Do NOT use Telegram's paid Ads product for adult-adjacent dating content at all. Organic channel promotion carries real but inconsistent risk. Treat as HIGH, not a reliable channel to build a durable presence on. Prefer opted-in channels with clear disclosure.",
    notes:
      "HIGH risk for the official ads product (adult content banned outright). MEDIUM-HIGH for organic channel/group promotion since enforcement is inconsistent but the platform is not a safe long-term bet due to periodic app-store crackdowns. Channels: 1 to 3 posts/day.",
  },
] as const;

export const PLATFORM_MATRIX_BY_ID: Readonly<Record<string, PlatformCompliance>> =
  Object.fromEntries(PLATFORM_MATRIX.map((platform) => [platform.id, platform]));
