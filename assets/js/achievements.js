// Achievements / Badges engine. Check returns newly-earned badges.
window.AppAchievements = (() => {
  const DEFS = [
    { id: "first-lesson",     icon: "🎓", title: "First Steps",          titleAr: "أولى الخطوات",     desc: "Complete your first lesson",          descAr: "أكمل أول درس" },
    { id: "ten-lessons",      icon: "📚", title: "Bookworm",             titleAr: "قارئ نهم",          desc: "Complete 10 lessons",                 descAr: "أكمل 10 دروس" },
    { id: "twenty-lessons",   icon: "🎒", title: "Scholar",              titleAr: "باحث",              desc: "Complete 20 lessons",                 descAr: "أكمل 20 درس" },
    { id: "all-b1",           icon: "🟢", title: "B1 Solid",             titleAr: "ثبتّ B1",            desc: "Complete every B1 lesson",            descAr: "أكمل كل دروس B1" },
    { id: "all-b2",           icon: "🔵", title: "B2 Master",            titleAr: "أتقنت B2",          desc: "Complete every B2 lesson",            descAr: "أكمل كل دروس B2" },
    { id: "all-c1",           icon: "🏆", title: "C1 Champion",          titleAr: "بطل C1",            desc: "Complete every C1 lesson",            descAr: "أكمل كل دروس C1" },
    { id: "all-c2",           icon: "👑", title: "C2 Pinnacle",          titleAr: "قمة C2",            desc: "Complete every C2 lesson",            descAr: "أكمل كل دروس C2" },
    { id: "vocab-10",         icon: "🔤", title: "Wordsmith",            titleAr: "صائغ الكلمات",      desc: "Master 10 words",                     descAr: "أتقن 10 كلمات" },
    { id: "vocab-30",         icon: "📖", title: "Vocabulary King",      titleAr: "ملك المفردات",      desc: "Master 30 words",                     descAr: "أتقن 30 كلمة" },
    { id: "vocab-60",         icon: "📕", title: "Lexicon Lord",         titleAr: "سيّد المعجم",        desc: "Master 60 words",                     descAr: "أتقن 60 كلمة" },
    { id: "streak-3",         icon: "🔥", title: "On Fire",              titleAr: "متّقد",             desc: "3-day streak",                        descAr: "3 أيام متواصلة" },
    { id: "streak-7",         icon: "⚡", title: "Week Warrior",         titleAr: "محارب الأسبوع",     desc: "7-day streak",                        descAr: "أسبوع متواصل" },
    { id: "streak-30",        icon: "💎", title: "Diamond Habit",        titleAr: "عادة ماسية",        desc: "30-day streak",                       descAr: "30 يوم متواصل" },
    { id: "first-challenge",  icon: "⚔️", title: "Challenger",           titleAr: "متحدٍّ",            desc: "Finish your first challenge",         descAr: "أكمل أول تحدي" },
    { id: "perfect-quiz",     icon: "💯", title: "Flawless",             titleAr: "بلا أخطاء",         desc: "Score 20/20 in a quiz challenge",     descAr: "اجمع 20 من 20" },
    { id: "typing-40",        icon: "⌨️", title: "Fast Fingers",         titleAr: "أصابع سريعة",       desc: "Reach 40 WPM",                        descAr: "اوصل لـ 40 كلمة/دقيقة" },
    { id: "typing-60",        icon: "🚀", title: "Speed Demon",          titleAr: "صاروخ السرعة",      desc: "Reach 60 WPM",                        descAr: "اوصل لـ 60 كلمة/دقيقة" },
    { id: "typing-80",        icon: "👑", title: "Typing Royalty",       titleAr: "ملك الطباعة",       desc: "Reach 80 WPM",                        descAr: "اوصل لـ 80 كلمة/دقيقة" },
    { id: "first-battle-win", icon: "🥇", title: "First Win",            titleAr: "أول فوز",           desc: "Win a battle vs a friend",            descAr: "افز بمعركة ضد صاحبك" },
    { id: "battle-streak",    icon: "🛡️", title: "Battle Hardened",      titleAr: "متمرّس قتالًا",     desc: "Win 5 battles",                       descAr: "افز بـ 5 معارك" },
    { id: "pronounce-90",     icon: "🎤", title: "Voice Match",          titleAr: "نطق مطابق",         desc: "Score 90%+ in pronunciation",         descAr: "احصل على 90%+ في النطق" },
    { id: "xp-500",           icon: "⭐", title: "Rising Star",          titleAr: "نجم صاعد",          desc: "Earn 500 XP",                         descAr: "اكسب 500 نقطة" },
    { id: "xp-1500",          icon: "🌟", title: "Bright Spark",         titleAr: "نجم مضيء",          desc: "Earn 1500 XP",                        descAr: "اكسب 1500 نقطة" },
    { id: "xp-5000",          icon: "🌠", title: "Legend",               titleAr: "أسطورة",            desc: "Earn 5000 XP",                        descAr: "اكسب 5000 نقطة" },
    { id: "writing-c1",       icon: "✍️", title: "Wordsmith C1",         titleAr: "كاتب C1",           desc: "Write at C1 level",                   descAr: "اكتب بمستوى C1" },
    { id: "all-explanations", icon: "💡", title: "Cultured",             titleAr: "مثقف",              desc: "Open every explanation pack",         descAr: "افتح كل الشروحات" },
    { id: "all-readings",     icon: "📰", title: "Avid Reader",          titleAr: "قارئ شغوف",         desc: "Finish every reading",                descAr: "أكمل كل القراءات" },
    { id: "first-mission",    icon: "🎯", title: "Mission Done",         titleAr: "مهمة منجزة",        desc: "Finish your first daily mission",     descAr: "أنجز أول مهمة يومية" },
    { id: "all-missions",     icon: "🏅", title: "Daily Hero",           titleAr: "بطل اليوم",         desc: "Finish all 3 missions in a day",      descAr: "أنجز كل المهام في يوم واحد" },
    { id: "night-owl",        icon: "🦉", title: "Night Owl",            titleAr: "بومة الليل",        desc: "Study after midnight",                descAr: "ادرس بعد منتصف الليل" },
    { id: "early-bird",       icon: "🌅", title: "Early Bird",           titleAr: "طائر مبكر",         desc: "Study before 6 AM",                   descAr: "ادرس قبل الساعة 6 صباحًا" },
    { id: "polyglot",         icon: "🌐", title: "Polyglot Mode",        titleAr: "متعدد اللغات",      desc: "Switch interface language",           descAr: "غيّر لغة الواجهة" },
    { id: "sharer",           icon: "🔗", title: "Generous",             titleAr: "كريم",              desc: "Share the site link",                 descAr: "شارك رابط الموقع" },
    { id: "ai-talker",        icon: "🤖", title: "Chatty",               titleAr: "ثرثار",              desc: "Have a chat with the AI coach",       descAr: "كلّم مدرّب الذكاء الاصطناعي" }
  ];

  function find(id) { return DEFS.find(d => d.id === id); }

  // Take current progress + ephemeral counters, return newly-earned list
  function check(progress) {
    const earned = new Set(progress.achievements || []);
    const newly = [];
    function award(id) {
      if (!earned.has(id)) { earned.add(id); newly.push(find(id)); }
    }
    if ((progress.completedLessons || []).length >= 1)  award("first-lesson");
    if ((progress.completedLessons || []).length >= 10) award("ten-lessons");
    if ((progress.completedLessons || []).length >= 20) award("twenty-lessons");

    const levels = ["A1","A2","B1","B2","C1","C2"];
    levels.forEach(lvl => {
      const all = AppData.lessons.filter(l => l.level === lvl);
      if (all.length && all.every(l => (progress.completedLessons || []).includes(l.id))) {
        award("all-" + lvl.toLowerCase());
      }
    });

    if ((progress.knownWords || []).length >= 10) award("vocab-10");
    if ((progress.knownWords || []).length >= 30) award("vocab-30");
    if ((progress.knownWords || []).length >= 60) award("vocab-60");

    if ((progress.streak || 0) >= 3)  award("streak-3");
    if ((progress.streak || 0) >= 7)  award("streak-7");
    if ((progress.streak || 0) >= 30) award("streak-30");

    if ((progress.xp || 0) >= 500)  award("xp-500");
    if ((progress.xp || 0) >= 1500) award("xp-1500");
    if ((progress.xp || 0) >= 5000) award("xp-5000");

    if ((progress.bestWpm || 0) >= 40) award("typing-40");
    if ((progress.bestWpm || 0) >= 60) award("typing-60");
    if ((progress.bestWpm || 0) >= 80) award("typing-80");

    if ((progress.battlesWon || 0) >= 1) award("first-battle-win");
    if ((progress.battlesWon || 0) >= 5) award("battle-streak");

    if ((progress.bestQuiz || 0) >= 1) award("first-challenge");
    if ((progress.bestQuiz || 0) >= 20) award("perfect-quiz");

    if (progress.bonusLang) award("polyglot");
    if (progress.bonusShared) award("sharer");
    if (progress.bonusAiTalked) award("ai-talker");
    if (progress.bonusReadingsAll) award("all-readings");
    if (progress.bonusExplanationsAll) award("all-explanations");
    if (progress.bonusPronounceHigh) award("pronounce-90");
    if (progress.bonusWritingC1) award("writing-c1");
    if (progress.bonusFirstMission) award("first-mission");
    if (progress.bonusAllMissions) award("all-missions");

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) award("night-owl");
    if (hour >= 4 && hour < 6) award("early-bird");

    return { all: Array.from(earned), newly };
  }

  return { DEFS, find, check };
})();
