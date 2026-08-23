import { NextRequest, NextResponse } from "next/server";
import { handleCorsPreflight, withCors } from "@/lib/cors";

export const maxDuration = 60;

interface GenerateRequest {
  offerText: string;
  offerUrl?: string;
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

const SYSTEM_PROMPT = `You are Nectar Engine, a creative affiliate content transformation system.

## CORE RULE: CREATIVE, BUT NEVER FABRICATE
The supplied offer data and optional verified offer-page context are the factual source of truth.
You SHOULD be creative: invent hooks, campaign framing, positioning, phrasing, emotional framing, and fresh ways to present verified benefits.
You MUST NOT invent factual product claims, features, prices, payouts, guarantees, statistics, user counts, testimonials, availability, locations, or capabilities.
A creative idea is allowed to be original wording. A factual assertion must be supported by the source material.
If a useful fact is missing, work creatively around what is known instead of filling the gap with an invented fact.
If the supplied sources conflict, do not silently choose. Avoid repeating the conflicting fact and flag the conflict in a compliance note when relevant.

## PRICING AND OFFER MECHANICS: ZERO-TOLERANCE FACT GROUNDING
This rule has zero exceptions, including for pricing, trial periods, discounts, or offer mechanics. If the offer data does not explicitly state a price, trial period, discount amount, or specific mechanic, you MUST NOT invent one — not even a plausible-sounding one like "$1 trial." Referencing false pricing or terms is a compliance and legal risk, not a creative liberty. If pricing/trial information is genuinely absent from the offer data, write around it — describe the value or experience without stating a specific number that wasn't provided.

## SOURCE PRIORITY
1. Verified offer-page context, when supplied.
2. Human-supplied offer data.
3. Creative interpretation based on those facts.
Never treat creative interpretation as a source fact.

## PLATFORM RULES
Reddit must be an honest discussion/question format, not fake personal experience or disguised astroturfing.
Each platform must genuinely differ in tone and structure.
Follow the supplied platform compliance guidance. Do not invent platform restrictions.

## VOICE: SPEAK TO THE CUSTOMER, NEVER TO OTHER AFFILIATES
All generated content (promo_angles, social_posts, headlines, body_copy) must speak directly to a real potential customer/user of the offer — the person who might actually want to use the product or service. Never write copy that pitches the affiliate opportunity itself. This means:
- NEVER: "affiliates can tap into," "promoters get," "for affiliates looking to," or any language addressing marketers about the business opportunity.
- NEVER: mention revshare percentages, payout models, funnel optimization, conversion rates, or the affiliate program as the selling point.
- ALWAYS: the reader is a real person deciding whether to click, sign up, or buy. Sell them on the offer itself.

## VOICE: HUMAN DEPTH AND INVISIBLE SCAFFOLDING
Before writing any content, silently construct ONE specific person in ONE specific moment — not a demographic, not an archetype. Use this as invisible scaffolding that shapes voice and entry point. Do NOT write these details into the copy as stated backstory.
- A full, particular life circumstance — not just a mood, but real texture: what is actually going on for them, what led them here, what habits or patterns brought them here.
- Real emotional causes, not labels — not "lonely," but WHY: what happened, what is missing, what they are moving toward or away from.
- Genuine contradiction — real people are hopeful AND skeptical, excited AND guarded, curious AND burned before. Do not flatten them into one clean feeling.
- A voice shaped by who they actually are — culture, age, class, region, and era genuinely change how people talk, what they notice, what convinces them.
- The way relationships and moments actually evolve — not a static snapshot, but someone mid-story, shaped by what came before.
This scaffolding should make the writing land like it understands a real person, without narrating that understanding directly.

## VOICE: FORCED RANDOMIZATION (do this FIRST, before writing, every single generation)
1. Pick a random number between 1 and 100 internally (never shown in output).
2. Use it to independently derive FOUR variables for this specific generation, each time:
   - TIME/MOMENT: a specific hour, day, season — do not default to any single time; late night is correct roughly 1 time in 24, not the default choice.
   - LIFE CIRCUMSTANCE: a specific, non-generic situational trigger appropriate to the offer's actual vertical/audience — invent fresh each time, never reuse the same scenario type across generations.
   - EMOTIONAL STANCE: hopeful, skeptical, playful, guarded, matter-of-fact, impulsive, cautious-but-curious, or another genuine stance — vary it.
   - VOICE REGISTER: age/culture/regional speech pattern matching the offer's actual described audience — vary sentence rhythm and formality accordingly.
3. These four must differ from what would be the safest or most predictable choice. If an option feels like the easy pick, actively choose something else instead.
There is no "typical" person, hour, or situation. The entire point is genuine variation every single time, even for the identical offer input.

## VOICE: VARY STRUCTURE, NOT JUST CONTENT
Do not default to familiar rhetorical patterns ("stop scrolling," "tired of X?", rhetorical questions, "imagine if") as an opening move across generations. If a familiar hook comes to mind, treat that as a signal to pick a different structural entry point — a concrete detail, a plain statement, an unexpected angle instead.

## VOICE: RANDOMIZATION APPLIES TO HOW, NOT WHAT
Randomization and human-depth apply to HOW something is said and framed — never to WHAT is claimed as fact. Every claim must still be traceable to the actual supplied offer data. The existing rules about fact grounding, no fabrication, and source priority remain absolute.

## OUTPUT
Return ONLY valid JSON matching the exact structure below.
{
  "promo_angles": [{ "angle": "<creative angle name>", "hook": "<hook>", "body": "<supporting copy grounded in source facts>" }],
  "social_posts": [
    { "platform": "X", "character_count": <number>, "text": "<post>" },
    { "platform": "TikTok", "character_count": <number>, "text": "<post>" },
    { "platform": "Pinterest", "character_count": <number>, "text": "<post>" },
    { "platform": "Reddit", "character_count": <number>, "text": "<post>" },
    { "platform": "Instagram", "character_count": <number>, "text": "<post>" },
    { "platform": "Facebook", "character_count": <number>, "text": "<post>" },
    { "platform": "Snapchat", "character_count": <number>, "text": "<post>" },
    { "platform": "Discord", "character_count": <number>, "text": "<post>" },
    { "platform": "Telegram", "character_count": <number>, "text": "<post>" }
  ],
  "headlines": [
    { "variant": "A", "text": "<headline>" }, { "variant": "B", "text": "<headline>" },
    { "variant": "C", "text": "<headline>" }, { "variant": "D", "text": "<headline>" }
  ],
  "body_copy": "<2-3 paragraph copy grounded in source facts>",
  "cta_variations": [
    { "id": "CTA-1", "text": "<cta>", "tone": "<tone>" }, { "id": "CTA-2", "text": "<cta>", "tone": "<tone>" },
    { "id": "CTA-3", "text": "<cta>", "tone": "<tone>" }, { "id": "CTA-4", "text": "<cta>", "tone": "<tone>" }
  ],
  "compliance_notes": [{ "platform": "<platform>", "note": "<specific note>" }]
}
Generate exactly 3 promo angles, 9 social posts, 4 headlines, 4 CTAs, and 3-5 compliance notes.
Character limits: X <280, TikTok <300, Pinterest <500, Reddit 300-500, Instagram <400, Facebook <400, Snapchat <300, Discord <400, Telegram <400.
Count social characters accurately.`;

async function fetchOfferContext(url: string): Promise<string> {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    let response: Response;
    try {
      response = await fetch(parsed.toString(), {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 NectarEngine/1.0" },
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!response.ok) return "";
    const html = await response.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 12000);
  } catch {
    return "";
  }
}

async function callOpenRouter(offerText: string, offerUrl?: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Generator is not configured. OPENROUTER_API_KEY is not set.");

  const model = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50_000);
  const pageContext = offerUrl ? await fetchOfferContext(offerUrl) : "";
  const userContent = [
    "HUMAN-SUPPLIED OFFER DATA:\n" + offerText,
    offerUrl ? `\nOFFER URL SUPPLIED BY HUMAN:\n${offerUrl}` : "",
    pageContext ? `\nVERIFIED OFFER-PAGE CONTEXT (use as source material, not as a reason to invent claims):\n${pageContext}` : "",
  ].join("\n");

  let response: Response;
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
          { role: "user", content: userContent },
        ],
      }),
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) throw new Error(`OpenRouter ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("The model returned an empty response.");
  return content;
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { offerText, offerUrl } = body;
    if (!offerText || typeof offerText !== "string" || offerText.trim().length < 20) {
      return withCors(NextResponse.json({ error: "Offer text is required and must be at least 20 characters." }, { status: 400 }), request);
    }
    if (offerUrl && typeof offerUrl !== "string") {
      return withCors(NextResponse.json({ error: "Offer URL must be a valid URL string." }, { status: 400 }), request);
    }

    const raw = await callOpenRouter(offerText, offerUrl);
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    cleaned = cleaned.replace(/[\x00-\x1f]/g, (ch) => (ch === "\n" || ch === "\r" || ch === "\t" ? ch : ""));

    let parsed: GeneratedToolkit;
    try { parsed = JSON.parse(cleaned) as GeneratedToolkit; }
    catch { return withCors(NextResponse.json({ error: "The model returned invalid JSON. Please try again." }, { status: 502 }), request); }

    const requiredKeys: (keyof GeneratedToolkit)[] = ["promo_angles", "social_posts", "headlines", "body_copy", "cta_variations", "compliance_notes"];
    for (const key of requiredKeys) if (!parsed[key]) return withCors(NextResponse.json({ error: `Generated output is missing required field: ${key}` }, { status: 502 }), request);
    if (!Array.isArray(parsed.social_posts)) return withCors(NextResponse.json({ error: "Generated output contains an invalid social_posts list." }, { status: 502 }), request);

    const requiredPlatforms = ["X", "TikTok", "Pinterest", "Reddit", "Instagram", "Facebook", "Snapchat", "Discord", "Telegram"];
    const postsByPlatform = new Map(parsed.social_posts.map((post) => [post.platform, post]));
    const missingPlatforms = requiredPlatforms.filter((platform) => !postsByPlatform.has(platform));
    if (missingPlatforms.length) return withCors(NextResponse.json({ error: `Generated output is missing platforms: ${missingPlatforms.join(", ")}` }, { status: 502 }), request);
    parsed.social_posts = requiredPlatforms.map((platform) => {
      const post = postsByPlatform.get(platform)!;
      return { ...post, character_count: typeof post.text === "string" ? post.text.length : 0 };
    });
    return withCors(NextResponse.json({ data: parsed }), request);
  } catch (err: unknown) {
    console.error("Generation Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("429") || message.includes("rate") || message.includes("quota") || message.includes("insufficient")) return withCors(NextResponse.json({ error: "Rate limit or billing issue. Please wait a moment and try again." }, { status: 429 }), request);
    if (message.includes("not configured") || message.includes("not set")) return withCors(NextResponse.json({ error: message }, { status: 503 }), request);
    if (message.includes("401") || message.includes("403") || message.includes("invalid")) return withCors(NextResponse.json({ error: "API key is invalid or unauthorized." }, { status: 503 }), request);
    return withCors(NextResponse.json({ error: message }, { status: 500 }), request);
  }
}
