import type { Chapter, Difficulty, TopicId } from "./types";

export type Locale = "en" | "ar";

/**
 * UI translation dictionary. English is the source of truth (`en`); the
 * Arabic object (`ar`) must match its shape exactly (enforced via the
 * `Messages` type derived from `en`).
 *
 * Note: the 132 exam questions themselves remain in English because the
 * Services Marketing terminology in the course slides is English; only the
 * interface chrome is translated here.
 */
const en = {
  dir: "ltr" as const,
  langName: "English",
  switchTo: "العربية",

  nav: {
    home: "Home",
    study: "Study Mode",
    dashboard: "Dashboard",
    brand: "Services Marketing",
    brandSub: "Exam Platform",
  },

  ai: {
    live: "AI Engine: Live",
    offline: "AI Engine: Smart Offline Mode",
  },

  hero: {
    badge: "AI-Powered Learning · Chapters 4 · 7 · 8 · 10 · 11",
    titleA: "Master",
    titleHighlight: "Services Marketing",
    titleB: "with intelligent exams",
    subtitle:
      "An interactive, AI-driven platform that generates fresh exams every attempt, explains every answer, and adapts to exactly where you need to improve — from the Flower of Service to the Cycle of Success.",
    chooseLevel: "Choose your level",
    tryStudy: "Try Study Mode",
  },

  levelsSection: {
    heading: "Choose your challenge",
    subtitle: "Three carefully calibrated difficulty levels. Each exam is 30 questions.",
  },

  features: {
    heading: "More than a quiz — a smart tutor",
    subtitle: "Everything you need to go from memorising to mastering.",
    items: [
      { title: "AI Question Generation", desc: "Fresh, syllabus-grounded questions synthesised on every attempt — never the same exam twice." },
      { title: "Adaptive Learning", desc: "The engine over-samples the topics you miss and eases up on the ones you've mastered." },
      { title: "No-Repetition System", desc: "Different order, different wording, different questions — same learning objectives." },
      { title: "Performance Analysis", desc: "Per-topic breakdowns, strong/weak areas and concrete recommendations after every exam." },
      { title: "Study Mode", desc: "A personal AI tutor that asks, waits, explains, and gives extra examples — one concept at a time." },
      { title: "Grounded & Accurate", desc: "A knowledge base of the five chapters keeps the AI on-syllabus and prevents hallucination." },
    ],
  },

  coverage: {
    heading: "Full syllabus coverage",
    subtitle: "Questions span every required concept across five chapters.",
    chapterWord: "Chapter",
  },

  landing: {
    catalogHeading: "Choose your course",
    catalogSubtitle: "Pick a subject to start practicing. More are on the way.",
    comingSoon: "Coming soon",
    open: "Open course",
    questionsLabel: "questions",
    chaptersLabel: "chapters",
    stats: {
      heading: "Built for results",
      items: [
        { value: "132+", label: "Exam-ready questions" },
        { value: "27", label: "Concepts covered" },
        { value: "3", label: "Difficulty levels" },
        { value: "100%", label: "Syllabus-grounded" },
      ],
    },
    dashboardPreview: {
      badge: "Live analytics",
      heading: "See your progress come to life",
      subtitle:
        "Every attempt feeds a personal dashboard — scores over time, mastery by topic, and AI insights that tell you exactly what to review next.",
      cardAnalytics: "Average score",
      cardProgress: "Mastery",
      cardInsight: "AI Insight",
      insightText: "Strong on Servicescape & SSTs. Focus next on Marketing Communications.",
      recommend: "Smart recommendation",
      recommendText: "Review Chapter 8 — Blueprinting & fail points.",
      bestLabel: "Best",
      attemptsLabel: "Attempts",
    },
    testimonials: {
      heading: "Loved by students",
      subtitle: "Real results, fewer late-night cram sessions.",
      items: [
        { quote: "Went from a C to an A in two weeks. The per-topic analysis showed me exactly where I was weak.", name: "Sara A.", role: "Marketing major" },
        { quote: "Study Mode feels like a private tutor. It explains every answer instantly.", name: "Khalid M.", role: "Business student" },
        { quote: "The exam never repeats the same way, so I actually learn instead of memorising.", name: "Noura F.", role: "MBA candidate" },
      ],
    },
    pricing: {
      heading: "Simple, student-friendly pricing",
      subtitle: "Start free. Upgrade only if you want the AI tutor.",
      perMonth: "/mo",
      mostPopular: "Most popular",
      cta: "Get started",
      plans: [
        {
          name: "Free",
          price: "$0",
          desc: "Everything you need to pass.",
          features: ["Full question bank", "3 difficulty levels", "Performance analysis", "Progress dashboard"],
        },
        {
          name: "Pro",
          price: "$6",
          desc: "AI-powered, personalised studying.",
          features: ["Everything in Free", "AI question generation", "AI Study Mode tutor", "Adaptive learning", "Digital certificate"],
        },
        {
          name: "Campus",
          price: "Custom",
          desc: "For study groups & classes.",
          features: ["Everything in Pro", "Multiple subjects", "Shared progress", "Priority support"],
        },
      ],
    },
    faq: {
      heading: "Frequently asked questions",
      items: [
        { q: "Are the questions based on my actual course?", a: "Yes — the bank is built directly from the Services Marketing slides (Chapters 4, 7, 8, 10 & 11), including the real examples used in class." },
        { q: "What happens if I close the browser mid-exam?", a: "Nothing is lost. Your answers and position are saved automatically, so you resume exactly where you left off." },
        { q: "Do I need the AI features to use it?", a: "No. The platform works fully offline with the built-in question bank and analysis. The AI tutor and question generation are optional extras." },
        { q: "Can I add other subjects?", a: "Yes — the platform is built as a course catalog. New subjects can be added with their own questions, study mode and dashboard." },
        { q: "Is it free?", a: "The core exam experience is free. A Pro tier unlocks the AI tutor and adaptive learning." },
      ],
    },
    finalCta: {
      heading: "Ready to ace your exam?",
      subtitle: "Join students who turned anxious cramming into confident mastery.",
      button: "Start practicing free",
    },
    footer: {
      tagline: "An AI-powered exam platform for mastering your courses.",
      product: "Product",
      rights: "All rights reserved.",
    },
  },

  level: {
    questions: (n: number) => `${n} questions`,
    best: (pct: number) => `Best ${pct}%`,
    start: "Start Exam",
  },

  welcome: {
    ready: "Ready to begin?",
    questions30: "30 questions",
    selfPaced: "Self-paced",
    noBack: "No going back",
    nameLabel: "Your name (for your certificate)",
    namePlaceholder: "e.g. Sara Ahmed",
    start: "Start Exam",
    note: "Questions are randomised and never repeat the same way twice.",
  },

  exam: {
    exit: "Exit",
    levelSuffix: (d: string) => `${d} level`,
    building: "Building your unique exam…",
    counter: (n: number, total: number) => `Question ${n} of ${total}`,
    of: (total: number) => `of ${total}`,
    chShort: "Ch.",
  },

  qType: {
    "multiple-choice": "Multiple Choice",
    "true-false": "True / False",
    scenario: "Scenario",
    definition: "Definition",
    comparison: "Comparison",
  } as Record<string, string>,

  results: {
    exceptional: "Exceptional! 🎉",
    wellDone: "Well done! 👏",
    keepGoing: "Keep going 💪",
    complete: (d: string) => `${d} exam complete`,
    correct: "Correct",
    wrong: "Wrong",
    finalScore: "Final Score",
    analysis: "Performance Analysis",
    analyzing: "analyzing…",
    strongAreas: "Strong Areas",
    weakAreas: "Weak Areas",
    strongEmpty: "Build strengths by retaking the exam.",
    weakEmpty: "No major weak spots — great work!",
    recommendations: "Recommendations",
    breakdown: "Topic Breakdown",
    review: "Review Answers",
    retake: "Retake Exam",
    dashboard: "Dashboard",
  },

  review: {
    title: "Review Answers",
    back: "Back to results",
    correct: "Correct",
    incorrect: "Incorrect",
    yourAnswer: "your answer",
    noAnswer: "No answer selected.",
  },

  certificate: {
    title: "Certificate of Achievement",
    body: (difficulty: string, pct: number) =>
      `has successfully completed the ${difficulty} Services Marketing examination with a score of ${pct}%.`,
    grade: "Grade",
    passed: "Passed",
    footer: "Services Marketing Exam Platform · Chapters 4 · 7 · 8 · 10 · 11",
    defaultName: "Star Student",
  },

  dashboard: {
    title: "Dashboard",
    subtitle: "Track your progress across every attempt.",
    reset: "Reset progress",
    resetConfirm: "Clear all saved progress? This cannot be undone.",
    emptyTitle: "No attempts yet",
    emptyDesc:
      "Take your first exam to unlock detailed analytics — scores over time, strong and weak areas, and chapters to review.",
    emptyCta: "Start your first exam",
    examsCompleted: "Exams Completed",
    averageScore: "Average Score",
    bestScore: "Best Score",
    improvement: "Improvement",
    scoresOverTime: "Scores Over Time",
    strengths: "Your Strengths",
    needsReview: "Needs Review",
    strengthsEmpty: "Keep practicing to build strengths.",
    needsReviewEmpty: "No weak spots detected — excellent!",
    chaptersToReview: "Chapters to Review",
    newExam: "New Exam",
    study: "Study Mode",
  },

  study: {
    title: "Study Mode",
    subtitle: "Your personal AI tutor — answer, learn instantly, then ask anything.",
    concept: (n: number, total: number) => `Concept ${n} / ${total}`,
    correct: "Correct!",
    notQuite: "Not quite.",
    tutor: "AI Tutor",
    thinking: "Tutor is thinking…",
    askPlaceholder: "Ask the tutor for an example or clarification…",
    offline:
      "The AI tutor is in offline mode. Tip: re-read the explanation above and connect it to the chapter's key definition.",
    next: "Next concept",
  },

  difficulty: {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  } as Record<Difficulty, string>,

  tagline: {
    easy: "Foundations",
    medium: "Application",
    hard: "Mastery",
  } as Record<Difficulty, string>,

  levelDesc: {
    easy: "Core definitions and fundamental concepts. Perfect for building a solid base across all five chapters.",
    medium: "Understanding, comparison and applying concepts. Connect ideas across topics and test real comprehension.",
    hard: "Analytical scenarios and easily-confused concepts that demand focus. Built to challenge top students.",
  } as Record<Difficulty, string>,

  chapterTitles: {
    4: "Developing Service Products & Branding (Flower of Service)",
    7: "Promoting Services & Educating Customers",
    8: "Designing & Managing Service Processes",
    10: "Crafting the Service Environment (Servicescape)",
    11: "Managing People for Service Advantage",
  } as Record<Chapter, string>,

  topics: {
    "flower-of-service": "Flower of Service",
    "facilitating-services": "Facilitating Services",
    "enhancing-services": "Enhancing Services",
    "branding-alternatives": "Branding Alternatives",
    "new-service-development": "New Service Development",
    "marketing-communications": "Marketing Communications",
    "5ws-model": "5Ws Model",
    "word-of-mouth": "Word of Mouth",
    "corporate-design": "Corporate Design",
    blueprinting: "Blueprinting",
    flowcharting: "Flowcharting",
    "service-blueprint": "Service Blueprint",
    "fail-proofing": "Fail-Proofing",
    "service-standards": "Service Standards",
    ssts: "Self-Service Technologies (SSTs)",
    servicescape: "Servicescape",
    "ambient-conditions": "Ambient Conditions",
    "pleasure-arousal": "Pleasure & Arousal",
    "mehrabian-russell": "Mehrabian-Russell Model",
    "role-stress": "Role Stress",
    "boundary-spanners": "Boundary Spanners",
    empowerment: "Empowerment",
    "service-culture": "Service Culture",
    "internal-marketing": "Internal Marketing",
    "cycle-of-success": "Cycle of Success",
    "cycle-of-failure": "Cycle of Failure",
    "emotional-labor": "Emotional Labor",
  } as Record<TopicId, string>,
};

export type Messages = typeof en;

const ar: Messages = {
  dir: "ltr", // overridden below to "rtl" via cast
  langName: "العربية",
  switchTo: "English",

  nav: {
    home: "الرئيسية",
    study: "وضع الدراسة",
    dashboard: "لوحة التحكم",
    brand: "تسويق الخدمات",
    brandSub: "منصة الاختبارات",
  },

  ai: {
    live: "محرك الذكاء الاصطناعي: مفعّل",
    offline: "محرك الذكاء الاصطناعي: وضع ذكي بدون اتصال",
  },

  hero: {
    badge: "تعلّم مدعوم بالذكاء الاصطناعي · الفصول ٤ · ٧ · ٨ · ١٠ · ١١",
    titleA: "أتقن",
    titleHighlight: "تسويق الخدمات",
    titleB: "عبر اختبارات ذكية",
    subtitle:
      "منصة تفاعلية مدعومة بالذكاء الاصطناعي تولّد اختباراً جديداً في كل محاولة، تشرح كل إجابة، وتتكيّف مع المواضيع التي تحتاج تحسينها — من زهرة الخدمة إلى دورة النجاح.",
    chooseLevel: "اختر مستواك",
    tryStudy: "جرّب وضع الدراسة",
  },

  levelsSection: {
    heading: "اختر التحدّي المناسب",
    subtitle: "ثلاثة مستويات صعوبة مُعايَرة بعناية. كل اختبار من ٣٠ سؤالاً.",
  },

  features: {
    heading: "أكثر من مجرد اختبار — مدرّس ذكي",
    subtitle: "كل ما تحتاجه للانتقال من الحفظ إلى الإتقان.",
    items: [
      { title: "توليد الأسئلة بالذكاء الاصطناعي", desc: "أسئلة جديدة مبنية على المنهج تُولَّد في كل محاولة — لا يتكرر الاختبار أبداً." },
      { title: "التعلّم التكيّفي", desc: "يركّز المحرك على المواضيع التي تخطئ فيها ويقلّل من التي أتقنتها." },
      { title: "نظام منع التكرار", desc: "ترتيب مختلف، صياغة مختلفة، أسئلة مختلفة — مع نفس الأهداف التعليمية." },
      { title: "تحليل الأداء", desc: "تفصيل لكل موضوع، نقاط القوة والضعف، وتوصيات عملية بعد كل اختبار." },
      { title: "وضع الدراسة", desc: "مدرّس شخصي بالذكاء الاصطناعي يسأل، ينتظر، يشرح، ويعطي أمثلة إضافية — مفهوماً تلو الآخر." },
      { title: "دقيق وملتزم بالمنهج", desc: "قاعدة معرفة للفصول الخمسة تُبقي الذكاء الاصطناعي ضمن المنهج وتمنع الهلوسة." },
    ],
  },

  coverage: {
    heading: "تغطية كاملة للمنهج",
    subtitle: "الأسئلة تشمل كل مفهوم مطلوب عبر الفصول الخمسة.",
    chapterWord: "الفصل",
  },

  landing: {
    catalogHeading: "اختر مادتك",
    catalogSubtitle: "اختر مادة لتبدأ التدرّب. والمزيد في الطريق.",
    comingSoon: "قريباً",
    open: "افتح المادة",
    questionsLabel: "سؤال",
    chaptersLabel: "فصول",
    stats: {
      heading: "مبني لتحقيق النتائج",
      items: [
        { value: "132+", label: "سؤال جاهز للامتحان" },
        { value: "27", label: "مفهوماً مغطّى" },
        { value: "3", label: "مستويات صعوبة" },
        { value: "100%", label: "ملتزم بالمنهج" },
      ],
    },
    dashboardPreview: {
      badge: "تحليلات حيّة",
      heading: "شاهد تقدّمك يتجسّد أمامك",
      subtitle:
        "كل محاولة تغذّي لوحة تحكم شخصية — نتائجك عبر الوقت، إتقانك لكل موضوع، ورؤى ذكية تخبرك بالضبط بما تحتاج مراجعته.",
      cardAnalytics: "متوسط الدرجات",
      cardProgress: "الإتقان",
      cardInsight: "رؤية ذكية",
      insightText: "قوي في Servicescape و SSTs. ركّز تالياً على Marketing Communications.",
      recommend: "توصية ذكية",
      recommendText: "راجع الفصل ٨ — Blueprinting ونقاط الفشل.",
      bestLabel: "الأفضل",
      attemptsLabel: "المحاولات",
    },
    testimonials: {
      heading: "محبوب من الطلاب",
      subtitle: "نتائج حقيقية، وسهر أقل قبل الامتحان.",
      items: [
        { quote: "انتقلت من C إلى A في أسبوعين. تحليل المواضيع وضّح لي بالضبط نقاط ضعفي.", name: "سارة أ.", role: "تخصص تسويق" },
        { quote: "وضع الدراسة يحسّه مدرّس خاص. يشرح كل إجابة فوراً.", name: "خالد م.", role: "طالب إدارة أعمال" },
        { quote: "الاختبار ما يتكرر بنفس الطريقة، فأنا فعلاً أتعلّم بدل ما أحفظ.", name: "نورة ف.", role: "ماجستير إدارة" },
      ],
    },
    pricing: {
      heading: "أسعار بسيطة ومناسبة للطلاب",
      subtitle: "ابدأ مجاناً. ترقَّ فقط لو تبي المدرّس الذكي.",
      perMonth: "/شهرياً",
      mostPopular: "الأكثر شيوعاً",
      cta: "ابدأ الآن",
      plans: [
        {
          name: "مجاني",
          price: "$0",
          desc: "كل ما تحتاجه للنجاح.",
          features: ["بنك أسئلة كامل", "٣ مستويات صعوبة", "تحليل الأداء", "لوحة تحكم للتقدّم"],
        },
        {
          name: "Pro",
          price: "$6",
          desc: "دراسة شخصية مدعومة بالذكاء الاصطناعي.",
          features: ["كل ما في المجاني", "توليد أسئلة بالذكاء الاصطناعي", "مدرّس وضع الدراسة الذكي", "تعلّم تكيّفي", "شهادة رقمية"],
        },
        {
          name: "Campus",
          price: "حسب الطلب",
          desc: "لمجموعات الدراسة والصفوف.",
          features: ["كل ما في Pro", "مواد متعددة", "تقدّم مشترك", "دعم ذو أولوية"],
        },
      ],
    },
    faq: {
      heading: "الأسئلة الشائعة",
      items: [
        { q: "هل الأسئلة مبنية على مادتي فعلاً؟", a: "نعم — البنك مبني مباشرة من شرائح تسويق الخدمات (الفصول ٤ و٧ و٨ و١٠ و١١)، مع الأمثلة الحقيقية المستخدمة في المحاضرات." },
        { q: "وش يصير لو سكّرت المتصفح بنص الاختبار؟", a: "ما يضيع شي. إجاباتك وموضعك يُحفظ تلقائياً، فترجع تكمّل من نفس المكان بالضبط." },
        { q: "هل أحتاج ميزات الذكاء الاصطناعي لاستخدامه؟", a: "لا. المنصة تشتغل بالكامل بدون اتصال ببنك الأسئلة والتحليل المدمج. المدرّس الذكي وتوليد الأسئلة إضافات اختيارية." },
        { q: "هل أقدر أضيف مواد ثانية؟", a: "نعم — المنصة مبنية ككتالوج مواد. تقدر تضيف مواد جديدة بأسئلتها ووضع دراستها ولوحة تحكمها." },
        { q: "هل هو مجاني؟", a: "تجربة الاختبار الأساسية مجانية. وخطة Pro تفتح المدرّس الذكي والتعلّم التكيّفي." },
      ],
    },
    finalCta: {
      heading: "جاهز تتفوّق في امتحانك؟",
      subtitle: "انضم لطلاب حوّلوا السهر القلِق إلى إتقان واثق.",
      button: "ابدأ التدرّب مجاناً",
    },
    footer: {
      tagline: "منصة اختبارات مدعومة بالذكاء الاصطناعي لإتقان موادك.",
      product: "المنتج",
      rights: "جميع الحقوق محفوظة.",
    },
  },

  level: {
    questions: (n: number) => `${n} سؤالاً`,
    best: (pct: number) => `الأفضل ${pct}٪`,
    start: "ابدأ الاختبار",
  },

  welcome: {
    ready: "جاهز للبدء؟",
    questions30: "٣٠ سؤالاً",
    selfPaced: "بإيقاعك الخاص",
    noBack: "لا رجوع للخلف",
    nameLabel: "اسمك (للشهادة)",
    namePlaceholder: "مثال: سارة أحمد",
    start: "ابدأ الاختبار",
    note: "الأسئلة عشوائية ولا تتكرر بنفس الطريقة مرتين.",
  },

  exam: {
    exit: "خروج",
    levelSuffix: (d: string) => `مستوى ${d}`,
    building: "نجهّز اختبارك الفريد…",
    counter: (n: number, total: number) => `السؤال ${n} من ${total}`,
    of: (total: number) => `من ${total}`,
    chShort: "الفصل",
  },

  qType: {
    "multiple-choice": "اختيار من متعدد",
    "true-false": "صح / خطأ",
    scenario: "سيناريو",
    definition: "تعريف",
    comparison: "مقارنة",
  },

  results: {
    exceptional: "ممتاز! 🎉",
    wellDone: "أحسنت! 👏",
    keepGoing: "واصل التقدّم 💪",
    complete: (d: string) => `اكتمل اختبار مستوى ${d}`,
    correct: "صحيحة",
    wrong: "خاطئة",
    finalScore: "النتيجة النهائية",
    analysis: "تحليل الأداء",
    analyzing: "جارٍ التحليل…",
    strongAreas: "نقاط القوة",
    weakAreas: "نقاط الضعف",
    strongEmpty: "ابنِ نقاط قوتك بإعادة الاختبار.",
    weakEmpty: "لا توجد نقاط ضعف كبيرة — عمل رائع!",
    recommendations: "التوصيات",
    breakdown: "تفصيل المواضيع",
    review: "مراجعة الإجابات",
    retake: "إعادة الاختبار",
    dashboard: "لوحة التحكم",
  },

  review: {
    title: "مراجعة الإجابات",
    back: "العودة للنتائج",
    correct: "صحيحة",
    incorrect: "خاطئة",
    yourAnswer: "إجابتك",
    noAnswer: "لم تُحدَّد إجابة.",
  },

  certificate: {
    title: "شهادة إنجاز",
    body: (difficulty: string, pct: number) =>
      `أكمل بنجاح اختبار تسويق الخدمات لمستوى ${difficulty} بنتيجة ${pct}٪.`,
    grade: "التقدير",
    passed: "ناجح",
    footer: "منصة اختبارات تسويق الخدمات · الفصول ٤ · ٧ · ٨ · ١٠ · ١١",
    defaultName: "طالب متميّز",
  },

  dashboard: {
    title: "لوحة التحكم",
    subtitle: "تابع تقدّمك عبر كل المحاولات.",
    reset: "تصفير التقدّم",
    resetConfirm: "مسح كل التقدّم المحفوظ؟ لا يمكن التراجع عن هذا.",
    emptyTitle: "لا توجد محاولات بعد",
    emptyDesc:
      "خُض أول اختبار لك لفتح التحليلات التفصيلية — النتائج عبر الوقت، نقاط القوة والضعف، والفصول التي تحتاج مراجعة.",
    emptyCta: "ابدأ أول اختبار لك",
    examsCompleted: "الاختبارات المكتملة",
    averageScore: "متوسط النتائج",
    bestScore: "أفضل نتيجة",
    improvement: "نسبة التحسّن",
    scoresOverTime: "النتائج عبر الوقت",
    strengths: "نقاط قوتك",
    needsReview: "تحتاج مراجعة",
    strengthsEmpty: "واصل التدرّب لبناء نقاط قوتك.",
    needsReviewEmpty: "لا توجد نقاط ضعف — ممتاز!",
    chaptersToReview: "الفصول التي تحتاج مراجعة",
    newExam: "اختبار جديد",
    study: "وضع الدراسة",
  },

  study: {
    title: "وضع الدراسة",
    subtitle: "مدرّسك الشخصي بالذكاء الاصطناعي — أجب، تعلّم فوراً، ثم اسأل أي شيء.",
    concept: (n: number, total: number) => `المفهوم ${n} / ${total}`,
    correct: "صحيح!",
    notQuite: "ليس تماماً.",
    tutor: "المدرّس الذكي",
    thinking: "المدرّس يفكّر…",
    askPlaceholder: "اطلب من المدرّس مثالاً أو توضيحاً…",
    offline:
      "المدرّس الذكي في وضع عدم الاتصال. نصيحة: أعد قراءة الشرح أعلاه واربطه بالتعريف الأساسي للفصل.",
    next: "المفهوم التالي",
  },

  difficulty: {
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
  },

  tagline: {
    easy: "الأساسيات",
    medium: "التطبيق",
    hard: "الإتقان",
  },

  levelDesc: {
    easy: "التعريفات الأساسية والمفاهيم الجوهرية. مثالي لبناء قاعدة صلبة عبر الفصول الخمسة.",
    medium: "الفهم والمقارنة وتطبيق المفاهيم. اربط الأفكار بين المواضيع واختبر فهمك الحقيقي.",
    hard: "سيناريوهات تحليلية ومفاهيم متشابهة تتطلب تركيزاً. مصمَّمة لتحدّي المتميّزين.",
  },

  chapterTitles: {
    4: "تطوير منتجات الخدمة والعلامة التجارية (زهرة الخدمة)",
    7: "الترويج للخدمات وتثقيف العملاء",
    8: "تصميم وإدارة عمليات الخدمة",
    10: "صياغة بيئة الخدمة (Servicescape)",
    11: "إدارة الأفراد لتحقيق ميزة الخدمة",
  },

  topics: {
    "flower-of-service": "زهرة الخدمة",
    "facilitating-services": "الخدمات الميسِّرة",
    "enhancing-services": "الخدمات المعزِّزة",
    "branding-alternatives": "بدائل العلامة التجارية",
    "new-service-development": "تطوير الخدمات الجديدة",
    "marketing-communications": "الاتصالات التسويقية",
    "5ws-model": "نموذج الـ 5Ws",
    "word-of-mouth": "الكلمة المنطوقة (WOM)",
    "corporate-design": "التصميم المؤسسي",
    blueprinting: "التخطيط (Blueprinting)",
    flowcharting: "المخطط الانسيابي",
    "service-blueprint": "مخطط الخدمة",
    "fail-proofing": "التأمين ضد الفشل",
    "service-standards": "معايير الخدمة",
    ssts: "تقنيات الخدمة الذاتية (SSTs)",
    servicescape: "بيئة الخدمة (Servicescape)",
    "ambient-conditions": "الظروف المحيطة",
    "pleasure-arousal": "المتعة والإثارة",
    "mehrabian-russell": "نموذج مهرابيان-راسل",
    "role-stress": "ضغوط الدور",
    "boundary-spanners": "موظفو الحدود",
    empowerment: "التمكين",
    "service-culture": "ثقافة الخدمة",
    "internal-marketing": "التسويق الداخلي",
    "cycle-of-success": "دورة النجاح",
    "cycle-of-failure": "دورة الفشل",
    "emotional-labor": "العمل العاطفي",
  },
};

// Arabic is right-to-left.
(ar as { dir: "ltr" | "rtl" }).dir = "rtl";

export const MESSAGES: Record<Locale, Messages> = { en, ar };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES.en;
}
