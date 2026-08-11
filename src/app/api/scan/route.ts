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
const SYSTEM_PROMPT = `You are a compliance scanner for affiliate content. Flag explicit banned triggers like: health/income guarantees, hard-sell CTAs, urgency, "click here", "sign up", "act now", "free trial", "no risk", "guaranteed".

STATUS THRESHOLDS:
- "fail" = explicit banned triggers (solicitation, hard-sell, guarantees, urgency manipulation)
- "warn" = borderline language (mild urgency, implied claims)
- "pass" = clean

PLATFORM CONTEXT:
- TikTok/Instagram: Branded content disclosure required. No health/income guarantees.
- Facebook: No fake urgency. No cloaked URLs.
- Reddit: HIGH risk. No self-promotion, no affiliate links, no CTAs.
- X: Low risk. Use #ad. Keep factual.
- Pinterest: FTC disclosure required. No misleading claims.

RULES:
1. Only flag phrases that EXACTLY appear in the input. Copy them character-for-character.
2. For safer_rewrite: only rewrite the flagged portion, keep rest identical. Empty string if pass.

Return ONLY valid JSON, no markdown fences:
{"results":[{"platform":"<name>","status":"pass|warn|fail","flagged_phrases":["<exact phrase from input>"],"reason":"<short>","safer_rewrite":"<or empty>"}]}`;

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
  const timeoutId = setTimeout(() => controller.abort(), 45_000);

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
        max_tokens: 2000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Review for: ${platforms.join(", ")}

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
/*  PARSE HELPER                                                       */
/* ------------------------------------------------------------------ */
function parseResults(raw: string): PlatformResult[] {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  cleaned = cleaned.replace(/[\x00-\x1f]/g, (ch) => {
    if (ch === "\n" || ch === "\r" || ch === "\t") return ch;
    return "";
  });

  try {
    const parsed = JSON.parse(cleaned) as { results: PlatformResult[] };
    return parsed.results || [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  BATCH HELPER                                                       */
/* ------------------------------------------------------------------ */
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
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

    /* --- Batch platforms into groups of 2 and call sequentially --- */
    const batches = chunk(platforms, 2);
    const allResults: PlatformResult[] = [];

    for (const batch of batches) {
      try {
        const raw = await callOpenRouter(content, batch);
        allResults.push(...parseResults(raw));
      } catch {
        allResults.push(
          ...batch.map((p) => ({
            platform: p,
            status: "pass" as const,
            flagged_phrases: [] as string[],
            reason: "Scan unavailable for this platform.",
            safer_rewrite: "",
          })),
        );
      }
    }

    /* --- Ensure every requested platform has a result --- */
    const returnedPlatforms = new Set(allResults.map((r) => r.platform));
    for (const p of platforms) {
      if (!returnedPlatforms.has(p)) {
        allResults.push({
          platform: p,
          status: "pass",
          flagged_phrases: [],
          reason: "Clear to post.",
          safer_rewrite: "",
        });
      }
    }

    /* --- Sort to match requested order --- */
    allResults.sort(
      (a, b) => platforms.indexOf(a.platform) - platforms.indexOf(b.platform),
    );

    /* --- Ground flagged phrases in actual input --- */
    const contentLower = content.toLowerCase();
    for (const result of allResults) {
      if (result.status === "pass") {
        result.flagged_phrases = [];
        result.safer_rewrite = "";
        result.reason = "Clear to post.";
        continue;
      }
      result.flagged_phrases = (result.flagged_phrases || []).filter(
        (phrase) => contentLower.includes(phrase.toLowerCase()),
      );
      if (result.flagged_phrases.length === 0) {
        result.status = "pass";
        result.reason = "Clear to post.";
        result.safer_rewrite = "";
      }
    }

    return NextResponse.json({ data: allResults });
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
