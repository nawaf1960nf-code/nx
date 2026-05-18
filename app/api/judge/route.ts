import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";

interface JudgeRequest {
  question: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  userAnswer: string;
}

interface JudgeResponse {
  isCorrect: boolean;
  confidence: number;
  feedback: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as JudgeRequest;
    const { question, correctAnswer, acceptableAnswers = [], userAnswer } =
      body;

    if (!userAnswer.trim()) {
      return NextResponse.json<JudgeResponse>({
        isCorrect: false,
        confidence: 1,
        feedback: "لم تُكتب إجابة.",
      });
    }

    const allAcceptable = [correctAnswer, ...acceptableAnswers].map((a) =>
      normalize(a),
    );
    const normalizedUser = normalize(userAnswer);

    // التحقق السريع المحلي (يكفي في ٨٠٪ من الحالات)
    if (allAcceptable.some((a) => a === normalizedUser)) {
      return NextResponse.json<JudgeResponse>({
        isCorrect: true,
        confidence: 1,
        feedback: "إجابة صحيحة تماماً!",
      });
    }

    // تحقق جزئي للكلمات الواضحة
    for (const ans of allAcceptable) {
      if (ans.length > 4 && normalizedUser.length > 3) {
        if (ans.includes(normalizedUser) || normalizedUser.includes(ans)) {
          // يحتاج تأكيد من الذكاء الاصطناعي
          break;
        }
      }
    }

    const anthropic = getAnthropic();

    // وضع التطوير بدون مفتاح: نعتمد فقط على المطابقة المحلية
    if (!anthropic) {
      return NextResponse.json<JudgeResponse>({
        isCorrect: false,
        confidence: 0.5,
        feedback: "[وضع تجريبي] الجواب لا يطابق الإجابة المتوقعة.",
      });
    }

    const systemPrompt = `أنت حكَم عادل في لعبة سؤال وجواب عربية. مهمتك تقييم إجابة لاعب بصدق ودقة.

قواعد التحكيم:
1. اقبل المرادفات والصياغات المختلفة للإجابة الصحيحة.
2. اقبل الإجابات بأخطاء إملائية بسيطة (حرف أو اثنين).
3. ارفض الإجابات الناقصة أو غير الدقيقة.
4. ارفض الإجابات اللي تذكر معلومة جانبية بدون الإجابة الفعلية.
5. كن صارماً في الأسماء (شخصيات، أماكن) لكن مرناً في الصياغة.

أعد ردك كـ JSON صرف:
{
  "isCorrect": true/false,
  "confidence": 0.0-1.0,
  "feedback": "تعليق قصير ودود (سطر واحد)"
}`;

    const userPrompt = `السؤال: ${question}
الإجابة الصحيحة: ${correctAnswer}
البدائل المقبولة: ${acceptableAnswers.join(" / ") || "لا يوجد"}
إجابة اللاعب: ${userAnswer}

هل إجابة اللاعب صحيحة؟`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json<JudgeResponse>({
        isCorrect: false,
        confidence: 0.5,
        feedback: "لم نتمكن من التحكيم تلقائياً، راجع المضيف.",
      });
    }

    const parsed = JSON.parse(jsonMatch[0]) as JudgeResponse;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Judge error:", error);
    return NextResponse.json<JudgeResponse>({
      isCorrect: false,
      confidence: 0,
      feedback: "حدث خطأ في التحكيم، حاول مرة ثانية.",
    });
  }
}

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[ًٌٍَُِّْ]/g, "") // تشكيل
    .replace(/[إأآ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^؀-ۿݐ-ݿ\w\s]/g, "")
    .replace(/\s+/g, " ");
}
