// Quiz challenge: 20 deterministic-per-day questions, varied types.
window.AppChallenges = (() => {
  const LB_KEY = "enc1_leaderboard";
  const TOTAL = 20;
  const TIME_PER_Q = 14;

  function todayKey() {
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  }
  function dailySeed() {
    const k = todayKey();
    let h = 0;
    for (let i = 0; i < k.length; i++) h = ((h<<5)-h) + k.charCodeAt(i) | 0;
    return Math.abs(h);
  }

  function rng(seed) {
    let a = seed | 0;
    return function() {
      a = (a + 0x6D2B79F5) | 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, r) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function todaysQuestions() {
    const r = rng(dailySeed());
    const bank = AppData.challengeBank.slice();
    // Split by type to ensure variety: aim ~10 MCQ + ~5 listen + ~5 others
    const mcqs = bank.filter(q => q.type === "mcq" || !q.type);
    const listens = bank.filter(q => q.type === "listen");
    const shuffledMcq = shuffle(mcqs, r);
    const shuffledListen = shuffle(listens, r);
    const picked = [
      ...shuffledMcq.slice(0, Math.min(15, shuffledMcq.length)),
      ...shuffledListen.slice(0, Math.min(5, shuffledListen.length))
    ];
    return shuffle(picked, r).slice(0, TOTAL);
  }

  function leaderboard() {
    const data = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
    const me = AppApp.user().name;
    const today = todayKey();
    return data.filter(r => r.day === today)
      .map(r => ({ ...r, you: r.name === me }))
      .sort((a, b) => b.score - a.score || a.timeSec - b.timeSec)
      .slice(0, 20);
  }

  function recordScore({ name, score, total, timeSec }) {
    const data = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
    data.push({ name, score, total, timeSec, day: todayKey(), date: new Date().toLocaleString() });
    localStorage.setItem(LB_KEY, JSON.stringify(data));
  }

  function importSharedScore(b64) {
    try {
      const obj = JSON.parse(atob(b64));
      if (!obj.name || obj.score == null) return false;
      const data = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
      const dup = data.some(r => r.name === obj.name && r.day === obj.day && r.score === obj.score && r.timeSec === obj.timeSec);
      if (!dup) {
        data.push(obj);
        localStorage.setItem(LB_KEY, JSON.stringify(data));
      }
      return true;
    } catch { return false; }
  }

  function shareUrlForLastScore() {
    const data = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
    const me = AppApp.user().name;
    const today = todayKey();
    const mine = data.filter(r => r.name === me && r.day === today).sort((a,b)=>b.score-a.score)[0];
    if (!mine) return null;
    const payload = btoa(JSON.stringify(mine));
    const u = new URL(window.location.href);
    u.search = "";
    u.hash = "score=" + payload;
    return u.toString();
  }

  return { todaysQuestions, dailySeed, leaderboard, recordScore, importSharedScore, shareUrlForLastScore, TIME_PER_Q, TOTAL };
})();
