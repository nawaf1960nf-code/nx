import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { fetchTopicImage } from "@/lib/images";

export const runtime = "nodejs";

interface RequestBody {
  difficulty: 200 | 400 | 600;
  recentlyAsked?: string[];
}

interface CharadesResponse {
  word: string;
  category: string;
  englishName: string;
  imageUrl: string | null;
  hint?: string;
}

const DIFFICULTY_GUIDE = {
  200: "كلمة جداً سهلة، يعرفها الجميع: فاكهة شائعة، حيوان مألوف، أداة منزلية، أو لعبة أطفال.",
  400: "كلمة متوسطة الصعوبة: مهنة، رياضة، شخصية مشهورة (مغني، ممثل، رياضي)، فيلم شهير، طبق طعام.",
  600: "كلمة صعبة وفريدة: معلَم سياحي عالمي، عملية/مفهوم، حدث تاريخي، أو ظاهرة طبيعية.",
} as const;

const CATEGORIES_BY_DIFFICULTY = {
  200: ["فاكهة", "حيوان", "لعبة أطفال", "أداة منزلية", "رياضة شائعة"],
  400: ["فيلم شهير", "مغني", "ممثل", "رياضي", "مهنة", "طبق طعام"],
  600: ["معلَم سياحي", "حدث تاريخي", "اختراع", "ظاهرة طبيعية", "شخصية أدبية"],
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { difficulty, recentlyAsked = [] } = body;

    const anthropic = getAnthropic();

    if (!anthropic) {
      const fallback: CharadesResponse = {
        word: difficulty === 200 ? "تمساح" : difficulty === 400 ? "ميسي" : "برج إيفل",
        englishName: difficulty === 200 ? "Crocodile" : difficulty === 400 ? "Lionel Messi" : "Eiffel Tower",
        category: "حيوانات",
        imageUrl: null,
        hint: "[وضع تجريبي]",
      };
      return NextResponse.json(fallback);
    }

    const categories = CATEGORIES_BY_DIFFICULTY[difficulty];

    const systemPrompt = `أنت مولّد كلمات للعبة "اشرح بدون كلام". اللاعب يشوف صورة وكلمة على جواله ويمثّلها بدون كلام، والباقي يخمّنون.

📋 القواعد:
1. أعطِ كلمة واحدة فقط - شي محسوس قابل للتمثيل بصرياً.
2. الكلمة عربية مفهومة في كل الدول العربية.
3. تجنّب الكلمات المسيئة أو الحساسة.
4. تجنّب الكلمات المكررة من القائمة.
5. أعطِ نسخة إنجليزية / لاتينية للكلمة (للبحث عن صورة).
6. اختر التصنيف من القائمة المُعطاة.

أعد JSON صرف فقط:
{
  "word": "الكلمة بالعربي",
  "englishName": "الكلمة بالإنجليزية (للبحث في ويكي)",
  "category": "التصنيف",
  "hint": "تلميح اختياري قصير لو احتاج"
}`;

    const userPrompt = `صعوبة: ${difficulty}
الوصف: ${DIFFICULTY_GUIDE[difficulty]}
التصنيفات المسموحة: ${categories.join("، ")}

${
  recentlyAsked.length > 0
    ? `كلمات مُستبعدة:\n- ${recentlyAsked.slice(-20).join("\n- ")}`
    : ""
}

أعطني كلمة واحدة جديدة الآن.`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 250,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as Omit<CharadesResponse, "imageUrl">;

    // جلب صورة من ويكي حسب الاسم الإنجليزي
    const imageUrl = await fetchTopicImage(
      parsed.englishName,
      parsed.word,
    );

    return NextResponse.json({ ...parsed, imageUrl });
  } catch (error) {
    console.error("Charades generation error:", error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 },
    );
  }
}
