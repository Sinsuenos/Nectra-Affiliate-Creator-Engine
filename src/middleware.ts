import { NextRequest, NextResponse } from "next/server";

const TRACKED_PATHS = new Set([
  "/",
  "/generator",
  "/scanner",
  "/compliance",
  "/sample",
  "/modules",
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/generator", "/scanner", "/compliance", "/sample", "/modules"],
};
