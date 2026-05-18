import { NextResponse } from "next/server";
import { fetchTopicImage } from "@/lib/images";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const url = await fetchTopicImage(query);

  return NextResponse.json({ url });
}
