import { NextRequest, NextResponse } from "next/server";
import { formatRestrictionsForPrompt } from "@/lib/restriction-parser";

export const maxDuration = 60;

interface GenerateRequest { offerText: string; offerUrl?: string; }
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

## SOURCE RESTRICTIONS ARE HARD FACTS
If the source contains a section labelled Restrictions, Restricted, Prohibited, Forbidden, Not Allowed, Do Not, Banned Traffic, or similar, those lines are actual offer restrictions supplied by the affiliate source. Treat them as binding constraints for this generation.
Never ignore, soften, reinterpret, or replace a source restriction with generic platform advice.
Do not generate traffic methods, claims, CTAs, links, placements, or campaign directions that violate a detected source restriction.
When a detected restriction affects a platform or generated output, mention the specific restriction in a compliance note using the source wording where practical.

## PRICING AND OFFER MECHANICS: ZERO-TOLERANCE FACT GROUNDING
This rule has zero exceptions, including for pricing, trial periods, discounts, or offer mechanics. If the offer data does not explicitly state a price, trial period, discount amount, or specific mechanic, you MUST NOT invent one — not even a plausible-sounding one like "$1 trial." Referencing false pricing or terms is a compliance and legal risk, not a creative liberty. If pricing/trial information is genuinely absent from the offer data, write around it — describe the value or experience without stating a specific number that wasn't provided.

## SOURCE PRIORITY
1. Verified offer-page context, when supplied.
2. Human-supplied offer data.
3. Deterministically detected source restrictions from the human-supplied offer data.
4. Creative interpretation based on those facts.
Never treat creative interpretation as a source fact.

## PLATFORM RULES
Reddit must be an honest discussion/question format, not fake personal experience or disguised astroturfing.
Each platform must genuinely differ in tone and structure.
Follow supplied platform compliance guidance. Do not invent platform restrictions.

## VOICE: SPEAK TO THE CUSTOMER, NEVER TO OTHER AFFILIATES
All generated content must speak directly to a real potential customer/user of the offer. Never pitch the affiliate opportunity itself.

## VOICE: HUMAN DEPTH AND INVISIBLE SCAFFOLDING
Before writing content, silently construct one specific person in one specific moment. Vary time, life circumstance, emotional stance, and voice register between generations. Do not write invented backstory as factual product information.

## VOICE: VARY STRUCTURE
Do not default to familiar openings such as "stop scrolling," "tired of X?", rhetorical questions, or "imagine if". Vary the structural entry point.

## OUTPUT
Return ONLY valid JSON matching the exact structure below.
{"promo_angles":[{"angle":"<creative angle name>","hook":"<hook>","body":"<supporting copy grounded in source facts>"}],"social_posts":[{"platform":"X","character_count":0,"text":"<post>"},{"platform":"TikTok","character_count":0,"text":"<post>"},{"platform":"Pinterest","character_count":0,"text":"<post>"},{"platform":"Reddit","character_count":0,"text":"<post>"},{"platform":"Instagram","character_count":0,"text":"<post>"},{"platform":"Facebook","character_count":0,"text":"<post>"},{"platform":"Snapchat","character_count":0,"text":"<post>"},{"platform":"Discord","character_count":0,"text":"<post>"},{"platform":"Telegram","character_count":0,"text":"<post>"}],"headlines":[{"variant":"A","text":"<headline>"},{"variant":"B","text":"<headline>"},{"variant":"C","text":"<headline>"},{"variant":"D","text":"<headline>"}],"body_copy":"<2-3 paragraph copy grounded in source facts>","cta_variations":[{"id":"CTA-1","text":"<cta>","tone":"<tone>"},{"id":"CTA-2","text":"<cta>","tone":"<tone>"},{"id":"CTA-3","text":"<cta>","tone":"<tone>"},{"id":"CTA-4","text":"<cta>","tone":"<tone>"}],"compliance_notes":[{"platform":"<platform>","note":"<specific note>"}]}
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
    try { response = await fetch(parsed.toString(), { signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0 NectarEngine/1.0" } }); }
    finally { clearTimeout(timeoutId); }
    if (!response.ok) return "";
    const html = await response.text();
    return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim().slice(0, 12000);
  } catch { return ""; }
}

async function callOpenRouter(offerText: string, offerUrl?: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Generator is not configured. OPENROUTER_API_KEY is not set.");
  const model = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50_000);
  const pageContext = offerUrl ? await fetchOfferContext(offerUrl) : "";
  const detectedRestrictions = formatRestrictionsForPrompt(offerText);
  const userContent = [
    "HUMAN-SUPPLIED OFFER DATA:\n" + offerText,
    detectedRestrictions ? `\nDETERMINISTICALLY DETECTED SOURCE RESTRICTIONS — TREAT AS HARD CONSTRAINTS:\n${detectedRestrictions}` : "",
    offerUrl ? `\nOFFER URL SUPPLIED BY HUMAN:\n${offerUrl}` : "",
    pageContext ? `\nVERIFIED OFFER-PAGE CONTEXT (use as source material, not as a reason to invent claims):\n${pageContext}` : "",
  ].join("\n");

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST", signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://nectar-engine.vercel.app", "X-Title": "Nectar Engine" },
      body: JSON.stringify({ model, max_tokens: 8000, messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userContent }] }),
    });
  } finally { clearTimeout(timeoutId); }
  if (!response.ok) throw new Error(`OpenRouter ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("The model returned an empty response.");
  return content;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { offerText, offerUrl } = body;
    if (!offerText || typeof offerText !== "string" || offerText.trim().length < 20) return NextResponse.json({ error: "Offer text is required and must be at least 20 characters." }, { status: 400 });
    if (offerUrl && typeof offerUrl !== "string") return NextResponse.json({ error: "Offer URL must be a valid URL string." }, { status: 400 });

    const raw = await callOpenRouter(offerText, offerUrl);
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    cleaned = cleaned.replace(/[\x00-\x1f]/g, (ch) => (ch === "\n" || ch === "\r" || ch === "\t" ? ch : ""));

    let parsed: GeneratedToolkit;
    try { parsed = JSON.parse(cleaned) as GeneratedToolkit; }
    catch { return NextResponse.json({ error: "The model returned invalid JSON. Please try again." }, { status: 502 }); }

    const requiredKeys: (keyof GeneratedToolkit)[] = ["promo_angles", "social_posts", "headlines", "body_copy", "cta_variations", "compliance_notes"];
    for (const key of requiredKeys) if (!parsed[key]) return NextResponse.json({ error: `Generated output is missing required field: ${key}` }, { status: 502 });
    if (!Array.isArray(parsed.social_posts)) return NextResponse.json({ error: "Generated output contains an invalid social_posts list." }, { status: 502 });

    const requiredPlatforms = ["X", "TikTok", "Pinterest", "Reddit", "Instagram", "Facebook", "Snapchat", "Discord", "Telegram"];
    const postsByPlatform = new Map(parsed.social_posts.map((post) => [post.platform, post]));
    const missingPlatforms = requiredPlatforms.filter((platform) => !postsByPlatform.has(platform));
    if (missingPlatforms.length) return NextResponse.json({ error: `Generated output is missing platforms: ${missingPlatforms.join(", ")}` }, { status: 502 });
    parsed.social_posts = requiredPlatforms.map((platform) => {
      const post = postsByPlatform.get(platform)!;
      return { ...post, character_count: typeof post.text === "string" ? post.text.length : 0 };
    });
    return NextResponse.json({ data: parsed });
  } catch (err: unknown) {
    console.error("Generation Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("429") || message.includes("rate") || message.includes("quota") || message.includes("insufficient")) return NextResponse.json({ error: "Rate limit or billing issue. Please wait a moment and try again." }, { status: 429 });
    if (message.includes("not configured") || message.includes("not set")) return NextResponse.json({ error: message }, { status: 503 });
    if (message.includes("401") || message.includes("403") || message.includes("invalid")) return NextResponse.json({ error: "API key is invalid or unauthorized." }, { status: 503 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
