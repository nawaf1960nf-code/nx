import { NextResponse } from "next/server";
import { fetchTopicImage } from "@/lib/images";
import { CATEGORY_BY_ID } from "@/lib/categories-data";

export const runtime = "nodejs";

// كاش بسيط في الذاكرة لتقليل طلبات Wikipedia
const cache = new Map<string, { url: string | null; expires: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // ٢٤ ساعة

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("id");

  if (!categoryId) {
    return NextResponse.json({ url: null }, { status: 400 });
  }

  const category = CATEGORY_BY_ID[categoryId];
  if (!category) {
    return NextResponse.json({ url: null }, { status: 404 });
  }

  // تحقق من الكاش
  const cached = cache.get(categoryId);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ url: cached.url });
  }

  const query = category.imageQuery || category.name;
  const url = await fetchTopicImage(query, category.name);

  cache.set(categoryId, {
    url,
    expires: Date.now() + CACHE_TTL,
  });

  return NextResponse.json({ url });
}
