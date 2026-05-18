import type { Hook } from "./types";

// وسائل المساعدة (الهوكات) في لعبة نون عين
export const HOOKS: Hook[] = [
  {
    id: "trap",
    name: "الفخ",
    description:
      "ما عرفت الجواب؟ عط السؤال للفريق الثاني! وإذا جاوب غلط ينقص نقاط السؤال من حسابه.",
    icon: "💣",
    timing: "after_question",
    color: "#e53935",
  },
  {
    id: "rest",
    name: "استريح",
    description:
      "اختار أكثر شخص مثقف في الفريق الثاني، وخله يستريح عن المشاركة في إجابة هذا السؤال.",
    icon: "✋",
    timing: "after_question",
    color: "#7c4dff",
  },
  {
    id: "call_friend",
    name: "اتصال بصديق",
    description: "صديقك اللي يعرف كل شي؟ هذا وقته، دق عليه!",
    icon: "📞",
    timing: "after_question",
    color: "#00c853",
  },
  {
    id: "pit",
    name: "الحفرة",
    description:
      "احفر لهم! جاوب صح، واخصم عدد النقاط اللي فزت فيها من نقاط الفريق الثاني.",
    icon: "🕳️",
    timing: "before_question",
    color: "#ff6f00",
  },
  {
    id: "double_answer",
    name: "جاوب جوابين",
    description:
      "متردد بين جوابين؟ هذي لك. جاوب بالاثنين عشان تضمن النقاط، أحد الجوابين كافي.",
    icon: "✌️",
    timing: "after_question",
    color: "#2196f3",
  },
  {
    id: "lock",
    name: "القفل",
    description:
      "اقفل وسيلة مساعدة على الفريق الثاني! ما يقدر يستخدمها في هذه الجولة.",
    icon: "🔒",
    timing: "before_question",
    color: "#455a64",
  },
  {
    id: "steal",
    name: "السرقة",
    description:
      "لو جاوب الفريق الثاني غلط، نقاط السؤال تروح لك بدلاً ما تختفي.",
    icon: "🦹",
    timing: "before_question",
    color: "#9c27b0",
  },
  {
    id: "ai_hint",
    name: "تلميح ذكي",
    description: "الذكاء الاصطناعي يعطيك تلميحاً ذكياً بدون ما يكشف الإجابة.",
    icon: "🤖",
    timing: "after_question",
    color: "#00acc1",
  },
  {
    id: "double_challenge",
    name: "التحدي المزدوج",
    description:
      "الفريقان يجاوبان بنفس الوقت! اللي يجاوب أول وصح يأخذ النقاط × 2.",
    icon: "⚔️",
    timing: "before_question",
    color: "#d50000",
  },
  {
    id: "multiplier",
    name: "المضاعف",
    description: "ضاعف نقاط هذا السؤال × 3 (لكن إذا غلطت تخسر × 3).",
    icon: "⭐",
    timing: "before_question",
    color: "#ffb300",
  },
  {
    id: "switch",
    name: "التبديل",
    description: "ما عجبك السؤال؟ بدّله بسؤال آخر من نفس الفئة بدون عقوبة.",
    icon: "🔄",
    timing: "after_question",
    color: "#3949ab",
  },
];

export const HOOK_BY_ID = HOOKS.reduce<Record<string, Hook>>((acc, hook) => {
  acc[hook.id] = hook;
  return acc;
}, {});

export const HOOKS_PER_TEAM = 4;
