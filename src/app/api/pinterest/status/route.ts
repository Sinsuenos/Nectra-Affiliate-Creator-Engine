import { NextResponse } from "next/server";
import { getUsablePinterestSession, pinterestFetch } from "@/lib/pinterest";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getUsablePinterestSession();
    if (!session) return NextResponse.json({ connected: false, state: "NOT_CONNECTED" });
    const account = await pinterestFetch<{ username?: string; profile_image?: string; account_type?: string }>("/user_account");
    const scopes = new Set(session.scope.split(/[\s,]+/).filter(Boolean));
    const canPublish = scopes.has("pins:write") && scopes.has("boards:write");
    return NextResponse.json({
      connected: true,
      state: canPublish ? "CONNECTED" : "AUTHORIZED_BUT_MISSING_WRITE_ACCESS",
      canPublish,
      username: account.username || null,
      accountType: account.account_type || null,
      scope: session.scope,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    const status = (error as { status?: number }).status;
    const message = error instanceof Error ? error.message : "Pinterest status unavailable";
    if (status === 401) return NextResponse.json({ connected: false, state: "TOKEN_EXPIRED", error: message });
    if (status === 403) return NextResponse.json({ connected: false, state: "AUTHORIZED_BUT_MISSING_WRITE_ACCESS", error: message });
    return NextResponse.json({ connected: false, state: "API_ERROR", error: message });
  }
}
