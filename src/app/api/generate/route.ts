import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

interface GenerateRequest {
  offerText: string;
}

interface PromoAngle { angle: string; hook: string; body: string; }
interface SocialPost { platform: string; character_count: number; text: string; }
interface Headline { variant: string; text: string; }
interface CTA { id: string; text: string; tone: string; }
interface ComplianceNote { platform: string; note: string; }
interface GeneratedToolkit {
  promo_angles: PromoAngle[];
  social_posts: SocialPost[];
  headlines: Headline[];
  body_copy: string;
  cta_variations: CTA[];
  compliance_notes: ComplianceNote[];
}

const SYSTEM_PROMPT = `You are Nectar Engine — a specialized affiliate content generation system built for high-risk, tightly-restricted verticals.

## CONTENT STANDARDS (NON-NEGOTIABLE)

1. FACT GROUNDING: Use ONLY facts present in the supplied offer data. NEVER invent features, prices, payouts, guarantees, statistics, user counts, testimonials, or claims. Never turn assumptions into facts. If information is missing, identify it as missing rather than filling gaps.

2. NO GENERIC FILLER: Every promotional angle must be traceable to a specific supplied offer fact. No "game-changer," "revolutionary," "cutting-edge," "world-class," or similar hollow modifiers unless the offer text itself uses them.

3. NO REPEATED ANGLES: Each output section must use a materially different angle. Do not repeat the same hook, benefit, or framing across sections.

4. REDDIT RULE: The Reddit post must be ONE honest question/discussion post written as if from a real person genuinely asking for input. No disguised promotions. No fake personal stories. No astroturfing.

5. PLATFORM DIFFERENTIATION: Each platform's post must genuinely differ in tone, structure, and approach — not just length. X is concise and direct. TikTok is casual and POV-driven. Pinterest is informational and saveable. Reddit is a genuine community question. Instagram uses visual-caption style with solicitation-safe language. Facebook uses solicitation-safe framing and avoids group-spam behavior. Snapchat is short, story-native, and non-explicit. Discord is community-first and suitable for an approved promo channel, never unsolicited mass promotion. Telegram is concise and disclosure-clear, with no implication that paid Telegram ads permit restricted content.

6. COMPLIANCE AWARENESS: Compliance notes must reference specific risk factors present in the offer data and platform-specific restrictions. Do not invent a restriction that is not supported by the supplied offer or the platform matrix.

## OUTPUT FORMAT

Return ONLY valid JSON matching this exact structure:

{
  "promo_angles": [
    { "angle": "<angle name>", "hook": "<compelling opening line>", "body": "<supporting paragraph tying to specific offer facts>" }
  ],
  "social_posts": [
    { "platform": "X", "character_count": <number>, "text": "<post text>" },
    { "platform": "TikTok", "character_count": <number>, "text": "<post text>" },
    { "platform": "Pinterest", "character_count": <number>, "text": "<post text>" },
    { "platform": "Reddit", "character_count": <number>, "text": "<post text>" },
    { "platform": "Instagram", "character_count": <number>, "text": "<post text>" },
    { "platform": "Facebook", "character_count": <number>, "text": "<post text>" },
    { "platform": "Snapchat", "character_count": <number>, "text": "<post text>" },
    { "platform": "Discord", "character_count": <number>, "text": "<post text>" },
    { "platform": "Telegram", "character_count": <number>, "text": "<post text>" }
  ],
  "headlines": [
    { "variant": "A", "text": "<headline>" },
    { "variant": "B", "text": "<headline>" },
    { "variant": "C", "text": "<headline>" },
    { "variant": "D", "text": "<headline>" }
  ],
  "body_copy": "<2-3 paragraph long-form sales copy grounded in offer facts>",
  "cta_variations": [
    { "id": "CTA-1", "text": "<call to action text>", "tone": "<tone description>" },
    { "id": "CTA-2", "text": "<call to action text>", "tone": "<tone description>" },
    { "id": "CTA-3", "text": "<call to action text>", "tone": "<tone description>" },
    { "id": "CTA-4", "text": "<call to action text>", "tone": "<tone description>" }
  ],
  "compliance_notes": [
    { "platform": "<platform name>", "note": "<specific risk note based on offer data>" }
  ]
}

Generate exactly 3 promo angles, 9 social posts (one per platform), 4 headlines, 4 CTA variations, and 3-5 compliance notes.

## CHARACTER COUNTS

- X: under 280 characters.
- TikTok: under 300 characters.
- Pinterest: under 500 characters.
- Reddit: 300-500 characters.
- Instagram: under 400 characters.
- Facebook: under 400 characters.
- Snapchat: under 300 characters.
- Discord: under 400 characters.
- Telegram: under 400 characters.

## IMPORTANT

- Do NOT include disclaimer text, intro, or outro outside the JSON.
- Do NOT wrap the JSON in markdown code fences.
- Return raw JSON only.
- Count characters accurately for each social post.`;

async function callOpenRouter(offerText: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Generator is not configured. OPENROUTER_API_KEY is not set.");

  const model = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50_000);

  let response: globalThis.Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nectar-engine.vercel.app",
        "X-Title": "Nectar Engine",
      },
      body: JSON.stringify({
        model,
        max_tokens: 8000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: offerText },
        ],
      }),
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenRouter ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("The model returned an empty response.");
  return content;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { offerText } = body;

    if (!offerText || typeof offerText !== "string" || offerText.trim().length < 20) {
      return NextResponse.json({ error: "Offer text is required and must be at least 20 characters." }, { status: 400 });
    }

    const raw = await callOpenRouter(offerText);
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    cleaned = cleaned.replace(/[\x00-\x1f]/g, (ch) => (ch === "\n" || ch === "\r" || ch === "\t" ? ch : ""));

    let parsed: GeneratedToolkit;
    try {
      parsed = JSON.parse(cleaned) as GeneratedToolkit;
    } catch {
      return NextResponse.json({ error: "The model returned invalid JSON. Please try again." }, { status: 502 });
    }

    const requiredKeys: (keyof GeneratedToolkit)[] = ["promo_angles", "social_posts", "headlines", "body_copy", "cta_variations", "compliance_notes"];
    for (const key of requiredKeys) {
      if (!parsed[key]) return NextResponse.json({ error: `Generated output is missing required field: ${key}` }, { status: 502 });
    }

    if (!Array.isArray(parsed.social_posts)) {
      return NextResponse.json({ error: "Generated output contains an invalid social_posts list." }, { status: 502 });
    }

    const requiredPlatforms = ["X", "TikTok", "Pinterest", "Reddit", "Instagram", "Facebook", "Snapchat", "Discord", "Telegram"];
    const postsByPlatform = new Map(parsed.social_posts.map((post) => [post.platform, post]));
    const missingPlatforms = requiredPlatforms.filter((platform) => !postsByPlatform.has(platform));
    if (missingPlatforms.length) {
      return NextResponse.json({ error: `Generated output is missing platforms: ${missingPlatforms.join(", ")}` }, { status: 502 });
    }

    parsed.social_posts = requiredPlatforms.map((platform) => {
      const post = postsByPlatform.get(platform)!;
      return { ...post, character_count: typeof post.text === "string" ? post.text.length : 0 };
    });

    return NextResponse.json({ data: parsed });
  } catch (err: unknown) {
    console.error("Generation Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("429") || message.includes("rate") || message.includes("quota") || message.includes("insufficient")) {
      return NextResponse.json({ error: "Rate limit or billing issue. Please wait a moment and try again." }, { status: 429 });
    }
    if (message.includes("not configured") || message.includes("not set")) return NextResponse.json({ error: message }, { status: 503 });
    if (message.includes("401") || message.includes("403") || message.includes("invalid")) return NextResponse.json({ error: "API key is invalid or unauthorized." }, { status: 503 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
