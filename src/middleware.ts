import { NextRequest, NextResponse } from "next/server";

const TRACKED_PATHS = new Set([
  "/",
  "/generator",
  "/scanner",
  "/compliance",
  "/sample",
  "/modules",
]);

const ALLOWED_ORIGINS = new Set([
  "https://chatgpt.com",
  "https://www.chatgpt.com",
  "https://nectar-engine.vercel.app",
]);

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (TRACKED_PATHS.has(path)) {
    const country = request.headers.get("x-vercel-ip-country") ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    const referrer = request.headers.get("referer") ?? "direct";
    console.info(
      `[traffic] path=${path} country=${country} ua=${userAgent.slice(0, 160)} ref=${referrer.slice(0, 160)}`,
    );
  }

  if (path.startsWith("/api/")) {
    const origin = request.headers.get("origin") || "";
    const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://chatgpt.com";

    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set("Access-Control-Allow-Origin", allowOrigin);
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.headers.set("Vary", "Origin");
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", allowOrigin);
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Vary", "Origin");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/generator", "/scanner", "/compliance", "/sample", "/modules", "/api/:path*"],
};
