import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
interface ScanRequest {
  content: string;
  platforms: string[];
}

interface PlatformResult {
  platform: string;
  status: "pass" | "warn" | "fail";
  flagged_phrases: string[];
  reason: string;
  safer_rewrite: string;
}

/* ------------------------------------------------------------------ */
/*  SYSTEM PROMPT                                                      */
/* ------------------------------------------------------------------ */
function buildSystemPrompt(platforms: string[]): string {
  const platformList = platforms.join(", ");
  return `You are Nectar Engine's Compliance Scanner. You review affiliate marketing content against platform-specific advertising policies for: ${platformList}.

## RULES (NON-NEGOTIABLE)

1. **GROUND IN INPUT**: Only flag phrases that actually appear in the user's submitted text. NEVER invent violations not present in the input. If the text is clean for a platform, return status "pass" with empty flagged_phrases.
2. **NO HALLUCINATION**: Do not claim the text contains phrases it does not contain. Copy flagged phrases EXACTLY as they appear in the input, character-for-character.
3. **PLATFORM SPECIFICITY**: Each platform has different rules. The same text may pass on X but fail on Reddit. Evaluate each platform independently based on its actual policies.
4. **REWRITE ACCURACY**: When providing a safer_rewrite, only rewrite the flagged portion. Keep the rest of the text identical. Do not add new marketing language.
5. **STATUS THRESHOLDS**:
   - "fail": Contains explicit banned triggers (solicitation language, hard-sell CTAs, undisclosed affiliate intent, health/income guarantees, urgency manipulation)
   - "warn": Contains borderline language (mild urgency, implied claims, missing disclosure where one would be expected, or tone that could trigger review)
   - "pass": No compliance concerns detected

## PLATFORM-SPECIFIC RULES

- **TikTok**: Branded Content toggle required. No hardcoded health/income claims. No "before and after" language. No crypto promotions.
- **Instagram**: Paid Partnership label required for branded posts. Disclaimers must be in first line of captions. No result-specific health language ("will cure", "guaranteed to work").
- **Facebook**: Branded Content tag required. No fake urgency ("only 2 left"). No cloaked affiliate URLs. No misleading health claims.
- **Reddit**: HIGH risk. No self-promotion in top-level posts on most subs. No affiliate links in posts. Must lead with genuine discussion, not marketing. Any direct CTA is suspicious.
- **X (Twitter)**: Use #ad or Sponsored label. Keep claims factual. Avoid link shorteners that obscure destination. Low risk overall.
- **Pinterest**: FTC disclosure in first line of pin descriptions. No misleading before-and-after pins. No deceptive product claims.

## OUTPUT FORMAT

Return ONLY valid JSON matching this exact structure (no markdown fences, no commentary):

{
  "results": [
    {
      "platform": "<platform name>",
      "status": "pass" | "warn" | "fail",
      "flagged_phrases": ["<exact phrase from input>", ...],
      "reason": "<one short line explaining the concern>",
      "safer_rewrite": "<rewritten version of flagged portion only, or empty string if pass>"
    }
  ]
}

Return one result object per platform. If status is "pass", flagged_phrases must be an empty array and safer_rewrite must be an empty string.`;
}

/* ------------------------------------------------------------------ */
/*  OPENROUTER CALL                                                     */
/* ------------------------------------------------------------------ */
async function callOpenRouter(content: string, platforms: string[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Scanner is not configured. OPENROUTER_API_KEY is not set.");
  }

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
        max_tokens: 4000,
        messages: [
          { role: "system", content: buildSystemPrompt(platforms) },
          { role: "user", content: `Scan the following content for compliance issues on ${platforms.join(", ")}:

---
${content}
---` },
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
  const raw = data?.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("The model returned an empty response.");
  }

  return raw;
}

/* ------------------------------------------------------------------ */
/*  POST HANDLER                                                       */
/* ------------------------------------------------------------------ */
export async function POST(request: NextRequest) {
  try {
    /* --- Validate request body --- */
    const body: ScanRequest = await request.json();
    const { content, platforms } = body;

    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Content is required and must be at least 10 characters." },
        { status: 400 },
      );
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: "At least one platform must be selected." },
        { status: 400 },
      );
    }

    /* --- Call OpenRouter --- */
    const raw = await callOpenRouter(content, platforms);

    /* --- Parse JSON (tolerant of markdown fences + control chars) --- */
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    cleaned = cleaned.replace(/[\x00-\x1f]/g, (ch) => {
      if (ch === "\n" || ch === "\r" || ch === "\t") return ch;
      return "";
    });

    let parsed: { results: PlatformResult[] };
    try {
      parsed = JSON.parse(cleaned) as { results: PlatformResult[] };
    } catch {
      return NextResponse.json(
        { error: "The model returned invalid JSON. Please try again." },
        { status: 502 },
      );
    }

    /* --- Validate structure --- */
    if (!parsed.results || !Array.isArray(parsed.results)) {
      return NextResponse.json(
        { error: "Invalid scan results format." },
        { status: 502 },
      );
    }

    /* --- Ensure every requested platform has a result --- */
    const returnedPlatforms = new Set(parsed.results.map((r) => r.platform));
    for (const p of platforms) {
      if (!returnedPlatforms.has(p)) {
        parsed.results.push({
          platform: p,
          status: "pass",
          flagged_phrases: [],
          reason: "No issues detected.",
          safer_rewrite: "",
        });
      }
    }

    /* --- Sort to match requested order --- */
    parsed.results.sort(
      (a, b) => platforms.indexOf(a.platform) - platforms.indexOf(b.platform),
    );

    /* --- Ground flagged phrases in actual input --- */
    for (const result of parsed.results) {
      if (result.status === "pass") {
        result.flagged_phrases = [];
        result.safer_rewrite = "";
        result.reason = "Clear to post.";
        continue;
      }
      const contentLower = content.toLowerCase();
      result.flagged_phrases = (result.flagged_phrases || []).filter(
        (phrase) => contentLower.includes(phrase.toLowerCase()),
      );
      if (result.flagged_phrases.length === 0 && result.status !== "pass") {
        /* Model flagged something not in the text — downgrade to pass */
        result.status = "pass";
        result.reason = "Clear to post.";
        result.safer_rewrite = "";
      }
    }

    return NextResponse.json({ data: parsed.results });
  } catch (err: unknown) {
    console.error("Scan Error:", err);

    const message = err instanceof Error ? err.message : "Unknown error";

    if (
      message.includes("429") ||
      message.includes("rate") ||
      message.includes("quota") ||
      message.includes("insufficient")
    ) {
      return NextResponse.json(
        { error: "Rate limit or billing issue. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    if (message.includes("not configured") || message.includes("not set")) {
      return NextResponse.json({ error: message }, { status: 503 });
    }

    if (message.includes("401") || message.includes("403") || message.includes("invalid")) {
      return NextResponse.json(
        { error: "API key is invalid or unauthorized." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
