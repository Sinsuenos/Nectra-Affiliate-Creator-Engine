import { NextResponse } from "next/server";
import { pinterestFetch } from "@/lib/pinterest";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(await pinterestFetch("/boards?page_size=100"));
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to list Pinterest boards" }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name || typeof body.name !== "string") {
      return NextResponse.json({ error: "Board name is required" }, { status: 400 });
    }
    const payload = {
      name: body.name.trim(),
      description: typeof body.description === "string" ? body.description.trim() : undefined,
      privacy: body.privacy === "SECRET" ? "SECRET" : "PUBLIC",
    };
    return NextResponse.json(await pinterestFetch("/boards", { method: "POST", body: JSON.stringify(payload) }), { status: 201 });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create Pinterest board" }, { status });
  }
}
