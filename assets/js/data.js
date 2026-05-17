// All learning content lives here. Edit/extend freely.
window.AppData = {
  // ===== LESSONS =====
  lessons: [
    {
      id: "b2-present-perfect",
      level: "B2",
      title: "Present Perfect vs Past Simple",
      summary: "أتقن متى تستخدم 'have done' ومتى تستخدم 'did' — من أكبر فروقات B1 إلى B2.",
      duration: 12,
      sections: [
        {
          heading: "ليش هذا الدرس مهم؟",
          body: "في العربية ما نفرّق بشكل واضح بين 'انتهيتُ' (ماضي) و'قد انتهيتُ' (له أثر الآن). الإنجليزية تهتم كثيرًا بهذا الفرق، وإتقانه من أهم القفزات من مستوى B1 إلى B2.",
          translation: ""
        },
        {
          heading: "الماضي البسيط (Past Simple) — حدث منتهي بوقت محدد",
          body: "نستخدمه لما الوقت يكون منتهي وغالبًا مذكور: yesterday, last week, in 2020, when I was a child.",
          examples: [
            { en: "I visited Paris in 2019.", ar: "زرت باريس في 2019." },
            { en: "She called me an hour ago.", ar: "اتصلت فيني قبل ساعة." }
          ]
        },
        {
          heading: "المضارع التام (Present Perfect) — له ارتباط بالحاضر",
          body: "نستخدمه لما الفعل صار في الماضي لكن نتيجته أو أثره ما زال موجودًا الآن. الوقت يكون غير محدد، أو فترة لسا مفتوحة (today, this week).",
          examples: [
            { en: "I have visited Paris three times.", ar: "زرت باريس ثلاث مرات (في حياتي حتى الآن)." },
            { en: "She has just called me.", ar: "اتصلت فيني قبل شوي." },
            { en: "I have lived here since 2018.", ar: "أنا ساكن هنا من 2018 (إلى الحين)." }
          ]
        },
        {
          heading: "كلمات إشارة تساعدك",
          body: "Past Simple: yesterday, ago, last X, in [year], when. — Present Perfect: just, already, yet, ever, never, since, for, so far, recently, this week/month/year."
        }
      ],
      quiz: [
        { q: "I _____ my keys. I can't find them anywhere.", options: ["lost", "have lost", "was losing", "had lost"], correct: 1, explain: "المضارع التام — النتيجة (ما يقدر يلقى المفاتيح) مؤثرة الآن." },
        { q: "Shakespeare _____ many famous plays.", options: ["has written", "wrote", "was writing", "has been writing"], correct: 1, explain: "ماضي بسيط — شكسبير توفي، فترة حياته مغلقة." },
        { q: "_____ you ever _____ sushi?", options: ["Did / try", "Have / tried", "Were / trying", "Had / tried"], correct: 1, explain: "مضارع تام — خبرة حياتية حتى الآن." },
        { q: "I _____ him last Friday at the conference.", options: ["have met", "met", "had met", "was meeting"], correct: 1, explain: "ماضي بسيط — وقت محدد (last Friday)." }
      ]
    },
    {
      id: "b2-conditionals",
      level: "B2",
      title: "إتقان الجمل الشرطية (0 إلى 3 + مختلط)",
      summary: "من الاحتمال الواقعي إلى الافتراض الماضي — تحكّم في كل أنواع الشرط.",
      duration: 18,
      sections: [
        { heading: "النوع الصفري — حقائق عامة", body: "If + present, present. للأشياء الثابتة دائمًا.",
          examples: [{ en: "If you heat water to 100°C, it boils.", ar: "إذا سخّنت الماء إلى 100°C، يغلي." }] },
        { heading: "النوع الأول — احتمال واقعي في المستقبل", body: "If + present, will/can/may + infinitive.",
          examples: [{ en: "If it rains tomorrow, we will stay home.", ar: "إذا أمطرت بكرة، نقعد في البيت." }] },
        { heading: "النوع الثاني — افتراض غير واقعي أو نادر", body: "If + past simple, would/could/might + infinitive. الـ past هنا ما يعني وقت ماضي، بل يدل أن الكلام افتراضي.",
          examples: [
            { en: "If I had more time, I would learn Japanese.", ar: "لو عندي وقت أكثر، كان تعلمت الياباني." },
            { en: "If I were you, I'd accept the offer.", ar: "لو كنت مكانك، كنت قبلت العرض." }
          ]
        },
        { heading: "النوع الثالث — افتراض في الماضي", body: "If + past perfect, would/could/might have + past participle. تتخيّل ماضيًا ما حصل.",
          examples: [{ en: "If I had studied harder, I would have passed.", ar: "لو ذاكرت أكثر، كان نجحت." }]
        },
        { heading: "النوع المختلط — شرط في الماضي، نتيجة في الحاضر", body: "If + past perfect, would + infinitive.",
          examples: [{ en: "If she had taken the job, she would be in London now.", ar: "لو أخذت الوظيفة، كانت الحين في لندن." }]
        }
      ],
      quiz: [
        { q: "If I _____ rich, I'd buy a house by the sea.", options: ["am", "was", "were", "had been"], correct: 2, explain: "شرط ثاني — افتراض غير واقعي. الإنجليزية الرسمية تستخدم 'were' لكل الضمائر." },
        { q: "If you had told me earlier, I _____ you.", options: ["would help", "will help", "would have helped", "had helped"], correct: 2, explain: "شرط ثالث — افتراض ماضي." },
        { q: "Water _____ at 0°C.", options: ["freezes", "would freeze", "will freeze", "freezed"], correct: 0, explain: "حقيقة عامة — مضارع بسيط." },
        { q: "If she _____ caught the earlier train, she would be home by now.", options: ["caught", "had caught", "has caught", "catches"], correct: 1, explain: "شرط مختلط — ماضي مع نتيجة حاضرة." }
      ]
    },
    {
      id: "b2-modals-deduction",
      level: "B2",
      title: "الأفعال الناقصة للاستنتاج (must / might / can't)",
      summary: "عبّر عن درجة تأكدك من الأشياء — من أبرز ميزات الإنجليزية الطبيعية.",
      duration: 10,
      sections: [
        { heading: "الاستنتاج في الحاضر", body: "must + infinitive = متأكد إنه صحيح. might/could/may + infinitive = محتمل. can't + infinitive = متأكد إنه غير صحيح.",
          examples: [
            { en: "He must be tired — he worked 14 hours.", ar: "أكيد متعب — اشتغل 14 ساعة." },
            { en: "She might be at the gym.", ar: "يمكن تكون في النادي." },
            { en: "That can't be true.", ar: "مستحيل هذا صحيح." }
          ]
        },
        { heading: "الاستنتاج في الماضي", body: "must have / might have / could have / can't have + past participle. نفس المنطق، بس عن الماضي.",
          examples: [
            { en: "She must have left already — her coat is gone.", ar: "أكيد طلعت — معطفها مو موجود." },
            { en: "They can't have heard us.", ar: "مستحيل سمعونا." }
          ]
        }
      ],
      quiz: [
        { q: "His car isn't in the driveway. He _____ at work.", options: ["must be", "can't be", "might not be", "shouldn't be"], correct: 0, explain: "استنتاج قوي حاضر — must be." },
        { q: "The lights are off. They _____ to bed.", options: ["must go", "must have gone", "can't go", "might go"], correct: 1, explain: "استنتاج عن حدث ماضي بدليل حاضر — must have gone." }
      ]
    },
    {
      id: "c1-inversion",
      level: "C1",
      title: "القلب النحوي للتوكيد (Inversion)",
      summary: "أعطِ كلامك طابعًا أدبيًا متقدمًا. حرّك الظروف السلبية للبداية ولاحظ السحر.",
      duration: 14,
      sections: [
        { heading: "النمط الأساسي", body: "لما الظرف السلبي يكون في بداية الجملة، نقلب فعل المساعدة والفاعل (مثل السؤال). يُستخدم في الإنجليزية الرسمية أو الأدبية للتأكيد.",
          examples: [
            { en: "Never have I seen such beauty.", ar: "لم أرَ مثل هذا الجمال أبدًا." },
            { en: "Rarely does she complain.", ar: "نادرًا ما تشتكي." },
            { en: "Not only did he apologise, but he also paid.", ar: "ما اعتذر فقط، بل دفع كمان." }
          ]
        },
        { heading: "أهم الكلمات المُحفّزة", body: "Never, rarely, seldom, hardly, scarcely, no sooner ... than, not only ... but also, under no circumstances, only when, only after, little (did I know)." },
        { heading: "قلب الشرط (Conditional Inversion)", body: "نحذف 'if' ونقلب فعل المساعدة. أسلوب رسمي.",
          examples: [
            { en: "Had I known earlier, I would have called.", ar: "لو كنت أعرف قبل، كان اتصلت." },
            { en: "Were he to apologise, I might forgive him.", ar: "لو يعتذر، يمكن أسامحه." }
          ]
        }
      ],
      quiz: [
        { q: "Never _____ such a generous offer.", options: ["I have seen", "have I seen", "I saw", "did I saw"], correct: 1, explain: "بعد 'never' في البداية: have I seen." },
        { q: "_____ I known, I would have helped.", options: ["If had", "Had", "If I have", "Have"], correct: 1, explain: "قلب شرطي: 'Had I known' = 'If I had known'." }
      ]
    },
    {
      id: "c1-cleft-sentences",
      level: "C1",
      title: "جمل التركيز (Cleft Sentences)",
      summary: "سلّط الضوء على الجزء المهم في جملتك. ركيزة أساسية في مستوى C1.",
      duration: 12,
      sections: [
        { heading: "It-cleft", body: "It + be + التركيز + جملة موصولة. تركّز على معلومة واحدة.",
          examples: [
            { en: "It was John who broke the vase.", ar: "جون هو اللي كسر الإناء (مو غيره)." },
            { en: "It's tomorrow that we leave, not today.", ar: "بكرة نطلع، مو اليوم." }
          ]
        },
        { heading: "What-cleft (Pseudo-cleft)", body: "What + جملة + be + التركيز. تبرز اللي تبيه أو تحتاجه أو تعمله.",
          examples: [
            { en: "What I need is a long holiday.", ar: "اللي محتاجه إجازة طويلة." },
            { en: "What annoys me most is the noise.", ar: "أكثر شي يزعجني الإزعاج." }
          ]
        }
      ],
      quiz: [
        { q: "Choose the correct cleft for emphasising 'on Tuesday'.",
          options: ["It was on Tuesday that I called him.", "What I called him was on Tuesday.", "On Tuesday was when I called him.", "I called him it was Tuesday."],
          correct: 0, explain: "It-cleft: 'It was [التركيز] that [الباقي]'." }
      ]
    },
    {
      id: "c1-hedging",
      level: "C1",
      title: "التحفّظ في الكلام (Hedging)",
      summary: "الإنجليزية الأكاديمية تتجنب الحسم المطلق. تعلّم أدوات التعبير المتوازن.",
      duration: 10,
      sections: [
        { heading: "ليش نتحفّظ؟", body: "الإنجليزية الأكاديمية والمهنية في مستوى C1 تخفّف من حدّة الادعاءات لتبدو متوازنة. عبارات مثل 'This is wrong' تصير 'This may be problematic'." },
        { heading: "أدوات التحفظ", body: "أفعال ناقصة: may, might, could. — ظروف: perhaps, possibly, arguably, somewhat. — أفعال: appears to, seems to, suggests, tends to. — عبارات: it could be argued that, there is some evidence that." },
        { heading: "قارن بين الصياغتين",
          examples: [
            { en: "Direct: Social media causes anxiety.", ar: "مباشر: مواقع التواصل تسبب القلق." },
            { en: "Hedged: There is growing evidence that social media may contribute to anxiety in some users.", ar: "متحفظ: هناك أدلة متزايدة على أن مواقع التواصل قد تساهم في القلق لدى بعض المستخدمين." }
          ]
        }
      ],
      quiz: [
        { q: "Pick the most C1-style hedged claim.",
          options: ["Coffee is bad for you.", "Coffee tends to disrupt sleep in some individuals.", "Everyone hates coffee at night.", "Coffee never lets people sleep."],
          correct: 1, explain: "فعل 'tends to' + تحفظ 'some individuals' = تحفّظ صحيح." }
      ]
    },
    {
      id: "b2-phrasal-verbs",
      level: "B2",
      title: "الأفعال المركبة الشائعة (Phrasal Verbs)",
      summary: "أهم 30 فعل مركب راح تقابلها يوميًا في المحادثة والقراءة.",
      duration: 15,
      sections: [
        { heading: "ليش هي مهمة؟", body: "الأفعال المركبة هي روح المحادثة الإنجليزية. لو قلت 'put off' بدل 'postpone' تطلع لهجتك أكثر طبيعية." },
        { heading: "أهم 10 أفعال لازم تعرفها بظهر قلب", body: "look up (يبحث عن معلومة), bring up (يذكر), put off (يؤجل), get along (ينسجم), turn down (يرفض), come up with (يخترع/يقترح), look forward to (يتشوّق لـ), figure out (يفهم), give up (يستسلم), run into (يقابل صدفة)." }
      ],
      quiz: [
        { q: "Can you _____ the meeting until Friday?", options: ["put up", "put off", "put on", "put through"], correct: 1, explain: "'Put off' = يؤجل." },
        { q: "I can't _____ what he said.", options: ["figure out", "figure up", "figure in", "figure away"], correct: 0, explain: "'Figure out' = يفهم." }
      ]
    },
    {
      id: "b2-passive",
      level: "B2",
      title: "المبني للمجهول — ما يتجاوز الأساسيات",
      summary: "استخدم المجهول لتغيّر التركيز، تظهر الرسمية، أو تتحدث بدبلوماسية.",
      duration: 12,
      sections: [
        { heading: "الصيغة", body: "be + past participle. الفاعل اختياري ويُذكر بعد 'by'." },
        { heading: "متى تستخدمه", body: "1) الفاعل واضح أو غير معروف ('My wallet was stolen'). 2) للتركيز على الفعل أو النتيجة ('The bridge was built in 1890'). 3) لطابع رسمي/أكاديمي. 4) للدبلوماسية ('Mistakes were made')." },
        { heading: "أزمنة صعبة",
          examples: [
            { en: "The project is being reviewed. (present continuous passive)", ar: "المشروع يُراجَع حاليًا." },
            { en: "The report has been submitted. (present perfect passive)", ar: "تم تسليم التقرير." },
            { en: "The bill will have been paid by Monday. (future perfect passive)", ar: "الفاتورة راح تكون مدفوعة قبل الإثنين." }
          ]
        }
      ],
      quiz: [
        { q: "The window _____ yesterday.", options: ["was broken", "broke", "has been broken", "is broken"], correct: 0, explain: "مبني للمجهول بزمن الماضي البسيط." },
        { q: "Your order _____ right now.", options: ["is processed", "is being processed", "has been processed", "processes"], correct: 1, explain: "مضارع مستمر مبني للمجهول — يحدث الآن." }
      ]
    },
    {
      id: "c1-discourse-markers",
      level: "C1",
      title: "أدوات الربط (Discourse Markers)",
      summary: "اللافتات اللي تحوّل جملك المتفرقة إلى نص متدفق بمستوى C1.",
      duration: 11,
      sections: [
        { heading: "للتناقض", body: "however, nevertheless, on the contrary, that said, having said that, then again." },
        { heading: "للإضافة", body: "moreover, furthermore, on top of that, what's more, in addition." },
        { heading: "للسبب والنتيجة", body: "consequently, therefore, as a result, thus, hence, accordingly." },
        { heading: "لإعادة الصياغة", body: "in other words, to put it differently, that is to say, namely." },
        { heading: "مثال متكامل",
          examples: [{ en: "The proposal is ambitious. That said, it lacks funding details. Nevertheless, the committee voted to support it.", ar: "الاقتراح طموح، لكنه يفتقر إلى تفاصيل التمويل. ومع ذلك، صوّتت اللجنة على دعمه." }]
        }
      ],
      quiz: [
        { q: "The plan worked perfectly; _____, the team got a bonus.", options: ["however", "consequently", "on the contrary", "namely"], correct: 1, explain: "سبب ونتيجة — consequently." }
      ]
    },
    {
      id: "b1-narrative-tenses",
      level: "B1",
      title: "أزمنة الحكاية (Narrative Tenses)",
      summary: "الماضي البسيط، المستمر، والتام — ثلاث تروس لرواية القصص.",
      duration: 12,
      sections: [
        { heading: "Past Simple — العمود الفقري للقصة", body: "أحداث متتابعة. 'I woke up, brushed my teeth, left the house.'" },
        { heading: "Past Continuous — خلفية الحدث", body: "شي كان مستمر لما حصل حدث ثاني. 'I was walking home when it started to rain.'" },
        { heading: "Past Perfect — حدث قبل حدث ماضي", body: "حدث صار قبل حدث ماضي ثاني. 'When I arrived, the meeting had already started.'" }
      ],
      quiz: [
        { q: "She _____ TV when the phone rang.", options: ["watched", "was watching", "had watched", "had been watching"], correct: 1, explain: "ماضي مستمر للخلفية، قاطعه حدث ماضي بسيط." },
        { q: "By the time we got to the cinema, the film _____.", options: ["started", "was starting", "had started", "has started"], correct: 2, explain: "ماضي تام — قبل 'got to the cinema'." }
      ]
    }
  ],

  // ===== EXPLANATIONS (bilingual cards) =====
  explanations: [
    {
      id: "exp-greetings",
      title: "Greetings & small talk",
      titleAr: "التحية والحديث الخفيف",
      icon: "👋",
      level: "B1",
      items: [
        { en: "How's it going?", ar: "كيف الأحوال؟", note: "أكثر طبيعية من 'How are you?' في المحادثات اليومية." },
        { en: "Long time no see!", ar: "زمان عنك! ما شفناك من زمان.", note: "تعبير ودود لما تقابل شخص ما شفته من فترة." },
        { en: "What have you been up to?", ar: "وش أخبارك آخر فترة؟ وش تسوي؟", note: "سؤال مفتوح عن نشاطاتك الأخيرة." },
        { en: "Not much, just the usual.", ar: "ولا شي، نفس الروتين.", note: "رد عام مهذب." },
        { en: "Take care!", ar: "خلِّ بالك من نفسك! (في الوداع)", note: "أكثر دفئًا من 'goodbye'." }
      ]
    },
    {
      id: "exp-agreement",
      title: "Agreeing & disagreeing politely",
      titleAr: "الموافقة والاعتراض بأدب",
      icon: "🤝",
      level: "B2",
      items: [
        { en: "I see your point, but…", ar: "أفهم وجهة نظرك، بس…", note: "أفضل من 'You're wrong'." },
        { en: "That's a fair point.", ar: "هذي نقطة وجيهة فعلًا.", note: "تعترف بصحة رأي الطرف الثاني." },
        { en: "I'm not so sure about that.", ar: "ما أنا متأكد من هذا.", note: "اعتراض ناعم بدون مواجهة." },
        { en: "I couldn't agree more.", ar: "ما أقدر أوافقك أكثر من هذا (= متفق تمامًا).", note: "تركيب قوي للموافقة الكاملة." },
        { en: "With all due respect, I have to disagree.", ar: "مع كامل احترامي، لازم أختلف معك.", note: "اعتراض رسمي ومهذب جدًا." }
      ]
    },
    {
      id: "exp-emails",
      title: "Professional email phrases",
      titleAr: "عبارات الإيميل الاحترافي",
      icon: "📧",
      level: "B2",
      items: [
        { en: "I hope this email finds you well.", ar: "أتمنى أن يصلك هذا الإيميل وأنت بخير.", note: "افتتاحية شائعة جدًا." },
        { en: "I'm writing to inquire about…", ar: "أكتب لك للاستفسار عن…", note: "افتتاحية رسمية لسؤال محدد." },
        { en: "Please find attached…", ar: "تجد بالمرفقات…", note: "للإشارة إلى الملفات المرفقة." },
        { en: "Could you kindly confirm by Friday?", ar: "ممكن من فضلك تأكد قبل الجمعة؟", note: "طلب مهذب بوقت محدد." },
        { en: "Looking forward to your reply.", ar: "بانتظار ردك.", note: "خاتمة احترافية شائعة." },
        { en: "Best regards, / Kind regards,", ar: "مع أطيب التحيات،", note: "خاتمة رسمية مناسبة لكل المواقف." }
      ]
    },
    {
      id: "exp-opinion",
      title: "Expressing opinions",
      titleAr: "التعبير عن الرأي",
      icon: "💭",
      level: "B2",
      items: [
        { en: "From my perspective, …", ar: "من وجهة نظري، …", note: "أكثر ثراءً من 'I think'." },
        { en: "It seems to me that…", ar: "يبدو لي أن…", note: "أسلوب لطيف للتعبير عن رأي بدون فرضه." },
        { en: "I'd argue that…", ar: "أزعم أن… / أرى أن…", note: "تعبير قوي يُستخدم في النقاشات." },
        { en: "As far as I'm concerned…", ar: "بقدر ما يخصني… / حسب رأيي…", note: "تركيز على وجهة النظر الشخصية." },
        { en: "There's no denying that…", ar: "لا يمكن إنكار أن…", note: "للحقائق التي يصعب الاعتراض عليها." }
      ]
    },
    {
      id: "exp-travel",
      title: "Travel essentials",
      titleAr: "أساسيات السفر",
      icon: "✈️",
      level: "B1",
      items: [
        { en: "Could I have an aisle seat, please?", ar: "ممكن مقعد بجانب الممر، من فضلك؟", note: "Aisle = الممر، Window = النافذة." },
        { en: "I'd like to check in this bag.", ar: "أبي أسجّل هذي الشنطة (في الـ check-in).", note: "للأمتعة اللي راح تنزل في عنبر الطائرة." },
        { en: "How long is the layover?", ar: "كم مدة الترانزيت/التوقف؟", note: "Layover = وقت التوقف بين رحلتين." },
        { en: "Is there a shuttle to the city center?", ar: "في باص (مكوكي) للوسط؟", note: "Shuttle = حافلة مخصصة للنقل بين نقطتين." },
        { en: "Could you call me a cab?", ar: "ممكن تطلب لي تاكسي؟", note: "'Cab' أمريكي، 'taxi' أكثر عمومية." }
      ]
    },
    {
      id: "exp-idioms",
      title: "Common idioms",
      titleAr: "تعابير اصطلاحية شائعة",
      icon: "🎭",
      level: "B2",
      items: [
        { en: "It's a piece of cake.", ar: "شي سهل جدًا. (حرفيًا: قطعة كيك)", note: "نقول 'piece of cake' للأشياء السهلة." },
        { en: "Break a leg!", ar: "بالتوفيق! (يُقال للممثلين قبل العرض)", note: "تعبير غريب لكنه يعني التشجيع، ولا تأخذه حرفيًا!" },
        { en: "Hit the books.", ar: "ذاكر/ادرس بجد.", note: "تعبير شائع في وسط الطلاب." },
        { en: "Once in a blue moon.", ar: "كل فترة طويلة جدًا. (نادرًا)", note: "للأشياء اللي تحصل مرة وحدة في زمان طويل." },
        { en: "Cost an arm and a leg.", ar: "غالي جدًا. (حرفيًا: يكلف ذراع ورجل)", note: "للأشياء المكلفة جدًا." },
        { en: "Bite the bullet.", ar: "خذ خطوة شجاعة وافعلها رغم صعوبتها.", note: "لمواجهة شي صعب ما تقدر تتجنبه." }
      ]
    },
    {
      id: "exp-difference-pairs",
      title: "Easily confused words",
      titleAr: "كلمات تتشابه ويلتبس معناها",
      icon: "🔀",
      level: "B2",
      items: [
        { en: "Affect vs Effect", ar: "Affect (فعل) = يؤثر. Effect (اسم) = التأثير.", note: "مثال: Stress affects sleep. — The effect was huge." },
        { en: "Lose vs Loose", ar: "Lose (فعل) = يفقد. Loose (صفة) = فضفاض/مرتخي.", note: "مثال: I always lose my keys. — These pants are too loose." },
        { en: "Their / There / They're", ar: "Their = ضمير ملكية. There = هناك. They're = اختصار لـ they are.", note: "ثلاثتها تنطق بنفس الطريقة لكن تكتب مختلف." },
        { en: "Borrow vs Lend", ar: "Borrow = يستعير (من شخص). Lend = يُعير (لشخص).", note: "Can I borrow your pen? — Sure, I'll lend you mine." },
        { en: "Bring vs Take", ar: "Bring = يحضر (إلى مكانك). Take = يأخذ (بعيدًا عنك).", note: "Bring me a cup. — Take this away." }
      ]
    },
    {
      id: "exp-business",
      title: "Business meeting language",
      titleAr: "لغة الاجتماعات المهنية",
      icon: "💼",
      level: "C1",
      items: [
        { en: "Let's get the ball rolling.", ar: "خلونا نبدأ. (نشغّل العمل)", note: "افتتاحية ودودة للاجتماع." },
        { en: "Could you walk me through it?", ar: "ممكن تشرحها لي خطوة بخطوة؟", note: "أفضل من 'explain' في السياق المهني." },
        { en: "Let's circle back to that.", ar: "خلونا نرجع لهذي النقطة لاحقًا.", note: "لتأجيل نقاش جانبي بدون تجاهله." },
        { en: "Are we all on the same page?", ar: "كلنا متفقين على نفس الفهم؟", note: "للتأكد من التوافق." },
        { en: "Let's take this offline.", ar: "خلونا نتناقش فيها على جنب (بعد الاجتماع).", note: "تعني خارج الاجتماع الحالي، ليس عبر الإنترنت بالضرورة." }
      ]
    },
    {
      id: "exp-collocations",
      title: "Natural collocations",
      titleAr: "التراكيب الطبيعية (Collocations)",
      icon: "🧩",
      level: "C1",
      items: [
        { en: "Make a decision (NOT do a decision)", ar: "نقول 'make' مع decision، مو 'do'.", note: "اللغة الإنجليزية تختار أفعالها بدقة." },
        { en: "Heavy traffic / Heavy rain", ar: "زحمة شديدة / مطر غزير.", note: "نستخدم 'heavy' للأشياء الكثيفة، ليس 'big'." },
        { en: "Strong coffee / Weak tea", ar: "قهوة ثقيلة / شاي خفيف.", note: "نقول strong/weak، مو 'powerful/light' للمشروبات." },
        { en: "Take a photo (NOT make a photo)", ar: "ناخذ صورة، نقول 'take' مو 'make'.", note: "خطأ شائع من المتحدثين بالعربية." },
        { en: "Catch a cold / Get a cold", ar: "نصاب بنزلة برد. الفعلان صحيحان.", note: "تعابير ثابتة محفوظة." }
      ]
    },
    {
      id: "exp-restaurant",
      title: "At a restaurant",
      titleAr: "في المطعم",
      icon: "🍽️",
      level: "B1",
      items: [
        { en: "Could we get the menu, please?", ar: "ممكن تجيب لنا قائمة الطعام، لو سمحت؟", note: "افتتاحية مهذبة." },
        { en: "What do you recommend?", ar: "وش تنصحنا فيه؟", note: "سؤال ودود يفتح الحديث." },
        { en: "I'll have the…", ar: "أبي… / راح آخذ…", note: "للطلب: I'll have the chicken." },
        { en: "Could we get the bill, please?", ar: "ممكن الفاتورة، لو سمحت؟", note: "'Bill' بريطاني، 'check' أمريكي." },
        { en: "Keep the change.", ar: "خلِّ الباقي. (بقشيش)", note: "تعبير لطيف للبقشيش." }
      ]
    }
  ],

  // ===== VOCABULARY =====
  vocabulary: [
    { word: "compelling", ipa: "/kəmˈpel.ɪŋ/", pos: "adj.", level: "B2", def: "Strong or forceful in argument; that makes you pay attention.", defAr: "مقنع وآسر، يجذب الانتباه بقوة.", ex: "She made a compelling case for change." },
    { word: "resilient", ipa: "/rɪˈzɪl.i.ənt/", pos: "adj.", level: "B2", def: "Able to recover quickly from setbacks.", defAr: "صامد، يستعيد قوته بسرعة بعد الصعوبات.", ex: "Children are remarkably resilient." },
    { word: "thrive", ipa: "/θraɪv/", pos: "verb", level: "B2", def: "To grow or develop well; to prosper.", defAr: "يزدهر، ينمو ويتطور بقوة.", ex: "Cacti thrive in dry climates." },
    { word: "endeavour", ipa: "/ɪnˈdev.ər/", pos: "noun/verb", level: "B2", def: "A serious or determined effort; to try hard.", defAr: "مسعى جاد، يسعى ويجتهد.", ex: "We will endeavour to deliver on time." },
    { word: "acknowledge", ipa: "/əkˈnɒl.ɪdʒ/", pos: "verb", level: "B2", def: "To accept or admit that something is true or exists.", defAr: "يعترف، يقرّ بصحة شيء.", ex: "He acknowledged his mistake openly." },
    { word: "anticipate", ipa: "/ænˈtɪs.ɪ.peɪt/", pos: "verb", level: "B2", def: "To expect or predict something.", defAr: "يتوقع، يستبق الأحداث.", ex: "We anticipate strong demand this year." },
    { word: "blunt", ipa: "/blʌnt/", pos: "adj.", level: "B2", def: "Saying things directly without trying to be polite.", defAr: "صريح بشكل مباشر وأحيانًا جاف.", ex: "To be blunt, your essay needs work." },
    { word: "concise", ipa: "/kənˈsaɪs/", pos: "adj.", level: "B2", def: "Short and clear, using few words.", defAr: "موجز وواضح بكلمات قليلة.", ex: "Please keep your answer concise." },
    { word: "deliberate", ipa: "/dɪˈlɪb.ər.ət/", pos: "adj.", level: "B2", def: "Done on purpose; carefully thought out.", defAr: "متعمَّد ومدروس.", ex: "It was a deliberate choice." },
    { word: "enhance", ipa: "/ɪnˈhɑːns/", pos: "verb", level: "B2", def: "To improve the quality, value, or attractiveness of something.", defAr: "يحسّن، يعزز، يرفع من جودة الشيء.", ex: "Music can enhance your mood." },
    { word: "fluctuate", ipa: "/ˈflʌk.tʃu.eɪt/", pos: "verb", level: "B2", def: "To change frequently in level or amount.", defAr: "يتذبذب صعودًا وهبوطًا.", ex: "Prices fluctuate seasonally." },
    { word: "genuine", ipa: "/ˈdʒen.ju.ɪn/", pos: "adj.", level: "B2", def: "Real, sincere, not fake.", defAr: "حقيقي وصادق، ليس مزيفًا.", ex: "Her smile was genuine." },
    { word: "hinder", ipa: "/ˈhɪn.dər/", pos: "verb", level: "B2", def: "To make it difficult for something to happen.", defAr: "يعيق ويمنع التقدم.", ex: "Bad weather hindered progress." },
    { word: "impose", ipa: "/ɪmˈpəʊz/", pos: "verb", level: "B2", def: "To officially force a rule, tax, etc. on someone.", defAr: "يفرض رسميًا (قاعدة، ضريبة، إلخ).", ex: "The government imposed new taxes." },
    { word: "jeopardise", ipa: "/ˈdʒep.ə.daɪz/", pos: "verb", level: "B2", def: "To put something at risk.", defAr: "يعرّض للخطر، يخاطر بشيء ثمين.", ex: "Don't jeopardise your career over this." },
    { word: "inevitable", ipa: "/ɪˈnev.ɪ.tə.bəl/", pos: "adj.", level: "B2", def: "Certain to happen; unavoidable.", defAr: "حتمي، لا مفر منه.", ex: "Change is inevitable." },

    { word: "ubiquitous", ipa: "/juːˈbɪk.wɪ.təs/", pos: "adj.", level: "C1", def: "Seeming to be everywhere at once.", defAr: "موجود في كل مكان، منتشر بشكل واسع.", ex: "Smartphones have become ubiquitous." },
    { word: "meticulous", ipa: "/məˈtɪk.jə.ləs/", pos: "adj.", level: "C1", def: "Showing great attention to detail.", defAr: "دقيق ومنظم بشكل لافت، يهتم بأدق التفاصيل.", ex: "He keeps meticulous records." },
    { word: "discrepancy", ipa: "/dɪˈskrep.ən.si/", pos: "noun", level: "C1", def: "A difference between two things that should match.", defAr: "تفاوت أو اختلاف بين شيئين يفترض تطابقهما.", ex: "There's a discrepancy in the figures." },
    { word: "scrutinise", ipa: "/ˈskruː.tɪ.naɪz/", pos: "verb", level: "C1", def: "To examine something very carefully.", defAr: "يدقق ويفحص بدقة شديدة.", ex: "Auditors scrutinised the accounts." },
    { word: "pertinent", ipa: "/ˈpɜː.tɪ.nənt/", pos: "adj.", level: "C1", def: "Relevant to a particular matter.", defAr: "ذو صلة وثيقة بالموضوع.", ex: "Please stick to pertinent details." },
    { word: "alleviate", ipa: "/əˈliː.vi.eɪt/", pos: "verb", level: "C1", def: "To make pain or suffering less severe.", defAr: "يخفّف من حدّة الألم أو المعاناة.", ex: "The medicine alleviated her symptoms." },
    { word: "exacerbate", ipa: "/ɪɡˈzæs.ə.beɪt/", pos: "verb", level: "C1", def: "To make a bad situation worse.", defAr: "يفاقم الوضع السيئ ويزيده سوءًا.", ex: "Stress exacerbates the condition." },
    { word: "tantamount", ipa: "/ˈtæn.tə.maʊnt/", pos: "adj.", level: "C1", def: "Equivalent in seriousness; effectively the same as.", defAr: "بمثابة، يساوي في الخطورة.", ex: "His silence was tantamount to admission." },
    { word: "succinct", ipa: "/səkˈsɪŋkt/", pos: "adj.", level: "C1", def: "Said in a clear and short way.", defAr: "مقتضب وواضح، يوصل الفكرة باختصار.", ex: "Give a succinct summary." },
    { word: "ostensibly", ipa: "/ɒsˈten.sə.bli/", pos: "adv.", level: "C1", def: "Apparently, but not necessarily really.", defAr: "ظاهريًا، حسب ما يبدو من السطح.", ex: "He left, ostensibly to call a friend." },
    { word: "candid", ipa: "/ˈkæn.dɪd/", pos: "adj.", level: "C1", def: "Honest and direct, especially when difficult.", defAr: "صريح ومباشر، حتى في الأمور الصعبة.", ex: "Let's have a candid conversation." },
    { word: "nuance", ipa: "/ˈnjuː.ɑːns/", pos: "noun", level: "C1", def: "A very slight difference in meaning, expression, sound, etc.", defAr: "فرق دقيق جدًا في المعنى أو التعبير.", ex: "The translation lost the nuances." },
    { word: "plausible", ipa: "/ˈplɔː.zə.bəl/", pos: "adj.", level: "C1", def: "Reasonable and likely to be true.", defAr: "معقول ويُحتمل أن يكون صحيحًا.", ex: "That's a plausible explanation." },
    { word: "redundant", ipa: "/rɪˈdʌn.dənt/", pos: "adj.", level: "C1", def: "Unnecessary because already present; or no longer needed at a job.", defAr: "زائد عن الحاجة، مكرر بدون فائدة.", ex: "Avoid redundant words in your essay." },
    { word: "sporadic", ipa: "/spəˈræd.ɪk/", pos: "adj.", level: "C1", def: "Happening irregularly or in scattered instances.", defAr: "متقطّع وغير منتظم.", ex: "There was sporadic gunfire in the distance." },
    { word: "vindicate", ipa: "/ˈvɪn.dɪ.keɪt/", pos: "verb", level: "C1", def: "To prove someone right after doubt.", defAr: "يبرّئ، يثبت صحة موقف شخص بعد الشك فيه.", ex: "The results vindicated her theory." },
    { word: "elucidate", ipa: "/ɪˈluː.sɪ.deɪt/", pos: "verb", level: "C1", def: "To make something clear; explain.", defAr: "يوضح ويشرح فكرة غامضة.", ex: "Could you elucidate your last point?" },
    { word: "diligent", ipa: "/ˈdɪl.ɪ.dʒənt/", pos: "adj.", level: "C1", def: "Working carefully and persistently.", defAr: "مجتهد ومثابر، يعمل بإتقان واستمرار.", ex: "She's a diligent researcher." }
  ],

  // ===== READING =====
  readings: [
    {
      id: "r-attention",
      level: "B2",
      title: "The Cost of Constant Attention",
      minutes: 4,
      text: `In an age of endless notifications, the human brain pays a hidden tax. Every ping, banner, or vibration nudges your attention away from whatever you were doing. Even if you ignore the alert, research suggests it takes the mind several seconds — sometimes minutes — to fully refocus.

This phenomenon, called attention residue, affects how deeply we think. A 2017 study found that simply having a smartphone visible on a desk reduced participants' working memory, even when the device was face-down and silent. The phone did not need to ring; the brain still allocated some bandwidth to monitoring it.

The implications go beyond productivity. Constant context-switching has been linked to higher stress, shallower learning, and worse decision-making. Some researchers argue that the ability to sustain attention is becoming a rare and valuable skill — a kind of cognitive luxury good.

The fix is rarely dramatic. Most experts recommend deliberate blocks of single-tasking: a quiet hour without any device in sight, or a workspace stripped of digital triggers. The harder battle is psychological. Once attention has been fragmented for years, sitting with one task can feel uncomfortable. Yet, like a muscle, focus can be retrained — slowly, and with practice.`,
      questions: [
        { q: "What is 'attention residue'?", options: ["The energy consumed by smartphones.", "The lingering distraction left by an interruption.", "The brain's reward for finishing tasks.", "A common form of memory loss."], correct: 1, explain: "تم تعريفها في الفقرة الثانية — التشتت المتبقي بعد المقاطعة." },
        { q: "According to the passage, what surprised researchers in 2017?", options: ["Phones improved memory when silent.", "Even a silent, face-down phone reduced working memory.", "People can multitask without cost.", "Notifications are useful for studying."], correct: 1 },
        { q: "The author compares sustained attention to:", options: ["A digital trigger.", "A rare luxury good.", "A new technology.", "A psychological illness."], correct: 1 },
        { q: "The 'harder battle' mentioned in the last paragraph is:", options: ["Buying fewer devices.", "Coping with the discomfort of focusing on one task.", "Earning more money.", "Avoiding sleep."], correct: 1 }
      ]
    },
    {
      id: "r-cities",
      level: "C1",
      title: "Cities as Living Laboratories",
      minutes: 5,
      text: `Urban centres have long been treated as engineering puzzles — grids of roads, networks of pipes, stacks of buildings. Yet a growing body of work in urban science reframes them as something altogether more organic: living laboratories in which millions of behavioural experiments unfold simultaneously.

This shift is partly methodological. The proliferation of sensor data, mobile location traces, and open civic records has allowed researchers to scrutinise how cities actually function rather than how they are planned to function. The discrepancy is often striking. A street designed to move cars efficiently may, in practice, serve as a child's playground, a vendor's marketplace, or a neighbour's improvised lounge.

Such findings are not merely academic. They are reshaping how municipalities allocate scarce resources. Several European cities have used granular movement data to redesign bus routes, while smaller experiments — temporarily closing a lane to traffic, or painting a square in bright colours — have yielded insights that no master plan could anticipate. The lesson, arguably, is one of humility: the city is not a static artefact to be perfected, but a dynamic system that absorbs and reflects the lives within it.

Critics, however, caution against techno-optimism. Sensor-rich cities raise pressing questions about surveillance, equity, and consent. Who collects the data? Who benefits? Whose patterns of life are rendered visible, and whose remain obscured? Until these questions are addressed in a transparent and inclusive manner, the laboratory metaphor risks becoming uncomfortably literal — with residents cast as unwitting subjects rather than active participants in the design of their own environment.`,
      questions: [
        { q: "What metaphor for cities does the passage introduce?", options: ["Cities as engineering puzzles.", "Cities as static artefacts.", "Cities as living laboratories.", "Cities as digital networks."], correct: 2 },
        { q: "The author's tone in the final paragraph is best described as:", options: ["Enthusiastically supportive.", "Cautiously sceptical.", "Hostile and dismissive.", "Indifferent."], correct: 1, explain: "النقاد 'يحذرون' — تشكك متوازن." },
        { q: "What does 'discrepancy' refer to in paragraph two?", options: ["Gaps in mobile phone coverage.", "Differences between planned and actual use of urban space.", "Errors in sensor data.", "Disagreements between researchers."], correct: 1 },
        { q: "The phrase 'unwitting subjects' suggests the residents:", options: ["Are deliberately participating.", "Don't realise they are being studied.", "Are city planners.", "Live outside the city."], correct: 1 }
      ]
    },
    {
      id: "r-coffee",
      level: "B1",
      title: "The Journey of a Coffee Bean",
      minutes: 3,
      text: `Most people drink coffee without thinking about it. But behind every cup is a long journey that starts on a small farm, often thousands of kilometres away.

Coffee grows on trees, mainly in countries near the equator. The fruit, called a coffee cherry, is red when it is ready to pick. Inside each cherry are two seeds — the beans we know.

After picking, the beans are washed and dried. They are still green at this stage. Then they are sent to factories around the world, where they are roasted. Roasting turns the beans brown and gives them their strong smell and taste.

Finally, the beans are ground and brewed. A simple cup of coffee on your table has passed through the hands of farmers, drivers, traders, roasters, and baristas. It is, in a way, a small miracle of cooperation.`,
      questions: [
        { q: "Where do most coffee trees grow?", options: ["Near the North Pole.", "Near the equator.", "Inside factories.", "In cold mountains."], correct: 1 },
        { q: "Coffee beans are green:", options: ["after roasting.", "in your cup.", "before roasting.", "when they grow."], correct: 2 },
        { q: "What changes during roasting?", options: ["The beans become red.", "The beans become brown and gain flavour.", "The beans grow larger.", "Nothing changes."], correct: 1 }
      ]
    }
  ],

  // ===== WRITING PROMPTS =====
  writingPrompts: [
    { id: "w-1", level: "B2", title: "Opinion essay", prompt: "Some people believe that working from home is better than working in an office. Do you agree? Write 180–220 words, using at least three discourse markers (e.g. however, moreover, consequently)." },
    { id: "w-2", level: "B2", title: "Email of complaint", prompt: "You bought a product online that arrived damaged. Write a formal email of complaint (120–150 words) requesting a replacement. Use at least one passive structure." },
    { id: "w-3", level: "C1", title: "Argumentative essay", prompt: "'Social media has done more harm than good to public discourse.' Discuss, using hedging language. 250–300 words. Include at least one cleft sentence and one inversion." },
    { id: "w-4", level: "C1", title: "Review", prompt: "Write a review of a film or book that changed how you think (200–250 words). Aim for varied sentence structures and at least 5 C1-level vocabulary items." },
    { id: "w-5", level: "B2", title: "Story", prompt: "Begin a story with: 'I never expected to find that envelope.' Continue for 180–220 words using past simple, past continuous, and past perfect." }
  ],

  // ===== PRONUNCIATION =====
  pronunciation: [
    { id: "p-1", level: "B2", text: "Three thin thieves thought thirty things.", focus: "/θ/ vs /ð/" },
    { id: "p-2", level: "B2", text: "She sells seashells by the seashore.", focus: "/ʃ/ vs /s/" },
    { id: "p-3", level: "B2", text: "Red lorry, yellow lorry.", focus: "/l/ and /r/" },
    { id: "p-4", level: "C1", text: "The sixth sheikh's sixth sheep is sick.", focus: "consonant clusters" },
    { id: "p-5", level: "C1", text: "Generally speaking, the ubiquitous influence of technology is, arguably, both beneficial and detrimental.", focus: "C1 connected speech and stress" },
    { id: "p-6", level: "B2", text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", focus: "/w/ and /tʃ/" },
    { id: "p-7", level: "C1", text: "Comfortable, vegetable, miscellaneous, entrepreneur, hyperbole.", focus: "stress in long words" },
    { id: "p-8", level: "B2", text: "I'd like a large latte with low-fat milk, please.", focus: "/l/ in clusters" }
  ],

  // ===== LISTENING =====
  listening: [
    {
      id: "l-1", level: "B2", title: "A weather forecast",
      script: "Good evening, and welcome to the weather. Tomorrow will start cloudy across most of the country, with a chance of light rain in the south-east. By the afternoon, the clouds will clear, giving way to bright sunshine. Temperatures will reach a pleasant twenty-two degrees. However, towards the end of the week, a cold front from the north is expected to bring much cooler conditions and possibly some storms.",
      questions: [
        { q: "What will the weather be like tomorrow morning?", options: ["Sunny", "Cloudy with possible rain", "Stormy", "Snowy"], correct: 1 },
        { q: "What temperature is expected?", options: ["12°C", "22°C", "32°C", "2°C"], correct: 1 },
        { q: "What is expected later in the week?", options: ["Hotter weather", "A heatwave", "A cold front", "Fog"], correct: 2 }
      ]
    },
    {
      id: "l-2", level: "C1", title: "A podcast intro",
      script: "Welcome back to The Long View, the podcast where we step away from the news cycle and look at the deeper currents shaping our world. In today's episode, our guest, an urban historian, argues that the cities we now consider iconic were once dismissed as failures. From medieval marketplaces to modernist housing estates, what looks brilliant in hindsight often appeared, at the time, to be a costly mistake. So, what does that tell us about the cities we're building today? Stay with us.",
      questions: [
        { q: "What kind of podcast is this?", options: ["Daily news", "Sports analysis", "Long-term, historical perspective", "Cooking"], correct: 2 },
        { q: "What does the guest argue?", options: ["Modern cities are perfect.", "Iconic cities were once seen as failures.", "Cities should be abandoned.", "Cities have no history."], correct: 1 }
      ]
    },
    {
      id: "l-3", level: "B2", title: "Booking a table",
      script: "Hello, I'd like to book a table for four people for this Friday evening, around seven thirty if possible. One of the guests is vegetarian, so it would be helpful if you could send the menu in advance. Also, we'd prefer a quiet corner if you have one available. Thanks very much.",
      questions: [
        { q: "How many people is the booking for?", options: ["Two", "Three", "Four", "Five"], correct: 2 },
        { q: "What time is requested?", options: ["6:30", "7:00", "7:30", "8:30"], correct: 2 },
        { q: "What special request is made?", options: ["A live band", "A vegetarian-friendly menu and a quiet corner", "A discount", "Outdoor seating"], correct: 1 }
      ]
    }
  ],

  // ===== CHALLENGE BANK — 50+ varied questions =====
  challengeBank: [
    // Group A — classic grammar MCQ
    { type: "mcq", q: "Choose: 'If I _____ rich, I would travel everywhere.'", options: ["am", "were", "have been", "be"], correct: 1 },
    { type: "mcq", q: "'_____ I known earlier, I would have called.'", options: ["If", "Had", "Have", "Would"], correct: 1 },
    { type: "mcq", q: "Inversion: 'Never _____ such a sunset.'", options: ["I have seen", "have I seen", "I saw", "did I have seen"], correct: 1 },
    { type: "mcq", q: "Choose the passive: 'They cleaned the room.'", options: ["The room cleaned.", "The room was cleaned.", "The room is clean.", "The room has clean."], correct: 1 },
    { type: "mcq", q: "Modal of deduction: 'His coat is gone — he _____ left.'", options: ["must have", "must be", "could", "should"], correct: 0 },
    { type: "mcq", q: "Past perfect: 'By the time we arrived, the film _____.'", options: ["started", "had started", "starts", "was starting"], correct: 1 },
    { type: "mcq", q: "Fill the gap: 'She has lived here _____ 2018.'", options: ["for", "since", "from", "during"], correct: 1 },
    { type: "mcq", q: "Rarely _____ such talent in one team.", options: ["you see", "do you see", "you do see", "have see"], correct: 1 },
    { type: "mcq", q: "Cleft for emphasis on Monday:", options: ["It was on Monday that I called.", "On Monday I was calling.", "I called on Monday it was.", "It on Monday I called."], correct: 0 },
    { type: "mcq", q: "Most natural: 'What I really need _____ a holiday.'", options: ["is", "are", "be", "have"], correct: 0 },

    // Group B — vocabulary & meaning
    { type: "mcq", q: "Synonym of 'meticulous':", options: ["careless", "detailed", "loud", "tired"], correct: 1 },
    { type: "mcq", q: "Antonym of 'alleviate':", options: ["soothe", "reduce", "exacerbate", "ignore"], correct: 2 },
    { type: "mcq", q: "Best synonym of 'plausible':", options: ["likely", "ridiculous", "obvious", "boring"], correct: 0 },
    { type: "mcq", q: "Best meaning of 'sporadic':", options: ["regular", "constant", "occasional and irregular", "fast"], correct: 2 },
    { type: "mcq", q: "Best paraphrase of 'tantamount to admission':", options: ["a real admission", "almost a denial", "effectively an admission", "a strong rejection"], correct: 2 },
    { type: "mcq", q: "Most precise word: 'He felt a _____ of guilt.'", options: ["pang", "punch", "pinch", "patch"], correct: 0 },
    { type: "mcq", q: "Best fit: 'The two reports show a clear _____.'", options: ["discrepancy", "diligence", "deliberation", "diversion"], correct: 0 },
    { type: "mcq", q: "Choose the C1 word for 'a small but important difference in meaning':", options: ["nuance", "noise", "notion", "nature"], correct: 0 },

    // Group C — collocations & natural usage
    { type: "mcq", q: "Choose the natural collocation:", options: ["make a research", "do a research", "conduct research", "make a researches"], correct: 2 },
    { type: "mcq", q: "Which is correct?", options: ["Make a photo", "Take a photo", "Do a photo", "Pull a photo"], correct: 1 },
    { type: "mcq", q: "Which is natural?", options: ["heavy rain", "big rain", "strong rain", "thick rain"], correct: 0 },
    { type: "mcq", q: "Fix: 'The information are useful.'", options: ["are correct already", "informations are", "information is", "an information is"], correct: 2 },
    { type: "mcq", q: "Make it formal: 'Tell me when you can.'", options: ["Inform me when you can.", "Let me know when you can.", "At your earliest convenience, please advise.", "Talk to me soon."], correct: 2 },

    // Group D — phrasal verbs & idioms
    { type: "mcq", q: "Phrasal verb for 'to postpone':", options: ["put off", "put on", "put up", "put in"], correct: 0 },
    { type: "mcq", q: "Idiom: 'Once in a _____ moon.'", options: ["red", "blue", "green", "full"], correct: 1 },
    { type: "mcq", q: "What does 'cost an arm and a leg' mean?", options: ["A small price", "Very expensive", "A cheap deal", "Free of charge"], correct: 1 },
    { type: "mcq", q: "What does 'piece of cake' mean?", options: ["A real dessert", "Very easy", "A difficult task", "An old recipe"], correct: 1 },
    { type: "mcq", q: "'I'll _____ you back later.' (call again)", options: ["call up", "call on", "call back", "call in"], correct: 2 },
    { type: "mcq", q: "What does 'bring up' mean here? 'Don't bring up that topic.'", options: ["raise it / mention it", "lift it physically", "buy it", "translate it"], correct: 0 },

    // Group E — register & style
    { type: "mcq", q: "Pick the C1-style hedged claim:", options: ["TV is bad.", "Excessive TV may correlate with poorer outcomes in some children.", "Everyone hates TV.", "TV never helps."], correct: 1 },
    { type: "mcq", q: "Most formal:", options: ["Sorry for the late reply.", "My bad, late again!", "I apologise for the delayed response.", "Late, sorry."], correct: 2 },
    { type: "mcq", q: "Choose the best connector: 'The plan is bold; _____, it lacks detail.'", options: ["furthermore", "however", "consequently", "namely"], correct: 1 },

    // Group F — listen-and-choose (TTS plays the prompt)
    { type: "listen", q: "Listen and choose what was said:", playText: "I would have called you if I had known.", options: ["I would call you if I knew.", "I would have called you if I had known.", "I will call you when I know.", "I called you when I knew."], correct: 1 },
    { type: "listen", q: "Listen and choose what was said:", playText: "She has been working here for over a decade.", options: ["She works here for a decade.", "She worked here a decade ago.", "She has been working here for over a decade.", "She will work here for a decade."], correct: 2 },
    { type: "listen", q: "Listen and choose the correct sentence:", playText: "Had we left earlier, we would have caught the train.", options: ["If we leave earlier, we catch the train.", "We left earlier and caught the train.", "Had we left earlier, we would have caught the train.", "We had left earlier to catch the train."], correct: 2 },
    { type: "listen", q: "Listen — what did you hear?", playText: "The evidence is, arguably, compelling.", options: ["The evidence is hardly compelling.", "The evidence is, arguably, compelling.", "The evidence was never compelling.", "Evidence arguments are compelling."], correct: 1 },
    { type: "listen", q: "Listen carefully:", playText: "We anticipated strong demand throughout the quarter.", options: ["We anticipated strong demand throughout the quarter.", "We expected weak demand for the quarter.", "We had strong demand by the quarter.", "We didn't anticipate any demand."], correct: 0 },

    // Group G — find the error
    { type: "mcq", q: "Find the error: 'I have went to the store yesterday.'", options: ["'have went' → 'went' (past simple)", "'the store' → 'a store'", "'yesterday' is wrong here", "No error"], correct: 0 },
    { type: "mcq", q: "Find the error: 'She don't like coffee.'", options: ["'don't' → 'doesn't'", "'like' → 'likes'", "'coffee' → 'a coffee'", "No error"], correct: 0 },
    { type: "mcq", q: "Find the error: 'He's married with a doctor.'", options: ["'with' → 'to'", "'married' → 'marry'", "'a doctor' → 'doctor'", "No error"], correct: 0 },

    // Group H — spelling
    { type: "mcq", q: "Choose the correct spelling:", options: ["accomodate", "accommodate", "acommodate", "accommadate"], correct: 1 },
    { type: "mcq", q: "Choose the correct spelling:", options: ["recieve", "receive", "receeve", "receave"], correct: 1 },
    { type: "mcq", q: "Choose the correct spelling:", options: ["definately", "definitely", "definatly", "definitly"], correct: 1 },
    { type: "mcq", q: "Choose the correct spelling:", options: ["seperate", "separate", "saperate", "separete"], correct: 1 },

    // Group I — confusing pairs
    { type: "mcq", q: "Pick the correct word: 'Stress can _____ your sleep.'", options: ["affect", "effect", "afect", "effekt"], correct: 0 },
    { type: "mcq", q: "Pick the correct word: 'These shoes are too _____.'", options: ["lose", "looze", "loose", "louse"], correct: 2 },
    { type: "mcq", q: "Pick the correct word: 'Can I _____ your pen?'", options: ["lend", "loan", "borrow", "rent"], correct: 2 },
    { type: "mcq", q: "Pick the correct: '_____ going to the party.'", options: ["Their", "There", "They're", "Thear"], correct: 2 },

    // Group J — comprehension micro
    { type: "mcq", q: "'She's been on cloud nine since the news.' Meaning:", options: ["She's confused.", "She's extremely happy.", "She's flying soon.", "She's worried."], correct: 1 },
    { type: "mcq", q: "'Let's circle back to that.' In a meeting, this means:", options: ["Repeat exactly.", "Go in a circle.", "Return to it later.", "Forget it."], correct: 2 },
    { type: "mcq", q: "'It's a no-brainer.' Means:", options: ["A foolish idea.", "An obvious decision.", "Without thinking.", "Requires expertise."], correct: 1 },
    { type: "mcq", q: "'I'll get back to you.' Means:", options: ["I'll return physically.", "I'll respond later.", "I'll go behind you.", "I'll refuse."], correct: 1 }
  ],

  // ===== TYPING RACE TEXTS =====
  typingTexts: [
    {
      id: "t-1", level: "B1",
      text: "The morning was quiet and the streets were empty. I walked slowly to the small bakery on the corner, breathing in the cold air. The smell of fresh bread reached me before I opened the door. I smiled and ordered my usual coffee and a warm croissant."
    },
    {
      id: "t-2", level: "B2",
      text: "Learning a new language is rarely a straight line. There are good days when every word feels natural, and difficult days when nothing seems to make sense. The secret is not talent but consistency. Small daily steps, even when slow, will eventually carry you further than a single perfect week."
    },
    {
      id: "t-3", level: "B2",
      text: "Cities at night reveal their truest character. The crowds thin out, the noise softens, and the people who remain are often there for a reason. Some are working, some are lost in thought, and some are simply enjoying the quiet between two busy days."
    },
    {
      id: "t-4", level: "C1",
      text: "It is often said that technology brings us closer together, yet there is a quiet paradox in our constant connectivity. We send more messages than ever, but spend less time in the slow, attentive conversations that build real understanding. Convenience, it seems, can sometimes come at the expense of depth."
    },
    {
      id: "t-5", level: "C1",
      text: "Reading widely is, arguably, one of the most underrated habits of intellectual growth. It exposes you to perspectives you might never have encountered otherwise and sharpens your ability to evaluate complex ideas. Moreover, a habit of careful reading often translates, almost invisibly, into clearer thinking and more precise writing."
    },
    {
      id: "t-6", level: "B2",
      text: "The first cup of coffee in the morning is, for many people, a small ritual. They warm the mug, measure the grounds, and wait for the kettle. The whole process takes only a few minutes, but it sets the tone for the day ahead. It is a quiet promise to yourself that you will begin with care."
    }
  ]
};
