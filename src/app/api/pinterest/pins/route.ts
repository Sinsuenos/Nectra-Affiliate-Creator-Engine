import { NextResponse } from "next/server";
import { pinterestFetch } from "@/lib/pinterest";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = new URLSearchParams();
    for (const key of ["bookmark", "page_size", "privacy", "pin_filter", "include_protected_pins"]) {
      const value = url.searchParams.get(key);
      if (value) query.set(key, value);
    }
    return NextResponse.json(await pinterestFetch(`/pins${query.toString() ? `?${query}` : ""}`));
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to list Pinterest Pins" }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.board_id || !body?.title || !body?.description || !body?.image_url) {
      return NextResponse.json({ error: "board_id, title, description, and image_url are required" }, { status: 400 });
    }
    const imageUrl = new URL(body.image_url);
    if (!/^https?:$/.test(imageUrl.protocol)) throw new Error("image_url must be an https URL");

    const payload = {
      board_id: String(body.board_id),
      title: String(body.title).trim().slice(0, 100),
      description: String(body.description).trim().slice(0, 800),
      link: body.link ? String(body.link).trim() : undefined,
      media_source: {
        source_type: "image_url",
        url: imageUrl.toString(),
        is_standard: true,
      },
    };

    return NextResponse.json(await pinterestFetch("/pins", { method: "POST", body: JSON.stringify(payload) }), { status: 201 });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create Pinterest Pin" }, { status });
  }
}
