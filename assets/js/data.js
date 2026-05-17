// Comprehensive learning content — A1 through C2 levels.
window.AppData = {

  // ===== LESSONS — full CEFR ladder =====
  lessons: [

    // ---------- A1 ----------
    {
      id: "a1-tobe", level: "A1",
      title: "فعل to be (am / is / are)",
      summary: "أساس كل جملة إنجليزية. فعل 'الكينونة' للضمائر المختلفة.",
      duration: 8,
      sections: [
        { heading: "الضمائر مع to be",
          body: "I am | You are | He is | She is | It is | We are | They are. هذا الفعل أصل بناء آلاف الجمل.",
          examples: [
            { en: "I am a student.", ar: "أنا طالب." },
            { en: "She is happy.", ar: "هي سعيدة." },
            { en: "They are at home.", ar: "هم في البيت." }
          ]
        },
        { heading: "الاختصارات (Contractions)",
          body: "I'm | You're | He's | She's | It's | We're | They're. هذي الصيغة الأكثر استخدامًا في المحادثة.",
          examples: [
            { en: "I'm tired.", ar: "أنا تعبان." },
            { en: "He's a doctor.", ar: "هو دكتور." }
          ]
        },
        { heading: "النفي والسؤال",
          body: "للنفي: am not / isn't / aren't. للسؤال: ابدأ بـ am/is/are.",
          examples: [
            { en: "She isn't here.", ar: "هي ما هي موجودة." },
            { en: "Are you ready?", ar: "أنت جاهز؟" }
          ]
        }
      ],
      quiz: [
        { q: "She _____ my sister.", options: ["am", "is", "are", "be"], correct: 1, explain: "He/She/It → is." },
        { q: "_____ you tired?", options: ["Am", "Is", "Are", "Do"], correct: 2, explain: "السؤال مع you → Are." },
        { q: "They _____ from Spain.", options: ["is", "are", "am", "be"], correct: 1 }
      ]
    },
    {
      id: "a1-simple-present", level: "A1",
      title: "المضارع البسيط (Simple Present)",
      summary: "للحقائق والعادات اليومية. أهم زمن للمبتدئين.",
      duration: 10,
      sections: [
        { heading: "متى نستخدمه",
          body: "للأشياء اللي تصير دائمًا أو عادة: I go to school every day. — للحقائق العامة: Water boils at 100°C." },
        { heading: "صيغة الفعل",
          body: "أكثر الضمائر يبقى الفعل عادي. لكن مع He/She/It نضيف 's' في النهاية.",
          examples: [
            { en: "I play football on Fridays.", ar: "ألعب كرة قدم كل جمعة." },
            { en: "She plays the piano.", ar: "هي تعزف على البيانو." },
            { en: "They live in Riyadh.", ar: "هم يسكنون في الرياض." }
          ]
        },
        { heading: "النفي والسؤال",
          body: "نستخدم do/does. النفي: don't/doesn't. السؤال: Do/Does + الفاعل + الفعل.",
          examples: [
            { en: "I don't drink coffee.", ar: "ما أشرب قهوة." },
            { en: "Does she speak English?", ar: "هل تتكلم إنجليزي؟" }
          ]
        }
      ],
      quiz: [
        { q: "He _____ tennis every weekend.", options: ["play", "plays", "playing", "is play"], correct: 1, explain: "مع He/She/It نضيف s." },
        { q: "_____ they live here?", options: ["Do", "Does", "Are", "Is"], correct: 0 },
        { q: "She _____ like fish.", options: ["don't", "doesn't", "isn't", "not"], correct: 1 }
      ]
    },
    {
      id: "a1-question-words", level: "A1",
      title: "كلمات السؤال (WH-Questions)",
      summary: "What, Where, When, Who, Why, How — مفاتيح أي سؤال إنجليزي.",
      duration: 8,
      sections: [
        { heading: "أهم كلمات السؤال",
          body: "What = ماذا/ما | Where = أين | When = متى | Who = من | Why = لماذا | How = كيف | Which = أيّ | Whose = لمن",
          examples: [
            { en: "What is your name?", ar: "ما اسمك؟" },
            { en: "Where do you live?", ar: "وين تسكن؟" },
            { en: "Why are you late?", ar: "ليش متأخر؟" },
            { en: "How old are you?", ar: "كم عمرك؟" }
          ]
        }
      ],
      quiz: [
        { q: "_____ is your birthday?", options: ["What", "When", "Where", "Who"], correct: 1 },
        { q: "_____ do you go to work?", options: ["What", "Why", "How", "Who"], correct: 2 }
      ]
    },

    // ---------- A2 ----------
    {
      id: "a2-past-simple", level: "A2",
      title: "الماضي البسيط للأفعال المنتظمة وغير المنتظمة",
      summary: "تكلم عن أمس ولحظات حصلت وانتهت. أساس الحكي والقصص.",
      duration: 12,
      sections: [
        { heading: "الأفعال المنتظمة (Regular)",
          body: "نضيف '-ed' في النهاية: play → played, watch → watched, study → studied.",
          examples: [
            { en: "I watched a film last night.", ar: "شفت فيلم البارحة." },
            { en: "She studied for hours.", ar: "ذاكرت لساعات." }
          ]
        },
        { heading: "الأفعال غير المنتظمة (Irregular)",
          body: "تتغير بشكلها الخاص ولازم تحفظها: go → went, eat → ate, see → saw, have → had, take → took.",
          examples: [
            { en: "I went to Madinah last summer.", ar: "رحت المدينة الصيف الماضي." },
            { en: "We had dinner at 8.", ar: "تعشينا الساعة 8." }
          ]
        },
        { heading: "النفي والسؤال",
          body: "نستخدم did. النفي: didn't + فعل في المصدر. السؤال: Did + فاعل + فعل في المصدر.",
          examples: [
            { en: "I didn't see him.", ar: "ما شفته." },
            { en: "Did you eat?", ar: "أكلت؟" }
          ]
        }
      ],
      quiz: [
        { q: "Yesterday I _____ to the park.", options: ["go", "goes", "went", "gone"], correct: 2 },
        { q: "She _____ very tired last night.", options: ["was", "is", "are", "be"], correct: 0 },
        { q: "_____ you see the news?", options: ["Do", "Did", "Does", "Are"], correct: 1 },
        { q: "He _____ his keys at home.", options: ["leave", "left", "leaves", "leaving"], correct: 1 }
      ]
    },
    {
      id: "a2-present-continuous", level: "A2",
      title: "المضارع المستمر (Present Continuous)",
      summary: "لما تتكلم عن شي يصير الآن أو فترة هذي.",
      duration: 10,
      sections: [
        { heading: "الصيغة",
          body: "am/is/are + فعل بـ -ing. للأشياء اللي تحدث الآن، أو ترتيبات مستقبلية.",
          examples: [
            { en: "I am reading a book.", ar: "أنا أقرأ كتاب الآن." },
            { en: "She is working from home today.", ar: "تشتغل من البيت اليوم." },
            { en: "We are flying to Dubai next week.", ar: "نسافر دبي الأسبوع الجاي (مرتب)." }
          ]
        },
        { heading: "الفرق عن المضارع البسيط",
          body: "Simple Present = عادة/حقيقة. Present Continuous = الآن/مؤقت.",
          examples: [
            { en: "I drink coffee every day. — I'm drinking tea right now.", ar: "أشرب قهوة كل يوم. — أشرب شاي الحين." }
          ]
        }
      ],
      quiz: [
        { q: "Look! It _____.", options: ["rains", "is raining", "rain", "raining"], correct: 1 },
        { q: "She _____ a new job at the moment.", options: ["looks for", "is looking for", "look for", "looking"], correct: 1 }
      ]
    },
    {
      id: "a2-comparatives", level: "A2",
      title: "المقارنة والتفضيل (Comparatives & Superlatives)",
      summary: "أطول، أكبر، الأفضل — كيف تقارن الأشياء.",
      duration: 10,
      sections: [
        { heading: "الصفات القصيرة",
          body: "نضيف '-er' للمقارنة و'-est' للتفضيل. tall → taller → tallest.",
          examples: [
            { en: "My brother is taller than me.", ar: "أخوي أطول مني." },
            { en: "Mount Everest is the tallest mountain.", ar: "إيفرست هو أطول جبل." }
          ]
        },
        { heading: "الصفات الطويلة",
          body: "نستخدم more/most. interesting → more interesting → most interesting.",
          examples: [
            { en: "This book is more interesting.", ar: "هذا الكتاب أكثر تشويقًا." },
            { en: "It's the most beautiful city.", ar: "هي أجمل مدينة." }
          ]
        },
        { heading: "الشاذ (Irregular)",
          body: "good → better → best | bad → worse → worst | far → further → furthest." }
      ],
      quiz: [
        { q: "London is _____ than Paris.", options: ["big", "bigger", "biggest", "more big"], correct: 1 },
        { q: "This is the _____ pizza in town.", options: ["good", "better", "best", "more good"], correct: 2 }
      ]
    },

    // ---------- B1 ----------
    {
      id: "b1-narrative-tenses", level: "B1",
      title: "أزمنة الحكاية (Narrative Tenses)",
      summary: "الماضي البسيط، المستمر، والتام — ثلاث تروس لرواية القصص.",
      duration: 12,
      sections: [
        { heading: "Past Simple — العمود الفقري للقصة", body: "أحداث متتابعة. 'I woke up, brushed my teeth, left the house.'" },
        { heading: "Past Continuous — خلفية الحدث", body: "شي كان مستمر لما حصل حدث ثاني. 'I was walking home when it started to rain.'" },
        { heading: "Past Perfect — حدث قبل حدث ماضي", body: "حدث صار قبل حدث ماضي ثاني. 'When I arrived, the meeting had already started.'" }
      ],
      quiz: [
        { q: "She _____ TV when the phone rang.", options: ["watched", "was watching", "had watched", "had been watching"], correct: 1 },
        { q: "By the time we got to the cinema, the film _____.", options: ["started", "was starting", "had started", "has started"], correct: 2 }
      ]
    },
    {
      id: "b1-future-tenses", level: "B1",
      title: "المستقبل: will, going to, present continuous",
      summary: "ثلاث طرق للتعبير عن المستقبل ولكل واحدة استخدامها الدقيق.",
      duration: 11,
      sections: [
        { heading: "will — قرارات لحظية وتوقعات",
          body: "نستخدمه للقرارات الفجائية، والتوقعات، والوعود.",
          examples: [
            { en: "I'll have a coffee, please.", ar: "آخذ قهوة، لو سمحت. (قرار لحظي)" },
            { en: "It will probably rain tomorrow.", ar: "بيمطر بكرة على الأغلب." }
          ]
        },
        { heading: "going to — خطط ودلائل",
          body: "للخطط اللي قررتها مسبقًا، والتوقعات المبنية على دليل واضح.",
          examples: [
            { en: "I'm going to study medicine.", ar: "بأدرس طب. (خطة مسبقة)" },
            { en: "Look at those clouds — it's going to rain.", ar: "شف الغيوم — بتمطر (دليل)." }
          ]
        },
        { heading: "Present Continuous — ترتيبات مؤكدة",
          body: "للترتيبات الثابتة (موعد، رحلة) المحددة الزمان.",
          examples: [
            { en: "I'm meeting Sara at 7.", ar: "بأقابل سارة الساعة 7. (موعد مرتب)" }
          ]
        }
      ],
      quiz: [
        { q: "I think it _____ snow tomorrow.", options: ["is going to", "will", "is", "is snowing"], correct: 1 },
        { q: "Be careful — you _____ fall!", options: ["will", "are going to", "fall", "going"], correct: 1 }
      ]
    },
    {
      id: "b1-modals-advice", level: "B1",
      title: "الأفعال الناقصة للنصح والإلزام",
      summary: "should, must, have to, ought to — كيف تنصح أو تلزم؟",
      duration: 10,
      sections: [
        { heading: "should / ought to — نصيحة",
          body: "نصيحة شخصية، رأي.",
          examples: [
            { en: "You should drink more water.", ar: "لازم تشرب ماء أكثر (نصيحة)." }
          ]
        },
        { heading: "must — إلزام داخلي قوي",
          body: "تشعر بضرورة قوية، شخصية.",
          examples: [
            { en: "I must finish this report tonight.", ar: "لازم أخلّص التقرير الليلة." }
          ]
        },
        { heading: "have to — إلزام خارجي",
          body: "قاعدة، قانون، أمر من غيرك.",
          examples: [
            { en: "You have to wear a seatbelt.", ar: "لازم تربط حزام الأمان (قانون)." }
          ]
        }
      ],
      quiz: [
        { q: "It's raining. You _____ take an umbrella.", options: ["should", "have", "must to", "shouldn't"], correct: 0 },
        { q: "Drivers _____ stop at red lights.", options: ["should", "have to", "could", "might"], correct: 1 }
      ]
    },

    // ---------- B2 ----------
    {
      id: "b2-present-perfect", level: "B2",
      title: "Present Perfect vs Past Simple",
      summary: "أتقن متى تستخدم 'have done' ومتى 'did' — أكبر فرق بين B1 و B2.",
      duration: 12,
      sections: [
        { heading: "ليش هذا الدرس مهم؟",
          body: "في العربية ما نفرّق نحويًا بين 'انتهيتُ' (ماضي) و'قد انتهيتُ' (له أثر الآن). الإنجليزية تهتم بهذا الفرق، وإتقانه قفزة من B1 إلى B2." },
        { heading: "Past Simple — حدث منتهي بوقت محدد",
          body: "للوقت المنتهي والمذكور: yesterday, last week, in 2020.",
          examples: [
            { en: "I visited Paris in 2019.", ar: "زرت باريس في 2019." }
          ]
        },
        { heading: "Present Perfect — أثر للحاضر",
          body: "للأفعال الماضية التي أثرها أو نتيجتها ما زالت الآن. الوقت غير محدد أو فترة مفتوحة.",
          examples: [
            { en: "I have lived here since 2018.", ar: "أعيش هنا من 2018 (لحدّ الحين)." },
            { en: "She has just called me.", ar: "اتصلت فيني قبل شوي." }
          ]
        },
        { heading: "كلمات إشارة", body: "Past Simple: yesterday, ago, in [year]. Present Perfect: just, already, yet, ever, since, for." }
      ],
      quiz: [
        { q: "I _____ my keys. I can't find them.", options: ["lost", "have lost", "was losing", "had lost"], correct: 1, explain: "النتيجة (ما يلقاها) مؤثرة الآن." },
        { q: "Shakespeare _____ many plays.", options: ["has written", "wrote", "was writing", "writes"], correct: 1 },
        { q: "_____ you ever _____ sushi?", options: ["Did / try", "Have / tried", "Were / trying", "Had / tried"], correct: 1 },
        { q: "I _____ him last Friday.", options: ["have met", "met", "had met", "was meeting"], correct: 1 }
      ]
    },
    {
      id: "b2-conditionals", level: "B2",
      title: "إتقان الجمل الشرطية (0 إلى 3 + مختلط)",
      summary: "من الاحتمال الواقعي إلى الافتراض الماضي — تحكّم في كل أنواع الشرط.",
      duration: 18,
      sections: [
        { heading: "النوع الصفري — حقائق عامة", body: "If + present, present.",
          examples: [{ en: "If you heat water, it boils.", ar: "إذا سخّنت الماء، يغلي." }] },
        { heading: "النوع الأول — احتمال واقعي مستقبلي", body: "If + present, will + infinitive.",
          examples: [{ en: "If it rains, we'll stay home.", ar: "إذا أمطرت، نقعد بالبيت." }] },
        { heading: "النوع الثاني — افتراضي حاضر/مستقبل", body: "If + past simple, would + infinitive.",
          examples: [
            { en: "If I were you, I'd accept.", ar: "لو كنت مكانك، كنت قبلت." }
          ]
        },
        { heading: "النوع الثالث — افتراضي ماضي", body: "If + past perfect, would have + past participle.",
          examples: [{ en: "If I had studied, I would have passed.", ar: "لو ذاكرت، كنت نجحت." }]
        },
        { heading: "المختلط", body: "If + past perfect, would + infinitive.",
          examples: [{ en: "If she had taken the job, she would be in London now.", ar: "لو أخذت الوظيفة، كانت بلندن الحين." }]
        }
      ],
      quiz: [
        { q: "If I _____ rich, I'd buy a house.", options: ["am", "was", "were", "had been"], correct: 2 },
        { q: "If you had told me, I _____ you.", options: ["would help", "will help", "would have helped", "had helped"], correct: 2 },
        { q: "Water _____ at 0°C.", options: ["freezes", "would freeze", "will freeze", "freezed"], correct: 0 }
      ]
    },
    {
      id: "b2-modals-deduction", level: "B2",
      title: "الأفعال الناقصة للاستنتاج (must / might / can't)",
      summary: "عبّر عن درجة تأكدك من الأشياء.",
      duration: 10,
      sections: [
        { heading: "الاستنتاج الحاضر", body: "must = أكيد. might/could/may = محتمل. can't = مستحيل.",
          examples: [
            { en: "He must be tired — he worked 14 hours.", ar: "أكيد متعب — اشتغل 14 ساعة." },
            { en: "That can't be true.", ar: "مستحيل صحيح." }
          ]
        },
        { heading: "الاستنتاج الماضي", body: "must/might/can't + have + past participle.",
          examples: [
            { en: "She must have left.", ar: "أكيد طلعت." }
          ]
        }
      ],
      quiz: [
        { q: "His car isn't here. He _____ at work.", options: ["must be", "can't be", "might not be", "shouldn't be"], correct: 0 },
        { q: "The lights are off. They _____ to bed.", options: ["must go", "must have gone", "can't go", "might go"], correct: 1 }
      ]
    },
    {
      id: "b2-phrasal-verbs", level: "B2",
      title: "الأفعال المركبة الشائعة",
      summary: "أهم 30 فعل مركب راح تقابلها يوميًا في المحادثة والقراءة.",
      duration: 15,
      sections: [
        { heading: "ليش هي مهمة؟", body: "هي روح المحادثة الإنجليزية. 'put off' بدل 'postpone' تطلع لهجتك طبيعية." },
        { heading: "أهم 10 لازم تعرفها", body: "look up, bring up, put off, get along, turn down, come up with, look forward to, figure out, give up, run into." }
      ],
      quiz: [
        { q: "Can you _____ the meeting?", options: ["put up", "put off", "put on", "put through"], correct: 1 },
        { q: "I can't _____ what he said.", options: ["figure out", "figure up", "figure in", "figure away"], correct: 0 }
      ]
    },
    {
      id: "b2-passive", level: "B2",
      title: "المبني للمجهول — ما يتجاوز الأساسيات",
      summary: "استخدم المجهول لتغيّر التركيز، تظهر الرسمية، أو تتحدث بدبلوماسية.",
      duration: 12,
      sections: [
        { heading: "الصيغة", body: "be + past participle. الفاعل اختياري (by)." },
        { heading: "متى نستخدمه",
          body: "الفاعل غير معروف، للتركيز على النتيجة، للرسمية، أو للدبلوماسية ('Mistakes were made')." },
        { heading: "أزمنة صعبة",
          examples: [
            { en: "The project is being reviewed.", ar: "المشروع تتم مراجعته حاليًا." },
            { en: "The report has been submitted.", ar: "تم تسليم التقرير." }
          ]
        }
      ],
      quiz: [
        { q: "The window _____ yesterday.", options: ["was broken", "broke", "has been broken", "is broken"], correct: 0 },
        { q: "Your order _____ right now.", options: ["is processed", "is being processed", "has been processed", "processes"], correct: 1 }
      ]
    },

    // ---------- C1 ----------
    {
      id: "c1-inversion", level: "C1",
      title: "القلب النحوي للتوكيد (Inversion)",
      summary: "أعطِ كلامك طابعًا أدبيًا متقدمًا.",
      duration: 14,
      sections: [
        { heading: "النمط الأساسي",
          body: "لما الظرف السلبي يكون في بداية الجملة، نقلب فعل المساعدة والفاعل.",
          examples: [
            { en: "Never have I seen such beauty.", ar: "لم أرَ مثل هذا الجمال أبدًا." },
            { en: "Rarely does she complain.", ar: "نادرًا ما تشتكي." }
          ]
        },
        { heading: "أهم الكلمات", body: "Never, rarely, seldom, hardly, not only, under no circumstances, only when." },
        { heading: "قلب الشرط",
          examples: [
            { en: "Had I known, I would have called.", ar: "لو كنت أعرف، اتصلت." }
          ]
        }
      ],
      quiz: [
        { q: "Never _____ such a generous offer.", options: ["I have seen", "have I seen", "I saw", "did I saw"], correct: 1 },
        { q: "_____ I known, I would have helped.", options: ["If had", "Had", "If I have", "Have"], correct: 1 }
      ]
    },
    {
      id: "c1-cleft-sentences", level: "C1",
      title: "جمل التركيز (Cleft Sentences)",
      summary: "سلّط الضوء على الجزء المهم في جملتك. ركيزة C1.",
      duration: 12,
      sections: [
        { heading: "It-cleft",
          examples: [
            { en: "It was John who broke the vase.", ar: "جون هو من كسر الإناء." }
          ]
        },
        { heading: "What-cleft",
          examples: [
            { en: "What I need is a long holiday.", ar: "اللي محتاجه إجازة طويلة." }
          ]
        }
      ],
      quiz: [
        { q: "Choose the cleft for 'on Tuesday':", options: ["It was on Tuesday that I called him.", "What I called him was on Tuesday.", "On Tuesday was when I called him.", "I called him it was Tuesday."], correct: 0 }
      ]
    },
    {
      id: "c1-hedging", level: "C1",
      title: "التحفّظ في الكلام (Hedging)",
      summary: "الإنجليزية الأكاديمية تتجنب الحسم المطلق.",
      duration: 10,
      sections: [
        { heading: "ليش نتحفظ؟",
          body: "C1 الأكاديمي والمهني يخفف الحسم. 'This is wrong' → 'This may be problematic'." },
        { heading: "أدوات", body: "may, might, could, perhaps, possibly, arguably, appears to, seems to, tends to." }
      ],
      quiz: [
        { q: "Pick the most C1 hedged claim:", options: ["Coffee is bad for you.", "Coffee tends to disrupt sleep in some individuals.", "Everyone hates coffee at night.", "Coffee never lets people sleep."], correct: 1 }
      ]
    },
    {
      id: "c1-discourse-markers", level: "C1",
      title: "أدوات الربط (Discourse Markers)",
      summary: "اللافتات اللي تحوّل جملك المتفرقة إلى نص متدفق.",
      duration: 11,
      sections: [
        { heading: "للتناقض", body: "however, nevertheless, on the contrary, that said." },
        { heading: "للإضافة", body: "moreover, furthermore, on top of that, what's more." },
        { heading: "للنتيجة", body: "consequently, therefore, as a result, thus." }
      ],
      quiz: [
        { q: "The plan worked; _____, the team got a bonus.", options: ["however", "consequently", "on the contrary", "namely"], correct: 1 }
      ]
    },

    // ---------- C2 ----------
    {
      id: "c2-subjunctive", level: "C2",
      title: "الصيغة الإنشائية (Subjunctive Mood)",
      summary: "صيغة نادرة لكنها علامة على الإنجليزية الأدبية والرسمية الراقية.",
      duration: 14,
      sections: [
        { heading: "ما هي الـ Subjunctive؟",
          body: "صيغة فعل خاصة تستخدم بعد أفعال الاقتراح والإلزام والتمني. الفعل يبقى بصيغة المصدر بغض النظر عن الفاعل." },
        { heading: "بعد أفعال الاقتراح",
          body: "suggest, recommend, insist, demand, propose + that + فاعل + فعل في المصدر.",
          examples: [
            { en: "I suggest that he leave immediately.", ar: "أقترح أن يغادر فورًا. (ليس 'leaves')" },
            { en: "The board insists that she be present.", ar: "المجلس يصرّ على حضورها. (ليس 'is')" }
          ]
        },
        { heading: "بعد التمنيات والافتراضات",
          body: "wish, if only, as if + were (لكل الضمائر).",
          examples: [
            { en: "I wish I were taller.", ar: "ليتني أطول." },
            { en: "He talks as if he were the boss.", ar: "يتكلم كأنه المدير." }
          ]
        }
      ],
      quiz: [
        { q: "I suggest that he _____ home.", options: ["goes", "go", "going", "will go"], correct: 1, explain: "Subjunctive — go بدون s." },
        { q: "I wish I _____ a doctor.", options: ["am", "was", "were", "will be"], correct: 2 }
      ]
    },
    {
      id: "c2-formal-register", level: "C2",
      title: "السجل الرسمي والمحايد",
      summary: "كيف ترفع لهجتك من اليومي للأكاديمي/المهني الراقي.",
      duration: 12,
      sections: [
        { heading: "تحويل الأفعال البسيطة لأسماء (Nominalisation)",
          body: "في C2 الأكاديمي، نحوّل الأفعال لأسماء.",
          examples: [
            { en: "Casual: They decided quickly. → Formal: A swift decision was reached.", ar: "عادي: قرروا بسرعة. → رسمي: تم التوصل لقرار سريع." }
          ]
        },
        { heading: "استبدال الكلمات اليومية",
          body: "get → obtain/receive | show → demonstrate/indicate | think about → consider | a lot of → considerable | also → furthermore." },
        { heading: "تجنب التعبيرات العامية",
          body: "في الكتابة الرسمية: لا تستخدم 'gonna', 'kids', 'stuff', 'a bit'. استخدم 'going to', 'children', 'matters', 'somewhat'." }
      ],
      quiz: [
        { q: "Most formal:", options: ["The team got the result fast.", "The team obtained the result swiftly.", "The team got it quick.", "The team got results super fast."], correct: 1 }
      ]
    },
    {
      id: "c2-cohesion", level: "C2",
      title: "تماسك النص (Cohesion & Reference)",
      summary: "كيف تربط أفكارك بأناقة بدون تكرار.",
      duration: 11,
      sections: [
        { heading: "الإحالة (Reference)",
          body: "استخدم الضمائر والإشارات لتجنب التكرار: this, that, these, those, the former, the latter, the issue, the matter, the case." },
        { heading: "الاستبدال (Substitution)",
          body: "do/so/one — تستبدل العنصر السابق.",
          examples: [
            { en: "She works hard, and so does he.", ar: "هي تشتغل بجد، وهو كذلك." },
            { en: "If you need an umbrella, I have one.", ar: "إذا تحتاج مظلة، عندي وحدة." }
          ]
        },
        { heading: "الحذف (Ellipsis)",
          body: "حذف ما هو مفهوم من السياق.",
          examples: [
            { en: "She wanted to come but couldn't (come).", ar: "بغت تجي بس ما قدرت." }
          ]
        }
      ],
      quiz: [
        { q: "Most natural: 'I called her; _____ didn't reply.'", options: ["she however", "however, she", "however she", "she she"], correct: 1 }
      ]
    }
  ],

  // ===== EXPLANATIONS (bilingual cards) =====
  explanations: [
    { id: "exp-greetings", title: "Greetings & small talk", titleAr: "التحية والحديث الخفيف", icon: "👋", level: "A2",
      items: [
        { en: "How's it going?", ar: "كيف الأحوال؟", note: "أكثر طبيعية من 'How are you?'." },
        { en: "Long time no see!", ar: "زمان عنك!", note: "تعبير ودود." },
        { en: "What have you been up to?", ar: "وش أخبارك آخر فترة؟", note: "سؤال مفتوح." },
        { en: "Not much, just the usual.", ar: "ولا شي، نفس الروتين.", note: "رد عام مهذب." },
        { en: "Take care!", ar: "خلِّ بالك من نفسك! (في الوداع)", note: "أكثر دفئًا من 'goodbye'." }
      ]
    },
    { id: "exp-agreement", title: "Agreeing & disagreeing politely", titleAr: "الموافقة والاعتراض بأدب", icon: "🤝", level: "B2",
      items: [
        { en: "I see your point, but…", ar: "أفهم وجهة نظرك، بس…", note: "أفضل من 'You're wrong'." },
        { en: "That's a fair point.", ar: "هذي نقطة وجيهة.", note: "تعترف بصحة الطرف الآخر." },
        { en: "I'm not so sure about that.", ar: "ما أنا متأكد من هذا.", note: "اعتراض ناعم." },
        { en: "I couldn't agree more.", ar: "ما أوافقك أكثر من هذا (=موافق تمامًا).", note: "تركيب قوي للموافقة." },
        { en: "With all due respect, I have to disagree.", ar: "مع كامل احترامي، لازم أختلف.", note: "اعتراض رسمي مهذب." }
      ]
    },
    { id: "exp-emails", title: "Professional email phrases", titleAr: "عبارات الإيميل الاحترافي", icon: "📧", level: "B2",
      items: [
        { en: "I hope this email finds you well.", ar: "أتمنى أن يصلك هذا الإيميل وأنت بخير.", note: "افتتاحية شائعة." },
        { en: "I'm writing to inquire about…", ar: "أكتب لك للاستفسار عن…", note: "افتتاحية رسمية لاستفسار." },
        { en: "Please find attached…", ar: "تجد بالمرفقات…", note: "للملفات المرفقة." },
        { en: "Could you kindly confirm by Friday?", ar: "ممكن من فضلك تأكد قبل الجمعة؟", note: "طلب مهذب بوقت محدد." },
        { en: "Looking forward to your reply.", ar: "بانتظار ردك.", note: "خاتمة احترافية." },
        { en: "Best regards, / Kind regards,", ar: "مع أطيب التحيات،", note: "خاتمة رسمية." }
      ]
    },
    { id: "exp-opinion", title: "Expressing opinions", titleAr: "التعبير عن الرأي", icon: "💭", level: "B2",
      items: [
        { en: "From my perspective, …", ar: "من وجهة نظري، …", note: "أكثر ثراءً من 'I think'." },
        { en: "It seems to me that…", ar: "يبدو لي أن…", note: "أسلوب لطيف." },
        { en: "I'd argue that…", ar: "أزعم أن…", note: "تعبير قوي للنقاش." },
        { en: "As far as I'm concerned…", ar: "حسب رأيي…", note: "تركيز على الشخصي." },
        { en: "There's no denying that…", ar: "لا يمكن إنكار أن…", note: "للحقائق الواضحة." }
      ]
    },
    { id: "exp-travel", title: "Travel essentials", titleAr: "أساسيات السفر", icon: "✈️", level: "A2",
      items: [
        { en: "Could I have an aisle seat, please?", ar: "ممكن مقعد بجانب الممر؟", note: "Aisle=الممر، Window=النافذة." },
        { en: "I'd like to check in this bag.", ar: "أبي أسجّل هذي الشنطة.", note: "للأمتعة الكبيرة." },
        { en: "How long is the layover?", ar: "كم مدة الترانزيت؟", note: "Layover=وقت التوقف." },
        { en: "Is there a shuttle to the city center?", ar: "في باص مكوكي للمدينة؟", note: "Shuttle=نقل بين نقطتين." },
        { en: "Could you call me a cab?", ar: "ممكن تطلب لي تاكسي؟", note: "Cab أمريكي." }
      ]
    },
    { id: "exp-idioms", title: "Common idioms", titleAr: "تعابير اصطلاحية شائعة", icon: "🎭", level: "B2",
      items: [
        { en: "It's a piece of cake.", ar: "شي سهل جدًا.", note: "للأشياء السهلة." },
        { en: "Break a leg!", ar: "بالتوفيق! (للممثلين)", note: "ما تأخذه حرفيًا!" },
        { en: "Hit the books.", ar: "ذاكر بجد.", note: "شائع بين الطلاب." },
        { en: "Once in a blue moon.", ar: "كل فترة طويلة، نادرًا.", note: "للأشياء النادرة." },
        { en: "Cost an arm and a leg.", ar: "غالي جدًا.", note: "للأشياء المكلفة." },
        { en: "Bite the bullet.", ar: "واجه الموقف الصعب.", note: "لتحمّل شي ما تقدر تتجنبه." }
      ]
    },
    { id: "exp-difference-pairs", title: "Easily confused words", titleAr: "كلمات يلتبس معناها", icon: "🔀", level: "B2",
      items: [
        { en: "Affect vs Effect", ar: "Affect (فعل)=يؤثر. Effect (اسم)=التأثير.", note: "Stress affects sleep. The effect was huge." },
        { en: "Lose vs Loose", ar: "Lose=يفقد. Loose=فضفاض.", note: "I lose my keys. Pants are loose." },
        { en: "Their / There / They're", ar: "Their=ملكية. There=هناك. They're=they are.", note: "نفس النطق مختلفة المعنى." },
        { en: "Borrow vs Lend", ar: "Borrow=يستعير. Lend=يُعير.", note: "Can I borrow? I'll lend you." },
        { en: "Bring vs Take", ar: "Bring=يحضر إليك. Take=يأخذ بعيدًا.", note: "Bring me / Take this away." }
      ]
    },
    { id: "exp-business", title: "Business meeting language", titleAr: "لغة الاجتماعات المهنية", icon: "💼", level: "C1",
      items: [
        { en: "Let's get the ball rolling.", ar: "خلونا نبدأ.", note: "افتتاحية ودودة." },
        { en: "Could you walk me through it?", ar: "ممكن تشرحها لي خطوة بخطوة؟", note: "أفضل من 'explain'." },
        { en: "Let's circle back to that.", ar: "نرجع لها لاحقًا.", note: "لتأجيل بدون تجاهل." },
        { en: "Are we all on the same page?", ar: "كلنا متفقين؟", note: "للتأكد من التوافق." },
        { en: "Let's take this offline.", ar: "نناقشها على جنب.", note: "ليس بالضرورة خارج الإنترنت." }
      ]
    },
    { id: "exp-collocations", title: "Natural collocations", titleAr: "التراكيب الطبيعية", icon: "🧩", level: "C1",
      items: [
        { en: "Make a decision (NOT do)", ar: "نقول 'make' مع decision.", note: "اختيار الأفعال دقيق." },
        { en: "Heavy traffic / Heavy rain", ar: "زحمة / مطر غزير.", note: "نستخدم 'heavy' للكثافة." },
        { en: "Strong coffee / Weak tea", ar: "قهوة ثقيلة / شاي خفيف.", note: "نقول strong/weak." },
        { en: "Take a photo (NOT make)", ar: "ناخذ صورة (take).", note: "خطأ شائع." },
        { en: "Catch a cold / Get a cold", ar: "نصاب بنزلة برد.", note: "الاثنين صح." }
      ]
    },
    { id: "exp-restaurant", title: "At a restaurant", titleAr: "في المطعم", icon: "🍽️", level: "A2",
      items: [
        { en: "Could we get the menu, please?", ar: "ممكن قائمة الطعام؟", note: "افتتاحية مهذبة." },
        { en: "What do you recommend?", ar: "وش تنصح فيه؟", note: "سؤال ودود." },
        { en: "I'll have the…", ar: "أبي… / آخذ…", note: "للطلب." },
        { en: "Could we get the bill, please?", ar: "ممكن الفاتورة؟", note: "Bill بريطاني، Check أمريكي." },
        { en: "Keep the change.", ar: "خلِّ الباقي (بقشيش).", note: "تعبير لطيف." }
      ]
    }
  ],

  // ===== VOCABULARY — A1 to C2 =====
  vocabulary: [
    // A1
    { word: "happy", ipa: "/ˈhæp.i/", pos: "adj.", level: "A1", def: "Feeling good and pleased.", defAr: "سعيد، مبسوط.", ex: "I'm happy to see you." },
    { word: "tired", ipa: "/ˈtaɪəd/", pos: "adj.", level: "A1", def: "Feeling that you need to rest or sleep.", defAr: "تعبان، يحتاج راحة.", ex: "I'm tired after work." },
    { word: "house", ipa: "/haʊs/", pos: "noun", level: "A1", def: "A building where people live.", defAr: "بيت، مسكن.", ex: "My house is small." },
    { word: "walk", ipa: "/wɔːk/", pos: "verb", level: "A1", def: "To move forward on your feet.", defAr: "يمشي على رجليه.", ex: "I walk to school." },
    { word: "fast", ipa: "/fɑːst/", pos: "adj./adv.", level: "A1", def: "Moving or happening quickly.", defAr: "سريع.", ex: "He runs fast." },
    // A2
    { word: "borrow", ipa: "/ˈbɒr.əʊ/", pos: "verb", level: "A2", def: "To take something temporarily.", defAr: "يستعير شيئًا مؤقتًا.", ex: "Can I borrow your pen?" },
    { word: "decide", ipa: "/dɪˈsaɪd/", pos: "verb", level: "A2", def: "To choose something after thinking.", defAr: "يقرر بعد التفكير.", ex: "I decided to study English." },
    { word: "weather", ipa: "/ˈweð.ər/", pos: "noun", level: "A2", def: "The condition of the air (rain, sun, etc.).", defAr: "حالة الجو.", ex: "The weather is lovely today." },
    { word: "noisy", ipa: "/ˈnɔɪ.zi/", pos: "adj.", level: "A2", def: "Making a lot of loud sound.", defAr: "مزعج، كثير الصوت.", ex: "The street is very noisy." },
    { word: "expensive", ipa: "/ɪkˈspen.sɪv/", pos: "adj.", level: "A2", def: "Costing a lot of money.", defAr: "غالي السعر.", ex: "This watch is expensive." },
    // B1/B2
    { word: "compelling", ipa: "/kəmˈpel.ɪŋ/", pos: "adj.", level: "B2", def: "Strong; making you pay attention.", defAr: "مقنع وآسر.", ex: "She made a compelling case for change." },
    { word: "resilient", ipa: "/rɪˈzɪl.i.ənt/", pos: "adj.", level: "B2", def: "Able to recover quickly from setbacks.", defAr: "صامد ومرن.", ex: "Children are remarkably resilient." },
    { word: "thrive", ipa: "/θraɪv/", pos: "verb", level: "B2", def: "To grow or prosper.", defAr: "يزدهر وينمو.", ex: "Cacti thrive in dry climates." },
    { word: "endeavour", ipa: "/ɪnˈdev.ər/", pos: "n./v.", level: "B2", def: "A serious effort; to try hard.", defAr: "مسعى جاد.", ex: "We will endeavour to deliver on time." },
    { word: "acknowledge", ipa: "/əkˈnɒl.ɪdʒ/", pos: "verb", level: "B2", def: "To accept or admit something is true.", defAr: "يعترف ويقرّ.", ex: "He acknowledged his mistake openly." },
    { word: "anticipate", ipa: "/ænˈtɪs.ɪ.peɪt/", pos: "verb", level: "B2", def: "To expect or predict.", defAr: "يتوقع ويستبق.", ex: "We anticipate strong demand." },
    { word: "blunt", ipa: "/blʌnt/", pos: "adj.", level: "B2", def: "Direct, sometimes too direct.", defAr: "صريح بشكل مباشر.", ex: "To be blunt, your essay needs work." },
    { word: "concise", ipa: "/kənˈsaɪs/", pos: "adj.", level: "B2", def: "Short and clear.", defAr: "موجز وواضح.", ex: "Please keep your answer concise." },
    { word: "deliberate", ipa: "/dɪˈlɪb.ər.ət/", pos: "adj.", level: "B2", def: "Done on purpose.", defAr: "متعمَّد ومدروس.", ex: "It was a deliberate choice." },
    { word: "enhance", ipa: "/ɪnˈhɑːns/", pos: "verb", level: "B2", def: "To improve the quality of something.", defAr: "يحسّن ويعزز.", ex: "Music can enhance your mood." },
    { word: "fluctuate", ipa: "/ˈflʌk.tʃu.eɪt/", pos: "verb", level: "B2", def: "To change frequently.", defAr: "يتذبذب.", ex: "Prices fluctuate seasonally." },
    { word: "genuine", ipa: "/ˈdʒen.ju.ɪn/", pos: "adj.", level: "B2", def: "Real, not fake.", defAr: "حقيقي وصادق.", ex: "Her smile was genuine." },
    { word: "hinder", ipa: "/ˈhɪn.dər/", pos: "verb", level: "B2", def: "To make difficult.", defAr: "يعيق.", ex: "Bad weather hindered progress." },
    { word: "impose", ipa: "/ɪmˈpəʊz/", pos: "verb", level: "B2", def: "To force a rule or tax.", defAr: "يفرض رسميًا.", ex: "The government imposed new taxes." },
    { word: "jeopardise", ipa: "/ˈdʒep.ə.daɪz/", pos: "verb", level: "B2", def: "To put at risk.", defAr: "يعرّض للخطر.", ex: "Don't jeopardise your career." },
    { word: "inevitable", ipa: "/ɪˈnev.ɪ.tə.bəl/", pos: "adj.", level: "B2", def: "Certain to happen.", defAr: "حتمي.", ex: "Change is inevitable." },
    // C1
    { word: "ubiquitous", ipa: "/juːˈbɪk.wɪ.təs/", pos: "adj.", level: "C1", def: "Seeming to be everywhere.", defAr: "موجود في كل مكان.", ex: "Smartphones have become ubiquitous." },
    { word: "meticulous", ipa: "/məˈtɪk.jə.ləs/", pos: "adj.", level: "C1", def: "Very careful with detail.", defAr: "دقيق ومنظم جدًا.", ex: "He keeps meticulous records." },
    { word: "discrepancy", ipa: "/dɪˈskrep.ən.si/", pos: "noun", level: "C1", def: "A difference where things should match.", defAr: "تفاوت أو اختلاف.", ex: "There's a discrepancy in the figures." },
    { word: "scrutinise", ipa: "/ˈskruː.tɪ.naɪz/", pos: "verb", level: "C1", def: "To examine carefully.", defAr: "يدقق ويفحص.", ex: "Auditors scrutinised the accounts." },
    { word: "pertinent", ipa: "/ˈpɜː.tɪ.nənt/", pos: "adj.", level: "C1", def: "Relevant.", defAr: "ذو صلة وثيقة.", ex: "Stick to pertinent details." },
    { word: "alleviate", ipa: "/əˈliː.vi.eɪt/", pos: "verb", level: "C1", def: "To make pain less severe.", defAr: "يخفّف.", ex: "The medicine alleviated her symptoms." },
    { word: "exacerbate", ipa: "/ɪɡˈzæs.ə.beɪt/", pos: "verb", level: "C1", def: "To make worse.", defAr: "يفاقم.", ex: "Stress exacerbates the condition." },
    { word: "tantamount", ipa: "/ˈtæn.tə.maʊnt/", pos: "adj.", level: "C1", def: "Equivalent in seriousness.", defAr: "بمثابة.", ex: "His silence was tantamount to admission." },
    { word: "succinct", ipa: "/səkˈsɪŋkt/", pos: "adj.", level: "C1", def: "Clear and short.", defAr: "مقتضب وواضح.", ex: "Give a succinct summary." },
    { word: "ostensibly", ipa: "/ɒsˈten.sə.bli/", pos: "adv.", level: "C1", def: "Apparently, but not really.", defAr: "ظاهريًا.", ex: "He left, ostensibly to call a friend." },
    { word: "candid", ipa: "/ˈkæn.dɪd/", pos: "adj.", level: "C1", def: "Honest and direct.", defAr: "صريح.", ex: "Let's have a candid conversation." },
    { word: "nuance", ipa: "/ˈnjuː.ɑːns/", pos: "noun", level: "C1", def: "A slight difference in meaning.", defAr: "فرق دقيق في المعنى.", ex: "The translation lost the nuances." },
    { word: "plausible", ipa: "/ˈplɔː.zə.bəl/", pos: "adj.", level: "C1", def: "Reasonable and likely true.", defAr: "معقول ومحتمل.", ex: "That's a plausible explanation." },
    { word: "redundant", ipa: "/rɪˈdʌn.dənt/", pos: "adj.", level: "C1", def: "Unnecessary; not needed.", defAr: "زائد عن الحاجة.", ex: "Avoid redundant words." },
    { word: "sporadic", ipa: "/spəˈræd.ɪk/", pos: "adj.", level: "C1", def: "Happening irregularly.", defAr: "متقطّع.", ex: "There was sporadic gunfire." },
    { word: "vindicate", ipa: "/ˈvɪn.dɪ.keɪt/", pos: "verb", level: "C1", def: "To prove right after doubt.", defAr: "يثبت صحة الموقف.", ex: "The results vindicated her theory." },
    { word: "elucidate", ipa: "/ɪˈluː.sɪ.deɪt/", pos: "verb", level: "C1", def: "To make clear.", defAr: "يوضح.", ex: "Could you elucidate your point?" },
    { word: "diligent", ipa: "/ˈdɪl.ɪ.dʒənt/", pos: "adj.", level: "C1", def: "Careful and persistent.", defAr: "مجتهد ومثابر.", ex: "She's a diligent researcher." },
    // C2
    { word: "perfunctory", ipa: "/pəˈfʌŋk.tər.i/", pos: "adj.", level: "C2", def: "Done as a duty, with minimal effort or care.", defAr: "شكلي، بلا اهتمام.", ex: "He gave the report a perfunctory glance." },
    { word: "ineffable", ipa: "/ɪnˈef.ə.bəl/", pos: "adj.", level: "C2", def: "Too great or beautiful to describe.", defAr: "يفوق الوصف.", ex: "The ineffable beauty of the sunrise." },
    { word: "vicissitude", ipa: "/vɪˈsɪs.ɪ.tjuːd/", pos: "noun", level: "C2", def: "A change of circumstances, especially unwelcome.", defAr: "تقلّب الأحوال.", ex: "The vicissitudes of life." },
    { word: "quintessential", ipa: "/ˌkwɪn.tɪˈsen.ʃəl/", pos: "adj.", level: "C2", def: "The most perfect example of a quality.", defAr: "النموذج الأمثل.", ex: "The quintessential English gentleman." },
    { word: "ephemeral", ipa: "/ɪˈfem.ər.əl/", pos: "adj.", level: "C2", def: "Lasting a very short time.", defAr: "زائل، عابر.", ex: "Fame can be ephemeral." }
  ],

  // ===== READING =====
  readings: [
    { id: "r-coffee", level: "A2", title: "The Journey of a Coffee Bean", minutes: 3,
      text: `Most people drink coffee without thinking about it. But behind every cup is a long journey that starts on a small farm, often thousands of kilometres away.

Coffee grows on trees, mainly in countries near the equator. The fruit, called a coffee cherry, is red when it is ready to pick. Inside each cherry are two seeds — the beans we know.

After picking, the beans are washed and dried. They are still green at this stage. Then they are sent to factories around the world, where they are roasted. Roasting turns the beans brown and gives them their strong smell and taste.

Finally, the beans are ground and brewed. A simple cup of coffee on your table has passed through the hands of farmers, drivers, traders, roasters, and baristas. It is, in a way, a small miracle of cooperation.`,
      questions: [
        { q: "Where do most coffee trees grow?", options: ["Near the North Pole.", "Near the equator.", "Inside factories.", "In cold mountains."], correct: 1 },
        { q: "Coffee beans are green:", options: ["after roasting.", "in your cup.", "before roasting.", "when they grow."], correct: 2 },
        { q: "What changes during roasting?", options: ["The beans become red.", "The beans become brown and gain flavour.", "The beans grow larger.", "Nothing changes."], correct: 1 }
      ]
    },
    { id: "r-attention", level: "B2", title: "The Cost of Constant Attention", minutes: 4,
      text: `In an age of endless notifications, the human brain pays a hidden tax. Every ping, banner, or vibration nudges your attention away from whatever you were doing. Even if you ignore the alert, research suggests it takes the mind several seconds — sometimes minutes — to fully refocus.

This phenomenon, called attention residue, affects how deeply we think. A 2017 study found that simply having a smartphone visible on a desk reduced participants' working memory, even when the device was face-down and silent. The phone did not need to ring; the brain still allocated some bandwidth to monitoring it.

The implications go beyond productivity. Constant context-switching has been linked to higher stress, shallower learning, and worse decision-making. Some researchers argue that the ability to sustain attention is becoming a rare and valuable skill — a kind of cognitive luxury good.

The fix is rarely dramatic. Most experts recommend deliberate blocks of single-tasking: a quiet hour without any device in sight, or a workspace stripped of digital triggers. The harder battle is psychological. Once attention has been fragmented for years, sitting with one task can feel uncomfortable. Yet, like a muscle, focus can be retrained — slowly, and with practice.`,
      questions: [
        { q: "What is 'attention residue'?", options: ["The energy consumed by smartphones.", "The lingering distraction left by an interruption.", "The brain's reward for finishing tasks.", "A common form of memory loss."], correct: 1 },
        { q: "What surprised researchers in 2017?", options: ["Phones improved memory when silent.", "Even a silent, face-down phone reduced working memory.", "People can multitask without cost.", "Notifications help studying."], correct: 1 },
        { q: "Sustained attention is compared to:", options: ["A digital trigger.", "A rare luxury good.", "A new technology.", "A psychological illness."], correct: 1 },
        { q: "The 'harder battle' is:", options: ["Buying fewer devices.", "Coping with the discomfort of focusing.", "Earning more money.", "Avoiding sleep."], correct: 1 }
      ]
    },
    { id: "r-cities", level: "C1", title: "Cities as Living Laboratories", minutes: 5,
      text: `Urban centres have long been treated as engineering puzzles — grids of roads, networks of pipes, stacks of buildings. Yet a growing body of work in urban science reframes them as something altogether more organic: living laboratories in which millions of behavioural experiments unfold simultaneously.

This shift is partly methodological. The proliferation of sensor data, mobile location traces, and open civic records has allowed researchers to scrutinise how cities actually function rather than how they are planned to function. The discrepancy is often striking. A street designed to move cars efficiently may, in practice, serve as a child's playground, a vendor's marketplace, or a neighbour's improvised lounge.

Such findings are not merely academic. They are reshaping how municipalities allocate scarce resources. Several European cities have used granular movement data to redesign bus routes, while smaller experiments — temporarily closing a lane to traffic, or painting a square in bright colours — have yielded insights that no master plan could anticipate. The lesson, arguably, is one of humility: the city is not a static artefact to be perfected, but a dynamic system that absorbs and reflects the lives within it.

Critics, however, caution against techno-optimism. Sensor-rich cities raise pressing questions about surveillance, equity, and consent. Who collects the data? Who benefits? Whose patterns of life are rendered visible, and whose remain obscured? Until these questions are addressed in a transparent and inclusive manner, the laboratory metaphor risks becoming uncomfortably literal — with residents cast as unwitting subjects rather than active participants in the design of their own environment.`,
      questions: [
        { q: "What metaphor for cities does the passage introduce?", options: ["Engineering puzzles.", "Static artefacts.", "Living laboratories.", "Digital networks."], correct: 2 },
        { q: "The author's tone in the final paragraph is:", options: ["Enthusiastically supportive.", "Cautiously sceptical.", "Hostile and dismissive.", "Indifferent."], correct: 1 },
        { q: "What does 'discrepancy' refer to?", options: ["Mobile phone coverage gaps.", "Differences between planned and actual use of urban space.", "Sensor data errors.", "Researcher disagreements."], correct: 1 },
        { q: "'Unwitting subjects' suggests residents:", options: ["Are deliberately participating.", "Don't realise they are being studied.", "Are city planners.", "Live outside the city."], correct: 1 }
      ]
    }
  ],

  // ===== WRITING PROMPTS =====
  writingPrompts: [
    { id: "w-a2-1", level: "A2", title: "My weekend", prompt: "Describe your last weekend. What did you do, where did you go, and how did you feel? Write 80–120 words using past simple." },
    { id: "w-1", level: "B2", title: "Opinion essay", prompt: "Some people believe that working from home is better than working in an office. Do you agree? Write 180–220 words, using at least three discourse markers (e.g. however, moreover, consequently)." },
    { id: "w-2", level: "B2", title: "Email of complaint", prompt: "You bought a product online that arrived damaged. Write a formal email of complaint (120–150 words) requesting a replacement. Use at least one passive structure." },
    { id: "w-3", level: "C1", title: "Argumentative essay", prompt: "'Social media has done more harm than good to public discourse.' Discuss, using hedging language. 250–300 words. Include at least one cleft sentence and one inversion." },
    { id: "w-4", level: "C1", title: "Review", prompt: "Write a review of a film or book that changed how you think (200–250 words). Aim for varied sentence structures and at least 5 C1-level vocabulary items." },
    { id: "w-5", level: "B2", title: "Story", prompt: "Begin a story with: 'I never expected to find that envelope.' Continue for 180–220 words using past simple, past continuous, and past perfect." },
    { id: "w-c2", level: "C2", title: "Academic abstract", prompt: "Write a 180–220 word academic-style abstract for a hypothetical study on the effect of remote work on creativity. Use nominalisation, hedging, and at least 6 C1/C2-level vocabulary items." }
  ],

  // ===== PRONUNCIATION =====
  pronunciation: [
    { id: "p-0", level: "A2", text: "She sells seashells by the seashore.", focus: "/ʃ/ vs /s/" },
    { id: "p-1", level: "B2", text: "Three thin thieves thought thirty things.", focus: "/θ/ vs /ð/" },
    { id: "p-3", level: "B2", text: "Red lorry, yellow lorry.", focus: "/l/ and /r/" },
    { id: "p-4", level: "C1", text: "The sixth sheikh's sixth sheep is sick.", focus: "consonant clusters" },
    { id: "p-5", level: "C1", text: "Generally speaking, the ubiquitous influence of technology is, arguably, both beneficial and detrimental.", focus: "C1 connected speech and stress" },
    { id: "p-6", level: "B2", text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", focus: "/w/ and /tʃ/" },
    { id: "p-7", level: "C1", text: "Comfortable, vegetable, miscellaneous, entrepreneur, hyperbole.", focus: "stress in long words" },
    { id: "p-8", level: "B2", text: "I'd like a large latte with low-fat milk, please.", focus: "/l/ in clusters" },
    { id: "p-c2", level: "C2", text: "The perfunctory acknowledgement of his contributions exacerbated her sense of vindication.", focus: "C2 long polysyllabic stress" }
  ],

  // ===== LISTENING =====
  listening: [
    { id: "l-1", level: "B2", title: "A weather forecast",
      script: "Good evening, and welcome to the weather. Tomorrow will start cloudy across most of the country, with a chance of light rain in the south-east. By the afternoon, the clouds will clear, giving way to bright sunshine. Temperatures will reach a pleasant twenty-two degrees. However, towards the end of the week, a cold front from the north is expected to bring much cooler conditions and possibly some storms.",
      questions: [
        { q: "Tomorrow morning weather?", options: ["Sunny", "Cloudy with possible rain", "Stormy", "Snowy"], correct: 1 },
        { q: "Expected temperature?", options: ["12°C", "22°C", "32°C", "2°C"], correct: 1 },
        { q: "Later in the week?", options: ["Hotter weather", "A heatwave", "A cold front", "Fog"], correct: 2 }
      ]
    },
    { id: "l-2", level: "C1", title: "A podcast intro",
      script: "Welcome back to The Long View, the podcast where we step away from the news cycle and look at the deeper currents shaping our world. In today's episode, our guest, an urban historian, argues that the cities we now consider iconic were once dismissed as failures. From medieval marketplaces to modernist housing estates, what looks brilliant in hindsight often appeared, at the time, to be a costly mistake. So, what does that tell us about the cities we're building today? Stay with us.",
      questions: [
        { q: "What kind of podcast?", options: ["Daily news", "Sports analysis", "Long-term historical perspective", "Cooking"], correct: 2 },
        { q: "The guest argues:", options: ["Modern cities are perfect.", "Iconic cities were once seen as failures.", "Cities should be abandoned.", "Cities have no history."], correct: 1 }
      ]
    },
    { id: "l-3", level: "B2", title: "Booking a table",
      script: "Hello, I'd like to book a table for four people for this Friday evening, around seven thirty if possible. One of the guests is vegetarian, so it would be helpful if you could send the menu in advance. Also, we'd prefer a quiet corner if you have one available. Thanks very much.",
      questions: [
        { q: "Booking for how many?", options: ["Two", "Three", "Four", "Five"], correct: 2 },
        { q: "Time requested?", options: ["6:30", "7:00", "7:30", "8:30"], correct: 2 },
        { q: "Special request?", options: ["Live band", "Vegetarian menu and quiet corner", "Discount", "Outdoor seating"], correct: 1 }
      ]
    },
    { id: "l-a2", level: "A2", title: "Asking for directions",
      script: "Excuse me, could you tell me how to get to the train station? Go straight down this road for about five minutes, then turn left at the big supermarket. The station is on your right, opposite the bank. You can't miss it.",
      questions: [
        { q: "Where is the speaker going?", options: ["The bank", "The supermarket", "The train station", "A restaurant"], correct: 2 },
        { q: "Where do you turn left?", options: ["At the bank", "At the supermarket", "After 10 minutes", "Right away"], correct: 1 }
      ]
    }
  ],

  // ===== CHALLENGE BANK =====
  challengeBank: [
    // Grammar
    { type: "mcq", q: "If I _____ rich, I would travel everywhere.", options: ["am", "were", "have been", "be"], correct: 1 },
    { type: "mcq", q: "_____ I known earlier, I would have called.", options: ["If", "Had", "Have", "Would"], correct: 1 },
    { type: "mcq", q: "Never _____ such a sunset.", options: ["I have seen", "have I seen", "I saw", "did I have seen"], correct: 1 },
    { type: "mcq", q: "They cleaned the room. → Passive:", options: ["The room cleaned.", "The room was cleaned.", "The room is clean.", "The room has clean."], correct: 1 },
    { type: "mcq", q: "His coat is gone — he _____ left.", options: ["must have", "must be", "could", "should"], correct: 0 },
    { type: "mcq", q: "By the time we arrived, the film _____.", options: ["started", "had started", "starts", "was starting"], correct: 1 },
    { type: "mcq", q: "She has lived here _____ 2018.", options: ["for", "since", "from", "during"], correct: 1 },
    { type: "mcq", q: "Rarely _____ such talent in one team.", options: ["you see", "do you see", "you do see", "have see"], correct: 1 },
    { type: "mcq", q: "Cleft for emphasis on 'Monday':", options: ["It was on Monday that I called.", "On Monday I was calling.", "I called on Monday it was.", "It on Monday I called."], correct: 0 },
    { type: "mcq", q: "What I really need _____ a holiday.", options: ["is", "are", "be", "have"], correct: 0 },
    // Vocabulary
    { type: "mcq", q: "Synonym of 'meticulous':", options: ["careless", "detailed", "loud", "tired"], correct: 1 },
    { type: "mcq", q: "Antonym of 'alleviate':", options: ["soothe", "reduce", "exacerbate", "ignore"], correct: 2 },
    { type: "mcq", q: "Synonym of 'plausible':", options: ["likely", "ridiculous", "obvious", "boring"], correct: 0 },
    { type: "mcq", q: "Meaning of 'sporadic':", options: ["regular", "constant", "occasional and irregular", "fast"], correct: 2 },
    { type: "mcq", q: "'Tantamount to admission' ≈", options: ["a real admission", "almost a denial", "effectively an admission", "a strong rejection"], correct: 2 },
    { type: "mcq", q: "He felt a _____ of guilt.", options: ["pang", "punch", "pinch", "patch"], correct: 0 },
    { type: "mcq", q: "Reports show a clear _____.", options: ["discrepancy", "diligence", "deliberation", "diversion"], correct: 0 },
    { type: "mcq", q: "C1 word for 'small but important difference':", options: ["nuance", "noise", "notion", "nature"], correct: 0 },
    // Collocations
    { type: "mcq", q: "Natural collocation:", options: ["make a research", "do a research", "conduct research", "make researches"], correct: 2 },
    { type: "mcq", q: "Correct:", options: ["Make a photo", "Take a photo", "Do a photo", "Pull a photo"], correct: 1 },
    { type: "mcq", q: "Natural:", options: ["heavy rain", "big rain", "strong rain", "thick rain"], correct: 0 },
    { type: "mcq", q: "Fix: 'The information are useful.'", options: ["are correct already", "informations are", "information is", "an information is"], correct: 2 },
    { type: "mcq", q: "Make formal: 'Tell me when you can.'", options: ["Inform me when you can.", "Let me know when you can.", "At your earliest convenience, please advise.", "Talk to me soon."], correct: 2 },
    // Phrasal verbs / idioms
    { type: "mcq", q: "Phrasal verb for 'postpone':", options: ["put off", "put on", "put up", "put in"], correct: 0 },
    { type: "mcq", q: "Idiom: 'Once in a _____ moon.'", options: ["red", "blue", "green", "full"], correct: 1 },
    { type: "mcq", q: "'Cost an arm and a leg' means:", options: ["A small price", "Very expensive", "A cheap deal", "Free"], correct: 1 },
    { type: "mcq", q: "'Piece of cake' means:", options: ["A real dessert", "Very easy", "Difficult task", "Old recipe"], correct: 1 },
    { type: "mcq", q: "'I'll _____ you back later.' (call again)", options: ["call up", "call on", "call back", "call in"], correct: 2 },
    { type: "mcq", q: "'Bring up' here: 'Don't bring up that topic.'", options: ["mention it", "lift it physically", "buy it", "translate it"], correct: 0 },
    // Register & style
    { type: "mcq", q: "Most C1 hedged claim:", options: ["TV is bad.", "Excessive TV may correlate with poorer outcomes in some children.", "Everyone hates TV.", "TV never helps."], correct: 1 },
    { type: "mcq", q: "Most formal:", options: ["Sorry for the late reply.", "My bad, late again!", "I apologise for the delayed response.", "Late, sorry."], correct: 2 },
    { type: "mcq", q: "Connector: 'The plan is bold; _____, it lacks detail.'", options: ["furthermore", "however", "consequently", "namely"], correct: 1 },
    // Listening (TTS)
    { type: "listen", q: "Listen and choose what was said:", playText: "I would have called you if I had known.", options: ["I would call you if I knew.", "I would have called you if I had known.", "I will call you when I know.", "I called you when I knew."], correct: 1 },
    { type: "listen", q: "Listen and choose:", playText: "She has been working here for over a decade.", options: ["She works here for a decade.", "She worked here a decade ago.", "She has been working here for over a decade.", "She will work here for a decade."], correct: 2 },
    { type: "listen", q: "Listen and choose the correct sentence:", playText: "Had we left earlier, we would have caught the train.", options: ["If we leave earlier, we catch the train.", "We left earlier and caught the train.", "Had we left earlier, we would have caught the train.", "We had left earlier to catch the train."], correct: 2 },
    { type: "listen", q: "Listen — what did you hear?", playText: "The evidence is, arguably, compelling.", options: ["The evidence is hardly compelling.", "The evidence is, arguably, compelling.", "The evidence was never compelling.", "Evidence arguments are compelling."], correct: 1 },
    { type: "listen", q: "Listen carefully:", playText: "We anticipated strong demand throughout the quarter.", options: ["We anticipated strong demand throughout the quarter.", "We expected weak demand for the quarter.", "We had strong demand by the quarter.", "We didn't anticipate any demand."], correct: 0 },
    // Errors
    { type: "mcq", q: "Find the error: 'I have went to the store yesterday.'", options: ["'have went' → 'went'", "'the store' → 'a store'", "'yesterday' is wrong", "No error"], correct: 0 },
    { type: "mcq", q: "Find the error: 'She don't like coffee.'", options: ["'don't' → 'doesn't'", "'like' → 'likes'", "'coffee' → 'a coffee'", "No error"], correct: 0 },
    { type: "mcq", q: "Find the error: 'He's married with a doctor.'", options: ["'with' → 'to'", "'married' → 'marry'", "'a doctor' → 'doctor'", "No error"], correct: 0 },
    // Spelling
    { type: "mcq", q: "Correct spelling:", options: ["accomodate", "accommodate", "acommodate", "accommadate"], correct: 1 },
    { type: "mcq", q: "Correct spelling:", options: ["recieve", "receive", "receeve", "receave"], correct: 1 },
    { type: "mcq", q: "Correct spelling:", options: ["definately", "definitely", "definatly", "definitly"], correct: 1 },
    { type: "mcq", q: "Correct spelling:", options: ["seperate", "separate", "saperate", "separete"], correct: 1 },
    // Confusing pairs
    { type: "mcq", q: "Stress can _____ your sleep.", options: ["affect", "effect", "afect", "effekt"], correct: 0 },
    { type: "mcq", q: "These shoes are too _____.", options: ["lose", "looze", "loose", "louse"], correct: 2 },
    { type: "mcq", q: "Can I _____ your pen?", options: ["lend", "loan", "borrow", "rent"], correct: 2 },
    { type: "mcq", q: "_____ going to the party.", options: ["Their", "There", "They're", "Thear"], correct: 2 },
    // Idiomatic meaning
    { type: "mcq", q: "'On cloud nine' means:", options: ["She's confused.", "Extremely happy.", "Flying soon.", "Worried."], correct: 1 },
    { type: "mcq", q: "'Let's circle back to that' means:", options: ["Repeat exactly.", "Go in circles.", "Return to it later.", "Forget it."], correct: 2 },
    { type: "mcq", q: "'It's a no-brainer' means:", options: ["A foolish idea.", "An obvious decision.", "Without thinking.", "Requires expertise."], correct: 1 },
    { type: "mcq", q: "'I'll get back to you' means:", options: ["Return physically.", "Respond later.", "Go behind you.", "Refuse."], correct: 1 }
  ],

  // ===== TYPING TEXTS =====
  typingTexts: [
    { id: "t-a1", level: "A1",
      text: "The cat is on the chair. The dog is in the garden. The sun is bright today. I am happy. My friend is here. We have a small but warm house. I like coffee in the morning. Do you like tea? Yes, I do." },
    { id: "t-1", level: "B1",
      text: "The morning was quiet and the streets were empty. I walked slowly to the small bakery on the corner, breathing in the cold air. The smell of fresh bread reached me before I opened the door. I smiled and ordered my usual coffee and a warm croissant." },
    { id: "t-2", level: "B2",
      text: "Learning a new language is rarely a straight line. There are good days when every word feels natural, and difficult days when nothing seems to make sense. The secret is not talent but consistency. Small daily steps, even when slow, will eventually carry you further than a single perfect week." },
    { id: "t-3", level: "B2",
      text: "Cities at night reveal their truest character. The crowds thin out, the noise softens, and the people who remain are often there for a reason. Some are working, some are lost in thought, and some are simply enjoying the quiet between two busy days." },
    { id: "t-4", level: "C1",
      text: "It is often said that technology brings us closer together, yet there is a quiet paradox in our constant connectivity. We send more messages than ever, but spend less time in the slow, attentive conversations that build real understanding. Convenience, it seems, can sometimes come at the expense of depth." },
    { id: "t-5", level: "C1",
      text: "Reading widely is, arguably, one of the most underrated habits of intellectual growth. It exposes you to perspectives you might never have encountered otherwise and sharpens your ability to evaluate complex ideas. Moreover, a habit of careful reading often translates, almost invisibly, into clearer thinking and more precise writing." },
    { id: "t-c2", level: "C2",
      text: "The vicissitudes of contemporary discourse are such that no single perspective can claim incontestable authority. To navigate this terrain with intellectual integrity demands not only erudition but also a willingness to entertain ostensibly opposing viewpoints, scrutinising them with both rigour and humility before arriving at any provisional conclusion." }
  ]
};
