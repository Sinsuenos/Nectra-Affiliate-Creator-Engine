import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { PLATFORM_MATRIX } from "@/lib/compliance/platform-matrix";

export const maxDuration = 60;

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

const VALID_STATUSES = new Set(["pass", "warn", "fail"]);
const DEFAULT_MODEL = "gemini-2.5-flash";
const RETIRED_MODELS = new Set([
  "gemini-2.0-flash",
  "models/gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "models/gemini-2.0-flash-001",
  "gemini-1.5-flash",
  "models/gemini-1.5-flash",
  "gemini-1.5-pro",
  "models/gemini-1.5-pro",
]);

function resolveModel(): string {
  const configured = (process.env.GEMINI_MODEL || "").trim();
  if (!configured) return DEFAULT_MODEL;
  if (RETIRED_MODELS.has(configured) || RETIRED_MODELS.has(`models/${configured}`)) {
    return DEFAULT_MODEL;
  }
  return configured;
}

function buildPlatformContext(platforms: string[]): string {
  return platforms
    .map((name) => {
      const entry = PLATFORM_MATRIX.find(
        (p) => p.name.toLowerCase() === name.toLowerCase(),
      );
      if (!entry) return `- ${name}`;
      return [
        `- ${entry.name} [${entry.risk} risk]`,
        `Risk signals: ${entry.bannedTriggers.join("; ")}`,
        `Safer approach: ${entry.safeApproach}`,
      ].join("\n  ");
    })
    .join("\n");
}

function buildPrompt(platforms: string[]): string {
  return `You are Nectar Engine's compliance scanner. Return ONLY a JSON object, with no markdown, commentary, or explanation.

Check the supplied content against ONLY these selected platforms:
${buildPlatformContext(platforms)}

Rules:
- fail = explicit high-risk or banned trigger for that platform.
- warn = meaningful borderline risk.
- pass = no meaningful platform-specific risk signal.
- flagged_phrases MUST be exact phrases copied from the supplied content.
- If no exact phrase supports warn/fail, use pass.
- safer_rewrite should preserve the content and only replace risky phrase(s); use an empty string for pass.
- Return exactly one result for every requested platform, using the same platform names provided.
- status MUST be exactly one of: pass, warn, fail.
- Keep reasons short and factual. Do not invent policy details.

Required JSON shape:
{"results":[{"platform":"<name>","status":"pass|warn|fail","flagged_phrases":["<exact phrase>"],"reason":"<short reason>","safer_rewrite":"<rewrite or empty>"}]}`;
}

function extractText(response: {
  text?: string;
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}): string {
  const direct = response.text?.trim();
  if (direct) return direct;
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) return "";
  return parts
    .map((p) => p.text || "")
    .join("")
    .trim();
}

function validateResults(
  content: string,
  platforms: string[],
  value: unknown,
): PlatformResult[] | null {
  if (!value || typeof value !== "object") return null;
  const results = (value as { results?: unknown }).results;
  if (!Array.isArray(results)) return null;

  const byPlatform = new Map<string, PlatformResult>();
  for (const item of results) {
    if (!item || typeof item !== "object") return null;
    const r = item as Partial<PlatformResult>;
    if (
      typeof r.platform !== "string" ||
      typeof r.status !== "string" ||
      !VALID_STATUSES.has(r.status) ||
      !Array.isArray(r.flagged_phrases) ||
      !r.flagged_phrases.every((p) => typeof p === "string") ||
      typeof r.reason !== "string" ||
      typeof r.safer_rewrite !== "string"
    ) {
      return null;
    }
    byPlatform.set(r.platform.toLowerCase(), r as PlatformResult);
  }

  const contentLower = content.toLowerCase();
  const output: PlatformResult[] = [];
  for (const platform of platforms) {
    const result = byPlatform.get(platform.toLowerCase());
    if (!result) return null;
    const grounded = result.flagged_phrases.filter((phrase) =>
      contentLower.includes(phrase.toLowerCase()),
    );
    if (result.status !== "pass" && grounded.length === 0) {
      output.push({
        ...result,
        platform,
        status: "warn",
        flagged_phrases: [],
        safer_rewrite: "",
        reason:
          "The model identified a risk but could not cite an exact phrase from the supplied content. No compliance clearance was issued for this platform.",
      });
    } else {
      output.push({
        ...result,
        platform,
        flagged_phrases: result.status === "pass" ? [] : grounded,
        safer_rewrite: result.status === "pass" ? "" : result.safer_rewrite,
        reason:
          result.status === "pass"
            ? "No meaningful platform-specific risk signal found."
            : result.reason,
      });
    }
  }
  return output;
}

function errorResponse(error: string, diagnostic: string, status: number) {
  return NextResponse.json({ error, diagnostic }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const platforms = Array.isArray(body.platforms)
      ? body.platforms.filter((p): p is string => typeof p === "string" && p.length > 0)
      : [];

    if (content.length < 10) {
      return errorResponse(
        "Content is required and must be at least 10 characters.",
        "invalid_input",
        400,
      );
    }
    if (platforms.length === 0) {
      return errorResponse(
        "At least one platform must be selected.",
        "no_platforms",
        400,
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return errorResponse(
        "Scanner is not configured on the server. No compliance clearance was issued.",
        "GEMINI_API_KEY_missing",
        503,
      );
    }

    const model = resolveModel();
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(platforms);
    const userText = `${prompt}\n\n--- CONTENT ---\n${content}\n--- END CONTENT ---`;
    let lastError = "";

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userText,
          config: {
            temperature: 0.2,
            maxOutputTokens: 2500,
            responseMimeType: "application/json",
          },
        });

        const raw = extractText(response);
        if (!raw) throw new Error("empty response");

        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new Error(`invalid JSON from Gemini: ${raw.slice(0, 120)}`);
        }

        const results = validateResults(content, platforms, parsed);
        if (!results) throw new Error("invalid scanner result schema");
        return NextResponse.json({ data: results });
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.error(`Scanner attempt ${attempt + 1} failed (model=${model}):`, lastError);
        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }

    const lower = lastError.toLowerCase();
    if (
      lower.includes("429") ||
      lower.includes("quota") ||
      lower.includes("resource_exhausted")
    ) {
      return errorResponse(
        "Scan temporarily unavailable. Please try again in a moment.",
        "provider_rate_limit",
        503,
      );
    }
    if (lower.includes("timeout") || lower.includes("abort")) {
      return errorResponse(
        "The scanner timed out waiting for the model. Try again.",
        "timeout",
        504,
      );
    }
    if (
      lower.includes("api key") ||
      lower.includes("api_key") ||
      lower.includes("permission") ||
      lower.includes("unauthorized") ||
      lower.includes("401") ||
      lower.includes("403")
    ) {
      return errorResponse(
        "Scanner is not configured on the server. No compliance clearance was issued.",
        `auth_error:${lastError.slice(0, 160)}`,
        503,
      );
    }

    return errorResponse(
      "The scanner could not complete the AI check. No compliance clearance was issued. Please try again.",
      `scanner_failed:${lastError.slice(0, 200)}`,
      503,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected scanner error";
    console.error("Scanner outer error:", message);
    return errorResponse(
      "The scanner could not process this request. Please try again.",
      message.slice(0, 160),
      500,
    );
  }
}
