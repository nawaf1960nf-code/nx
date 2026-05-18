import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { CATEGORY_BY_ID } from "@/lib/categories-data";
import { fetchTopicImage } from "@/lib/images";

export const runtime = "nodejs";

interface RequestBody {
  categoryId: string;
  difficulty: 200 | 400 | 600;
  language?: "ar" | "en";
  recentlyAsked?: string[];
}

interface QuestionResponse {
  text: string;
  answer: string;
  acceptableAnswers: string[];
  hint: string;
  imageQuery?: string;
  imageUrl?: string | null;
}

const DIFFICULTY_GUIDE = {
  200: "سؤال سهل ومباشر، يعرفه الجميع تقريباً",
  400: "سؤال متوسط الصعوبة، يحتاج إلمام جيد بالفئة",
  600: "سؤال صعب، للمتعمقين والمتخصصين في الفئة",
} as const;


export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { categoryId, difficulty, language = "ar", recentlyAsked = [] } = body;

    const category = CATEGORY_BY_ID[categoryId];
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const anthropic = getAnthropic();

    if (!anthropic) {
      const mock: QuestionResponse = {
        text: `[وضع تجريبي] سؤال في فئة ${category.name} بصعوبة ${difficulty} — أضف ANTHROPIC_API_KEY لتوليد أسئلة حقيقية.`,
        answer: "إجابة وهمية",
        acceptableAnswers: ["إجابة وهمية", "اجابة وهمية"],
        hint: "هذا تلميح وهمي.",
        imageUrl: null,
      };
      return NextResponse.json(mock);
    }

    const systemPrompt = `أنت مولّد أسئلة لعبة جماعية عربية اسمها "نون عين". مهمتك توليد سؤال واحد بالفصحى الواضحة المفهومة لجميع العرب.

قواعد صارمة:
1. السؤال يكون في فئة محددة بصعوبة محددة.
2. الإجابة قصيرة (كلمة أو كلمتين عادة، ٤ كلمات حد أقصى).
3. الإجابة قاطعة وموثقة، ليست رأياً شخصياً.
4. تجنّب الأسئلة المكررة من القائمة المُعطاة.
5. تجنّب الأسئلة الحساسة سياسياً أو دينياً.
6. لا تستخدم تواريخ بعد ${new Date().getFullYear()}.
7. أعطِ تلميحاً ذكياً لا يكشف الإجابة لكن يقرّبها.
8. أعطِ مرادفات مقبولة للإجابة (بدائل صحيحة بنفس المعنى).
9. اقترح imageQuery مناسب بالإنجليزية (٢-٤ كلمات) لجلب صورة من Pexels تُثري السؤال بصرياً بدون كشف الإجابة.

أعد ردك كـ JSON صرف، بدون markdown ولا تعليقات:
{
  "text": "نص السؤال",
  "answer": "الإجابة الأساسية",
  "acceptableAnswers": ["الإجابة الأساسية", "بديل مقبول 1", "بديل مقبول 2"],
  "hint": "تلميح ذكي",
  "imageQuery": "english search query for thematic image"
}`;

    const userPrompt = `الفئة: ${category.name}
وصف الفئة: ${category.description}
الصعوبة: ${difficulty} نقطة (${DIFFICULTY_GUIDE[difficulty]})
اللغة: ${language === "ar" ? "العربية" : "الإنجليزية"}

${
  recentlyAsked.length > 0
    ? `الأسئلة المُستبعدة (لا تكررها):\n- ${recentlyAsked.slice(-15).join("\n- ")}`
    : ""
}

أعطني سؤالاً واحداً جديداً.`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse question" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as QuestionResponse;

    // جلب صورة موضوعية من Wikipedia (آمنة، لا تكشف الإجابة)
    const imageQuery = parsed.imageQuery || category.imageQuery || category.name;
    parsed.imageUrl = await fetchTopicImage(imageQuery, category.name);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Question generation failed" },
      { status: 500 },
    );
  }
}
