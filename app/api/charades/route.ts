import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { fetchTopicImage } from "@/lib/images";

export const runtime = "nodejs";

interface RequestBody {
  difficulty: 200 | 400 | 600;
  categoryId?: string;
  recentlyAsked?: string[];
}

interface CharadesResponse {
  word: string;
  category: string;
  englishName: string;
  imageUrl: string | null;
  instructions: string; // إرشادات للممثل
}

// قواعد التوليد حسب نوع اللعبة
const GAME_RULES: Record<
  string,
  {
    title: string;
    instructions: (difficulty: number) => string;
    examples: { 200: string; 400: string; 600: string };
    needsImage: boolean;
    categories: { 200: string[]; 400: string[]; 600: string[] };
  }
> = {
  charades: {
    title: "اشرح بدون كلام",
    instructions: () =>
      "مثّل الكلمة بدون أي صوت أو كلمة. الباقي يخمّنون.",
    examples: {
      200: "تمساح، بيتزا، كرة قدم، طائرة",
      400: "ميسي، عنكبوت سبايدرمان، تحلب بقرة، تشاهد فيلم رعب",
      600: "برج إيفل، الذكاء الاصطناعي، طبيب يجري عملية، رائد فضاء",
    },
    needsImage: true,
    categories: {
      200: ["حيوانات مألوفة", "أكلات شائعة", "رياضات", "أدوات يومية", "ألعاب"],
      400: ["مشاهير معروفين", "أفلام شهيرة", "مهن", "تصرفات يومية مضحكة", "حيوانات تفعل أشياء"],
      600: ["معالم سياحية عالمية", "مفاهيم مجردة", "شخصيات تاريخية", "اختراعات", "مهن دقيقة"],
    },
  },
  imitation: {
    title: "محاكاة المشاهير",
    instructions: () =>
      "قلّد صوت/طريقة كلام هذا الشخص بدون ذكر اسمه. الباقي يخمّنون.",
    examples: {
      200: "محمد عبده، عمرو دياب، فيروز",
      400: "ميسي، ترامب، عبدالباري عطوان",
      600: "أينشتاين، شكسبير، نابليون",
    },
    needsImage: true,
    categories: {
      200: ["مغنين عرب مشهورين", "ممثلين كوميديين"],
      400: ["رياضيين عالميين", "سياسيين", "إعلاميين"],
      600: ["شخصيات تاريخية", "علماء", "قادة عسكريين"],
    },
  },
  two_words: {
    title: "احزرني بكلمتين",
    instructions: () =>
      "وصف الكلمة باستخدام كلمتين فقط (ممنوع ذكر اسمها أو مرادفاتها).",
    examples: {
      200: "بحر، نار، كتاب",
      400: "ساعة ذكية، صديق طفولة",
      600: "ذكاء اصطناعي، طبق طائر",
    },
    needsImage: false,
    categories: {
      200: ["أشياء بسيطة", "أماكن مألوفة", "أشياء طبيعية"],
      400: ["مفاهيم متوسطة", "أشياء مركبة"],
      600: ["مفاهيم مجردة", "اختراعات حديثة"],
    },
  },
};

const TIME_BY_DIFFICULTY = { 200: 90, 400: 50, 600: 30 } as const;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { difficulty, categoryId = "charades", recentlyAsked = [] } = body;

    const rules = GAME_RULES[categoryId] ?? GAME_RULES.charades;
    const anthropic = getAnthropic();

    if (!anthropic) {
      return NextResponse.json<CharadesResponse>({
        word: rules.examples[difficulty].split("،")[0],
        englishName: "Example",
        category: rules.title,
        instructions: rules.instructions(difficulty),
        imageUrl: null,
      });
    }

    const systemPrompt = `أنت مولّد محتوى للعبة جماعية عربية اسمها "${rules.title}".

📋 طبيعة اللعبة:
${rules.instructions(difficulty)}

🎯 الصعوبة الحالية: ${difficulty}
${difficulty === 200 ? "(سهل جداً، يعرفه ٩٠٪ من الناس)" : ""}
${difficulty === 400 ? "(متوسط، يحتاج معرفة جيدة)" : ""}
${difficulty === 600 ? "(صعب، للمحترفين فقط)" : ""}

⏱️ الوقت المتاح: ${TIME_BY_DIFFICULTY[difficulty]} ثانية

📂 التصنيفات المسموحة لهذي الصعوبة:
${rules.categories[difficulty].map((c, i) => `${i + 1}. ${c}`).join("\n")}

✨ أمثلة على المستوى المطلوب:
${rules.examples[difficulty]}

📐 القواعد:
1. الكلمة/التحدي ممتع ومشوق، يفجّر الضحك أو الحماس.
2. مناسب للجمعات العائلية والأصدقاء (بدون إساءة).
3. يتجنب التكرار من القائمة المُعطاة.
4. إذا كانت اللعبة "تحدي بدني" - يكون قابل للتنفيذ ومضحك.
5. ${
      rules.needsImage
        ? "اذكر اسم بالإنجليزية للبحث عن صورة في ويكيبيديا."
        : "لا حاجة لاسم إنجليزي."
    }

أعد JSON صرف فقط:
{
  "word": "${rules.needsImage ? "الكلمة بالعربي" : "نص التحدي/الوصف"}",
  "englishName": "${rules.needsImage ? "النسخة الإنجليزية للبحث" : "Same"}",
  "category": "نوع التصنيف اللي اخترته"
}`;

    const userPrompt = `أعطني محتوى جديد بصعوبة ${difficulty} - شي ممتع ومثير للضحك.

${
  recentlyAsked.length > 0
    ? `مُستبعد (لا تكرر):\n- ${recentlyAsked.slice(-20).join("\n- ")}`
    : ""
}`;

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
      return NextResponse.json(
        { error: "Failed to parse" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as Omit<
      CharadesResponse,
      "imageUrl" | "instructions"
    >;

    let imageUrl: string | null = null;
    if (rules.needsImage && parsed.englishName) {
      imageUrl = await fetchTopicImage(parsed.englishName, parsed.word);
    }

    return NextResponse.json<CharadesResponse>({
      ...parsed,
      imageUrl,
      instructions: rules.instructions(difficulty),
    });
  } catch (error) {
    console.error("Charades generation error:", error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 },
    );
  }
}
