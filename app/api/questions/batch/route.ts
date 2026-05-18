import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { CATEGORY_BY_ID } from "@/lib/categories-data";

export const runtime = "nodejs";
export const maxDuration = 60;

interface RequestBody {
  categoryId: string;
}

interface GeneratedQuestion {
  text: string;
  answer: string;
  acceptableAnswers: string[];
  hint: string;
  difficulty: 200 | 400 | 600;
  idx: number; // 0 أو 1 لكل صعوبة
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { categoryId } = body;

    const category = CATEGORY_BY_ID[categoryId];
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const anthropic = getAnthropic();

    // وضع تجريبي بدون مفتاح
    if (!anthropic) {
      const mock: GeneratedQuestion[] = [];
      [200, 400, 600].forEach((diff) => {
        [0, 1].forEach((idx) => {
          mock.push({
            text: `[وضع تجريبي] سؤال ${idx + 1} بصعوبة ${diff} في ${category.name}`,
            answer: "إجابة وهمية",
            acceptableAnswers: ["إجابة وهمية"],
            hint: "تلميح وهمي",
            difficulty: diff as 200 | 400 | 600,
            idx,
          });
        });
      });
      return NextResponse.json({ questions: mock });
    }

    const systemPrompt = `أنت مولّد أسئلة لعبة جماعية عربية اسمها "نون عين". مهمتك توليد ٦ أسئلة دفعة وحدة لفئة معينة.

📋 الفئة: ${category.name}
${category.description}

📊 توزيع الصعوبات (6 أسئلة):
- سؤالان بصعوبة 200 (Easy): سهل جداً يعرفه الجميع
- سؤالان بصعوبة 400 (Medium): متوسط يحتاج معرفة جيدة
- سؤالان بصعوبة 600 (Hard): صعب للمتعمقين

⚠️ قواعد إلزامية:
1. الإجابات قصيرة وعامية (كلمة-كلمتين، حد أقصى ٣ كلمات).
   ✅ "ليفاي" بدل "الكابتن ليفاي أكرمان"
   ✅ "ماين كرافت" بدل "لعبة الـ sandbox من شركة Mojang"
2. كل سؤال مختلف تماماً عن الباقي (لا تكرار ولا تشابه).
3. تجنّب الأسئلة الحساسة سياسياً ودينياً.
4. الإجابة قاطعة وموثقة، ما هي رأي.
5. لكل إجابة، أضف ٢-٤ بدائل مقبولة (مرادفات، اسم بالإنجليزي، اختصارات).
6. التلميح ذكي وقصير، يقرّب الإجابة بدون كشفها.

أعد JSON صرف فقط، مصفوفة من ٦ أسئلة بدون أي تعليقات:
{
  "questions": [
    {
      "difficulty": 200,
      "idx": 0,
      "text": "نص السؤال",
      "answer": "الإجابة القصيرة",
      "acceptableAnswers": ["الإجابة", "بديل1", "بديل2"],
      "hint": "تلميح"
    },
    { "difficulty": 200, "idx": 1, ... },
    { "difficulty": 400, "idx": 0, ... },
    { "difficulty": 400, "idx": 1, ... },
    { "difficulty": 600, "idx": 0, ... },
    { "difficulty": 600, "idx": 1, ... }
  ]
}`;

    const userPrompt = `ولّد ٦ أسئلة متنوعة وممتعة لفئة "${category.name}".
كل سؤال يجب أن يكون مختلفاً ومميزاً عن الباقي.
استخدم اللغة العربية الواضحة (يمكن خلط أسماء بالإنجليزية إذا كانت مشهورة في الفئة).`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 3500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse questions batch" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as { questions: GeneratedQuestion[] };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Batch generation error:", error);
    return NextResponse.json(
      { error: "Batch generation failed" },
      { status: 500 },
    );
  }
}
