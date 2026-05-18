// MonkeyType-style typing test with daily-seeded text + leaderboard.
window.AppTyping = (() => {
  const LB_KEY = "enc1_typing_leaderboard";
  const DURATION = 60; // seconds

  let state = null;

  function todayKey() {
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  }
  function dailySeed() {
    const k = "typing-" + todayKey();
    let h = 0;
    for (let i = 0; i < k.length; i++) h = ((h<<5)-h) + k.charCodeAt(i) | 0;
    return Math.abs(h);
  }

  function todaysText() {
    const seed = dailySeed();
    const i = seed % AppData.typingTexts.length;
    return AppData.typingTexts[i];
  }

  function start(text) {
    state = {
      text,
      started: false,
      startTime: null,
      endTime: null,
      typed: "",
      correctChars: 0,
      totalKeystrokes: 0,
      finished: false,
      timer: null,
      duration: DURATION
    };
    renderDisplay();
    updateStats();
    const input = document.getElementById("t-input");
    if (input) { input.value = ""; input.focus(); }
  }

  function renderDisplay() {
    const d = document.getElementById("t-display");
    if (!d || !state) return;
    let html = "";
    const cur = state.typed.length;
    for (let i = 0; i < state.text.length; i++) {
      const ch = state.text[i];
      let cls = "ch";
      if (i < cur) cls += (state.typed[i] === ch ? " ok" : " bad");
      else if (i === cur) cls += " cur";
      html += `<span class="${cls}">${ch === " " ? "&nbsp;" : escapeHtml(ch)}</span>`;
    }
    d.innerHTML = html;
    // Auto-scroll cursor into view
    const curEl = d.querySelector(".ch.cur");
    if (curEl) curEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function escapeHtml(c) {
    return c.replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
  }

  function onInput(value) {
    if (!state || state.finished) return;
    if (!state.started) {
      state.started = true;
      state.startTime = Date.now();
      startTimer();
    }
    // Detect new keystrokes (additions only)
    if (value.length > state.typed.length) {
      const newChars = value.length - state.typed.length;
      state.totalKeystrokes += newChars;
    }
    state.typed = value.slice(0, state.text.length);
    // Recount correct
    let c = 0;
    for (let i = 0; i < state.typed.length; i++) {
      if (state.typed[i] === state.text[i]) c++;
    }
    state.correctChars = c;
    renderDisplay();
    updateStats();
    if (state.typed.length >= state.text.length) finish();
  }

  function startTimer() {
    state.timer = setInterval(() => {
      const elapsed = (Date.now() - state.startTime) / 1000;
      if (elapsed >= state.duration) finish();
      updateStats();
    }, 250);
  }

  function updateStats() {
    if (!state) return;
    const elapsed = state.started ? Math.max(0.1, (Date.now() - state.startTime) / 1000) : 0;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.round((state.correctChars / 5) / minutes) : 0;
    const acc = state.totalKeystrokes ? Math.round((state.correctChars / state.totalKeystrokes) * 100) : 100;
    const remaining = state.started ? Math.max(0, Math.ceil(state.duration - elapsed)) : state.duration;
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set("t-time", remaining + "s");
    set("t-wpm", wpm);
    set("t-acc", acc + "%");
    set("t-chars", `${state.correctChars}/${state.text.length}`);
  }

  function finish() {
    if (!state || state.finished) return;
    state.finished = true;
    state.endTime = Date.now();
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    const elapsed = (state.endTime - state.startTime) / 1000;
    const minutes = elapsed / 60;
    const wpm = Math.round((state.correctChars / 5) / minutes);
    const acc = state.totalKeystrokes ? Math.round((state.correctChars / state.totalKeystrokes) * 100) : 100;
    const result = { wpm, acc, time: Math.round(elapsed), chars: state.correctChars, total: state.text.length };
    saveScore(result);
    showResult(result);
    if (window.AppApp && typeof AppApp.onTypingFinished === "function") AppApp.onTypingFinished(result);
  }

  function showResult(r) {
    const stage = document.getElementById("typing-stage");
    if (!stage) return;
    const t = AppI18n.t.bind(AppI18n);
    stage.innerHTML = `
      <div class="typing-result">
        <div style="color:var(--text-dim);font-size:13px;">${t("Your speed","سرعتك")}</div>
        <div class="big-wpm">${r.wpm} <span style="font-size:18px;">WPM</span></div>
        <div style="display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:10px;color:var(--text-dim);font-size:14px;">
          <div>🎯 ${t("Accuracy","الدقة")}: <strong style="color:var(--text);">${r.acc}%</strong></div>
          <div>⏱ ${t("Time","الوقت")}: <strong style="color:var(--text);">${r.time}s</strong></div>
          <div>⌨ ${t("Characters","الحروف")}: <strong style="color:var(--text);">${r.chars}/${r.total}</strong></div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px;">
          <button class="btn btn-primary" onclick="AppApp.startTyping()">🔄 ${t("Try again","حاول مرة ثانية")}</button>
          <button class="btn" onclick="AppApp.shareTyping()">📤 ${t("Share my score","شارك نتيجتي")}</button>
          <button class="btn btn-ghost" onclick="AppApp.go('challenges')">← ${t("Back","عودة")}</button>
        </div>
      </div>
    `;
    AppApp.toast(AppI18n.t(`Nice! ${r.wpm} WPM at ${r.acc}% accuracy.`, `ممتاز! ${r.wpm} كلمة بالدقيقة بدقة ${r.acc}%.`), "success");
  }

  function saveScore(r) {
    const data = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
    data.push({
      name: AppApp.user().name,
      wpm: r.wpm,
      acc: r.acc,
      time: r.time,
      day: todayKey(),
      date: new Date().toLocaleString()
    });
    localStorage.setItem(LB_KEY, JSON.stringify(data));
  }

  function leaderboard() {
    const data = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
    const me = AppApp.user().name;
    const today = todayKey();
    return data.filter(r => r.day === today)
      .map(r => ({ ...r, you: r.name === me }))
      .sort((a, b) => b.wpm - a.wpm || b.acc - a.acc)
      .slice(0, 20);
  }

  function importSharedScore(b64) {
    try {
      const obj = JSON.parse(atob(b64));
      if (!obj.name || obj.wpm == null) return false;
      const data = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
      const dup = data.some(r => r.name === obj.name && r.day === obj.day && r.wpm === obj.wpm && r.acc === obj.acc);
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
    const mine = data.filter(r => r.name === me && r.day === today).sort((a,b) => b.wpm - a.wpm)[0];
    if (!mine) return null;
    const payload = btoa(JSON.stringify(mine));
    const u = new URL(window.location.href);
    u.search = "";
    u.hash = "typing=" + payload;
    return u.toString();
  }

  function abort() {
    if (state && state.timer) clearInterval(state.timer);
    state = null;
  }

  return { start, onInput, todaysText, leaderboard, shareUrlForLastScore, importSharedScore, abort, DURATION };
})();
