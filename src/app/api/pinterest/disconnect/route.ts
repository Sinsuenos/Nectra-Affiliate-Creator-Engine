import { NextResponse } from "next/server";
import { clearPinterestSession } from "@/lib/pinterest";

export const runtime = "nodejs";

export async function POST() {
  await clearPinterestSession();
  return NextResponse.json({ connected: false });
}
