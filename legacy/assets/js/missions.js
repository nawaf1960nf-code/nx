// Daily missions — 3 small tasks per day, seeded.
window.AppMissions = (() => {
  function todayKey() {
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  }

  function rng(seed) {
    let a = seed | 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const POOL = [
    { id: "do-lesson",       icon: "📚", title: "Finish a lesson",          titleAr: "أنهِ درسًا",                   xp: 30 },
    { id: "learn-5-words",   icon: "🔤", title: "Mark 5 new words",         titleAr: "علّم 5 كلمات جديدة",           xp: 25 },
    { id: "do-challenge",    icon: "⚔️", title: "Complete a challenge",     titleAr: "أكمل تحديًا",                  xp: 40 },
    { id: "do-typing",       icon: "⌨️", title: "Run a typing race",        titleAr: "خُض سباق كتابة",                xp: 30 },
    { id: "do-reading",      icon: "📖", title: "Finish a reading",         titleAr: "أنهِ نصًا للقراءة",             xp: 30 },
    { id: "do-pronunciation",icon: "🎤", title: "Try a pronunciation",      titleAr: "جرّب نطقًا",                    xp: 25 },
    { id: "do-explanation",  icon: "💡", title: "Read an explanation pack", titleAr: "اقرأ مجموعة شروحات",            xp: 20 },
    { id: "earn-100-xp",     icon: "⭐", title: "Earn 100 XP today",        titleAr: "اكسب 100 نقطة اليوم",          xp: 20 },
    { id: "do-listening",    icon: "🎧", title: "Finish a listening task",  titleAr: "أنجز مهمة استماع",              xp: 30 },
    { id: "chat-ai",         icon: "🤖", title: "Talk to the AI coach",     titleAr: "كلّم مدرّب الذكاء الاصطناعي",   xp: 25 }
  ];

  function todays(progress) {
    const day = todayKey();
    if (progress.missions && progress.missions[day]) {
      return { day, list: progress.missions[day] };
    }
    let h = 0;
    for (let i = 0; i < day.length; i++) h = ((h << 5) - h) + day.charCodeAt(i) | 0;
    const r = rng(Math.abs(h));
    const pool = POOL.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const list = pool.slice(0, 3).map(m => ({ ...m, done: false }));
    return { day, list };
  }

  function ensureFresh(progress) {
    const { day, list } = todays(progress);
    if (!progress.missions) progress.missions = {};
    if (!progress.missions[day]) progress.missions[day] = list;
    return progress.missions[day];
  }

  function markIfMatches(progress, eventId, dailyXP) {
    const list = ensureFresh(progress);
    let changed = false;
    list.forEach(m => {
      if (m.done) return;
      if (m.id === eventId) { m.done = true; changed = true; }
      if (m.id === "earn-100-xp" && (dailyXP || 0) >= 100) { m.done = true; changed = true; }
    });
    return { changed, list };
  }

  return { todays, ensureFresh, markIfMatches, todayKey, POOL };
})();
