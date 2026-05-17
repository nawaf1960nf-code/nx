/* Bloom — exercise library, programs, achievements, motivational copy */

const BLOOM_DATA = (function () {

  /* ── EXERCISE LIBRARY ─────────────────────────────────
     Each exercise focuses on women's training goals:
     glutes, hamstrings, quads, back, shoulders, core. */
  const EXERCISES = [
    // ── GLUTES ──
    { id: 'hip-thrust',    name: 'Hip Thrust',           nameAr: 'دفع الورك',           target: 'Glutes', emoji: '🍑', muscle: 'glutes',
      tips: ['Drive through heels', 'Squeeze glutes hard at top', 'Keep ribs tucked'],
      mistakes: ['Overarching lower back', 'Pushing through toes', 'Going too heavy too soon'],
      women: ['Best glute builder for women', 'Focus on mind-muscle connection', 'Pause 1s at the top'],
      alts: ['Glute Bridge', 'Single-leg Hip Thrust'] },

    { id: 'glute-bridge',  name: 'Glute Bridge',         nameAr: 'جسر المؤخرة',         target: 'Glutes', emoji: '🌸', muscle: 'glutes',
      tips: ['Push hips upward', 'Hold and squeeze 2s', 'Keep neck relaxed'],
      mistakes: ['Letting knees cave inward', 'Not fully extending hips'],
      women: ['Great warm-up', 'Activates glutes before squats'],
      alts: ['Hip Thrust', 'Single-leg Bridge'] },

    { id: 'rdl',           name: 'Romanian Deadlift',     nameAr: 'الرفعة الرومانية',    target: 'Hamstrings & Glutes', emoji: '🌹', muscle: 'hamstrings',
      tips: ['Hinge from hips, not knees', 'Bar travels close to legs', 'Feel hamstring stretch'],
      mistakes: ['Rounding back', 'Squatting it down', 'Locking knees'],
      women: ['Builds the back of legs beautifully', 'Improves posture'],
      alts: ['Dumbbell RDL', 'Single-leg RDL'] },

    { id: 'bulgarian',     name: 'Bulgarian Split Squat', nameAr: 'سكوات بلغاري',        target: 'Glutes & Quads', emoji: '🌷', muscle: 'glutes',
      tips: ['Lean slightly forward', 'Push through front heel', 'Control descent'],
      mistakes: ['Front knee caving', 'Bouncing at bottom'],
      women: ['Targets each leg individually', 'Fixes imbalances'],
      alts: ['Lunges', 'Reverse Lunge'] },

    { id: 'cable-kickback', name: 'Cable Kickback',       nameAr: 'سحب الكابل للخلف',    target: 'Glutes', emoji: '✨', muscle: 'glutes',
      tips: ['Keep core tight', 'Squeeze at top', 'Slow eccentric'],
      mistakes: ['Using lower back', 'Swinging the leg'],
      women: ['Isolates the glute', 'Perfect for finisher sets'],
      alts: ['Donkey Kicks', 'Glute Kickback Machine'] },

    // ── LEGS ──
    { id: 'squat',         name: 'Back Squat',            nameAr: 'سكوات خلفي',          target: 'Quads & Glutes', emoji: '👑', muscle: 'quads',
      tips: ['Feet shoulder-width', 'Sit back and down', 'Chest up'],
      mistakes: ['Heels coming up', 'Knees caving inward', 'Going too low without mobility'],
      women: ['The queen of leg exercises', 'Builds strength + curves'],
      alts: ['Goblet Squat', 'Leg Press'] },

    { id: 'leg-press',     name: 'Leg Press',             nameAr: 'ضغط الأرجل',          target: 'Quads & Glutes', emoji: '💪', muscle: 'quads',
      tips: ['Feet placement = focus muscle', 'Don\'t lock knees at top', 'Full range of motion'],
      mistakes: ['Lifting hips off pad', 'Quarter reps'],
      women: ['Higher foot placement = more glutes', 'Safer than squats for beginners'],
      alts: ['Squat', 'Hack Squat'] },

    { id: 'leg-curl',      name: 'Leg Curl',              nameAr: 'ثني الأرجل',          target: 'Hamstrings', emoji: '🌺', muscle: 'hamstrings',
      tips: ['Squeeze hamstring at top', 'Slow on the way down', 'Point toes for max contraction'],
      mistakes: ['Lifting hips', 'Using momentum'],
      women: ['Beautiful hamstring shape', 'Pair with RDLs'],
      alts: ['Nordic Curls', 'Stability Ball Curl'] },

    { id: 'walking-lunge', name: 'Walking Lunge',         nameAr: 'الاندفاع',            target: 'Legs & Glutes', emoji: '🚶‍♀️', muscle: 'quads',
      tips: ['Long step forward', 'Drop back knee toward floor', 'Push off front heel'],
      mistakes: ['Stepping too short', 'Letting front knee go past toes too far'],
      women: ['Burns + tones', 'Great cardio component'],
      alts: ['Reverse Lunge', 'Stationary Lunge'] },

    // ── BACK ──
    { id: 'lat-pulldown',  name: 'Lat Pulldown',          nameAr: 'سحب علوي',            target: 'Back & Biceps', emoji: '🦋', muscle: 'back',
      tips: ['Pull elbows to ribs', 'Squeeze shoulder blades', 'Don\'t use momentum'],
      mistakes: ['Pulling behind neck', 'Using too much arm'],
      women: ['Sculpts the V-shape', 'Improves posture'],
      alts: ['Pull-ups', 'Assisted Pull-ups'] },

    { id: 'seated-row',    name: 'Seated Cable Row',      nameAr: 'تجديف جالس',          target: 'Back', emoji: '🌊', muscle: 'back',
      tips: ['Sit tall', 'Pull to belly button', 'Squeeze 1s'],
      mistakes: ['Rocking back too much', 'Rounding shoulders'],
      women: ['Tightens the upper back', 'Fights desk posture'],
      alts: ['Dumbbell Row', 'Bent-over Row'] },

    { id: 'db-row',        name: 'Dumbbell Row',          nameAr: 'تجديف بالدمبل',       target: 'Back', emoji: '🌟', muscle: 'back',
      tips: ['Flat back', 'Pull elbow to hip', 'Squeeze lat at top'],
      mistakes: ['Twisting torso', 'Pulling with arm only'],
      women: ['Unilateral = balanced back', 'Stable & beginner-friendly'],
      alts: ['Cable Row', 'T-bar Row'] },

    { id: 'face-pull',     name: 'Face Pull',             nameAr: 'سحب للوجه',           target: 'Rear Delts & Back', emoji: '🦢', muscle: 'shoulders',
      tips: ['Pull rope to face', 'Elbows high', 'Hold and squeeze'],
      mistakes: ['Too heavy too fast', 'Shrugging shoulders'],
      women: ['Posture lifesaver', 'Sculpts shoulders beautifully'],
      alts: ['Rear Delt Fly', 'Band Pull-apart'] },

    // ── SHOULDERS ──
    { id: 'shoulder-press', name: 'Shoulder Press',       nameAr: 'ضغط الأكتاف',         target: 'Shoulders', emoji: '⭐', muscle: 'shoulders',
      tips: ['Press straight up', 'Core tight', 'Don\'t flare elbows'],
      mistakes: ['Arching lower back', 'Going too heavy'],
      women: ['Builds beautiful shoulders', 'Pairs with lateral raise'],
      alts: ['Dumbbell Press', 'Arnold Press'] },

    { id: 'lateral-raise', name: 'Lateral Raise',         nameAr: 'رفع جانبي',           target: 'Shoulders', emoji: '🦋', muscle: 'shoulders',
      tips: ['Slight bend in elbows', 'Lift to shoulder height', 'Lead with pinky'],
      mistakes: ['Going too heavy', 'Shrugging at the top'],
      women: ['Creates that sculpted shoulder look', 'Hourglass illusion'],
      alts: ['Cable Lateral Raise', 'Machine Lateral'] },

    // ── CHEST ──
    { id: 'chest-press',   name: 'Chest Press',           nameAr: 'ضغط الصدر',           target: 'Chest', emoji: '💖', muscle: 'chest',
      tips: ['Squeeze chest', 'Full range', 'Control negative'],
      mistakes: ['Half reps', 'Locking out hard'],
      women: ['Lifts and shapes the chest', 'Great for posture'],
      alts: ['Push-ups', 'Dumbbell Press'] },

    { id: 'pushup',        name: 'Push-up',               nameAr: 'الضغط',               target: 'Chest & Triceps', emoji: '🌹', muscle: 'chest',
      tips: ['Straight line head to heels', 'Lower chest to floor', 'Squeeze on the way up'],
      mistakes: ['Sagging hips', 'Flaring elbows wide'],
      women: ['Bodyweight queen', 'Anywhere, anytime'],
      alts: ['Incline Push-up', 'Knee Push-up'] },

    // ── ARMS ──
    { id: 'bicep-curl',    name: 'Bicep Curl',            nameAr: 'تمرين البايسبس',      target: 'Biceps', emoji: '💪', muscle: 'arms',
      tips: ['Elbows tucked', 'Squeeze at top', 'Slow descent'],
      mistakes: ['Swinging', 'Half range'],
      women: ['Toned arms in tank tops', 'Confidence boost'],
      alts: ['Hammer Curl', 'Cable Curl'] },

    { id: 'tricep-pushdown', name: 'Tricep Pushdown',      nameAr: 'ضغط ترايسبس',         target: 'Triceps', emoji: '✨', muscle: 'arms',
      tips: ['Elbows pinned', 'Full extension', 'Squeeze at bottom'],
      mistakes: ['Elbows flaring out', 'Leaning into the weight'],
      women: ['Tightens the back of arms', 'Bye-bye bingo wings'],
      alts: ['Overhead Extension', 'Skullcrushers'] },

    // ── CORE ──
    { id: 'plank',         name: 'Plank',                 nameAr: 'بلانك',                target: 'Core', emoji: '🌟', muscle: 'core',
      tips: ['Straight line', 'Squeeze glutes', 'Breathe'],
      mistakes: ['Hips sagging or piking', 'Holding breath'],
      women: ['Whole-body strength', 'Snatched waist'],
      alts: ['Side Plank', 'Forearm Plank'] },

    { id: 'crunch',        name: 'Cable Crunch',          nameAr: 'كرنش بالكابل',         target: 'Core', emoji: '💎', muscle: 'core',
      tips: ['Round the spine', 'Pull belly to spine', 'Slow and controlled'],
      mistakes: ['Using hip flexors', 'Pulling with arms'],
      women: ['Defined midsection', 'Heavy-weighted = real results'],
      alts: ['Crunches', 'Sit-ups'] },

    { id: 'leg-raise',     name: 'Hanging Leg Raise',     nameAr: 'رفع الأرجل معلق',     target: 'Lower Abs', emoji: '🌙', muscle: 'core',
      tips: ['Curl pelvis up', 'No swinging', 'Slow descent'],
      mistakes: ['Just lifting legs', 'Using momentum'],
      women: ['Lower belly killer', 'Strong + flat'],
      alts: ['Lying Leg Raise', 'Knee Tucks'] },
  ];

  /* ── DEFAULT PROGRAM ───────────────────────────────────
     A 5-day women-focused split with progressive overload.
     Day 1: Glutes & Hams
     Day 2: Back & Biceps
     Day 3: Quads & Calves
     Day 4: Shoulders & Arms
     Day 5: Full Body Burn
     Day 6/7: Rest */
  const DEFAULT_PROGRAM = {
    id: 'glow-up-5',
    name: 'Glow Up Strength',
    nameAr: 'برنامج التوهّج',
    description: '5-day premium split designed for women — sculpt glutes, build a strong back, and feel amazing.',
    descriptionAr: 'برنامج ٥ أيام فاخر مصمّم للنساء — لنحت المؤخرة، تقوية الظهر، والإحساس بالقوة.',
    days: [
      { id: 'd1', name: 'Glutes & Hamstrings', nameAr: 'مؤخرة و خلف الفخذ', emoji: '🍑',
        focus: ['glutes','hamstrings'],
        exercises: [
          { exerciseId: 'hip-thrust',     sets: 4, reps: 10, weight: 30 },
          { exerciseId: 'rdl',            sets: 4, reps: 10, weight: 25 },
          { exerciseId: 'bulgarian',      sets: 3, reps: 12, weight: 8 },
          { exerciseId: 'cable-kickback', sets: 3, reps: 15, weight: 10 },
          { exerciseId: 'leg-curl',       sets: 3, reps: 12, weight: 20 },
        ]
      },
      { id: 'd2', name: 'Back & Biceps', nameAr: 'ظهر و بايسبس', emoji: '🦋',
        focus: ['back','arms'],
        exercises: [
          { exerciseId: 'lat-pulldown',  sets: 4, reps: 10, weight: 25 },
          { exerciseId: 'seated-row',    sets: 4, reps: 10, weight: 25 },
          { exerciseId: 'db-row',        sets: 3, reps: 10, weight: 10 },
          { exerciseId: 'face-pull',     sets: 3, reps: 15, weight: 12 },
          { exerciseId: 'bicep-curl',    sets: 3, reps: 12, weight: 6 },
        ]
      },
      { id: 'd3', name: 'Quads & Calves', nameAr: 'أمام الفخذ والسمانة', emoji: '👑',
        focus: ['quads'],
        exercises: [
          { exerciseId: 'squat',         sets: 4, reps: 8,  weight: 30 },
          { exerciseId: 'leg-press',     sets: 4, reps: 12, weight: 60 },
          { exerciseId: 'walking-lunge', sets: 3, reps: 12, weight: 8 },
          { exerciseId: 'leg-curl',      sets: 3, reps: 12, weight: 20 },
        ]
      },
      { id: 'd4', name: 'Shoulders & Arms', nameAr: 'أكتاف و أذرع', emoji: '⭐',
        focus: ['shoulders','arms'],
        exercises: [
          { exerciseId: 'shoulder-press',   sets: 4, reps: 10, weight: 6 },
          { exerciseId: 'lateral-raise',    sets: 4, reps: 12, weight: 4 },
          { exerciseId: 'face-pull',        sets: 3, reps: 15, weight: 12 },
          { exerciseId: 'bicep-curl',       sets: 3, reps: 12, weight: 6 },
          { exerciseId: 'tricep-pushdown',  sets: 3, reps: 12, weight: 12 },
        ]
      },
      { id: 'd5', name: 'Full Body Burn', nameAr: 'حرق كامل الجسم', emoji: '🔥',
        focus: ['glutes','core','back'],
        exercises: [
          { exerciseId: 'hip-thrust',    sets: 3, reps: 12, weight: 25 },
          { exerciseId: 'lat-pulldown',  sets: 3, reps: 12, weight: 22 },
          { exerciseId: 'shoulder-press',sets: 3, reps: 10, weight: 6 },
          { exerciseId: 'plank',         sets: 3, reps: 1,  weight: 0, time: 45 },
          { exerciseId: 'leg-raise',     sets: 3, reps: 12, weight: 0 },
        ]
      },
      { id: 'r1', name: 'Rest', nameAr: 'راحة', emoji: '🌙', rest: true, exercises: [] },
      { id: 'r2', name: 'Rest', nameAr: 'راحة', emoji: '🌙', rest: true, exercises: [] },
    ]
  };

  /* ── ACHIEVEMENT BADGES ─── */
  const BADGES = [
    { id: 'first-workout',  name: 'First Step',          nameAr: 'الخطوة الأولى',  desc: 'Complete your first workout',     descAr: 'أكملي أول تمرين',     icon: '🌱', color: 1, req: s => s.totalWorkouts >= 1 },
    { id: 'streak-3',       name: 'On Fire',             nameAr: 'مشتعلة',         desc: '3-day workout streak',            descAr: 'سلسلة ٣ أيام',         icon: '🔥', color: 1, req: s => s.streak >= 3 },
    { id: 'streak-7',       name: 'Week Warrior',        nameAr: 'محاربة الأسبوع', desc: '7-day workout streak',            descAr: 'سلسلة ٧ أيام',         icon: '👑', color: 4, req: s => s.streak >= 7 },
    { id: 'streak-30',      name: 'Diamond Queen',       nameAr: 'ملكة الألماس',  desc: '30-day workout streak',           descAr: 'سلسلة ٣٠ يوم',         icon: '💎', color: 4, req: s => s.streak >= 30 },
    { id: 'volume-1000',    name: 'Strong Girl',         nameAr: 'فتاة قوية',     desc: 'Lift 1,000 kg total volume',      descAr: 'ارفعي ١٠٠٠ كجم إجمالي', icon: '💪', color: 2, req: s => s.totalVolume >= 1000 },
    { id: 'volume-10000',   name: 'Iron Lady',           nameAr: 'سيدة الحديد',   desc: 'Lift 10,000 kg total volume',     descAr: 'ارفعي ١٠٬٠٠٠ كجم',    icon: '⚙️', color: 2, req: s => s.totalVolume >= 10000 },
    { id: 'first-pr',       name: 'New PR',              nameAr: 'رقم قياسي جديد', desc: 'Set your first personal record',  descAr: 'سجّلي أول رقم قياسي',  icon: '🏆', color: 3, req: s => s.totalPRs >= 1 },
    { id: 'pr-10',          name: 'Record Breaker',      nameAr: 'كاسرة الأرقام', desc: 'Hit 10 personal records',         descAr: '١٠ أرقام قياسية',     icon: '🏅', color: 3, req: s => s.totalPRs >= 10 },
    { id: 'workouts-10',    name: 'Committed',           nameAr: 'ملتزمة',        desc: '10 workouts completed',           descAr: '١٠ تمارين مكتملة',     icon: '🌸', color: 1, req: s => s.totalWorkouts >= 10 },
    { id: 'workouts-50',    name: 'Glow Up',             nameAr: 'توهّج',          desc: '50 workouts completed',           descAr: '٥٠ تمرين مكتمل',       icon: '✨', color: 3, req: s => s.totalWorkouts >= 50 },
    { id: 'workouts-100',   name: 'Goddess Mode',        nameAr: 'وضع الإلهة',    desc: '100 workouts completed',          descAr: '١٠٠ تمرين مكتمل',     icon: '🌟', color: 4, req: s => s.totalWorkouts >= 100 },
    { id: 'mood-tracker',   name: 'Self Aware',          nameAr: 'واعية لذاتك',   desc: 'Log mood 7 times',                descAr: 'سجّلي مزاجك ٧ مرات',  icon: '🌷', color: 1, req: s => s.moodLogs >= 7 },
  ];

  /* ── XP / LEVELS ─── */
  const LEVELS = [
    { lvl: 1,  name: 'Spark',          nameAr: 'شرارة',          xp: 0 },
    { lvl: 2,  name: 'Petal',          nameAr: 'بتلة',           xp: 100 },
    { lvl: 3,  name: 'Bloom',          nameAr: 'تفتّح',          xp: 250 },
    { lvl: 4,  name: 'Rose',           nameAr: 'وردة',           xp: 500 },
    { lvl: 5,  name: 'Queen',          nameAr: 'ملكة',           xp: 900 },
    { lvl: 6,  name: 'Strong Girl',    nameAr: 'قوية',           xp: 1400 },
    { lvl: 7,  name: 'Iron Rose',      nameAr: 'وردة فولاذية',  xp: 2000 },
    { lvl: 8,  name: 'Diamond',        nameAr: 'ألماسة',         xp: 2800 },
    { lvl: 9,  name: 'Goddess',        nameAr: 'إلهة',           xp: 4000 },
    { lvl: 10, name: 'Bloom Legend',   nameAr: 'أسطورة',         xp: 6000 },
  ];

  /* ── MOTIVATIONAL MESSAGES ─── */
  const MOTIVATION = {
    workoutDone: {
      en: [
        "Proud of you queen 👑",
        "You showed up — that's everything ✨",
        "Stronger than yesterday 💪",
        "You're glowing 🌸",
        "Look at you, becoming her 💖",
        "Another step toward the woman you're meant to be 🌹",
        "Inhale strength, exhale doubt 🌟",
        "You owned that session 🔥",
      ],
      ar: [
        "فخورة فيكِ يا ملكة 👑",
        "حضرتِ — وذا أهم شيء ✨",
        "أقوى من أمس 💪",
        "متوهّجة 🌸",
        "شوفي حالك، صرتي هي 💖",
        "خطوة جديدة نحو المرأة الي تستحقيها 🌹",
        "استنشقي القوة، ازفري الشك 🌟",
        "كسرتي الجلسة 🔥",
      ]
    },
    prHit: {
      en: ["NEW PR UNLOCKED 🎉","You broke your record!","Stronger than ever 💪","Look at you go 🌟","Iconic 👑"],
      ar: ["رقم قياسي جديد 🎉","كسرتي رقمك!","أقوى من أي وقت 💪","ولا أروع 🌟","أيقونية 👑"]
    },
    quotes: {
      en: [
        "Discipline is the highest form of self-love.",
        "She believed she could, so she did.",
        "Your body hears everything your mind says.",
        "Strong is the new beautiful.",
        "You're allowed to take up space.",
        "Show up for her — the future you.",
        "Every rep is a love letter to your body.",
        "Soft heart, strong body.",
      ],
      ar: [
        "الانضباط هو أرقى أشكال حب الذات.",
        "آمنت أنها تستطيع، ففعلت.",
        "جسدك يسمع كل ما يقوله عقلك.",
        "القوة هي الجمال الجديد.",
        "من حقّك أن تأخذي مساحتك.",
        "اعملي لأجلها — أنتِ المستقبل.",
        "كل تكرار هو رسالة حب لجسدك.",
        "قلب رقيق، جسد قوي.",
      ]
    }
  };

  /* ── MOODS ─── */
  const MOODS = [
    { id: 'low',     emoji: '😔', en: 'Low',     ar: 'منخفض'  },
    { id: 'tired',   emoji: '😴', en: 'Tired',   ar: 'متعبة' },
    { id: 'okay',    emoji: '🙂', en: 'Okay',    ar: 'عادي'  },
    { id: 'good',    emoji: '😊', en: 'Good',    ar: 'ممتاز' },
    { id: 'amazing', emoji: '🤩', en: 'Amazing', ar: 'رائع'  },
  ];

  /* helpers */
  function findExercise(id){ return EXERCISES.find(e => e.id === id); }
  function levelForXp(xp){
    let cur = LEVELS[0];
    for (let i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i].xp <= xp) cur = LEVELS[i];
    }
    const next = LEVELS.find(l => l.xp > xp) || null;
    return { current: cur, next, pct: next ? Math.min(100, Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100)) : 100 };
  }

  return { EXERCISES, DEFAULT_PROGRAM, BADGES, LEVELS, MOTIVATION, MOODS, findExercise, levelForXp };
})();
