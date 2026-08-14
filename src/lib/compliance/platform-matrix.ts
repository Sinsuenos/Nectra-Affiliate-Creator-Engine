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
    bannedTriggers: ["Direct link shorteners in bio-only posts", "Multi-level marketing language", "Unmarked financial advice", "Unlabeled adult content", "Gambling links"],
    safeApproach: "Disclose paid partnerships using X\u2019s Paid Partnership label and include clear identifiable disclosure in the post itself \u2014 a standalone #ad is not sufficient on its own under FTC guidance. Avoid link shorteners that obscure the destination. Keep financial and health claims factual and cite sources.",
    notes: "X permits properly labeled adult content; the risk is unlabeled or misleading adult material. Spam detection triggers on mass identical posting, not a specific frequency threshold.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    risk: "MEDIUM",
    bannedTriggers: ["Branded content without the Branded Content toggle", "Before-and-after health claims", "Crypto or token promotions", "Adult themes", "Misleading weight-loss promises"],
    safeApproach: "Enable the Branded Content toggle for posts that qualify as branded content under TikTok\u2019s commercial content policies. The required disclosure mechanism depends on how the content is classified \u2014 not all affiliate posts trigger the same labeling requirement. Avoid hardcoded weight-loss or income claims.",
    notes: "TikTok enforces against repetitive content that triggers spam detection. The enforcement threshold is behavioral, not a specific post-count limit.",
  },
  {
    id: "instagram",
    name: "Instagram",
    risk: "MEDIUM",
    bannedTriggers: ["Affiliate links without Paid Partnership tag", "Health outcome guarantees", "Before-and-after transformations", "Crypto promotions", "Tobacco or alcohol targeting under-25"],
    safeApproach: "Use the Paid Partnership label for all branded posts. Place disclaimers in the first line of captions rather than burying them. Avoid result-specific health language like 'will cure' or 'guaranteed to work.'",
    notes: "Instagram\u2019s algorithm may reduce reach for accounts that post a high ratio of commercial content. The enforcement is behavioral, not a specific frequency threshold.",
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
    notes: "Reddit\u2019s spam rules concern repeated, unwanted mass engagement rather than a specific numeric threshold. Each subreddit sets its own self-promotion rules. Build karma through genuine participation before any affiliate activity.",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    risk: "LOW",
    bannedTriggers: ["Health misinformation", "Misleading before-and-after pins", "Adult content", "Affiliate links in pin descriptions without disclosure", "Deceptive product claims"],
    safeApproach: "Include FTC disclosure in the first line of every pin description. Use high-quality original images rather than stock. Link directly to the offer landing page rather than through redirect chains.",
    notes: "Pinterest may limit distribution of accounts that pin the same URL excessively. The threshold is behavioral, not a specific pin-count limit.",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    risk: "MEDIUM",
    bannedTriggers: ["Explicit sexual content or references to sexual activity", "Sex work, pornography, or nudity", "Dating services emphasizing casual sexual encounters", "Sponsored lenses with suggestive content", "Undisclosed sponsored content in Stories or Spotlight", "Content targeting under-18 without age-gate"],
    safeApproach: "Age-gate all dating-vertical content 18+. Keep the dating angle emotional and lifestyle-focused (companionship, connection) rather than sexual. Use the Sponsored label on all branded Story and Spotlight content. Avoid 'casual encounters' framing entirely.",
    notes: "More permissive than most platforms for legitimate dating offers if content stays non-explicit and age-gated. Snapchat users swipe quickly so front-load the value.",
  },
  {
    id: "discord",
    name: "Discord",
    risk: "MEDIUM",
    bannedTriggers: ["Explicit or implicit adult sexual content in Discord Ads", "Compensated sexual acts or escort service references in Discord Ads", "Intimate massage or sex work references in Discord Ads", "Products shaped like intimate body parts in Discord Ads", "Unsolicited DMs with affiliate links", "Bot-driven mass messaging"],
    safeApproach: "In private servers, dating/relationship content in non-explicit terms is generally permissible \u2014 server rules and age-restricted channels control what\u2019s allowed. For Discord\u2019s official Ads product, adult-adjacent content is prohibited outright. Only post affiliate content in channels designated for it.",
    notes: "MEDIUM risk because enforcement is structurally contained to closed communities, not broadcast/discovery risk. Important distinction: Discord\u2019s Ads Policy (HIGH-risk for adult content) is much stricter than organic server enforcement, where age-restricted channels and community consent allow more leeway. No public algorithmic feed to exploit.",
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