import { NextResponse } from "next/server";
import { makeState, PINTEREST_APP_ID, PINTEREST_REDIRECT_URI, PINTEREST_SCOPES, setOAuthState } from "@/lib/pinterest";

export const runtime = "nodejs";

export async function GET() {
  try {
    const state = makeState();
    await setOAuthState(state);
    const url = new URL("https://www.pinterest.com/oauth/");
    url.searchParams.set("client_id", PINTEREST_APP_ID);
    url.searchParams.set("redirect_uri", PINTEREST_REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", PINTEREST_SCOPES.join(","));
    url.searchParams.set("state", state);
    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Pinterest OAuth is not configured" }, { status: 500 });
  }
}
