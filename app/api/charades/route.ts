import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";

interface RequestBody {
  difficulty: 200 | 400 | 600;
  drawMode?: boolean;
  recentlyAsked?: string[];
}

interface CharadesResponse {
  word: string;
  category: string;
  hint?: string;
}

const DIFFICULTY_GUIDE = {
  200: "كلمة شائعة جداً وسهلة (مثل: قطة، سيارة)",
  400: "كلمة متوسطة (مثل: طبيب أسنان، كرة طائرة)",
  600: "كلمة صعبة أو مركّبة (مثل: قطار سريع، عالم فيزياء)",
} as const;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { difficulty, drawMode = false, recentlyAsked = [] } = body;

    const anthropic = getAnthropic();

    if (!anthropic) {
      const fallback: CharadesResponse = {
        word: drawMode ? "بيتزا" : "تمساح",
        category: "حيوانات",
        hint: "[وضع تجريبي]",
      };
      return NextResponse.json(fallback);
    }

    const systemPrompt = `أنت مولّد كلمات للعبة "اشرح بدون كلام" (نمط charades) أو "ارسم وخمن" (نمط pictionary) باللغة العربية.

قواعد:
1. أعطِ كلمة واحدة فقط، تكون فعل أو شيء قابل ${drawMode ? "للرسم" : "للتمثيل"}.
2. الكلمة عربية فصحى مفهومة في كل الدول العربية.
3. تجنّب الكلمات الحساسة أو المسيئة.
4. تجنّب الكلمات المُكررة من القائمة.
5. التصنيف من: حيوانات، مأكولات، أفعال، مهن، رياضات، أفلام مشهورة، أشياء يومية.

أعد JSON صرف:
{
  "word": "الكلمة",
  "category": "التصنيف",
  "hint": "تلميح اختياري قصير (لمن يعرض الكلمة فقط)"
}`;

    const userPrompt = `صعوبة: ${difficulty} (${DIFFICULTY_GUIDE[difficulty]})
النمط: ${drawMode ? "رسم وتخمين (pictionary)" : "تمثيل بدون كلام (charades)"}

${
  recentlyAsked.length > 0
    ? `كلمات مُستبعدة:\n- ${recentlyAsked.slice(-15).join("\n- ")}`
    : ""
}

أعطني كلمة جديدة الآن.`;

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

    const parsed = JSON.parse(jsonMatch[0]) as CharadesResponse;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Charades generation error:", error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 },
    );
  }
}
