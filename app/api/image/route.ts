import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface PexelsResponse {
  photos: Array<{
    src: { large: string; medium: string; original: string };
    alt: string;
  }>;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const pexelsKey = process.env.PEXELS_API_KEY;

  if (!pexelsKey) {
    return NextResponse.json({
      url: null,
      placeholder: true,
      message: "Set PEXELS_API_KEY to enable images",
    });
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
      {
        headers: { Authorization: pexelsKey },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return NextResponse.json({ url: null });
    }

    const data = (await res.json()) as PexelsResponse;
    const photo = data.photos[Math.floor(Math.random() * data.photos.length)];

    if (!photo) {
      return NextResponse.json({ url: null });
    }

    return NextResponse.json({
      url: photo.src.large,
      alt: photo.alt,
    });
  } catch (error) {
    console.error("Pexels error:", error);
    return NextResponse.json({ url: null });
  }
}
