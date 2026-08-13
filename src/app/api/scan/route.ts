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

// --- Free-model failover chain (all free, $0 cost) ---
const MODEL_FALLBACK_CHAIN = [
  "nvidia/nemotron-3.5-lightning:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "openchat/openchat-7b:free",
];

const MAX_RETRIES_PER_MODEL = 2;
const RETRY_DELAYS_MS = [600, 1500]; // backoff between retries

/**
 * Build platform context for ONLY the platforms in this batch.
 */
function buildPlatformContext(platforms: string[]): string {
  const lines: string[] = [];
  for (const name of platforms) {
    const entry = PLATFORM_MATRIX.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (!entry) continue;
    lines.push(
      [
        `- ${entry.name} [${entry.risk} risk]`,
        `Risk signals: ${entry.bannedTriggers.join("; ")}`,
        `Safer approach: ${entry.safeApproach}`,
      ].join("\n  ")
    );
  }
  return lines.join("\n");
}

function buildSystemPrompt(platforms: string[]): string {
  const context = buildPlatformContext(platforms);
  return `You are a JSON-only compliance API. You MUST output a single JSON object and NOTHING else.

Do NOT include any thinking, explanation, analysis, commentary, reasoning steps, or conversational text before or after the JSON. Do NOT use markdown code fences. Output the raw JSON directly.

PLATFORM CONTEXT (for reference only — do not repeat or discuss it):
${context}

RULES:
- fail = the input contains an explicit high-risk/banned trigger for that platform
- warn = the input contains a meaningful borderline risk
- pass = no meaningful platform-specific risk signal was found
- Only flag phrases that EXACTLY appear in the input. Copy them character-for-character.
- If no exact phrase from the input supports a warning/failure, return pass.
- For safer_rewrite, preserve the rest of the input and only replace the risky phrase(s). Empty string for pass.
- Return exactly one result for every requested platform, using the platform name supplied by the user.

OUTPUT FORMAT (return ONLY this JSON, nothing else):
{"results":[{"platform":"<name>","status":"pass|warn|fail","flagged_phrases":["<exact phrase>"],"reason":"<short reason>","safer_rewrite":"<rewrite or empty>"}]}`;
}

function classifyScanError(message: string): {
  error: string;
  diagnostic: string;
  status: number;
} {
  const lower = message.toLowerCase();
  if (lower.includes("not set") || lower.includes("not configured")) {
    return {
      error: "Scanner is not configured on the server. No compliance clearance was issued.",
      diagnostic: "OPENROUTER_API_KEY_missing",
      status: 503,
    };
  }
  if (lower.includes("429") || lower.includes("rate") || lower.includes("quota") || lower.includes("free-models")) {
    return {
      error: "Scan temporarily unavailable — try again in a moment.",
      diagnostic: "provider_rate_limit",
      status: 503,
    };
  }
  if (lower.includes("empty response")) {
    return {
      error: "The scanner model returned an empty response. No compliance clearance was issued. Try again.",
      diagnostic: "empty_model_response",
      status: 503,
    };
  }
  if (lower.includes("abort") || lower.includes("timeout")) {
    return {
      error: "The scanner timed out waiting for the model. Try again.",
      diagnostic: "timeout",
      status: 504,
    };
  }
  if (lower.includes("401") || lower.includes("403") || lower.includes("unauthorized")) {
    return {
      error: "Scanner API access is invalid or unauthorized.",
      diagnostic: "auth_error",
      status: 503,
    };
  }
  return {
    error: "The scanner could not complete the AI check. No compliance clearance was issued. Please try again.",
    diagnostic: message.slice(0, 240),
    status: 503,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Single attempt against one model. Returns raw content string or throws.
 */
async function callModelOnce(
  model: string,
  systemPrompt: string,
  content: string,
  platforms: string[]
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Scanner is not configured. OPENROUTER_API_KEY is not set.");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60_000);

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
        max_tokens: 4000,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Selected platforms: ${platforms.join(", ")}\n\n--- CONTENT ---\n${content}\n--- END CONTENT ---`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      const error = new Error(`OpenRouter ${response.status}: ${errBody}`) as Error & {
        status?: number;
      };
      error.status = response.status;
      throw error;
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = await response.json();
    } catch {
      // OpenRouter sometimes returns HTTP 200 with a plain-text error body
      const bodyText = await response.text().catch(() => 'unreadable');
      throw new Error(`OpenRouter returned invalid JSON: ${bodyText.slice(0, 200)}`);
    }

    const raw = data?.choices?.[0]?.message?.content;
    if (!raw || raw.trim().length === 0) {
      throw new Error("The model returned an empty response.");
    }
    return raw;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Retry loop for a single model: up to MAX_RETRIES_PER_MODEL attempts
 * with backoff. Retries on empty response, 429, and 5xx.
 */
async function callModelWithRetries(
  model: string,
  systemPrompt: string,
  content: string,
  platforms: string[]
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
    try {
      const result = await callModelOnce(model, systemPrompt, content, platforms);
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const status = (err as Error & { status?: number }).status;

      const isEmpty = lastError.message.includes("empty response");
      const isRateLimit = status === 429 || lastError.message.includes("429");
      const isServerError = status !== undefined && status >= 500;
      const isTimeout = lastError.message.includes("abort") || lastError.message.includes("timeout");
      const isInvalidJson = lastError.message.includes("invalid JSON");
      const retriable = isEmpty || isRateLimit || isServerError || isTimeout || isInvalidJson;

      if (!retriable || attempt === MAX_RETRIES_PER_MODEL) {
        throw lastError;
      }

      const delay = RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
      console.warn(
        `Scanner retry ${attempt + 1}/${MAX_RETRIES_PER_MODEL} for ${model}: ${lastError.message.slice(0, 120)} (${delay}ms)`
      );
      await sleep(delay);
    }
  }

  throw lastError || new Error("Unknown scanner error after retries");
}

/**
 * Full failover chain: tries each model with per-model retries.
 */
async function callOpenRouter(
  content: string,
  platforms: string[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(platforms);
  const errors: string[] = [];

  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      return await callModelWithRetries(model, systemPrompt, content, platforms);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${model}: ${msg.slice(0, 120)}`);
      console.warn(`Scanner model ${model} failed, trying next. Error: ${msg.slice(0, 120)}`);
    }
  }

  throw new Error(
    `All ${MODEL_FALLBACK_CHAIN.length} models failed. ` + errors.join(" | ")
  );
}

/**
 * Extract a JSON object from anywhere in a model response.
 * Handles: raw JSON, markdown fences, thinking-then-JSON, conversational prefix.
 * Finds the first "{" and extracts to its matching "}".
 */
function extractJsonObject(raw: string): string | null {
  // Fast path: entire response is JSON
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    // Find matching closing brace
    let depth = 0;
    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === "{") depth++;
      else if (trimmed[i] === "}") {
        depth--;
        if (depth === 0) return trimmed.slice(0, i + 1);
      }
    }
  }

  // Strip markdown fences first
  let unfenced = trimmed;
  if (unfenced.startsWith("```")) {
    unfenced = unfenced.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    unfenced = unfenced.trim();
    if (unfenced.startsWith("{")) {
      let depth = 0;
      for (let i = 0; i < unfenced.length; i++) {
        if (unfenced[i] === "{") depth++;
        else if (unfenced[i] === "}") {
          depth--;
          if (depth === 0) return unfenced.slice(0, i + 1);
        }
      }
    }
  }

  // Slow path: find first "{" anywhere in the response and extract to matching "}"
  const firstBrace = trimmed.indexOf("{");
  if (firstBrace === -1) return null;

  let depth = 0;
  for (let i = firstBrace; i < trimmed.length; i++) {
    if (trimmed[i] === "{") depth++;
    else if (trimmed[i] === "}") {
      depth--;
      if (depth === 0) return trimmed.slice(firstBrace, i + 1);
    }
  }

  return null; // no complete JSON object found
}

function parseResults(raw: string): PlatformResult[] {
  const jsonStr = extractJsonObject(raw);
  if (!jsonStr) return [];

  // Clean control characters (preserve newlines/tabs inside string values)
  const cleaned = jsonStr.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");

  try {
    const parsed = JSON.parse(cleaned) as { results?: PlatformResult[] };
    return Array.isArray(parsed.results) ? parsed.results : [];
  } catch {
    return [];
  }
}

function groundResults(
  content: string,
  platforms: string[],
  modelResults: PlatformResult[]
): PlatformResult[] | null {
  const byPlatform = new Map<string, PlatformResult>();
  for (const result of modelResults) {
    if (result?.platform) byPlatform.set(result.platform.toLowerCase(), result);
  }

  const contentLower = content.toLowerCase();
  const missing = platforms.filter(
    (platform) => !byPlatform.has(platform.toLowerCase())
  );
  if (missing.length > 0) return null;

  return platforms.map((platform) => {
    const result = byPlatform.get(platform.toLowerCase())!;
    const grounded = (result.flagged_phrases || []).filter(
      (phrase) =>
        typeof phrase === "string" && contentLower.includes(phrase.toLowerCase())
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
      return {
        ...result,
        platform,
        status: "warn" as const,
        flagged_phrases: [],
        safer_rewrite: "",
        reason:
          "The model identified a risk, but it did not cite an exact phrase from the supplied content. No compliance clearance was issued for this platform.",
      };
    }

    return { ...result, platform, flagged_phrases: grounded };
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    const content =
      typeof body.content === "string" ? body.content.trim() : "";
    const platforms = Array.isArray(body.platforms)
      ? body.platforms.filter((p): p is string => typeof p === "string" && p.length > 0)
      : [];

    if (content.length < 10) {
      return NextResponse.json(
        { error: "Content is required and must be at least 10 characters.", diagnostic: "invalid_input" },
        { status: 400 }
      );
    }
    if (platforms.length === 0) {
      return NextResponse.json(
        { error: "At least one platform must be selected.", diagnostic: "no_platforms" },
        { status: 400 }
      );
    }

    // Sequential batching: never more than 2 platforms per model call.
    const batches: string[][] = [];
    for (let i = 0; i < platforms.length; i += 2) {
      batches.push(platforms.slice(i, i + 2));
    }

    const results: PlatformResult[] = [];
    for (const batch of batches) {
      try {
        const raw = await callOpenRouter(content, batch);
        const modelResults = parseResults(raw);
        if (modelResults.length === 0) {
          return NextResponse.json(
            {
              error: "The scanner returned an unreadable result. No compliance clearance was issued. Please try again.",
              diagnostic: "unparseable_model_json",
            },
            { status: 503 }
          );
        }
        const grounded = groundResults(content, batch, modelResults);
        if (!grounded) {
          const missing = batch.filter(
            (platform) =>
              !modelResults.some(
                (r) => r?.platform?.toLowerCase() === platform.toLowerCase()
              )
          );
          return NextResponse.json(
            {
              error: `The scanner did not return a complete check for: ${missing.join(", ")}. No compliance clearance was issued. Please try again.`,
              diagnostic: `incomplete_platforms:${missing.join(",")}`,
            },
            { status: 503 }
          );
        }
        results.push(...grounded);
      } catch (err) {
        console.error("Scanner model call failed:", err);
        const message = err instanceof Error ? err.message : "Scanner model call failed.";
        const classified = classifyScanError(message);
        return NextResponse.json(
          { error: classified.error, diagnostic: classified.diagnostic },
          { status: classified.status }
        );
      }
    }

    return NextResponse.json({ data: results });
  } catch (err: unknown) {
    console.error("Scan Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    const classified = classifyScanError(message);
    return NextResponse.json(
      { error: classified.error, diagnostic: classified.diagnostic },
      { status: classified.status >= 500 ? classified.status : 500 }
    );
  }
}
