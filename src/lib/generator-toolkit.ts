/** Shared generator toolkit types, demo content, and helpers. */

/* ------------------------------------------------------------------ */
/*  DEMO PASTE TEXT (Cozy 50+ offer)                                   */
/* ------------------------------------------------------------------ */
export const DEMO_PASTE =
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
export function validateOfferInput(text: string): string | null {
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
export interface PromoAngle {
  angle: string;
  hook: string;
  body: string;
}

export interface SocialPost {
  platform: string;
  character_count: number;
  text: string;
}

export interface Headline {
  variant: string;
  text: string;
}

export interface CTA {
  id: string;
  text: string;
  tone: string;
}

export interface ComplianceNote {
  platform: string;
  note: string;
}

export interface GeneratedToolkit {
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
export const DEMO_TOOLKIT: GeneratedToolkit = {
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

export function buildFullToolkitText(toolkit: GeneratedToolkit): string {
  const parts: string[] = [];
  for (const a of toolkit.promo_angles || []) {
    parts.push(`[ANGLE ${a.angle}]\n${a.hook}\n${a.body}`);
  }
  for (const p of toolkit.social_posts || []) {
    parts.push(`[${p.platform}] ${p.text}`);
  }
  for (const h of toolkit.headlines || []) {
    parts.push(`[HEADLINE ${h.variant}] ${h.text}`);
  }
  if (toolkit.body_copy) parts.push(`[BODY]\n${toolkit.body_copy}`);
  for (const c of toolkit.cta_variations || []) {
    parts.push(`[CTA ${c.id}] ${c.text}`);
  }
  for (const n of toolkit.compliance_notes || []) {
    parts.push(`[COMPLIANCE ${n.platform}] ${n.note}`);
  }
  return parts.join("\n\n");
}

export function countToolkitBlocks(toolkit: GeneratedToolkit): number {
  return (
    (toolkit.promo_angles?.length || 0) +
    (toolkit.social_posts?.length || 0) +
    (toolkit.headlines?.length || 0) +
    (toolkit.body_copy ? 1 : 0) +
    (toolkit.cta_variations?.length || 0) +
    (toolkit.compliance_notes?.length || 0)
  );
}
