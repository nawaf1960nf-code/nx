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

🚨 قاعدة التنوع الصارمة (الأهم!):
السؤالان في نفس الصعوبة لازم يكونان عن **جوانب مختلفة تماماً** من الفئة، ليس تنويعاً سطحياً.

أمثلة على التنوع الصحيح (في فئة "ون بيس" بصعوبة 200):
✅ سؤال 1: عن البطل الرئيسي (موضوع: شخصية)
✅ سؤال 2: عن قدرة فاكهة شيطان (موضوع: قوى/نظام عالم)
❌ لا تسأل سؤالين عن نفس الشخصية أو نفس الموضوع.

أمثلة على التنوع الصحيح (في "أفلام عربية" بصعوبة 200):
✅ سؤال 1: عن ممثل (موضوع: شخصيات)
✅ سؤال 2: عن فيلم محدد (موضوع: أعمال)
❌ لا تسأل سؤالين كلاهما عن "اسم البطل في فيلم".

📐 تأكد إن السؤالين في كل صعوبة:
- يستهدفان معلومات مختلفة جذرياً
- يحتاجان معرفة مختلفة للإجابة
- ليس مجرد تغيير الصياغة لنفس الفكرة
- يغطيان فروعاً مختلفة من الفئة

⚠️ قواعد أخرى إلزامية:
1. الإجابات قصيرة وعامية (كلمة-كلمتين، حد أقصى ٣ كلمات).
   ✅ "ليفاي" بدل "الكابتن ليفاي أكرمان"
   ✅ "ماين كرافت" بدل "لعبة الـ sandbox من شركة Mojang"
2. تجنّب الأسئلة الحساسة سياسياً ودينياً.
3. الإجابة قاطعة وموثقة، ما هي رأي.
4. لكل إجابة، أضف ٢-٤ بدائل مقبولة (مرادفات، اسم بالإنجليزي، اختصارات).
5. التلميح ذكي وقصير، يقرّب الإجابة بدون كشفها.

أعد JSON صرف فقط، مصفوفة من ٦ أسئلة بدون أي تعليقات:
{
  "questions": [
    {
      "difficulty": 200,
      "idx": 0,
      "subtopic": "اسم الفرع المختلف الذي اخترته",
      "text": "نص السؤال",
      "answer": "الإجابة القصيرة",
      "acceptableAnswers": ["الإجابة", "بديل1", "بديل2"],
      "hint": "تلميح"
    },
    { "difficulty": 200, "idx": 1, "subtopic": "فرع مختلف تماماً", ... },
    { "difficulty": 400, "idx": 0, "subtopic": "...", ... },
    { "difficulty": 400, "idx": 1, "subtopic": "...", ... },
    { "difficulty": 600, "idx": 0, "subtopic": "...", ... },
    { "difficulty": 600, "idx": 1, "subtopic": "...", ... }
  ]
}`;

    const userPrompt = `ولّد ٦ أسئلة متنوعة وممتعة لفئة "${category.name}".

🚨 الأهم: السؤالين في كل صعوبة يجب أن يكونا عن جوانب مختلفة تماماً من الفئة. ابدأ بتحديد ٣ فروع مختلفة في ذهنك، ثم اكتب سؤالين لكل فرع (لكن بصعوبات مختلفة لتحقيق التوزيع).

مثلاً للفئة الحالية، قبل ما تكتب، فكر:
- ما هي ٣-٤ جوانب مختلفة جذرياً من هذه الفئة؟
- كيف أوزّع السؤالين في كل صعوبة على هذه الجوانب؟

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
