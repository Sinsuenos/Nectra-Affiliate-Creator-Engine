import { NextResponse } from "next/server";
import { getUsablePinterestSession, pinterestFetch } from "@/lib/pinterest";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getUsablePinterestSession();
    if (!session) return NextResponse.json({ connected: false });
    const account = await pinterestFetch<{ username?: string; profile_image?: string; account_type?: string }>("/user_account");
    return NextResponse.json({
      connected: true,
      username: account.username || null,
      accountType: account.account_type || null,
      scope: session.scope,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    return NextResponse.json({ connected: false, error: error instanceof Error ? error.message : "Pinterest status unavailable" });
  }
}
