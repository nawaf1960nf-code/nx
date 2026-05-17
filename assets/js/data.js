// All learning content lives here. Edit/extend freely.
window.AppData = {
  // ===== LESSONS (Grammar + concept) =====
  lessons: [
    {
      id: "b2-present-perfect",
      level: "B2",
      title: "Present Perfect vs Past Simple",
      summary: "Master when to use 'have done' vs 'did' — a common B2 stumbling block.",
      duration: 12,
      sections: [
        {
          heading: "Why this matters",
          body: "Arabic and many other languages don't grammatically separate 'I finished' (past) from 'I have finished' (relevance now). English speakers care a lot about this distinction. Mastering it is one of the biggest jumps from B1 to B2.",
          translation: "العربية لا تفرق نحويًا بين 'انتهيت' و'قد انتهيت'. الإنجليزية تهتم كثيرًا بهذا الفرق، وإتقانه قفزة كبيرة من B1 إلى B2."
        },
        {
          heading: "Past Simple — finished, with a finished time",
          body: "Use Past Simple when the time is over and usually mentioned: yesterday, last week, in 2020, when I was a child.",
          examples: [
            { en: "I visited Paris in 2019.", ar: "زرت باريس عام 2019." },
            { en: "She called me an hour ago.", ar: "اتصلت بي قبل ساعة." }
          ]
        },
        {
          heading: "Present Perfect — relevance to now",
          body: "Use Present Perfect for past actions whose effect, result, or relevance continues to the present. The time is unfinished (today, this week) or unspecified.",
          examples: [
            { en: "I have visited Paris three times.", ar: "زرت باريس ثلاث مرات (في حياتي حتى الآن)." },
            { en: "She has just called me.", ar: "اتصلت بي للتو." },
            { en: "I have lived here since 2018.", ar: "أعيش هنا منذ 2018." }
          ]
        },
        {
          heading: "Signal words",
          body: "Past Simple: yesterday, ago, last X, in [year], when. Present Perfect: just, already, yet, ever, never, since, for, so far, recently, this week/month/year."
        }
      ],
      quiz: [
        {
          q: "I _____ my keys. I can't find them anywhere.",
          options: ["lost", "have lost", "was losing", "had lost"],
          correct: 1,
          explain: "Present Perfect — the result (can't find them) affects now."
        },
        {
          q: "Shakespeare _____ many famous plays.",
          options: ["has written", "wrote", "was writing", "has been writing"],
          correct: 1,
          explain: "Past Simple — Shakespeare is dead; the time period of his life is closed."
        },
        {
          q: "_____ you ever _____ sushi?",
          options: ["Did / try", "Have / tried", "Were / trying", "Had / tried"],
          correct: 1,
          explain: "Present Perfect — life experience up to now ('ever')."
        },
        {
          q: "I _____ him last Friday at the conference.",
          options: ["have met", "met", "had met", "was meeting"],
          correct: 1,
          explain: "Past Simple — a specific finished time (last Friday)."
        }
      ]
    },
    {
      id: "b2-conditionals",
      level: "B2",
      title: "Mastering the Conditionals (0–3 + Mixed)",
      summary: "From real possibility to hypothetical past — control all four conditionals.",
      duration: 18,
      sections: [
        {
          heading: "Zero — general truths",
          body: "If + present, present. Used for things always true.",
          examples: [
            { en: "If you heat water to 100°C, it boils.", ar: "إذا سخنت الماء حتى 100 درجة، يغلي." }
          ]
        },
        {
          heading: "First — real future possibility",
          body: "If + present, will/can/may + infinitive.",
          examples: [
            { en: "If it rains tomorrow, we will stay home.", ar: "إذا أمطرت غدًا، سنبقى في البيت." }
          ]
        },
        {
          heading: "Second — unreal / unlikely present or future",
          body: "If + past simple, would/could/might + infinitive. The past tense doesn't mean past time — it signals 'not real'.",
          examples: [
            { en: "If I had more time, I would learn Japanese.", ar: "لو كان عندي وقت أكثر، لتعلمت اليابانية." },
            { en: "If I were you, I'd accept the offer.", ar: "لو كنت مكانك، لقبلت العرض." }
          ]
        },
        {
          heading: "Third — unreal past",
          body: "If + past perfect, would/could/might have + past participle. Imagining a past that didn't happen.",
          examples: [
            { en: "If I had studied harder, I would have passed.", ar: "لو درست بجدية أكبر، لكنت نجحت." }
          ]
        },
        {
          heading: "Mixed — past condition, present result",
          body: "If + past perfect, would + infinitive. Past unreality with current effect.",
          examples: [
            { en: "If she had taken the job, she would be in London now.", ar: "لو أخذت الوظيفة، لكانت في لندن الآن." }
          ]
        }
      ],
      quiz: [
        {
          q: "If I _____ rich, I'd buy a house by the sea.",
          options: ["am", "was", "were", "had been"],
          correct: 2,
          explain: "Second conditional — unreal present. Formal English prefers 'were' for all persons."
        },
        {
          q: "If you had told me earlier, I _____ you.",
          options: ["would help", "will help", "would have helped", "had helped"],
          correct: 2,
          explain: "Third conditional — unreal past."
        },
        {
          q: "Water _____ at 0°C.",
          options: ["freezes", "would freeze", "will freeze", "freezed"],
          correct: 0,
          explain: "Zero conditional context — general truth in present simple."
        },
        {
          q: "If she _____ caught the earlier train, she would be home by now.",
          options: ["caught", "had caught", "has caught", "catches"],
          correct: 1,
          explain: "Mixed conditional — past condition with present result."
        }
      ]
    },
    {
      id: "b2-modals-deduction",
      level: "B2",
      title: "Modals of Deduction (must / might / can't)",
      summary: "Express how certain you are about something — a hallmark of natural English.",
      duration: 10,
      sections: [
        {
          heading: "Present deduction",
          body: "must + infinitive = I'm sure it's true. might/could/may + infinitive = it's possible. can't + infinitive = I'm sure it's not true.",
          examples: [
            { en: "He must be tired — he worked 14 hours.", ar: "لا بد أنه متعب — اشتغل 14 ساعة." },
            { en: "She might be at the gym.", ar: "ربما تكون في النادي." },
            { en: "That can't be true.", ar: "هذا مستحيل أن يكون صحيحًا." }
          ]
        },
        {
          heading: "Past deduction",
          body: "must have / might have / could have / can't have + past participle. Same logic, but about the past.",
          examples: [
            { en: "She must have left already — her coat is gone.", ar: "لا بد أنها غادرت — معطفها ليس هنا." },
            { en: "They can't have heard us.", ar: "مستحيل أنهم سمعونا." }
          ]
        }
      ],
      quiz: [
        {
          q: "His car isn't in the driveway. He _____ at work.",
          options: ["must be", "can't be", "might not be", "shouldn't be"],
          correct: 0,
          explain: "Strong deduction in present — 'must be'."
        },
        {
          q: "The lights are off. They _____ to bed.",
          options: ["must go", "must have gone", "can't go", "might go"],
          correct: 1,
          explain: "Past deduction with present evidence — 'must have gone'."
        }
      ]
    },
    {
      id: "c1-inversion",
      level: "C1",
      title: "Inversion for Emphasis",
      summary: "Sound advanced and literary. Move negative adverbs to the front and watch the magic.",
      duration: 14,
      sections: [
        {
          heading: "The pattern",
          body: "Negative or restrictive adverbials at the start of a sentence trigger subject-auxiliary inversion (like a question). Used in formal/literary English for emphasis.",
          examples: [
            { en: "Never have I seen such beauty.", ar: "لم أرَ مثل هذا الجمال أبدًا." },
            { en: "Rarely does she complain.", ar: "نادرًا ما تشتكي." },
            { en: "Not only did he apologise, but he also paid.", ar: "لم يعتذر فحسب، بل دفع أيضًا." }
          ]
        },
        {
          heading: "Common triggers",
          body: "Never, rarely, seldom, hardly, scarcely, no sooner ... than, not only ... but also, under no circumstances, only when, only after, little (did I know)."
        },
        {
          heading: "Conditional inversion",
          body: "Drop 'if', invert the auxiliary. Sounds formal.",
          examples: [
            { en: "Had I known earlier, I would have called.", ar: "لو علمت مبكرًا، لاتصلت." },
            { en: "Were he to apologise, I might forgive him.", ar: "لو اعتذر، فربما أسامحه." }
          ]
        }
      ],
      quiz: [
        {
          q: "Never _____ such a generous offer.",
          options: ["I have seen", "have I seen", "I saw", "did I saw"],
          correct: 1,
          explain: "After 'never' at the start, invert the auxiliary: have I seen."
        },
        {
          q: "_____ I known, I would have helped.",
          options: ["If had", "Had", "If I have", "Have"],
          correct: 1,
          explain: "Conditional inversion: 'Had I known' = 'If I had known'."
        }
      ]
    },
    {
      id: "c1-cleft-sentences",
      level: "C1",
      title: "Cleft Sentences (It / What focus)",
      summary: "Highlight the exact part of your sentence that matters. A C1 essential.",
      duration: 12,
      sections: [
        {
          heading: "It-cleft",
          body: "It + be + focus + relative clause. Brings one piece of information to the front.",
          examples: [
            { en: "It was John who broke the vase.", ar: "كان جون هو من كسر الإناء." },
            { en: "It's tomorrow that we leave, not today.", ar: "غدًا سنغادر، ليس اليوم." }
          ]
        },
        {
          heading: "What-cleft (pseudo-cleft)",
          body: "What + clause + be + focus. Spotlights what you do, want, or need.",
          examples: [
            { en: "What I need is a long holiday.", ar: "ما أحتاجه إجازة طويلة." },
            { en: "What annoys me most is the noise.", ar: "أكثر ما يزعجني هو الضجيج." }
          ]
        }
      ],
      quiz: [
        {
          q: "Choose the correct cleft for emphasising 'on Tuesday'.",
          options: [
            "It was on Tuesday that I called him.",
            "What I called him was on Tuesday.",
            "On Tuesday was when I called him.",
            "I called him it was Tuesday."
          ],
          correct: 0,
          explain: "It-cleft: 'It was [focus] that [rest]'."
        }
      ]
    },
    {
      id: "c1-hedging",
      level: "C1",
      title: "Hedging — Sounding Educated and Cautious",
      summary: "Native-like academic English avoids absolutes. Learn the toolkit of cautious claims.",
      duration: 10,
      sections: [
        {
          heading: "Why hedge?",
          body: "C1 academic and professional English softens claims to sound balanced and avoid overstating. Direct statements like 'This is wrong' often become 'This may be problematic'."
        },
        {
          heading: "The toolkit",
          body: "Modals: may, might, could. Adverbs: perhaps, possibly, arguably, somewhat. Verbs: appears to, seems to, suggests, tends to. Phrases: it could be argued that, there is some evidence that."
        },
        {
          heading: "Compare",
          examples: [
            { en: "Direct: Social media causes anxiety.", ar: "مباشر: مواقع التواصل تسبب القلق." },
            { en: "Hedged: There is growing evidence that social media may contribute to anxiety in some users.", ar: "متحفظ: هناك أدلة متزايدة على أن مواقع التواصل قد تسهم في القلق لدى بعض المستخدمين." }
          ]
        }
      ],
      quiz: [
        {
          q: "Pick the most C1-style hedged claim.",
          options: [
            "Coffee is bad for you.",
            "Coffee tends to disrupt sleep in some individuals.",
            "Everyone hates coffee at night.",
            "Coffee never lets people sleep."
          ],
          correct: 1,
          explain: "Verb 'tends to' + qualifier 'some individuals' = proper hedging."
        }
      ]
    },
    {
      id: "b2-phrasal-verbs",
      level: "B2",
      title: "High-Frequency Phrasal Verbs",
      summary: "The 30 phrasal verbs you'll meet most in everyday conversation and reading.",
      duration: 15,
      sections: [
        {
          heading: "Why they matter",
          body: "Phrasal verbs are the glue of spoken English. Replacing 'postpone' with 'put off' instantly sounds more natural."
        },
        {
          heading: "Top 10 you should know cold",
          body: "look up (to find info), bring up (to mention), put off (postpone), get along (have good relations), turn down (refuse), come up with (invent), look forward to (anticipate), figure out (understand), give up (quit), run into (meet by chance)."
        }
      ],
      quiz: [
        {
          q: "Can you _____ the meeting until Friday?",
          options: ["put up", "put off", "put on", "put through"],
          correct: 1,
          explain: "'Put off' = postpone."
        },
        {
          q: "I can't _____ what he said.",
          options: ["figure out", "figure up", "figure in", "figure away"],
          correct: 0,
          explain: "'Figure out' = understand."
        }
      ]
    },
    {
      id: "b2-passive",
      level: "B2",
      title: "Passive Voice — Beyond the Basics",
      summary: "Use the passive to shift focus, sound formal, or be diplomatic.",
      duration: 12,
      sections: [
        {
          heading: "Form",
          body: "be + past participle. The doer (agent) is optional, introduced by 'by'."
        },
        {
          heading: "When to use it",
          body: "1) The agent is obvious or unknown ('My wallet was stolen'). 2) You want to focus on the action/result ('The bridge was built in 1890'). 3) Formal/academic tone. 4) To be diplomatic ('Mistakes were made')."
        },
        {
          heading: "Tricky tenses",
          examples: [
            { en: "The project is being reviewed. (present continuous passive)", ar: "المشروع تتم مراجعته حاليًا." },
            { en: "The report has been submitted. (present perfect passive)", ar: "تم تسليم التقرير." },
            { en: "The bill will have been paid by Monday. (future perfect passive)", ar: "ستكون الفاتورة قد دُفعت بحلول الإثنين." }
          ]
        }
      ],
      quiz: [
        {
          q: "The window _____ yesterday.",
          options: ["was broken", "broke", "has been broken", "is broken"],
          correct: 0,
          explain: "Past simple passive with 'yesterday'."
        },
        {
          q: "Your order _____ right now.",
          options: ["is processed", "is being processed", "has been processed", "processes"],
          correct: 1,
          explain: "Present continuous passive — happening now."
        }
      ]
    },
    {
      id: "c1-discourse-markers",
      level: "C1",
      title: "Discourse Markers — Sound Coherent",
      summary: "The signposts that turn fragmented sentences into flowing C1 writing and speech.",
      duration: 11,
      sections: [
        {
          heading: "Contrast",
          body: "however, nevertheless, on the contrary, that said, having said that, then again."
        },
        {
          heading: "Addition",
          body: "moreover, furthermore, on top of that, what's more, in addition."
        },
        {
          heading: "Cause/Result",
          body: "consequently, therefore, as a result, thus, hence, accordingly."
        },
        {
          heading: "Reformulation",
          body: "in other words, to put it differently, that is to say, namely."
        },
        {
          heading: "Example in use",
          examples: [
            { en: "The proposal is ambitious. That said, it lacks funding details. Nevertheless, the committee voted to support it.", ar: "المقترح طموح، إلا أنه يفتقر إلى تفاصيل التمويل. ومع ذلك صوتت اللجنة لدعمه." }
          ]
        }
      ],
      quiz: [
        {
          q: "The plan worked perfectly; _____, the team got a bonus.",
          options: ["however", "consequently", "on the contrary", "namely"],
          correct: 1,
          explain: "Cause-and-result: 'consequently'."
        }
      ]
    },
    {
      id: "b1-narrative-tenses",
      level: "B1",
      title: "Narrative Tenses — Telling Stories",
      summary: "Past simple, past continuous, past perfect: the three gears of storytelling.",
      duration: 12,
      sections: [
        {
          heading: "Past Simple — the spine of the story",
          body: "Sequenced events. 'I woke up, brushed my teeth, left the house.'"
        },
        {
          heading: "Past Continuous — background activity",
          body: "Something in progress when another event happened. 'I was walking home when it started to rain.'"
        },
        {
          heading: "Past Perfect — earlier than the story time",
          body: "An event before another past event. 'When I arrived, the meeting had already started.'"
        }
      ],
      quiz: [
        {
          q: "She _____ TV when the phone rang.",
          options: ["watched", "was watching", "had watched", "had been watching"],
          correct: 1,
          explain: "Past continuous for background activity, interrupted by a past simple event."
        },
        {
          q: "By the time we got to the cinema, the film _____.",
          options: ["started", "was starting", "had started", "has started"],
          correct: 2,
          explain: "Past perfect — earlier than 'got to the cinema'."
        }
      ]
    }
  ],

  // ===== VOCABULARY =====
  vocabulary: [
    // B2 daily essentials
    { word: "compelling", ipa: "/kəmˈpel.ɪŋ/", pos: "adj.", level: "B2", def: "Strong or forceful in argument; that makes you pay attention.", defAr: "مقنع جدًا، يجذب الانتباه.", ex: "She made a compelling case for change." },
    { word: "resilient", ipa: "/rɪˈzɪl.i.ənt/", pos: "adj.", level: "B2", def: "Able to recover quickly from setbacks.", defAr: "صامد، يستعيد قوته بسرعة.", ex: "Children are remarkably resilient." },
    { word: "thrive", ipa: "/θraɪv/", pos: "verb", level: "B2", def: "To grow or develop well; to prosper.", defAr: "يزدهر، ينمو بقوة.", ex: "Cacti thrive in dry climates." },
    { word: "endeavour", ipa: "/ɪnˈdev.ər/", pos: "noun/verb", level: "B2", def: "A serious or determined effort; to try hard.", defAr: "مسعى، يسعى جاهدًا.", ex: "We will endeavour to deliver on time." },
    { word: "acknowledge", ipa: "/əkˈnɒl.ɪdʒ/", pos: "verb", level: "B2", def: "To accept or admit that something is true or exists.", defAr: "يعترف، يقر.", ex: "He acknowledged his mistake openly." },
    { word: "anticipate", ipa: "/ænˈtɪs.ɪ.peɪt/", pos: "verb", level: "B2", def: "To expect or predict something.", defAr: "يتوقع، يستبق.", ex: "We anticipate strong demand this year." },
    { word: "blunt", ipa: "/blʌnt/", pos: "adj.", level: "B2", def: "Saying things directly without trying to be polite.", defAr: "صريح بشكل جاف.", ex: "To be blunt, your essay needs work." },
    { word: "concise", ipa: "/kənˈsaɪs/", pos: "adj.", level: "B2", def: "Short and clear, using few words.", defAr: "موجز.", ex: "Please keep your answer concise." },
    { word: "deliberate", ipa: "/dɪˈlɪb.ər.ət/", pos: "adj.", level: "B2", def: "Done on purpose; carefully thought out.", defAr: "متعمد، مدروس.", ex: "It was a deliberate choice." },
    { word: "enhance", ipa: "/ɪnˈhɑːns/", pos: "verb", level: "B2", def: "To improve the quality, value, or attractiveness of something.", defAr: "يحسّن، يعزز.", ex: "Music can enhance your mood." },

    { word: "fluctuate", ipa: "/ˈflʌk.tʃu.eɪt/", pos: "verb", level: "B2", def: "To change frequently in level or amount.", defAr: "يتذبذب.", ex: "Prices fluctuate seasonally." },
    { word: "genuine", ipa: "/ˈdʒen.ju.ɪn/", pos: "adj.", level: "B2", def: "Real, sincere, not fake.", defAr: "حقيقي، صادق.", ex: "Her smile was genuine." },
    { word: "hinder", ipa: "/ˈhɪn.dər/", pos: "verb", level: "B2", def: "To make it difficult for something to happen.", defAr: "يعيق.", ex: "Bad weather hindered progress." },
    { word: "impose", ipa: "/ɪmˈpəʊz/", pos: "verb", level: "B2", def: "To officially force a rule, tax, etc. on someone.", defAr: "يفرض.", ex: "The government imposed new taxes." },
    { word: "jeopardise", ipa: "/ˈdʒep.ə.daɪz/", pos: "verb", level: "B2", def: "To put something at risk.", defAr: "يعرّض للخطر.", ex: "Don't jeopardise your career over this." },

    // C1
    { word: "ubiquitous", ipa: "/juːˈbɪk.wɪ.təs/", pos: "adj.", level: "C1", def: "Seeming to be everywhere at once.", defAr: "موجود في كل مكان.", ex: "Smartphones have become ubiquitous." },
    { word: "meticulous", ipa: "/məˈtɪk.jə.ləs/", pos: "adj.", level: "C1", def: "Showing great attention to detail.", defAr: "دقيق ومنظم بشكل لافت.", ex: "He keeps meticulous records." },
    { word: "discrepancy", ipa: "/dɪˈskrep.ən.si/", pos: "noun", level: "C1", def: "A difference between two things that should match.", defAr: "تفاوت، اختلاف.", ex: "There's a discrepancy in the figures." },
    { word: "scrutinise", ipa: "/ˈskruː.tɪ.naɪz/", pos: "verb", level: "C1", def: "To examine something very carefully.", defAr: "يدقق، يفحص.", ex: "Auditors scrutinised the accounts." },
    { word: "pertinent", ipa: "/ˈpɜː.tɪ.nənt/", pos: "adj.", level: "C1", def: "Relevant to a particular matter.", defAr: "ذو صلة.", ex: "Please stick to pertinent details." },
    { word: "alleviate", ipa: "/əˈliː.vi.eɪt/", pos: "verb", level: "C1", def: "To make pain or suffering less severe.", defAr: "يخفف.", ex: "The medicine alleviated her symptoms." },
    { word: "exacerbate", ipa: "/ɪɡˈzæs.ə.beɪt/", pos: "verb", level: "C1", def: "To make a bad situation worse.", defAr: "يفاقم.", ex: "Stress exacerbates the condition." },
    { word: "tantamount", ipa: "/ˈtæn.tə.maʊnt/", pos: "adj.", level: "C1", def: "Equivalent in seriousness; effectively the same as.", defAr: "بمثابة، يساوي.", ex: "His silence was tantamount to admission." },
    { word: "succinct", ipa: "/səkˈsɪŋkt/", pos: "adj.", level: "C1", def: "Said in a clear and short way.", defAr: "مقتضب وواضح.", ex: "Give a succinct summary." },
    { word: "ostensibly", ipa: "/ɒsˈten.sə.bli/", pos: "adv.", level: "C1", def: "Apparently, but not necessarily really.", defAr: "ظاهريًا.", ex: "He left, ostensibly to call a friend." },

    { word: "candid", ipa: "/ˈkæn.dɪd/", pos: "adj.", level: "C1", def: "Honest and direct, especially when difficult.", defAr: "صريح.", ex: "Let's have a candid conversation." },
    { word: "compelling", ipa: "/kəmˈpel.ɪŋ/", pos: "adj.", level: "C1", def: "Powerful enough to demand attention.", defAr: "آسر، مقنع.", ex: "The evidence is compelling." },
    { word: "nuance", ipa: "/ˈnjuː.ɑːns/", pos: "noun", level: "C1", def: "A very slight difference in meaning, expression, sound, etc.", defAr: "فرق دقيق.", ex: "The translation lost the nuances." },
    { word: "plausible", ipa: "/ˈplɔː.zə.bəl/", pos: "adj.", level: "C1", def: "Reasonable and likely to be true.", defAr: "معقول.", ex: "That's a plausible explanation." },
    { word: "redundant", ipa: "/rɪˈdʌn.dənt/", pos: "adj.", level: "C1", def: "Unnecessary because already present; or no longer needed at a job.", defAr: "زائد، فائض.", ex: "Avoid redundant words in your essay." },
    { word: "sporadic", ipa: "/spəˈræd.ɪk/", pos: "adj.", level: "C1", def: "Happening irregularly or in scattered instances.", defAr: "متقطع.", ex: "There was sporadic gunfire in the distance." },
    { word: "vindicate", ipa: "/ˈvɪn.dɪ.keɪt/", pos: "verb", level: "C1", def: "To prove someone right after doubt.", defAr: "يبرّئ، يثبت صحة موقفه.", ex: "The results vindicated her theory." },
    { word: "elucidate", ipa: "/ɪˈluː.sɪ.deɪt/", pos: "verb", level: "C1", def: "To make something clear; explain.", defAr: "يوضح.", ex: "Could you elucidate your last point?" },
    { word: "diligent", ipa: "/ˈdɪl.ɪ.dʒənt/", pos: "adj.", level: "C1", def: "Working carefully and persistently.", defAr: "مجتهد، مثابر.", ex: "She's a diligent researcher." },
    { word: "inevitable", ipa: "/ɪˈnev.ɪ.tə.bəl/", pos: "adj.", level: "B2", def: "Certain to happen; unavoidable.", defAr: "حتمي.", ex: "Change is inevitable." }
  ],

  // ===== READING PASSAGES =====
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
        {
          q: "What is 'attention residue'?",
          options: [
            "The energy consumed by smartphones.",
            "The lingering distraction left by an interruption.",
            "The brain's reward for finishing tasks.",
            "A common form of memory loss."
          ],
          correct: 1,
          explain: "Defined in the second paragraph — it's the leftover distraction."
        },
        {
          q: "According to the passage, what surprised researchers in 2017?",
          options: [
            "Phones improved memory when silent.",
            "Even a silent, face-down phone reduced working memory.",
            "People can multitask without cost.",
            "Notifications are useful for studying."
          ],
          correct: 1
        },
        {
          q: "The author compares sustained attention to:",
          options: [
            "A digital trigger.",
            "A rare luxury good.",
            "A new technology.",
            "A psychological illness."
          ],
          correct: 1
        },
        {
          q: "The 'harder battle' mentioned in the last paragraph is:",
          options: [
            "Buying fewer devices.",
            "Coping with the discomfort of focusing on one task.",
            "Earning more money.",
            "Avoiding sleep."
          ],
          correct: 1
        }
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
        {
          q: "What metaphor for cities does the passage introduce?",
          options: [
            "Cities as engineering puzzles.",
            "Cities as static artefacts.",
            "Cities as living laboratories.",
            "Cities as digital networks."
          ],
          correct: 2
        },
        {
          q: "The author's tone in the final paragraph is best described as:",
          options: [
            "Enthusiastically supportive.",
            "Cautiously sceptical.",
            "Hostile and dismissive.",
            "Indifferent."
          ],
          correct: 1,
          explain: "Critics 'caution against' shows balanced scepticism."
        },
        {
          q: "What does 'discrepancy' refer to in paragraph two?",
          options: [
            "Gaps in mobile phone coverage.",
            "Differences between planned and actual use of urban space.",
            "Errors in sensor data.",
            "Disagreements between researchers."
          ],
          correct: 1
        },
        {
          q: "The phrase 'unwitting subjects' suggests the residents:",
          options: [
            "Are deliberately participating.",
            "Don't realise they are being studied.",
            "Are city planners.",
            "Live outside the city."
          ],
          correct: 1
        }
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
        {
          q: "Where do most coffee trees grow?",
          options: ["Near the North Pole.", "Near the equator.", "Inside factories.", "In cold mountains."],
          correct: 1
        },
        {
          q: "Coffee beans are green:",
          options: ["after roasting.", "in your cup.", "before roasting.", "when they grow."],
          correct: 2
        },
        {
          q: "What changes during roasting?",
          options: [
            "The beans become red.",
            "The beans become brown and gain flavour.",
            "The beans grow larger.",
            "Nothing changes."
          ],
          correct: 1
        }
      ]
    }
  ],

  // ===== WRITING PROMPTS =====
  writingPrompts: [
    {
      id: "w-1",
      level: "B2",
      title: "Opinion essay",
      prompt: "Some people believe that working from home is better than working in an office. Do you agree? Write 180–220 words, using at least three discourse markers (e.g. however, moreover, consequently)."
    },
    {
      id: "w-2",
      level: "B2",
      title: "Email of complaint",
      prompt: "You bought a product online that arrived damaged. Write a formal email of complaint (120–150 words) requesting a replacement. Use at least one passive structure."
    },
    {
      id: "w-3",
      level: "C1",
      title: "Argumentative essay",
      prompt: "'Social media has done more harm than good to public discourse.' Discuss, using hedging language. 250–300 words. Include at least one cleft sentence and one inversion."
    },
    {
      id: "w-4",
      level: "C1",
      title: "Review",
      prompt: "Write a review of a film or book that changed how you think (200–250 words). Aim for varied sentence structures and at least 5 C1-level vocabulary items."
    },
    {
      id: "w-5",
      level: "B2",
      title: "Story",
      prompt: "Begin a story with: 'I never expected to find that envelope.' Continue for 180–220 words using past simple, past continuous, and past perfect."
    }
  ],

  // ===== PRONUNCIATION TARGETS =====
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

  // ===== LISTENING (uses TTS) =====
  listening: [
    {
      id: "l-1",
      level: "B2",
      title: "A weather forecast",
      script: "Good evening, and welcome to the weather. Tomorrow will start cloudy across most of the country, with a chance of light rain in the south-east. By the afternoon, the clouds will clear, giving way to bright sunshine. Temperatures will reach a pleasant twenty-two degrees. However, towards the end of the week, a cold front from the north is expected to bring much cooler conditions and possibly some storms.",
      questions: [
        { q: "What will the weather be like tomorrow morning?", options: ["Sunny", "Cloudy with possible rain", "Stormy", "Snowy"], correct: 1 },
        { q: "What temperature is expected?", options: ["12°C", "22°C", "32°C", "2°C"], correct: 1 },
        { q: "What is expected later in the week?", options: ["Hotter weather", "A heatwave", "A cold front", "Fog"], correct: 2 }
      ]
    },
    {
      id: "l-2",
      level: "C1",
      title: "A podcast intro",
      script: "Welcome back to The Long View, the podcast where we step away from the news cycle and look at the deeper currents shaping our world. In today's episode, our guest, an urban historian, argues that the cities we now consider iconic were once dismissed as failures. From medieval marketplaces to modernist housing estates, what looks brilliant in hindsight often appeared, at the time, to be a costly mistake. So, what does that tell us about the cities we're building today? Stay with us.",
      questions: [
        { q: "What kind of podcast is this?", options: ["Daily news", "Sports analysis", "Long-term, historical perspective", "Cooking"], correct: 2 },
        { q: "What does the guest argue?", options: ["Modern cities are perfect.", "Iconic cities were once seen as failures.", "Cities should be abandoned.", "Cities have no history."], correct: 1 }
      ]
    },
    {
      id: "l-3",
      level: "B2",
      title: "Booking a table",
      script: "Hello, I'd like to book a table for four people for this Friday evening, around seven thirty if possible. One of the guests is vegetarian, so it would be helpful if you could send the menu in advance. Also, we'd prefer a quiet corner if you have one available. Thanks very much.",
      questions: [
        { q: "How many people is the booking for?", options: ["Two", "Three", "Four", "Five"], correct: 2 },
        { q: "What time is requested?", options: ["6:30", "7:00", "7:30", "8:30"], correct: 2 },
        { q: "What special request is made?", options: ["A live band", "A vegetarian-friendly menu and a quiet corner", "A discount", "Outdoor seating"], correct: 1 }
      ]
    }
  ],

  // ===== CHALLENGE QUESTION POOL =====
  challengeBank: [
    { q: "Choose: 'If I _____ rich, I would travel everywhere.'", options: ["am", "were", "have been", "be"], correct: 1 },
    { q: "Synonym of 'meticulous':", options: ["careless", "detailed", "loud", "tired"], correct: 1 },
    { q: "Phrasal verb for 'to postpone':", options: ["put off", "put on", "put up", "put in"], correct: 0 },
    { q: "Choose the passive: 'They cleaned the room.'", options: ["The room cleaned.", "The room was cleaned.", "The room is clean.", "The room has clean."], correct: 1 },
    { q: "'_____ I known earlier, I would have called.'", options: ["If", "Had", "Have", "Would"], correct: 1 },
    { q: "Most precise word: He felt a _____ of guilt.", options: ["pang", "punch", "pinch", "patch"], correct: 0 },
    { q: "Pick the C1-style hedged claim:", options: ["TV is bad.", "Excessive TV may correlate with poorer outcomes in some children.", "Everyone hates TV.", "TV never helps."], correct: 1 },
    { q: "Inversion: 'Never _____ such a sunset.'", options: ["I have seen", "have I seen", "I saw", "did I have seen"], correct: 1 },
    { q: "Cleft: emphasise 'on Monday'.", options: ["It was on Monday that I called.", "On Monday I was calling.", "I called on Monday it was.", "It on Monday I called."], correct: 0 },
    { q: "Antonym of 'alleviate':", options: ["soothe", "reduce", "exacerbate", "ignore"], correct: 2 },
    { q: "Best fit: 'The two reports show a clear _____.'", options: ["discrepancy", "diligence", "deliberation", "diversion"], correct: 0 },
    { q: "Modal of deduction: His coat is gone — he _____ left.", options: ["must have", "must be", "could", "should"], correct: 0 },
    { q: "Choose the best connector: 'The plan is bold; _____, it lacks detail.'", options: ["furthermore", "however", "consequently", "namely"], correct: 1 },
    { q: "Most natural: 'What I really need _____ a holiday.'", options: ["is", "are", "be", "have"], correct: 0 },
    { q: "Fill the gap: 'She has lived here _____ 2018.'", options: ["for", "since", "from", "during"], correct: 1 },
    { q: "Best synonym of 'plausible':", options: ["likely", "ridiculous", "obvious", "boring"], correct: 0 },
    { q: "Idiom: 'Once in a _____ moon.'", options: ["red", "blue", "green", "full"], correct: 1 },
    { q: "Rarely _____ such talent in one team.", options: ["you see", "do you see", "you do see", "have see"], correct: 1 },
    { q: "Past perfect: 'By the time we arrived, the film _____.'", options: ["started", "had started", "starts", "was starting"], correct: 1 },
    { q: "Choose the C1 word: 'A very small but important difference in meaning.'", options: ["nuance", "noise", "notion", "nature"], correct: 0 },
    { q: "Make it formal: 'Tell me when you can.'", options: ["Inform me when you can.", "Let me know when you can.", "At your earliest convenience, please advise.", "Talk to me soon."], correct: 2 },
    { q: "Best paraphrase of 'tantamount to admission':", options: ["a real admission", "almost a denial", "effectively an admission", "a strong rejection"], correct: 2 },
    { q: "Fix: 'The information are useful.'", options: ["are correct already", "informations are", "information is", "an information is"], correct: 2 },
    { q: "Choose the natural collocation:", options: ["make a research", "do a research", "conduct research", "make a researches"], correct: 2 },
    { q: "Best meaning of 'sporadic':", options: ["regular", "constant", "occasional and irregular", "fast"], correct: 2 }
  ]
};
