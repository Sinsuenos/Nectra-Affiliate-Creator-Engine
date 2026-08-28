import { NextResponse } from "next/server";
import { consumeOAuthState, exchangeCode, savePinterestSession, validState } from "@/lib/pinterest";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const expectedState = await consumeOAuthState();

  if (error) {
    return NextResponse.redirect(new URL(`/pinterest?error=${encodeURIComponent(errorDescription || error)}`, url.origin));
  }
  if (!validState(state, expectedState)) {
    return NextResponse.json({ error: "Pinterest OAuth state validation failed" }, { status: 400 });
  }
  if (!code) {
    return NextResponse.json({ error: "Pinterest did not return an authorization code" }, { status: 400 });
  }

  try {
    const session = await exchangeCode(code);
    await savePinterestSession(session);
    return NextResponse.redirect(new URL("/pinterest?connected=1", url.origin));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Pinterest connection failed";
    return NextResponse.redirect(new URL(`/pinterest?error=${encodeURIComponent(message)}`, url.origin));
  }
}
