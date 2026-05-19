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

/**
 * تحقق محلي صارم بناءً على مسافة Levenshtein.
 * يقبل فقط الإجابات اللي تطابق الصحيحة (أو أحد بدائلها) مع فروق إملائية بسيطة.
 */
function isCloseMatch(user: string, target: string): boolean {
  const u = normalize(user);
  const t = normalize(target);
  if (!u || !t) return false;
  if (u === t) return true;

  // طول مختلف بأكثر من ٢٠٪ = إجابة مختلفة
  const lenDiff = Math.abs(u.length - t.length);
  const maxLen = Math.max(u.length, t.length);
  if (maxLen > 0 && lenDiff / maxLen > 0.25) return false;

  // مسافة Levenshtein
  const dist = levenshtein(u, t);

  // اقبل فقط لو الفرق صغير جداً نسبة لطول الإجابة:
  // - كلمة قصيرة (≤ 4 أحرف): فرق حرف واحد كحد أقصى
  // - كلمة متوسطة (5-8 أحرف): فرقين كحد أقصى
  // - كلمة طويلة (> 8 أحرف): فرق ١٠٪ كحد أقصى
  const allowed = t.length <= 4 ? 1 : t.length <= 8 ? 2 : Math.floor(t.length * 0.15);
  return dist <= allowed;
}

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // حذف
        dp[i][j - 1] + 1, // إضافة
        dp[i - 1][j - 1] + cost, // إبدال
      );
    }
  }
  return dp[m][n];
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

    const allAcceptable = [correctAnswer, ...acceptableAnswers];

    // التحقق المحلي الصارم - يكفي في معظم الحالات
    const localMatch = allAcceptable.some((target) =>
      isCloseMatch(userAnswer, target),
    );

    if (localMatch) {
      return NextResponse.json<JudgeResponse>({
        isCorrect: true,
        confidence: 1,
        feedback: "إجابة صحيحة!",
      });
    }

    const anthropic = getAnthropic();

    // بدون مفتاح AI: نرفض كل ما لا يطابق محلياً
    if (!anthropic) {
      return NextResponse.json<JudgeResponse>({
        isCorrect: false,
        confidence: 1,
        feedback: "الإجابة غير صحيحة.",
      });
    }

    // مع AI: نسأل عن المرادفات فقط (لا نقبل كلمات مختلفة)
    const systemPrompt = `أنت حكَم صارم في لعبة سؤال وجواب عربية. مهمتك تحديد إذا كانت إجابة اللاعب هي **نفس** الإجابة الصحيحة (أو شكل آخر للكتابة فقط).

🚨 قواعد صارمة:
1. **اقبل** الإجابة فقط إذا كانت:
   - نفس الكلمة بشكل مختلف (إملاء/مرادف صحيح ١٠٠٪)
   - مثال: "ميسي" = "Messi" = "ليونيل ميسي"
   - مثال: "أمريكا" = "الولايات المتحدة"
   - مثال: "البحرين" مكتوبة "بحرين" (بدون ال)

2. **ارفض** الإجابة إذا كانت:
   - كلمة مختلفة تماماً عن الصحيحة (حتى لو متعلقة بالموضوع)
   - مفهوم قريب لكن ليس نفس الإجابة
   - معلومة عن نفس الموضوع لكن ليست الجواب
   - مثال: السؤال "اسم دمية رولز رويس؟" الجواب "روح النشوة"
     ❌ "الملاك" - مرفوضة (كلمة مختلفة)
     ❌ "تمثال" - مرفوضة (وصف عام)
     ✅ "روح النشوة" أو "Spirit of Ecstasy"

3. **انتبه:** إجابتك المرجعية هي القيمة المُعطاة في "correctAnswer" والبدائل في "acceptableAnswers". ما عداهما = رفض.

4. **لا تستنتج** أو تفسّر بشكل واسع. كن دقيقاً.

أعد ردك كـ JSON صرف فقط:
{
  "isCorrect": true/false,
  "confidence": 0.0-1.0,
  "feedback": "سطر واحد قصير - تعليق مختصر"
}`;

    const userPrompt = `السؤال: ${question}
الإجابة الصحيحة: ${correctAnswer}
البدائل المقبولة: ${acceptableAnswers.length > 0 ? acceptableAnswers.join(" / ") : "(لا يوجد بدائل)"}
إجابة اللاعب: ${userAnswer}

هل إجابة اللاعب هي **نفس** الإجابة الصحيحة (أو شكل آخر لكتابتها فقط)؟`;

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
      return NextResponse.json<JudgeResponse>({
        isCorrect: false,
        confidence: 0.5,
        feedback: "تعذّر التحكيم، اعتبرها غلط.",
      });
    }

    const parsed = JSON.parse(jsonMatch[0]) as JudgeResponse;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Judge error:", error);
    return NextResponse.json<JudgeResponse>({
      isCorrect: false,
      confidence: 0,
      feedback: "حدث خطأ في التحكيم.",
    });
  }
}

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[ًٌٍَُِّْ]/g, "") // تشكيل
    .replace(/ـ/g, "") // تطويل
    .replace(/[إأآ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/^ال/, "") // ال التعريف في البداية
    .replace(/[^؀-ۿݐ-ݿa-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
