/* ------------------------------------------------------------------ */
/*  CORS HELPER FOR CHATGPT CUSTOM GPT ACTION                          */
/* ------------------------------------------------------------------ */
//
// ChatGPT Custom GPT Actions call this API from the user's browser at
// chatgpt.com (or chat.openai.com). Browser CORS policy requires the
// server to explicitly allow these origins, the POST/OPTIONS methods,
// and the Content-Type / Authorization request headers.
//
// We do NOT use wildcard CORS. Only the origins listed below are allowed.
//
// Allowed origins:
//   - https://chatgpt.com        (primary ChatGPT web client)
//   - https://chat.openai.com    (legacy ChatGPT web client)
//   - http://localhost:3000      (local dev — same-origin in prod is allowed implicitly)
//
// The site's own origin (nectar-engine.vercel.app) is same-origin for
// the in-product Generator/Scanner pages and does not require CORS.

import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = new Set<string>([
  "https://chatgpt.com",
  "https://chat.openai.com",
  "http://localhost:3000",
]);

const ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
].join(", ");

const ALLOWED_METHODS = "POST, OPTIONS";

const MAX_AGE = "86400"; // 24h — let browsers cache preflight

function resolveOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null;
  if (ALLOWED_ORIGINS.has(requestOrigin)) return requestOrigin;
  return null;
}

/**
 * Build CORS response headers for the given request. Returns an empty
 * object if the request origin is not in the allowlist (so no CORS
 * headers are added — the browser will block the response).
 */
export function corsHeaders(request: Request): Record<string, string> {
  const origin = resolveOrigin(request.headers.get("origin"));
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Max-Age": MAX_AGE,
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

/**
 * Handle an OPTIONS preflight request. Returns 204 with CORS headers
 * if the origin is allowed; returns 204 with no CORS headers (which
 * effectively blocks the actual request) otherwise.
 */
export function handleCorsPreflight(request: Request): NextResponse {
  const headers = corsHeaders(request);
  // Always return 204 for OPTIONS — browsers require a 2xx response
  // to proceed with the actual POST. If the origin isn't allowed, we
  // return 204 without CORS headers; the browser will then block the
  // actual POST from reading the response.
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...headers,
      Allow: ALLOWED_METHODS,
    },
  });
}

/**
 * Add CORS headers to a normal response (POST). Mutates the response
 * in-place and returns it.
 */
export function withCors(response: NextResponse, request: Request): NextResponse {
  const headers = corsHeaders(request);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}
