import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { PLATFORM_MATRIX } from "@/lib/compliance/platform-matrix";

export const maxDuration = 60;

interface ScanRequest { content: string; platforms: string[]; }
interface PlatformResult { platform: string; status: "pass" | "warn" | "fail"; flagged_phrases: string[]; reason: string; safer_rewrite: string; }
const VALID_STATUSES = new Set(["pass", "warn", "fail"]);

function buildPlatformContext(platforms: string[]): string {
  return platforms.map((name) => {
    const entry = PLATFORM_MATRIX.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (!entry) return `- ${name}`;
    return [`- ${entry.name} [${entry.risk} risk]`, `Risk signals: ${entry.bannedTriggers.join("; ")}`, `Safer approach: ${entry.safeApproach}`].join("\n  ");
  }).join("\n");
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
- Return exactly one result for every requested platform.
- status MUST be exactly one of: pass, warn, fail.
- Keep reasons short and factual. Do not invent policy details.

Required JSON shape:
{"results":[{"platform":"<name>","status":"pass|warn|fail","flagged_phrases":["<exact phrase>"],"reason":"<short reason>","safer_rewrite":"<rewrite or empty>"}]}`;
}

function validateResults(content: string, platforms: string[], value: unknown): PlatformResult[] | null {
  if (!value || typeof value !== "object") return null;
  const results = (value as { results?: unknown }).results;
  if (!Array.isArray(results)) return null;
  const byPlatform = new Map<string, PlatformResult>();
  for (const item of results) {
    if (!item || typeof item !== "object") return null;
    const r = item as Partial<PlatformResult>;
    if (typeof r.platform !== "string" || typeof r.status !== "string" || !VALID_STATUSES.has(r.status) || !Array.isArray(r.flagged_phrases) || !r.flagged_phrases.every((p) => typeof p === "string") || typeof r.reason !== "string" || typeof r.safer_rewrite !== "string") return null;
    byPlatform.set(r.platform.toLowerCase(), r as PlatformResult);
  }
  const contentLower = content.toLowerCase();
  return platforms.map((platform) => {
    const result = byPlatform.get(platform.toLowerCase());
    if (!result) throw new Error("invalid scanner result schema");
    const grounded = result.flagged_phrases.filter((phrase) => contentLower.includes(phrase.toLowerCase()));
    if (result.status !== "pass" && grounded.length === 0) {
      return { ...result, platform, status: "warn" as const, flagged_phrases: [], safer_rewrite: "", reason: "The model identified a risk but could not cite an exact phrase from the supplied content. No compliance clearance was issued for this platform." };
    }
    return { ...result, platform, flagged_phrases: result.status === "pass" ? [] : grounded, safer_rewrite: result.status === "pass" ? "" : result.safer_rewrite, reason: result.status === "pass" ? "No meaningful platform-specific risk signal found." : result.reason };
  });
}

function errorResponse(error: string, diagnostic: string, status: number) { return NextResponse.json({ error, diagnostic }, { status }); }

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const platforms = Array.isArray(body.platforms) ? body.platforms.filter((p): p is string => typeof p === "string" && p.length > 0) : [];
    if (content.length < 10) return errorResponse("Content is required and must be at least 10 characters.", "invalid_input", 400);
    if (platforms.length === 0) return errorResponse("At least one platform must be selected.", "no_platforms", 400);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return errorResponse("Scanner is not configured on the server. No compliance clearance was issued.", "GEMINI_API_KEY_missing", 503);
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(platforms);
    let lastError = "";

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({ model, contents: [{ role: "user", parts: [{ text: `${prompt}\n\n--- CONTENT ---\n${content}\n--- END CONTENT ---` }] }], config: { temperature: 0.2, maxOutputTokens: 2500, responseMimeType: "application/json" } });
        const raw = response.text?.trim();
        if (!raw) throw new Error("empty response");
        let parsed: unknown;
        try { parsed = JSON.parse(raw); } catch { throw new Error("invalid JSON from Gemini"); }
        const results = validateResults(content, platforms, parsed);
        if (!results) throw new Error("invalid scanner result schema");
        return NextResponse.json({ data: results });
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    const lower = lastError.toLowerCase();
    if (lower.includes("429") || lower.includes("quota") || lower.includes("resource_exhausted")) return errorResponse("Scan temporarily unavailable. Please try again in a moment.", "provider_rate_limit", 503);
    if (lower.includes("timeout") || lower.includes("abort")) return errorResponse("The scanner timed out waiting for the model. Try again.", "timeout", 504);
    return errorResponse("The scanner could not complete the AI check. No compliance clearance was issued. Please try again.", "scanner_failed", 503);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected scanner error";
    return errorResponse("The scanner could not process this request. Please try again.", message.slice(0, 160), 500);
  }
}
