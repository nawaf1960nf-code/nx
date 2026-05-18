// خدمة استرجاع الصور من Wikipedia (مجانية، بدون مفتاح API)

interface WikiSearchResponse {
  query?: {
    search?: Array<{ title: string }>;
  };
}

interface WikiSummaryResponse {
  thumbnail?: { source: string };
  originalimage?: { source: string };
  description?: string;
}

async function searchWikiTitle(
  query: string,
  lang: "ar" | "en",
): Promise<string | null> {
  try {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(
      query,
    )}&srlimit=1&origin=*`;
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { "User-Agent": "NoonAeen/1.0" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WikiSearchResponse;
    return data?.query?.search?.[0]?.title ?? null;
  } catch {
    return null;
  }
}

async function fetchWikiImage(
  title: string,
  lang: "ar" | "en",
): Promise<string | null> {
  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title.replace(/ /g, "_"),
    )}`;
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { "User-Agent": "NoonAeen/1.0" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WikiSummaryResponse;
    return (
      data?.originalimage?.source ??
      data?.thumbnail?.source ??
      null
    );
  } catch {
    return null;
  }
}

/**
 * جلب صورة موضوعية لاستعلام معين.
 * يجرب ويكيبيديا العربية أولاً، ثم الإنجليزية.
 */
export async function fetchTopicImage(
  query: string,
  fallbackQuery?: string,
): Promise<string | null> {
  if (!query.trim()) return null;

  const queries = [query, fallbackQuery].filter(Boolean) as string[];

  for (const q of queries) {
    // ويكيبيديا الإنجليزية أفضل تغطية للأنمي والأفلام الأجنبية والألعاب
    const enTitle = await searchWikiTitle(q, "en");
    if (enTitle) {
      const img = await fetchWikiImage(enTitle, "en");
      if (img) return img;
    }

    // العربية للمحتوى العربي
    const arTitle = await searchWikiTitle(q, "ar");
    if (arTitle) {
      const img = await fetchWikiImage(arTitle, "ar");
      if (img) return img;
    }
  }

  return null;
}
