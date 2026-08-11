import { NextRequest, NextResponse } from "next/server";
import { PLATFORM_MATRIX } from "@/lib/compliance/platform-matrix";

export const maxDuration = 120;

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

const PLATFORM_CONTEXT_STRING = PLATFORM_MATRIX.map((p) => {
  return [
    `- ${p.name} [${p.risk} risk]`,
    `Risk signals: ${p.bannedTriggers.join("; ")}`,
    `Safer approach: ${p.safeApproach}`,
  ].join("\n  ");
}).join("\n");

const SYSTEM_PROMPT = `You are Nectar Engine's platform compliance scanner.

Your job is to review ONE piece of affiliate content against the selected publishing platforms.
Do not invent policy violations. Use the platform context below as guidance, not as a claim that every signal is universally banned in every format.

PLATFORM CONTEXT:
${PLATFORM_CONTEXT_STRING}

STATUS:
- fail = the input contains an explicit high-risk/banned trigger for that platform
- warn = the input contains a meaningful borderline risk that deserves review
- pass = no meaningful platform-specific risk signal was found

GROUNDING RULES:
1. Only flag phrases that EXACTLY appear in the input. Copy them character-for-character.
2. Do not flag a phrase merely because it appears in another platform's rules.
3. Do not invent facts, policy claims, or prohibited categories beyond the supplied platform context.
4. If no exact phrase from the input supports a warning/failure, return pass.
5. For safer_rewrite, preserve the rest of the input and only replace the risky phrase(s). Empty string for pass.
6. Return exactly one result for every requested platform, using the platform name supplied by the user.

Return ONLY valid JSON:
{"results":[{"platform":"<name>","status":"pass|warn|fail","flagged_phrases":["<exact phrase from input>"],"reason":"<short grounded reason>","safer_rewrite":"<full rewritten content or empty>"}]}`;

async function callOpenRouter(content: string, platforms: string[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Scanner is not configured. OPENROUTER_API_KEY is not set.");

  const model = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
        max_tokens: 2600,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Selected platforms: ${platforms.join(", ")}\n\n--- CONTENT ---\n${content}\n--- END CONTENT ---`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenRouter ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) throw new Error("The model returned an empty response.");
    return raw;
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseResults(raw: string): PlatformResult[] {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  cleaned = cleaned.replace(/[\x00-\x1f]/g, (ch) =>
    ch === "\n" || ch === "\r" || ch === "\t" ? ch : "",
  );

  try {
    const parsed = JSON.parse(cleaned) as { results?: PlatformResult[] };
    return Array.isArray(parsed.results) ? parsed.results : [];
  } catch {
    return [];
  }
}

function unavailable(platform: string): PlatformResult {
  return {
    platform,
    status: "warn",
    flagged_phrases: [],
    reason: "Scanner could not complete this platform check. No compliance clearance was issued.",
    safer_rewrite: "",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const platforms = Array.isArray(body.platforms)
      ? body.platforms.filter((p): p is string => typeof p === "string" && p.length > 0)
      : [];

    if (content.length < 10) {
      return NextResponse.json(
        { error: "Content is required and must be at least 10 characters." },
        { status: 400 },
      );
    }
    if (platforms.length === 0) {
      return NextResponse.json(
        { error: "At least one platform must be selected." },
        { status: 400 },
      );
    }

    let modelResults: PlatformResult[] = [];
    try {
      /* One request reviews all selected platforms. The previous 2-platform
         sequential design could take ~126s for nine platforms and exceed the
         serverless execution window. One grounded call is both faster and
         friendlier to free-tier rate limits. */
      modelResults = parseResults(await callOpenRouter(content, platforms));
    } catch (err) {
      console.error("Scanner model call failed:", err);
      modelResults = platforms.map(unavailable);
    }

    const byPlatform = new Map<string, PlatformResult>();
    for (const result of modelResults) {
      if (result?.platform) byPlatform.set(result.platform.toLowerCase(), result);
    }

    const contentLower = content.toLowerCase();
    const results = platforms.map((platform) => {
      const result = byPlatform.get(platform.toLowerCase()) ?? unavailable(platform);
      const grounded = (result.flagged_phrases || []).filter(
        (phrase) => typeof phrase === "string" && contentLower.includes(phrase.toLowerCase()),
      );

      if (result.status === "pass") {
        return {
          ...result,
          platform,
          flagged_phrases: [],
          safer_rewrite: "",
          reason: "No meaningful platform-specific risk signal found.",
        };
      }

      if (grounded.length === 0) {
        return unavailable(platform);
      }

      return {
        ...result,
        platform,
        flagged_phrases: grounded,
      };
    });

    return NextResponse.json({ data: results });
  } catch (err: unknown) {
    console.error("Scan Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("429") || message.includes("rate") || message.includes("quota")) {
      return NextResponse.json(
        { error: "The scanner model is rate-limited. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    if (message.includes("not configured") || message.includes("not set")) {
      return NextResponse.json({ error: message }, { status: 503 });
    }

    if (message.includes("401") || message.includes("403") || message.includes("invalid")) {
      return NextResponse.json(
        { error: "Scanner API access is invalid or unauthorized." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
