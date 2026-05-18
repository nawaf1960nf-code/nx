import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { CATEGORY_BY_ID } from "@/lib/categories-data";

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
}

const DIFFICULTY_GUIDE = {
  200: "سهل جداً، يعرفه ٩٠٪ من الناس. أساسيات الفئة فقط.",
  400: "متوسط، يحتاج معرفة جيدة بالفئة، ليس سؤال عادي للجميع.",
  600: "صعب، للمتعمقين فقط - معلومة دقيقة أو نادرة.",
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
      };
      return NextResponse.json(mock);
    }

    const systemPrompt = `أنت مولّد أسئلة لعبة جماعية عربية اسمها "نون عين". مهمتك توليد سؤال واحد ممتع وواضح.

📋 قواعد الأسلوب:
1. السؤال بالعربية الفصحى البسيطة المفهومة، أو يدخل فيها مصطلح إنجليزي شائع إذا الفئة تستدعي ذلك (مثل: GTA, One Piece, FIFA).
2. الإجابة لازم تكون **قصيرة وسهلة وعامية** - اسم شخص، اسم لعبة، كلمة وحدة، رقم - مو شرح طويل.
3. ممنوع الإجابات المعقّدة أو الأكاديمية. مثال:
   ✅ "ليفاي" (وليس "الكابتن ليفاي أكرمان قائد الفرقة الاستطلاعية")
   ✅ "ماين كرافت" (وليس "لعبة الـ sandbox الشهيرة من شركة Mojang")
   ✅ "٤" (وليس "أربعة وأربعون ألف عام")
4. الإجابة قاطعة وموثقة، ما تكون رأي.
5. ما تستخدم تواريخ بعد ${new Date().getFullYear()}.

📊 درجات الصعوبة:
- 200 نقطة = سؤال جداً سهل (Easy mode)
- 400 نقطة = سؤال متوسط (Medium mode)
- 600 نقطة = سؤال صعب (Hard mode)

⚠️ تجنّب:
- الأسئلة الحساسة سياسياً أو دينياً.
- الأسئلة المكررة من القائمة المعطاة.
- الإجابات المركّبة الطويلة (أكثر من ٣ كلمات نادراً).
- الأسئلة العامة بدون موضوع محدد.

🧠 التلميح:
- لا يكشف الإجابة لكن يقرّبها.
- بسيط ومباشر.

🔄 المرادفات المقبولة:
- الاسم بالعربي والإنجليزي إن وُجد.
- أشكال كتابية مختلفة (مثلاً: ليفاي/ليفي/Levi).
- اسم مختصر وكامل.

أعد ردك كـ JSON صرف فقط، بدون markdown ولا تعليقات:
{
  "text": "نص السؤال",
  "answer": "الإجابة القصيرة العامية",
  "acceptableAnswers": ["الإجابة", "بديل 1", "بديل 2"],
  "hint": "تلميح قصير ومباشر"
}`;

    const userPrompt = `الفئة: ${category.name}
وصف الفئة: ${category.description}
الصعوبة: ${difficulty} نقطة (${DIFFICULTY_GUIDE[difficulty]})

${
  recentlyAsked.length > 0
    ? `أسئلة مُستبعدة (لا تكررها):\n- ${recentlyAsked.slice(-15).join("\n- ")}`
    : ""
}

أعطني سؤالاً واحداً جديداً بإجابة قصيرة وعامية.`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 600,
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

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Question generation failed" },
      { status: 500 },
    );
  }
}
