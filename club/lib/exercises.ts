import type { Bilingual } from "./i18n";
import type { MuscleId } from "./muscles";

export type Level = "beginner" | "intermediate" | "advanced";

/**
 * A single exercise. Shaped to mirror open-source exercise datasets (name,
 * primary/secondary muscles, equipment, level, instructions) so the full
 * ~800-exercise open dataset can be folded in later without changing the UI.
 */
export interface Exercise {
  id: string;
  name: Bilingual;
  /** Primary muscle the exercise targets. */
  primary: MuscleId;
  /** Secondary muscles worked. */
  secondary: MuscleId[];
  equipment: Bilingual;
  level: Level;
  /** Short step-by-step form cues. */
  steps: { en: string[]; ar: string[] };
}

const E = (
  id: string,
  name: Bilingual,
  primary: MuscleId,
  secondary: MuscleId[],
  equipment: Bilingual,
  level: Level,
  steps: { en: string[]; ar: string[] },
): Exercise => ({ id, name, primary, secondary, equipment, level, steps });

export const EXERCISES: Exercise[] = [
  // ── Chest ─────────────────────────────────────────────────────────────
  E("bench-press", { en: "Barbell Bench Press", ar: "ضغط البار المسطح" }, "chest", ["shoulders", "triceps"],
    { en: "Barbell", ar: "بار" }, "intermediate", {
      en: ["Lie flat, grip slightly wider than shoulders.", "Lower the bar to mid-chest under control.", "Press up until arms are straight without locking hard."],
      ar: ["استلقِ على الظهر وأمسك البار أوسع قليلًا من الكتفين.", "أنزل البار إلى منتصف الصدر بتحكم.", "ادفع لأعلى حتى تستقيم الذراعان دون قفل حاد."],
    }),
  E("incline-db-press", { en: "Incline Dumbbell Press", ar: "ضغط الدمبل المائل" }, "chest", ["shoulders", "triceps"],
    { en: "Dumbbells", ar: "دمبل" }, "beginner", {
      en: ["Set bench to ~30°, dumbbells at chest.", "Press up and slightly together.", "Lower slowly to a deep stretch."],
      ar: ["اضبط المقعد على ~30 درجة والدمبل عند الصدر.", "ادفع لأعلى مع تقريب بسيط.", "أنزل ببطء حتى تمدد عميق."],
    }),
  E("pushup", { en: "Push-Up", ar: "تمرين الضغط" }, "chest", ["shoulders", "triceps", "abs"],
    { en: "Bodyweight", ar: "وزن الجسم" }, "beginner", {
      en: ["Hands under shoulders, body in a straight line.", "Lower chest toward the floor.", "Push back up, keeping core tight."],
      ar: ["اليدان تحت الكتفين والجسم بخط مستقيم.", "أنزل الصدر باتجاه الأرض.", "ادفع لأعلى مع شد البطن."],
    }),
  E("cable-fly", { en: "Cable Chest Fly", ar: "تفتيح الكيبل للصدر" }, "chest", ["shoulders"],
    { en: "Cable", ar: "كيبل" }, "intermediate", {
      en: ["Set pulleys high, slight forward lean.", "Bring handles together in an arc.", "Squeeze the chest, return slowly."],
      ar: ["اضبط البكرات عاليًا مع ميل بسيط للأمام.", "قرّب المقابض بحركة قوسية.", "اعصر الصدر وارجع ببطء."],
    }),

  // ── Shoulders ─────────────────────────────────────────────────────────
  E("ohp", { en: "Overhead Press", ar: "الضغط العلوي" }, "shoulders", ["triceps", "traps"],
    { en: "Barbell", ar: "بار" }, "intermediate", {
      en: ["Bar at collarbone, grip just outside shoulders.", "Press overhead, head through at the top.", "Lower under control to the start."],
      ar: ["البار عند الترقوة والقبضة خارج الكتفين قليلًا.", "ادفع فوق الرأس مع تمرير الرأس للأمام أعلى الحركة.", "أنزل بتحكم إلى البداية."],
    }),
  E("lateral-raise", { en: "Lateral Raise", ar: "الرفرفة الجانبية" }, "shoulders", [],
    { en: "Dumbbells", ar: "دمبل" }, "beginner", {
      en: ["Stand with dumbbells at sides.", "Raise arms out to shoulder height.", "Lower slowly — lead with the elbows."],
      ar: ["قف والدمبل بجانبيك.", "ارفع الذراعين للجانب حتى مستوى الكتف.", "أنزل ببطء مع تقديم المرفقين."],
    }),
  E("face-pull", { en: "Face Pull", ar: "سحب الوجه" }, "shoulders", ["traps", "lats"],
    { en: "Cable", ar: "كيبل" }, "beginner", {
      en: ["Set rope at face height.", "Pull toward your forehead, elbows high.", "Squeeze rear delts, return slowly."],
      ar: ["اضبط الحبل عند مستوى الوجه.", "اسحب باتجاه الجبهة مع رفع المرفقين.", "اعصر الكتف الخلفي وارجع ببطء."],
    }),

  // ── Biceps ────────────────────────────────────────────────────────────
  E("barbell-curl", { en: "Barbell Curl", ar: "مرجحة البار" }, "biceps", ["forearms"],
    { en: "Barbell", ar: "بار" }, "beginner", {
      en: ["Stand, grip the bar shoulder-width.", "Curl up keeping elbows pinned.", "Lower slowly without swinging."],
      ar: ["قف وأمسك البار بعرض الكتفين.", "ارفع مع تثبيت المرفقين.", "أنزل ببطء دون تأرجح."],
    }),
  E("hammer-curl", { en: "Hammer Curl", ar: "مرجحة المطرقة" }, "biceps", ["forearms"],
    { en: "Dumbbells", ar: "دمبل" }, "beginner", {
      en: ["Hold dumbbells with neutral (palms-in) grip.", "Curl up keeping wrists straight.", "Lower under control."],
      ar: ["أمسك الدمبل بقبضة محايدة (الكفان للداخل).", "ارفع مع إبقاء الرسغين مستقيمين.", "أنزل بتحكم."],
    }),
  E("incline-curl", { en: "Incline Dumbbell Curl", ar: "مرجحة الدمبل المائلة" }, "biceps", [],
    { en: "Dumbbells", ar: "دمبل" }, "intermediate", {
      en: ["Sit back on an incline bench, arms hanging.", "Curl up with a strong squeeze.", "Lower to a full stretch."],
      ar: ["اجلس على مقعد مائل والذراعان متدليتان.", "ارفع مع عصر قوي.", "أنزل حتى تمدد كامل."],
    }),

  // ── Triceps ───────────────────────────────────────────────────────────
  E("triceps-pushdown", { en: "Triceps Pushdown", ar: "دفع الترايسبس بالكيبل" }, "triceps", [],
    { en: "Cable", ar: "كيبل" }, "beginner", {
      en: ["Grip the bar, elbows at your sides.", "Push down until arms are straight.", "Return slowly, keep elbows fixed."],
      ar: ["أمسك البار والمرفقان بجانبيك.", "ادفع لأسفل حتى تستقيم الذراعان.", "ارجع ببطء مع تثبيت المرفقين."],
    }),
  E("skullcrusher", { en: "Lying Triceps Extension", ar: "تمديد الترايسبس مستلقيًا" }, "triceps", [],
    { en: "EZ Bar", ar: "بار متعرّج" }, "intermediate", {
      en: ["Lie flat, bar over forehead.", "Bend elbows to lower the bar back.", "Extend up without flaring elbows."],
      ar: ["استلقِ والبار فوق الجبهة.", "اثنِ المرفقين لإنزال البار للخلف.", "مدّ لأعلى دون تفريد المرفقين."],
    }),
  E("dips", { en: "Triceps Dips", ar: "الغطس للترايسبس" }, "triceps", ["chest", "shoulders"],
    { en: "Bodyweight", ar: "وزن الجسم" }, "intermediate", {
      en: ["Support on parallel bars, torso upright.", "Lower until elbows reach ~90°.", "Press back up to lockout."],
      ar: ["استند على متوازيين والجذع منتصب.", "أنزل حتى يصل المرفقان ~90 درجة.", "ادفع لأعلى حتى الاستقامة."],
    }),

  // ── Forearms ──────────────────────────────────────────────────────────
  E("wrist-curl", { en: "Wrist Curl", ar: "ثني الرسغ" }, "forearms", [],
    { en: "Dumbbells", ar: "دمبل" }, "beginner", {
      en: ["Rest forearms on thighs, palms up.", "Curl the wrists upward.", "Lower slowly for a full stretch."],
      ar: ["ضع الساعدين على الفخذين والكفان لأعلى.", "اثنِ الرسغين لأعلى.", "أنزل ببطء لتمدد كامل."],
    }),
  E("farmer-carry", { en: "Farmer's Carry", ar: "حمل المزارع" }, "forearms", ["traps", "abs"],
    { en: "Dumbbells", ar: "دمبل" }, "beginner", {
      en: ["Hold heavy dumbbells at your sides.", "Walk tall with braced core.", "Keep shoulders back the whole way."],
      ar: ["أمسك دمبل ثقيلًا بجانبيك.", "امشِ منتصبًا مع شد البطن.", "أبقِ الكتفين للخلف طوال المسافة."],
    }),

  // ── Abs ───────────────────────────────────────────────────────────────
  E("plank", { en: "Plank", ar: "تمرين البلانك" }, "abs", ["obliques"],
    { en: "Bodyweight", ar: "وزن الجسم" }, "beginner", {
      en: ["Forearms down, body in a straight line.", "Brace the core and glutes.", "Hold without letting hips sag."],
      ar: ["الساعدان على الأرض والجسم بخط مستقيم.", "شدّ البطن والمؤخرة.", "اثبت دون هبوط الورك."],
    }),
  E("hanging-leg-raise", { en: "Hanging Leg Raise", ar: "رفع الأرجل معلقًا" }, "abs", ["obliques"],
    { en: "Pull-up Bar", ar: "عقلة" }, "advanced", {
      en: ["Hang from a bar, legs straight.", "Raise legs to hip height or higher.", "Lower slowly without swinging."],
      ar: ["تعلق على العقلة والساقان مستقيمتان.", "ارفع الساقين حتى مستوى الورك أو أعلى.", "أنزل ببطء دون تأرجح."],
    }),
  E("crunch", { en: "Crunch", ar: "تمرين البطن الكرنش" }, "abs", [],
    { en: "Bodyweight", ar: "وزن الجسم" }, "beginner", {
      en: ["Lie back, knees bent.", "Curl shoulders off the floor.", "Lower with control, don't pull the neck."],
      ar: ["استلقِ والركبتان مثنيتان.", "ارفع الكتفين عن الأرض.", "أنزل بتحكم دون شد الرقبة."],
    }),

  // ── Obliques ──────────────────────────────────────────────────────────
  E("russian-twist", { en: "Russian Twist", ar: "اللف الروسي" }, "obliques", ["abs"],
    { en: "Plate", ar: "وزنة" }, "beginner", {
      en: ["Sit leaning back, feet up.", "Rotate the weight side to side.", "Keep the movement controlled."],
      ar: ["اجلس مائلًا للخلف والقدمان مرفوعتان.", "لف الوزنة من جانب لآخر.", "أبقِ الحركة متحكمًا بها."],
    }),
  E("side-plank", { en: "Side Plank", ar: "البلانك الجانبي" }, "obliques", ["abs"],
    { en: "Bodyweight", ar: "وزن الجسم" }, "beginner", {
      en: ["Lie on your side, prop on one forearm.", "Lift hips into a straight line.", "Hold, then switch sides."],
      ar: ["استلقِ على جانبك مستندًا على ساعد واحد.", "ارفع الورك لخط مستقيم.", "اثبت ثم بدّل الجانب."],
    }),

  // ── Traps ─────────────────────────────────────────────────────────────
  E("shrug", { en: "Dumbbell Shrug", ar: "هز الأكتاف بالدمبل" }, "traps", [],
    { en: "Dumbbells", ar: "دمبل" }, "beginner", {
      en: ["Hold dumbbells at your sides.", "Shrug shoulders straight up.", "Pause, then lower slowly."],
      ar: ["أمسك الدمبل بجانبيك.", "ارفع الكتفين لأعلى مباشرة.", "توقف ثم أنزل ببطء."],
    }),
  E("upright-row", { en: "Upright Row", ar: "السحب العمودي" }, "traps", ["shoulders"],
    { en: "Barbell", ar: "بار" }, "intermediate", {
      en: ["Hold the bar with a narrow grip.", "Pull up toward the chin, elbows high.", "Lower under control."],
      ar: ["أمسك البار بقبضة ضيقة.", "اسحب باتجاه الذقن مع رفع المرفقين.", "أنزل بتحكم."],
    }),

  // ── Lats / Back ───────────────────────────────────────────────────────
  E("pullup", { en: "Pull-Up", ar: "العقلة" }, "lats", ["biceps", "forearms"],
    { en: "Pull-up Bar", ar: "عقلة" }, "advanced", {
      en: ["Hang with an overhand grip.", "Pull chest toward the bar.", "Lower to a full stretch."],
      ar: ["تعلق بقبضة علوية.", "اسحب الصدر باتجاه البار.", "أنزل حتى تمدد كامل."],
    }),
  E("lat-pulldown", { en: "Lat Pulldown", ar: "سحب أمامي علوي" }, "lats", ["biceps"],
    { en: "Cable", ar: "كيبل" }, "beginner", {
      en: ["Grip the bar wide, sit tall.", "Pull to the upper chest.", "Return slowly, control the stretch."],
      ar: ["أمسك البار واسعًا واجلس منتصبًا.", "اسحب لأعلى الصدر.", "ارجع ببطء وتحكم بالتمدد."],
    }),
  E("bent-row", { en: "Bent-Over Row", ar: "التجديف المنحني" }, "lats", ["biceps", "lowerBack"],
    { en: "Barbell", ar: "بار" }, "intermediate", {
      en: ["Hinge forward, flat back.", "Row the bar to your waist.", "Squeeze the back, lower slowly."],
      ar: ["انحنِ للأمام مع ظهر مستقيم.", "جدّف بالبار إلى الخصر.", "اعصر الظهر وأنزل ببطء."],
    }),

  // ── Lower Back ────────────────────────────────────────────────────────
  E("deadlift", { en: "Deadlift", ar: "الرفعة الميتة" }, "lowerBack", ["glutes", "hamstrings", "traps"],
    { en: "Barbell", ar: "بار" }, "advanced", {
      en: ["Bar over mid-foot, flat back.", "Drive through the floor to stand.", "Lock out hips, lower with control."],
      ar: ["البار فوق منتصف القدم والظهر مستقيم.", "ادفع الأرض للوقوف.", "افرد الورك وأنزل بتحكم."],
    }),
  E("back-extension", { en: "Back Extension", ar: "تمديد الظهر" }, "lowerBack", ["glutes", "hamstrings"],
    { en: "Bodyweight", ar: "وزن الجسم" }, "beginner", {
      en: ["Anchor hips on the pad.", "Lower the torso, then raise to neutral.", "Avoid over-arching at the top."],
      ar: ["ثبّت الورك على الوسادة.", "أنزل الجذع ثم ارفع للوضع المحايد.", "تجنب التقوّس الزائد في الأعلى."],
    }),

  // ── Glutes ────────────────────────────────────────────────────────────
  E("hip-thrust", { en: "Hip Thrust", ar: "دفع الورك" }, "glutes", ["hamstrings"],
    { en: "Barbell", ar: "بار" }, "intermediate", {
      en: ["Upper back on a bench, bar over hips.", "Drive hips up, squeeze glutes.", "Lower under control."],
      ar: ["أعلى الظهر على المقعد والبار فوق الورك.", "ادفع الورك لأعلى واعصر المؤخرة.", "أنزل بتحكم."],
    }),
  E("glute-bridge", { en: "Glute Bridge", ar: "جسر المؤخرة" }, "glutes", ["hamstrings"],
    { en: "Bodyweight", ar: "وزن الجسم" }, "beginner", {
      en: ["Lie back, knees bent, feet flat.", "Lift hips to a straight line.", "Squeeze, then lower slowly."],
      ar: ["استلقِ والركبتان مثنيتان والقدمان مسطحتان.", "ارفع الورك لخط مستقيم.", "اعصر ثم أنزل ببطء."],
    }),

  // ── Quads ─────────────────────────────────────────────────────────────
  E("back-squat", { en: "Back Squat", ar: "السكوات الخلفي" }, "quads", ["glutes", "hamstrings", "lowerBack"],
    { en: "Barbell", ar: "بار" }, "advanced", {
      en: ["Bar on upper back, feet shoulder-width.", "Sit down between the hips.", "Drive up through mid-foot."],
      ar: ["البار على أعلى الظهر والقدمان بعرض الكتفين.", "انزل بين الوركين.", "ادفع لأعلى من منتصف القدم."],
    }),
  E("leg-press", { en: "Leg Press", ar: "دفع الأرجل" }, "quads", ["glutes", "hamstrings"],
    { en: "Machine", ar: "جهاز" }, "beginner", {
      en: ["Feet mid-platform, shoulder-width.", "Lower until knees near 90°.", "Press up without locking hard."],
      ar: ["القدمان منتصف المنصة بعرض الكتفين.", "أنزل حتى تقترب الركبتان من 90 درجة.", "ادفع لأعلى دون قفل حاد."],
    }),
  E("lunge", { en: "Walking Lunge", ar: "الطعن المتحرك" }, "quads", ["glutes", "hamstrings"],
    { en: "Dumbbells", ar: "دمبل" }, "intermediate", {
      en: ["Step forward into a lunge.", "Drop the back knee toward the floor.", "Push off and step through."],
      ar: ["اخطُ للأمام في وضع طعن.", "أنزل الركبة الخلفية باتجاه الأرض.", "ادفع وتقدّم بالخطوة التالية."],
    }),

  // ── Hamstrings ────────────────────────────────────────────────────────
  E("romanian-deadlift", { en: "Romanian Deadlift", ar: "الرفعة الرومانية" }, "hamstrings", ["glutes", "lowerBack"],
    { en: "Barbell", ar: "بار" }, "intermediate", {
      en: ["Soft knees, hinge at the hips.", "Slide the bar down the thighs.", "Feel the stretch, then stand tall."],
      ar: ["ركبتان مرنتان والانحناء من الورك.", "مرّر البار على الفخذين للأسفل.", "اشعر بالتمدد ثم قف منتصبًا."],
    }),
  E("leg-curl", { en: "Leg Curl", ar: "ثني الأرجل" }, "hamstrings", ["calves"],
    { en: "Machine", ar: "جهاز" }, "beginner", {
      en: ["Lie/sit on the machine, pad on calves.", "Curl the heels toward the glutes.", "Lower slowly with control."],
      ar: ["استلقِ/اجلس على الجهاز والوسادة على السمانة.", "اثنِ الكعبين باتجاه المؤخرة.", "أنزل ببطء وتحكم."],
    }),

  // ── Calves ────────────────────────────────────────────────────────────
  E("standing-calf-raise", { en: "Standing Calf Raise", ar: "رفع السمانة واقفًا" }, "calves", [],
    { en: "Machine", ar: "جهاز" }, "beginner", {
      en: ["Balls of feet on the platform.", "Rise onto your toes fully.", "Lower to a deep stretch."],
      ar: ["مقدمة القدمين على المنصة.", "ارتفع على أطراف الأصابع بالكامل.", "أنزل حتى تمدد عميق."],
    }),
  E("seated-calf-raise", { en: "Seated Calf Raise", ar: "رفع السمانة جالسًا" }, "calves", [],
    { en: "Machine", ar: "جهاز" }, "beginner", {
      en: ["Pad on lower thighs, balls of feet on platform.", "Raise the heels as high as possible.", "Lower slowly for a stretch."],
      ar: ["الوسادة على أسفل الفخذين ومقدمة القدمين على المنصة.", "ارفع الكعبين لأعلى ما يمكن.", "أنزل ببطء لتمدد."],
    }),
];

/** All exercises that train the given muscle (as primary or secondary). */
export function exercisesForMuscle(muscle: MuscleId): Exercise[] {
  const primary = EXERCISES.filter((e) => e.primary === muscle);
  const secondary = EXERCISES.filter((e) => e.primary !== muscle && e.secondary.includes(muscle));
  return [...primary, ...secondary];
}
