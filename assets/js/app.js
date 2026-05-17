// Main app controller. Wires views, state, audio, and challenges together.
window.AppApp = (() => {
  const STORE_USER = "enc1_user";
  const STORE_PROGRESS = "enc1_progress";
  const STORE_THEME = "enc1_theme";

  let _user = null;
  let _progress = null;
  let _currentView = "dashboard";

  function init() {
    const theme = localStorage.getItem(STORE_THEME) || "dark";
    document.documentElement.setAttribute("data-theme", theme);

    _user = JSON.parse(localStorage.getItem(STORE_USER) || "null");
    _progress = JSON.parse(localStorage.getItem(STORE_PROGRESS) || "null") || defaultProgress();
    saveProgress();

    // Handle incoming shared-score link (#score=...)
    if (location.hash.startsWith("#score=")) {
      const ok = AppChallenges.importSharedScore(location.hash.slice("#score=".length));
      if (ok) setTimeout(() => toast("🏆 Friend's score added to your leaderboard.", "success"), 1200);
      history.replaceState({}, "", location.pathname + location.search);
    }

    if (!_user) showWelcome();
    else launchApp();

    bindGlobalEvents();
  }

  function defaultProgress() {
    return {
      currentLevel: "B1",
      xp: 0,
      streak: 0,
      lastActiveDay: null,
      completedLessons: [],
      knownWords: [],
      quizScores: {},
      pronAttempts: []
    };
  }

  function showWelcome() {
    const modal = document.getElementById("welcome-modal");
    const start = document.getElementById("welcome-start");
    start.onclick = () => {
      const name = document.getElementById("welcome-name").value.trim() || "Learner";
      const lang = document.getElementById("welcome-lang").value;
      _user = { name, lang, createdAt: Date.now() };
      localStorage.setItem(STORE_USER, JSON.stringify(_user));
      AppI18n.apply(lang);
      modal.classList.add("hidden");
      launchApp();
    };
    AppI18n.apply(document.getElementById("welcome-lang").value);
    document.getElementById("welcome-lang").addEventListener("change", e => AppI18n.apply(e.target.value));
  }

  function launchApp() {
    document.getElementById("welcome-modal").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    AppI18n.apply(_user.lang || "en");
    refreshHeader();
    refreshStreak();
    go("dashboard");
  }

  function refreshHeader() {
    document.getElementById("user-name").textContent = _user.name;
    document.getElementById("user-level").textContent = _progress.currentLevel;
    document.getElementById("user-avatar").textContent = (_user.name[0] || "?").toUpperCase();
    document.getElementById("greeting").textContent =
      AppI18n.t(`Hi, ${_user.name}`, `أهلًا، ${_user.name}`);
  }

  function bindGlobalEvents() {
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => go(btn.dataset.view));
    });
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("lang-toggle").addEventListener("click", () => {
      const next = AppI18n.get() === "en" ? "ar" : "en";
      _user.lang = next;
      localStorage.setItem(STORE_USER, JSON.stringify(_user));
      AppI18n.apply(next);
      go(_currentView); // re-render
    });
    document.getElementById("share-btn").addEventListener("click", () => {
      const url = location.origin + location.pathname;
      navigator.clipboard?.writeText(url);
      toast(AppI18n.t("Link copied! Share it with your friends.","تم نسخ الرابط! شاركه مع أصدقائك."), "success");
    });
    document.getElementById("generic-modal").addEventListener("click", e => {
      if (e.target.id === "generic-modal") closeModal();
    });
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORE_THEME, next);
  }

  function go(view, opts = {}) {
    _currentView = view;
    document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === view));
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById("view-" + view);
    if (!target) return;
    target.classList.add("active");
    if (view === "dashboard") target.innerHTML = AppViews.renderDashboard();
    else if (view === "lessons") target.innerHTML = AppViews.renderLessons();
    else if (view === "vocabulary") { target.innerHTML = AppViews.renderVocabulary(); mountVocab(); }
    else if (view === "reading") target.innerHTML = AppViews.renderReading();
    else if (view === "writing") target.innerHTML = AppViews.renderWriting();
    else if (view === "pronunciation") { target.innerHTML = AppViews.renderPronunciation(); mountPron(); }
    else if (view === "listening") { target.innerHTML = AppViews.renderListening(); mountListening(); }
    else if (view === "challenges") target.innerHTML = AppViews.renderChallenges();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ===== speech wrapper =====
  function speak(btn, text) {
    if (btn && btn.classList.contains("speaking")) {
      AppAudio.stop();
      btn.classList.remove("speaking");
      return;
    }
    document.querySelectorAll(".audio-btn.speaking").forEach(b => b.classList.remove("speaking"));
    btn && btn.classList.add("speaking");
    AppAudio.speak(text, {
      onend: () => btn && btn.classList.remove("speaking")
    });
  }

  // ===== LESSON =====
  function openLesson(id) {
    _currentView = "lessons";
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById("view-lessons");
    target.classList.add("active");
    target.innerHTML = AppViews.renderLessonDetail(id);
    bindQuiz(document.getElementById("lesson-quiz"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindQuiz(container) {
    if (!container) return;
    container.querySelectorAll(".quiz-question").forEach(qDiv => {
      qDiv.querySelectorAll(".quiz-option").forEach(opt => {
        opt.addEventListener("click", () => {
          qDiv.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");
        });
      });
    });
  }

  function submitQuiz(lessonId) {
    const l = AppData.lessons.find(x => x.id === lessonId);
    if (!l) return;
    const container = document.getElementById("lesson-quiz");
    let correct = 0;
    l.quiz.forEach((q, i) => {
      const qDiv = container.querySelector(`.quiz-question[data-i="${i}"]`);
      const opts = qDiv.querySelectorAll(".quiz-option");
      let chosen = -1;
      opts.forEach((o,j) => { if (o.classList.contains("selected")) chosen = j; });
      opts.forEach((o,j) => {
        o.disabled = true;
        if (j === q.correct) o.classList.add("correct");
        if (j === chosen && j !== q.correct) o.classList.add("wrong");
      });
      const exDiv = qDiv.querySelector(".q-explain");
      if (q.explain) { exDiv.textContent = "💡 " + q.explain; exDiv.style.display = "block"; }
      if (chosen === q.correct) correct++;
    });
    _progress.quizScores[lessonId] = { score: correct, total: l.quiz.length, at: Date.now() };
    if (!_progress.completedLessons.includes(lessonId)) _progress.completedLessons.push(lessonId);
    addXP(correct * 10 + 20);
    promoteLevelIfDue();
    saveProgress();
    refreshHeader();
    toast(AppI18n.t(`Done! ${correct} / ${l.quiz.length} correct (+${correct*10+20} XP).`, `أحسنت! ${correct}/${l.quiz.length} صحيحة (+${correct*10+20} XP).`), "success");
  }

  // ===== VOCAB =====
  function mountVocab() {
    const grid = document.getElementById("vocab-grid");
    const search = document.getElementById("vocab-search");
    const level = document.getElementById("vocab-level");
    function refresh() { grid.innerHTML = AppViews.renderVocabGrid(search.value, level.value); }
    search.addEventListener("input", refresh);
    level.addEventListener("change", refresh);
    refresh();
  }

  function toggleWord(w) {
    const i = _progress.knownWords.indexOf(w);
    if (i >= 0) _progress.knownWords.splice(i, 1);
    else { _progress.knownWords.push(w); addXP(5); }
    saveProgress();
    if (_currentView === "vocabulary") mountVocabRefresh();
    refreshHeader();
  }

  function mountVocabRefresh() {
    const grid = document.getElementById("vocab-grid");
    if (!grid) return;
    const search = document.getElementById("vocab-search");
    const level = document.getElementById("vocab-level");
    grid.innerHTML = AppViews.renderVocabGrid(search.value, level.value);
  }

  function openFlashcards() {
    const words = AppData.vocabulary.slice().sort(() => Math.random() - 0.5);
    let i = 0;
    const modal = document.getElementById("generic-modal");
    const content = document.getElementById("generic-modal-content");
    function render() {
      if (i >= words.length) {
        content.innerHTML = `<div style="text-align:center;padding:20px;">
          <h2>🎉 ${AppI18n.t("Deck complete","انتهت البطاقات")}</h2>
          <p>${AppI18n.t("Great session.","جلسة ممتازة.")}</p>
          <button class="btn btn-primary" onclick="AppApp.closeModal()">${AppI18n.t("Close","إغلاق")}</button>
        </div>`;
        return;
      }
      const w = words[i];
      content.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>${i+1}/${words.length}</strong>
          <button class="ghost-btn" onclick="AppApp.closeModal()">✕</button>
        </div>
        <div class="flashcard-stage">
          <div class="flashcard" id="fc">
            <div class="flashcard-face front">
              <div class="word-big">${w.word}</div>
              <div class="ipa">${w.ipa}</div>
              <button class="audio-btn" style="margin-top:14px;" onclick="event.stopPropagation();AppApp.speak(this, ${JSON.stringify(w.word).replace(/"/g,"&quot;")})">🔊</button>
              <div class="hint">${AppI18n.t("Tap to flip","اضغط للقلب")}</div>
            </div>
            <div class="flashcard-face back">
              <div style="font-weight:600;">${w.def}</div>
              <div style="color:var(--text-dim);font-size:13px;margin-top:6px;">${w.defAr || ""}</div>
              <div style="margin-top:14px;font-family:'Lora',serif;font-style:italic;">"${w.ex}"</div>
            </div>
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="btn btn-danger" onclick="AppApp.fcNext(false)">${AppI18n.t("Didn't know","لم أعرف")}</button>
          <button class="btn btn-success" onclick="AppApp.fcNext(true)">${AppI18n.t("Knew it ✓","عرفت ✓")}</button>
        </div>
      `;
      document.getElementById("fc").addEventListener("click", e => {
        e.currentTarget.classList.toggle("flipped");
      });
    }
    window.AppApp.fcNext = (known) => {
      const w = words[i];
      if (known && !_progress.knownWords.includes(w.word)) {
        _progress.knownWords.push(w.word);
        addXP(5);
      }
      i++;
      saveProgress();
      refreshHeader();
      render();
    };
    modal.classList.remove("hidden");
    render();
  }

  function closeModal() {
    document.getElementById("generic-modal").classList.add("hidden");
  }

  function popWord(ev, word) {
    ev.stopPropagation();
    document.querySelectorAll(".popup-tip").forEach(p => p.remove());
    const w = AppData.vocabulary.find(v => v.word.toLowerCase() === word.toLowerCase());
    const def = w ? `<div class="pt-def">${w.ipa} · ${w.pos}<br>${w.def}</div>` : `<div class="pt-def" style="color:var(--text-dim);">${AppI18n.t("No entry. Hear pronunciation:","لا تعريف. استمع للنطق:")}</div>`;
    const tip = document.createElement("div");
    tip.className = "popup-tip";
    tip.innerHTML = `
      <div class="pt-word">${word}</div>
      ${def}
      <div class="pt-actions">
        <button class="audio-btn" style="width:28px;height:28px;font-size:12px;" onclick="AppApp.speak(this, ${JSON.stringify(word).replace(/"/g,"&quot;")})">🔊</button>
        <button class="btn btn-ghost" style="padding:4px 8px;font-size:12px;" onclick="this.closest('.popup-tip').remove()">✕</button>
      </div>
    `;
    document.body.appendChild(tip);
    const r = ev.target.getBoundingClientRect();
    tip.style.left = Math.min(window.innerWidth - 280, r.left + window.scrollX) + "px";
    tip.style.top = (r.bottom + window.scrollY + 6) + "px";
    setTimeout(() => {
      const dismiss = (e) => { if (!tip.contains(e.target)) { tip.remove(); document.removeEventListener("click", dismiss); } };
      document.addEventListener("click", dismiss);
    }, 0);
  }

  // ===== READING =====
  function openReading(id) {
    _currentView = "reading";
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById("view-reading");
    target.classList.add("active");
    target.innerHTML = AppViews.renderReadingDetail(id);
    bindQuiz(document.getElementById("reading-quiz"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitReading(id) {
    const r = AppData.readings.find(x => x.id === id);
    const container = document.getElementById("reading-quiz");
    let correct = 0;
    r.questions.forEach((q,i) => {
      const qDiv = container.querySelector(`.quiz-question[data-i="${i}"]`);
      const opts = qDiv.querySelectorAll(".quiz-option");
      let chosen = -1;
      opts.forEach((o,j) => { if (o.classList.contains("selected")) chosen = j; });
      opts.forEach((o,j) => {
        o.disabled = true;
        if (j === q.correct) o.classList.add("correct");
        if (j === chosen && j !== q.correct) o.classList.add("wrong");
      });
      if (q.explain) {
        const ex = qDiv.querySelector(".q-explain");
        ex.textContent = "💡 " + q.explain;
        ex.style.display = "block";
      }
      if (chosen === q.correct) correct++;
    });
    addXP(correct * 8);
    toast(AppI18n.t(`Reading done: ${correct}/${r.questions.length}.`, `قراءة: ${correct}/${r.questions.length}.`), "success");
    saveProgress();
    refreshHeader();
  }

  // ===== WRITING =====
  function openWriting(id) {
    _currentView = "writing";
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById("view-writing");
    target.classList.add("active");
    target.innerHTML = AppViews.renderWritingDetail(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function gradeWriting(id) {
    const p = AppData.writingPrompts.find(x => x.id === id);
    const text = document.getElementById("writing-input").value.trim();
    const fb = document.getElementById("writing-feedback");
    if (!text) { fb.innerHTML = `<div class="writing-feedback">${AppI18n.t("Write something first.","اكتب شيئًا أولًا.")}</div>`; return; }

    const words = text.split(/\s+/).filter(Boolean);
    const wc = words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length).length || 1;
    const avgLen = (wc / sentences).toFixed(1);
    const unique = new Set(words.map(w => w.toLowerCase().replace(/[^\w'-]/g,""))).size;
    const lexicalDiversity = ((unique / wc) * 100).toFixed(0);

    const advancedWords = words.filter(w => {
      const c = w.toLowerCase().replace(/[^\w]/g,"");
      return AppData.vocabulary.some(v => v.word.toLowerCase() === c);
    });

    const markers = ["however","moreover","consequently","furthermore","nevertheless","therefore","that said","in addition","on the contrary","hence","accordingly","arguably"];
    const usedMarkers = markers.filter(m => new RegExp("\\b"+m+"\\b", "i").test(text));

    const passives = (text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length;
    const conditionals = /\bif\b.+(would|could|might|will)/i.test(text);
    const cleft = /\bit (was|is)\b.+\bthat\b/i.test(text) || /\bwhat\b.+\bis\b/i.test(text);
    const inversion = /^(Never|Rarely|Seldom|Hardly|Not only|Little|Only|Under no circumstances)\b/im.test(text);

    const targetMatch = p.prompt.match(/(\d+)[–-](\d+)\s*words/i);
    const [min, max] = targetMatch ? [+targetMatch[1], +targetMatch[2]] : [120, 220];
    const lengthOk = wc >= min && wc <= max;

    const checks = [
      { label: AppI18n.t("Length","الطول"), value: `${wc} ${AppI18n.t("words","كلمة")} (${AppI18n.t("target","المستهدف")} ${min}–${max})`, ok: lengthOk },
      { label: AppI18n.t("Sentences","الجمل"), value: `${sentences} · ${AppI18n.t("avg length","متوسط الطول")} ${avgLen}` },
      { label: AppI18n.t("Lexical diversity","تنوع المفردات"), value: `${lexicalDiversity}%`, ok: +lexicalDiversity >= 55 },
      { label: AppI18n.t("Advanced vocabulary","مفردات متقدمة"), value: `${advancedWords.length} ${AppI18n.t("hits","كلمة")}`, ok: advancedWords.length >= 3 },
      { label: AppI18n.t("Discourse markers","روابط الخطاب"), value: usedMarkers.length ? usedMarkers.join(", ") : "—", ok: usedMarkers.length >= 2 },
      { label: AppI18n.t("Passive structures","صيغ مبنية للمجهول"), value: passives, ok: passives >= 1 },
      { label: AppI18n.t("Conditional used","شرطية مستخدمة"), value: conditionals ? "✓" : "—", ok: conditionals },
      { label: AppI18n.t("Cleft sentence","جملة تركيز"), value: cleft ? "✓" : "—", ok: cleft },
      { label: AppI18n.t("Inversion","قلب نحوي"), value: inversion ? "✓" : "—", ok: inversion },
    ];

    const score = checks.filter(c => c.ok).length;
    const grade = score >= 7 ? "C1 🟢" : score >= 5 ? "B2 🔵" : "B1 🟡";

    fb.innerHTML = `
      <div class="writing-feedback">
        <h3 style="margin:0 0 10px;">${AppI18n.t("Estimated level","المستوى التقديري")}: ${grade}</h3>
        ${checks.map(c => `
          <div class="feedback-item">
            <span class="label">${c.label}:</span> ${c.value}
            ${c.ok != null ? (c.ok ? " ✅" : " ⚠️") : ""}
          </div>
        `).join("")}
        <div class="feedback-item" style="color:var(--text-dim);font-size:13px;">
          ${AppI18n.t("Tip: aim for variety — mix short and long sentences, and try at least one C1 structure (cleft, inversion, or hedged claim).", "نصيحة: نوّع جملك بين القصيرة والطويلة، وحاول استخدام تركيب من C1 (cleft, inversion, hedging).")}
        </div>
      </div>
    `;
    addXP(score * 6 + 10);
    saveProgress();
    refreshHeader();
  }

  function readWriting() {
    const text = document.getElementById("writing-input").value.trim();
    if (!text) return;
    AppAudio.speak(text);
  }

  // ===== PRONUNCIATION =====
  function mountPron() {
    document.querySelectorAll(".mic-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.text;
        const resultEl = btn.closest(".pron-target").querySelector(".pron-result");
        resultEl.style.display = "block";
        resultEl.innerHTML = `<em>${AppI18n.t("Listening... speak now.","أستمع... تكلّم الآن.")}</em>`;
        btn.classList.add("listening");
        AppAudio.listen({
          onResult: (alts) => {
            const best = alts[0] || "";
            const score = AppAudio.similarity(best, target);
            const pct = Math.round(score * 100);
            const color = pct >= 80 ? "var(--success)" : pct >= 55 ? "var(--warn)" : "var(--danger)";
            resultEl.innerHTML = `
              <div style="font-weight:600;color:${color};font-size:18px;">${pct}% match</div>
              <div style="margin-top:6px;color:var(--text-dim);">${AppI18n.t("You said","قلت")}: <em>"${best}"</em></div>
              <div style="margin-top:6px;font-size:13px;color:var(--muted);">${AppI18n.t("Target","المطلوب")}: ${target}</div>
            `;
            _progress.pronAttempts.push({ target, said: best, score: pct, at: Date.now() });
            addXP(Math.round(pct / 10));
            saveProgress();
            refreshHeader();
          },
          onError: (err) => { resultEl.innerHTML = `<span style="color:var(--danger);">⚠ ${err}</span>`; },
          onEnd: () => btn.classList.remove("listening")
        });
      });
    });
  }

  // ===== LISTENING =====
  function mountListening() {
    const voiceSel = document.getElementById("voice-select");
    const list = AppAudio.listEnglishVoices();
    voiceSel.innerHTML = list.map((v,i) => `<option value="${i}">${v.name} (${v.lang})</option>`).join("") || `<option>${AppI18n.t("Default","افتراضي")}</option>`;
    voiceSel.addEventListener("change", () => {
      const v = list[+voiceSel.value];
      if (v) AppAudio.setVoice(v);
    });
    // Pre-bind quiz click selection
    document.querySelectorAll("[data-listening]").forEach(c => bindQuiz(c));
  }

  function playListening(id) {
    const l = AppData.listening.find(x => x.id === id);
    if (!l) return;
    const rate = parseFloat(document.getElementById("rate-select").value);
    AppAudio.speak(l.script, { rate });
  }

  function toggleScript(id, btn) {
    const el = document.getElementById("script-" + id);
    const open = el.style.display === "none";
    el.style.display = open ? "block" : "none";
    btn.textContent = open ? AppI18n.t("Hide script","إخفاء النص") : AppI18n.t("Show script","إظهار النص");
  }

  function submitListening(id) {
    const l = AppData.listening.find(x => x.id === id);
    const container = document.querySelector(`[data-listening="${id}"]`);
    let correct = 0;
    l.questions.forEach((q,i) => {
      const qDiv = container.querySelector(`.quiz-question[data-i="${i}"]`);
      const opts = qDiv.querySelectorAll(".quiz-option");
      let chosen = -1;
      opts.forEach((o,j) => { if (o.classList.contains("selected")) chosen = j; });
      opts.forEach((o,j) => {
        o.disabled = true;
        if (j === q.correct) o.classList.add("correct");
        if (j === chosen && j !== q.correct) o.classList.add("wrong");
      });
      if (chosen === q.correct) correct++;
    });
    addXP(correct * 8);
    saveProgress();
    refreshHeader();
    toast(AppI18n.t(`Listening: ${correct}/${l.questions.length}`, `استماع: ${correct}/${l.questions.length}`), "success");
  }

  // ===== CHALLENGE =====
  let _chState = null;
  function startChallenge() {
    const target = document.getElementById("view-challenges");
    target.innerHTML = AppViews.renderChallengeQuiz();
    const questions = AppChallenges.todaysQuestions();
    _chState = { i: 0, questions, correct: 0, started: Date.now(), timer: null };
    renderChallengeStep();
  }

  function renderChallengeStep() {
    const stage = document.getElementById("challenge-stage");
    const fill = document.getElementById("timer-fill");
    const tt = document.getElementById("timer-text");
    if (_chState.timer) clearInterval(_chState.timer);

    if (_chState.i >= _chState.questions.length) {
      const elapsed = Math.round((Date.now() - _chState.started) / 1000);
      AppChallenges.recordScore({
        name: _user.name,
        score: _chState.correct,
        total: _chState.questions.length,
        timeSec: elapsed
      });
      addXP(_chState.correct * 6 + 20);
      saveProgress();
      refreshHeader();
      stage.innerHTML = `
        <div style="text-align:center;padding:20px;">
          <h2>🎉 ${AppI18n.t("Challenge complete","انتهى التحدي")}</h2>
          <div style="font-size:42px;font-weight:700;background:linear-gradient(135deg,var(--primary),var(--primary-2));-webkit-background-clip:text;background-clip:text;color:transparent;">${_chState.correct} / ${_chState.questions.length}</div>
          <p style="color:var(--text-dim);">${AppI18n.t("Time","الوقت")}: ${elapsed}s</p>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px;">
            <button class="btn btn-primary" onclick="AppApp.shareScore()">📤 ${AppI18n.t("Share my score","شارك نتيجتي")}</button>
            <button class="btn" onclick="AppApp.go('challenges')">${AppI18n.t("Leaderboard","لوحة الترتيب")}</button>
          </div>
        </div>
      `;
      fill.style.width = "0%";
      tt.textContent = "✓";
      return;
    }

    const q = _chState.questions[_chState.i];
    stage.innerHTML = `
      <div style="color:var(--text-dim);font-size:13px;">${AppI18n.t("Question","سؤال")} ${_chState.i+1} / ${_chState.questions.length}</div>
      <div class="q-text" style="font-size:18px;margin:10px 0 16px;">${q.q}</div>
      <div class="quiz-options" id="ch-options">
        ${q.options.map((o,j) => `<button class="quiz-option" data-j="${j}">${o}</button>`).join("")}
      </div>
    `;
    let remaining = AppChallenges.TIME_PER_Q;
    fill.style.width = "100%";
    tt.textContent = remaining + "s";
    _chState.timer = setInterval(() => {
      remaining--;
      fill.style.width = (remaining / AppChallenges.TIME_PER_Q) * 100 + "%";
      tt.textContent = Math.max(0, remaining) + "s";
      if (remaining <= 0) {
        clearInterval(_chState.timer);
        revealChoice(-1);
      }
    }, 1000);
    document.querySelectorAll("#ch-options .quiz-option").forEach(btn => {
      btn.addEventListener("click", () => revealChoice(+btn.dataset.j));
    });
  }

  function revealChoice(chosen) {
    const q = _chState.questions[_chState.i];
    const opts = document.querySelectorAll("#ch-options .quiz-option");
    opts.forEach((o, j) => {
      o.disabled = true;
      if (j === q.correct) o.classList.add("correct");
      if (j === chosen && j !== q.correct) o.classList.add("wrong");
    });
    if (chosen === q.correct) _chState.correct++;
    clearInterval(_chState.timer);
    setTimeout(() => { _chState.i++; renderChallengeStep(); }, 900);
  }

  function copyChallengeLink() {
    const url = location.origin + location.pathname;
    navigator.clipboard?.writeText(url);
    toast(AppI18n.t("Invite link copied!","تم نسخ رابط الدعوة!"), "success");
  }

  function shareScore() {
    const link = AppChallenges.shareUrlForLastScore();
    if (!link) { toast(AppI18n.t("Play the challenge first.","العب التحدي أولًا."), "error"); return; }
    navigator.clipboard?.writeText(link);
    toast(AppI18n.t("Score link copied! Send it to friends to add to their leaderboard.","تم نسخ رابط نتيجتك! ارسله لأصدقائك ليضاف لقائمتهم."), "success");
  }

  // ===== XP + LEVEL =====
  function addXP(n) { _progress.xp = (_progress.xp || 0) + n; }
  function promoteLevelIfDue() {
    const c1Count = _progress.completedLessons.filter(id => {
      const l = AppData.lessons.find(x => x.id === id);
      return l && l.level === "C1";
    }).length;
    const b2Count = _progress.completedLessons.filter(id => {
      const l = AppData.lessons.find(x => x.id === id);
      return l && l.level === "B2";
    }).length;
    if (c1Count >= 2) _progress.currentLevel = "C1";
    else if (b2Count >= 2) _progress.currentLevel = "B2";
  }

  function refreshStreak() {
    const today = new Date().toDateString();
    const last = _progress.lastActiveDay;
    if (last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    _progress.streak = (last === yesterday ? (_progress.streak || 0) + 1 : 1);
    _progress.lastActiveDay = today;
    saveProgress();
  }

  function saveProgress() { localStorage.setItem(STORE_PROGRESS, JSON.stringify(_progress)); }

  // ===== TOAST =====
  let toastTimer = null;
  function toast(msg, kind = "") {
    const el = document.getElementById("toast");
    el.className = "toast " + kind;
    el.textContent = msg;
    el.classList.remove("hidden");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 3200);
  }

  // expose
  return {
    init, go, openLesson, submitQuiz,
    speak, user: () => _user, progress: () => _progress,
    toast,
    toggleWord, openFlashcards, popWord, closeModal,
    openReading, submitReading,
    openWriting, gradeWriting, readWriting,
    playListening, toggleScript, submitListening,
    startChallenge, copyChallengeLink, shareScore
  };
})();

document.addEventListener("DOMContentLoaded", () => AppApp.init());
