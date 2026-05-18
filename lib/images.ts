// خدمة جلب الصور من Wikipedia (مجانية، بدون مفتاح API)

interface WikiSummary {
  thumbnail?: { source: string; width?: number; height?: number };
  originalimage?: { source: string; width?: number; height?: number };
  type?: string;
}

interface WikiSearchResult {
  query?: {
    search?: Array<{ title: string }>;
  };
}

/**
 * يجلب صورة من Wikipedia بناءً على عنوان مقال محدد.
 * يفضّل originalimage عن thumbnail.
 */
async function fetchFromWikiTitle(
  title: string,
  lang: "ar" | "en",
): Promise<string | null> {
  try {
    const cleanTitle = title.replace(/\s+/g, "_");
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`;
    const res = await fetch(url, {
      next: { revalidate: 86400 * 7 }, // أسبوع
      headers: {
        "User-Agent": "NoonAeen/1.0 (https://noonaeen.net)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WikiSummary;
    // تجنّب الصفحات اللي مو محتوى حقيقي
    if (data.type === "disambiguation" || data.type === "redirect") return null;
    const img =
      data.originalimage?.source ??
      data.thumbnail?.source ??
      null;
    if (!img) return null;
    // تجنّب الأيقونات الصغيرة جداً
    const width = data.originalimage?.width ?? data.thumbnail?.width ?? 0;
    if (width > 0 && width < 200) return null;
    return img;
  } catch {
    return null;
  }
}

/**
 * بحث في ويكي ثم جلب صورة أول نتيجة.
 */
async function searchAndFetch(
  query: string,
  lang: "ar" | "en",
): Promise<string | null> {
  try {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&origin=*`;
    const res = await fetch(url, {
      next: { revalidate: 86400 * 7 },
      headers: {
        "User-Agent": "NoonAeen/1.0 (https://noonaeen.net)",
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WikiSearchResult;
    const title = data?.query?.search?.[0]?.title;
    if (!title) return null;
    return fetchFromWikiTitle(title, lang);
  } catch {
    return null;
  }
}

/**
 * جلب صورة لتصنيف:
 * 1. لو في coverImage محدد، استخدمه
 * 2. لو في wikiTitle، اجلب مباشرة من ويكي
 * 3. fallback: بحث في ويكي
 */
export async function fetchCategoryImage(opts: {
  coverImage?: string;
  wikiTitle?: string;
  wikiTitleAr?: string;
  query?: string;
}): Promise<string | null> {
  if (opts.coverImage) return opts.coverImage;

  // جرب العنوان الإنجليزي أولاً (تغطية أفضل)
  if (opts.wikiTitle) {
    const img = await fetchFromWikiTitle(opts.wikiTitle, "en");
    if (img) return img;
  }
  if (opts.wikiTitleAr) {
    const img = await fetchFromWikiTitle(opts.wikiTitleAr, "ar");
    if (img) return img;
  }
  if (opts.query) {
    const img = await searchAndFetch(opts.query, "en");
    if (img) return img;
    const arImg = await searchAndFetch(opts.query, "ar");
    if (arImg) return arImg;
  }
  return null;
}

/**
 * جلب صورة لاستعلام عام (للسيناريوهات اللي بدون wikiTitle).
 */
export async function fetchTopicImage(
  query: string,
  fallbackQuery?: string,
): Promise<string | null> {
  const queries = [query, fallbackQuery].filter(Boolean) as string[];
  for (const q of queries) {
    const img = await searchAndFetch(q, "en");
    if (img) return img;
    const arImg = await searchAndFetch(q, "ar");
    if (arImg) return arImg;
  }
  return null;
}
