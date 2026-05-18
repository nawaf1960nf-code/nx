// Main app controller — auth-gated, multi-account.
window.AppApp = (() => {
  const STORE_THEME = "enc1_theme";

  let _currentView = "dashboard";
  let _dailyXP = 0;
  let _dailyXpDay = null;

  function init() {
    const theme = localStorage.getItem(STORE_THEME) || "dark";
    document.documentElement.setAttribute("data-theme", theme);

    // Sound toggle init
    const soundBtn = document.getElementById("sound-toggle");
    if (soundBtn) soundBtn.textContent = AppSounds.isEnabled() ? "🔊" : "🔇";

    // Import shared scores / battle links from hash
    if (location.hash.startsWith("#score=")) {
      const ok = AppChallenges.importSharedScore(location.hash.slice(7));
      if (ok) setTimeout(() => toast("🏆 " + AppI18n.t("Friend's quiz score added.","تم إضافة نتيجة صديقك."), "success"), 1500);
      history.replaceState({}, "", location.pathname + location.search);
    }
    if (location.hash.startsWith("#typing=")) {
      const ok = AppTyping.importSharedScore(location.hash.slice(8));
      if (ok) setTimeout(() => toast("⌨️ " + AppI18n.t("Friend's typing score added.","تم إضافة نتيجة كتابة صديقك."), "success"), 1500);
      history.replaceState({}, "", location.pathname + location.search);
    }
    let pendingBattle = null;
    if (location.hash.startsWith("#battle=")) {
      const res = AppBattles.importFromHash(location.hash.slice(8));
      if (res) pendingBattle = res;
      history.replaceState({}, "", location.pathname + location.search);
    }

    const u = AppAuth.current();
    if (!u) showAuth(pendingBattle);
    else launchApp(pendingBattle);
  }

  // ===== AUTH FLOW =====
  function showAuth(pendingBattle) {
    AppI18n.apply(localStorage.getItem("enc1_pref_lang") || "ar");
    const authScreen = document.getElementById("auth-screen");
    authScreen.classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");

    document.querySelectorAll(".auth-tab").forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t === tab));
        document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
        document.getElementById(tab.dataset.tab + "-form").classList.add("active");
      };
    });

    document.querySelectorAll(".auth-lang-btn").forEach(b => {
      b.onclick = () => {
        document.querySelectorAll(".auth-lang-btn").forEach(x => x.classList.toggle("active", x === b));
        AppI18n.apply(b.dataset.lang);
        localStorage.setItem("enc1_pref_lang", b.dataset.lang);
      };
    });
    // Init the active lang button
    const curLang = AppI18n.get();
    document.querySelectorAll(".auth-lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === curLang));

    document.getElementById("login-form").onsubmit = async (e) => {
      e.preventDefault();
      const f = e.target;
      try {
        await AppAuth.login({ email: f.email.value, password: f.password.value });
        AppSounds.chime();
        launchApp(pendingBattle);
      } catch (err) {
        document.getElementById("login-error").textContent = err.message;
        AppSounds.wrong();
      }
    };

    document.getElementById("signup-form").onsubmit = async (e) => {
      e.preventDefault();
      const f = e.target;
      try {
        await AppAuth.signup({
          name: f.name.value, email: f.email.value,
          password: f.password.value, lang: f.lang.value
        });
        AppSounds.win();
        launchApp(pendingBattle);
      } catch (err) {
        document.getElementById("signup-error").textContent = err.message;
        AppSounds.wrong();
      }
    };
  }

  function launchApp(pendingBattle) {
    document.getElementById("auth-screen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    const u = AppAuth.current();
    AppI18n.apply(u.lang || "en");
    refreshHeader();
    refreshStreak();
    bindGlobalEvents();
    checkAchievements();
    if (pendingBattle && pendingBattle.battle) {
      _currentView = "challenges";
      const target = document.getElementById("view-challenges");
      target.innerHTML = AppViews.renderBattleRoom(pendingBattle.battle.code);
      document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
      target.classList.add("active");
      setActiveNav("challenges");
      if (pendingBattle.kind === "result") AppSounds.chime();
    } else {
      go("dashboard");
    }
  }

  // ===== HELPERS =====
  function user() { return AppAuth.current(); }
  function progress() { return AppAuth.current()?.progress || AppAuth.defaultProgress(); }

  function updateProgress(updater) {
    return AppAuth.updateProgress(updater);
  }

  function refreshHeader() {
    const u = user();
    if (!u) return;
    const p = progress();
    document.getElementById("user-name").textContent = u.name;
    document.getElementById("user-level").textContent = p.currentLevel;
    document.getElementById("user-avatar").textContent = (u.name[0] || "?").toUpperCase();
    document.getElementById("greeting").textContent =
      AppI18n.t(`Hi, ${u.name}`, `أهلًا، ${u.name}`);
  }

  function bindGlobalEvents() {
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.onclick = () => { go(btn.dataset.view); closeSidebar(); };
    });
    document.getElementById("theme-toggle").onclick = toggleTheme;
    document.getElementById("sound-toggle").onclick = toggleSound;
    document.getElementById("lang-toggle").onclick = switchLang;
    document.getElementById("mobile-lang").onclick = switchLang;
    document.getElementById("logout-btn").onclick = confirmLogout;
    document.getElementById("share-btn").onclick = () => {
      copyToClipboard(location.origin + location.pathname);
      toast(AppI18n.t("Link copied! Share it with friends.","تم نسخ الرابط! شاركه مع أصحابك."), "success");
      updateProgress(p => ({ ...p, bonusShared: true }));
      checkAchievements();
    };
    document.getElementById("generic-modal").onclick = e => {
      if (e.target.id === "generic-modal") closeModal();
    };
    document.getElementById("hamburger").onclick = openSidebar;
    document.getElementById("close-sidebar").onclick = closeSidebar;
    document.getElementById("sidebar-backdrop").onclick = closeSidebar;
  }

  function openSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebar-backdrop").classList.add("open");
  }
  function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebar-backdrop").classList.remove("open");
  }

  function switchLang() {
    const next = AppI18n.get() === "en" ? "ar" : "en";
    AppAuth.updateCurrent({ lang: next });
    AppI18n.apply(next);
    updateProgress(p => ({ ...p, bonusLang: true }));
    checkAchievements();
    go(_currentView);
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORE_THEME, next);
  }

  function toggleSound() {
    const enabled = !AppSounds.isEnabled();
    AppSounds.setEnabled(enabled);
    document.getElementById("sound-toggle").textContent = enabled ? "🔊" : "🔇";
    if (enabled) AppSounds.pop();
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(ta);
  }

  function confirmLogout() {
    if (confirm(AppI18n.t("Log out of your account?","تسجيل الخروج من حسابك؟"))) {
      AppAuth.logout();
      location.reload();
    }
  }

  function setActiveNav(view) {
    document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === view));
  }

  function go(view, opts = {}) {
    _currentView = view;
    setActiveNav(view);
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById("view-" + view);
    if (!target) return;
    target.classList.add("active");

    if (view === "dashboard") target.innerHTML = AppViews.renderDashboard();
    else if (view === "lessons") target.innerHTML = AppViews.renderLessons();
    else if (view === "explanations") target.innerHTML = AppViews.renderExplanations();
    else if (view === "vocabulary") { target.innerHTML = AppViews.renderVocabulary(); mountVocab(); }
    else if (view === "reading") target.innerHTML = AppViews.renderReading();
    else if (view === "writing") target.innerHTML = AppViews.renderWriting();
    else if (view === "pronunciation") { target.innerHTML = AppViews.renderPronunciation(); mountPron(); }
    else if (view === "listening") { target.innerHTML = AppViews.renderListening(); mountListening(); }
    else if (view === "ai-chat") { target.innerHTML = AppViews.renderAiChat(); mountChat(); }
    else if (view === "achievements") target.innerHTML = AppViews.renderAchievements();
    else if (view === "profile") target.innerHTML = AppViews.renderProfile();
    else if (view === "challenges") {
      if (opts.sub === "quiz") { target.innerHTML = AppViews.renderChallengeQuiz(); startChallenge(); }
      else if (opts.sub === "typing") { target.innerHTML = AppViews.renderTypingRace(); mountTyping(); }
      else if (opts.sub === "battle") target.innerHTML = AppViews.renderBattles();
      else target.innerHTML = AppViews.renderChallenges();
    }
    AppSounds.pop();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ===== AUDIO =====
  function speak(btn, text) {
    if (btn && btn.classList.contains("speaking")) {
      AppAudio.stop(); btn.classList.remove("speaking"); return;
    }
    document.querySelectorAll(".audio-btn.speaking").forEach(b => b.classList.remove("speaking"));
    btn && btn.classList.add("speaking");
    AppAudio.speak(text, { onend: () => btn && btn.classList.remove("speaking") });
  }

  // ===== LESSONS =====
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
        opt.onclick = () => {
          AppSounds.pop();
          qDiv.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");
        };
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
    updateProgress(p => {
      p.quizScores = p.quizScores || {};
      p.quizScores[lessonId] = { score: correct, total: l.quiz.length, at: Date.now() };
      if (!p.completedLessons.includes(lessonId)) p.completedLessons.push(lessonId);
      return p;
    });
    promoteLevelIfDue();
    const xp = correct * 10 + 20;
    addXP(xp);
    markMission("do-lesson");
    correct >= l.quiz.length * 0.7 ? AppSounds.win() : AppSounds.correct();
    toast(AppI18n.t(`Done! ${correct}/${l.quiz.length} (+${xp} XP)`, `أحسنت! ${correct}/${l.quiz.length} (+${xp} XP)`), "success");
    refreshHeader();
    checkAchievements();
  }

  // ===== EXPLANATIONS =====
  function openExplanation(id) {
    _currentView = "explanations";
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById("view-explanations");
    target.classList.add("active");
    target.innerHTML = AppViews.renderExplanationDetail(id);
    markMission("do-explanation");
    // Track opened explanations
    updateProgress(p => {
      const opened = new Set(p.openedExplanations || []);
      opened.add(id);
      p.openedExplanations = Array.from(opened);
      if (opened.size >= AppData.explanations.length) p.bonusExplanationsAll = true;
      return p;
    });
    checkAchievements();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ===== VOCAB =====
  function mountVocab() {
    const grid = document.getElementById("vocab-grid");
    const search = document.getElementById("vocab-search");
    const level = document.getElementById("vocab-level");
    const refresh = () => { grid.innerHTML = AppViews.renderVocabGrid(search.value, level.value); };
    search.oninput = refresh;
    level.onchange = refresh;
    refresh();
  }

  function toggleWord(w) {
    let added = false;
    updateProgress(p => {
      const idx = p.knownWords.indexOf(w);
      if (idx >= 0) p.knownWords.splice(idx, 1);
      else { p.knownWords.push(w); added = true; }
      return p;
    });
    if (added) { addXP(5); AppSounds.pop(); markMission("learn-5-words"); }
    if (_currentView === "vocabulary") {
      const grid = document.getElementById("vocab-grid");
      const search = document.getElementById("vocab-search");
      const level = document.getElementById("vocab-level");
      if (grid) grid.innerHTML = AppViews.renderVocabGrid(search.value, level.value);
    }
    refreshHeader();
    checkAchievements();
  }

  function openFlashcards() {
    const words = AppData.vocabulary.slice().sort(() => Math.random() - 0.5);
    let i = 0;
    const modal = document.getElementById("generic-modal");
    const content = document.getElementById("generic-modal-content");
    function render() {
      if (i >= words.length) {
        AppConfetti.fire({ count: 60 });
        AppSounds.win();
        content.innerHTML = `<div style="text-align:center;padding:20px;">
          <h2>🎉 ${AppI18n.t("Deck complete","انتهت البطاقات")}</h2>
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
              <button class="audio-btn" style="margin-top:14px;" onclick="event.stopPropagation();AppApp.speak(this, ${JSON.stringify(w.word).replace(/"/g,'&quot;')})">🔊</button>
              <div class="hint">${AppI18n.t("Tap to flip","اضغط للقلب")}</div>
            </div>
            <div class="flashcard-face back">
              <div style="font-weight:600;">${w.def}</div>
              <div style="color:var(--text-dim);font-size:13px;margin-top:6px;font-family:'Cairo';">${w.defAr || ""}</div>
              <div style="margin-top:14px;font-family:'Lora',serif;font-style:italic;">"${w.ex}"</div>
            </div>
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="btn btn-danger" onclick="AppApp.fcNext(false)">${AppI18n.t("Didn't know","لم أعرفها")}</button>
          <button class="btn btn-success" onclick="AppApp.fcNext(true)">${AppI18n.t("Knew it ✓","عرفتها ✓")}</button>
        </div>
      `;
      document.getElementById("fc").onclick = e => e.currentTarget.classList.toggle("flipped");
    }
    window.AppApp.fcNext = (known) => {
      const w = words[i];
      if (known) {
        updateProgress(p => {
          if (!p.knownWords.includes(w.word)) p.knownWords.push(w.word);
          return p;
        });
        addXP(5);
        AppSounds.correct();
        markMission("learn-5-words");
      } else {
        AppSounds.wrong();
      }
      i++;
      refreshHeader();
      render();
    };
    modal.classList.remove("hidden");
    render();
  }

  function closeModal() { document.getElementById("generic-modal").classList.add("hidden"); }

  function popWord(ev, word) {
    ev.stopPropagation();
    document.querySelectorAll(".popup-tip").forEach(p => p.remove());
    const w = AppData.vocabulary.find(v => v.word.toLowerCase() === word.toLowerCase());
    const def = w
      ? `<div class="pt-def">${w.ipa} · ${w.pos}<br>${w.def}<br><span style="font-family:'Cairo';">${w.defAr||""}</span></div>`
      : `<div class="pt-def" style="color:var(--text-dim);">${AppI18n.t("No entry. Hear pronunciation:","لا يوجد تعريف. استمع للنطق:")}</div>`;
    const tip = document.createElement("div");
    tip.className = "popup-tip";
    tip.innerHTML = `
      <div class="pt-word">${word}</div>
      ${def}
      <div class="pt-actions">
        <button class="audio-btn audio-btn-sm" onclick="AppApp.speak(this, ${JSON.stringify(word).replace(/"/g,'&quot;')})">🔊</button>
        <button class="btn btn-ghost" style="padding:4px 8px;font-size:12px;min-height:28px;" onclick="this.closest('.popup-tip').remove()">✕</button>
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
      if (chosen === q.correct) correct++;
    });
    addXP(correct * 8);
    updateProgress(p => {
      const done = new Set(p.completedReadings || []);
      done.add(id);
      p.completedReadings = Array.from(done);
      if (done.size >= AppData.readings.length) p.bonusReadingsAll = true;
      return p;
    });
    markMission("do-reading");
    AppSounds.correct();
    toast(AppI18n.t(`Reading: ${correct}/${r.questions.length}`, `قراءة: ${correct}/${r.questions.length}`), "success");
    refreshHeader();
    checkAchievements();
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
    const lex = ((unique / wc) * 100).toFixed(0);
    const adv = words.filter(w => {
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
      { label: AppI18n.t("Length","الطول"), value: `${wc} (${AppI18n.t("target","المطلوب")} ${min}–${max})`, ok: lengthOk },
      { label: AppI18n.t("Sentences","الجمل"), value: `${sentences} · ${avgLen} ${AppI18n.t("avg","متوسط")}` },
      { label: AppI18n.t("Diversity","التنوع"), value: `${lex}%`, ok: +lex >= 55 },
      { label: AppI18n.t("Advanced vocab","مفردات متقدمة"), value: `${adv.length}`, ok: adv.length >= 3 },
      { label: AppI18n.t("Markers","الروابط"), value: usedMarkers.length ? usedMarkers.join(", ") : "—", ok: usedMarkers.length >= 2 },
      { label: AppI18n.t("Passives","مبني للمجهول"), value: passives, ok: passives >= 1 },
      { label: AppI18n.t("Conditional","شرطية"), value: conditionals?"✓":"—", ok: conditionals },
      { label: AppI18n.t("Cleft","تركيز"), value: cleft?"✓":"—", ok: cleft },
      { label: AppI18n.t("Inversion","قلب نحوي"), value: inversion?"✓":"—", ok: inversion },
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
      </div>
    `;
    addXP(score * 6 + 10);
    if (score >= 7) {
      updateProgress(pr => ({ ...pr, bonusWritingC1: true }));
      AppConfetti.fire({ count: 80 });
      AppSounds.win();
    } else {
      AppSounds.correct();
    }
    refreshHeader();
    checkAchievements();
  }

  function readWriting() {
    const text = document.getElementById("writing-input").value.trim();
    if (text) AppAudio.speak(text);
  }

  // ===== PRONUNCIATION =====
  function mountPron() {
    document.querySelectorAll(".mic-trigger").forEach(btn => {
      btn.onclick = () => {
        const target = btn.dataset.text;
        const resultEl = btn.closest(".pron-target").querySelector(".pron-result");
        resultEl.style.display = "block";
        resultEl.innerHTML = `<em>${AppI18n.t("Listening… speak now.","أستمع... تكلّم الآن.")}</em>`;
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
            addXP(Math.round(pct / 10));
            if (pct >= 90) {
              updateProgress(p => ({ ...p, bonusPronounceHigh: true }));
              AppSounds.win();
              AppConfetti.fire({ count: 40 });
            } else if (pct >= 60) AppSounds.correct();
            else AppSounds.wrong();
            markMission("do-pronunciation");
            refreshHeader();
            checkAchievements();
          },
          onError: (err) => { resultEl.innerHTML = `<span style="color:var(--danger);">⚠ ${err}</span>`; AppSounds.wrong(); },
          onEnd: () => btn.classList.remove("listening")
        });
      };
    });
  }

  // ===== LISTENING =====
  function mountListening() {
    const voiceSel = document.getElementById("voice-select");
    const list = AppAudio.listEnglishVoices();
    voiceSel.innerHTML = list.map((v,i) => `<option value="${i}">${v.name} (${v.lang})</option>`).join("") || `<option>${AppI18n.t("Default","افتراضي")}</option>`;
    voiceSel.onchange = () => { const v = list[+voiceSel.value]; if (v) AppAudio.setVoice(v); };
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
    markMission("do-listening");
    AppSounds.correct();
    refreshHeader();
    checkAchievements();
    toast(AppI18n.t(`Listening: ${correct}/${l.questions.length}`, `استماع: ${correct}/${l.questions.length}`), "success");
  }

  // ===== AI CHAT =====
  function mountChat() {
    const input = document.getElementById("chat-input");
    if (!input) return;
    input.focus();
    input.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); sendChat(); } };
    const msgs = document.getElementById("chat-messages");
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function sendChat() {
    const input = document.getElementById("chat-input");
    const msgs = document.getElementById("chat-messages");
    if (!input || !msgs) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    const log = AppAiChat.loadLog();
    log.push({ role: "user", text });
    msgs.insertAdjacentHTML("beforeend", `<div class="chat-msg user">${escHtml(text)}</div>`);
    AppSounds.pop();
    setTimeout(() => {
      const r = AppAiChat.reply(text);
      log.push({ role: "bot", text: r.reply, tips: r.tips });
      AppAiChat.saveLog(log);
      msgs.insertAdjacentHTML("beforeend", `<div class="chat-msg bot">${escHtml(r.reply)}</div>${r.tips && r.tips.length ? `<div class="chat-tips">💡 ${r.tips.map(escHtml).join(" · ")}</div>` : ""}`);
      msgs.scrollTop = msgs.scrollHeight;
      AppSounds.correct();
      AppAudio.speak(r.reply, { rate: 0.95 });
      updateProgress(p => ({ ...p, bonusAiTalked: true }));
      markMission("chat-ai");
      addXP(5);
      checkAchievements();
    }, 400);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function clearChat() {
    if (!confirm(AppI18n.t("Clear chat history?","مسح المحادثة؟"))) return;
    AppAiChat.clear();
    go("ai-chat");
  }

  // ===== CHALLENGE QUIZ =====
  let _chState = null;
  function startChallenge(opts) {
    const questions = opts && opts.questions ? opts.questions : AppChallenges.todaysQuestions();
    _chState = { i: 0, questions, correct: 0, started: Date.now(), timer: null, battleCode: opts && opts.battleCode || null };
    renderChallengeStep();
  }

  function renderChallengeStep() {
    const stage = document.getElementById("challenge-stage");
    const fill = document.getElementById("timer-fill");
    const tt = document.getElementById("timer-text");
    if (!stage || !fill || !tt) return;
    if (_chState.timer) clearInterval(_chState.timer);

    if (_chState.i >= _chState.questions.length) {
      const elapsed = Math.round((Date.now() - _chState.started) / 1000);
      const u = user();
      if (_chState.battleCode) {
        AppBattles.recordResult(_chState.battleCode, {
          name: u.name, type: "quiz", score: _chState.correct,
          total: _chState.questions.length, timeSec: elapsed
        });
      } else {
        AppChallenges.recordScore({ name: u.name, score: _chState.correct, total: _chState.questions.length, timeSec: elapsed });
      }
      updateProgress(p => {
        if (_chState.correct > (p.bestQuiz || 0)) p.bestQuiz = _chState.correct;
        return p;
      });
      addXP(_chState.correct * 6 + 30);
      markMission("do-challenge");
      const perfect = _chState.correct === _chState.questions.length;
      if (perfect) { AppConfetti.fire({ count: 120 }); AppSounds.win(); }
      else if (_chState.correct >= _chState.questions.length * 0.7) { AppConfetti.fire({ count: 60 }); AppSounds.win(); }
      else AppSounds.chime();
      stage.innerHTML = `
        <div style="text-align:center;padding:24px 12px;">
          <h2>🎉 ${AppI18n.t("Challenge complete","انتهى التحدي")}</h2>
          <div style="font-size:46px;font-weight:800;line-height:1;background:linear-gradient(135deg,var(--primary),var(--primary-2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;">${_chState.correct} / ${_chState.questions.length}</div>
          <p style="color:var(--text-dim);margin-top:6px;">${AppI18n.t("Time","الوقت")}: ${elapsed}s</p>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px;">
            ${_chState.battleCode
              ? `<button class="btn btn-primary" onclick="AppApp.copyBattleResult('${_chState.battleCode}')">📤 ${AppI18n.t("Share my result","شارك نتيجتي")}</button>
                 <button class="btn" onclick="AppApp.openBattleRoom('${_chState.battleCode}')">${AppI18n.t("Battle room","غرفة المعركة")}</button>`
              : `<button class="btn btn-primary" onclick="AppApp.shareScore()">📤 ${AppI18n.t("Share my score","شارك نتيجتي")}</button>
                 <button class="btn" onclick="AppApp.go('challenges')">${AppI18n.t("Leaderboard","لوحة الترتيب")}</button>`}
          </div>
        </div>
      `;
      fill.style.width = "0%"; tt.textContent = "✓";
      refreshHeader();
      checkAchievements();
      return;
    }

    const q = _chState.questions[_chState.i];
    const isListen = q.type === "listen";
    stage.innerHTML = `
      <div style="color:var(--text-dim);font-size:13px;">${AppI18n.t("Question","السؤال")} ${_chState.i+1} / ${_chState.questions.length}</div>
      <div class="q-text" style="font-size:17px;margin:10px 0 14px;">${escHtml(q.q)}</div>
      ${isListen ? `<div style="margin-bottom:14px;">
        <button class="btn btn-primary" onclick="AppAudio.speak(${JSON.stringify(q.playText).replace(/"/g,'&quot;')}, {rate:0.95})">🔊 ${AppI18n.t("Play again","شغّل مرة أخرى")}</button>
      </div>` : ""}
      <div class="quiz-options" id="ch-options">
        ${q.options.map((o,j) => `<button class="quiz-option" data-j="${j}">${escHtml(o)}</button>`).join("")}
      </div>
    `;
    if (isListen) setTimeout(() => AppAudio.speak(q.playText, { rate: 0.95 }), 200);
    let remaining = AppChallenges.TIME_PER_Q;
    fill.style.width = "100%"; tt.textContent = remaining + "s";
    _chState.timer = setInterval(() => {
      remaining--;
      fill.style.width = (remaining / AppChallenges.TIME_PER_Q) * 100 + "%";
      tt.textContent = Math.max(0, remaining) + "s";
      if (remaining <= 3 && remaining > 0) AppSounds.tick();
      if (remaining <= 0) { clearInterval(_chState.timer); revealChoice(-1); }
    }, 1000);
    document.querySelectorAll("#ch-options .quiz-option").forEach(btn => {
      btn.onclick = () => revealChoice(+btn.dataset.j);
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
    if (chosen === q.correct) { _chState.correct++; AppSounds.correct(); }
    else AppSounds.wrong();
    clearInterval(_chState.timer);
    AppAudio.stop();
    setTimeout(() => { _chState.i++; renderChallengeStep(); }, 900);
  }

  function copyChallengeLink() {
    copyToClipboard(location.origin + location.pathname);
    toast(AppI18n.t("Invite link copied!","تم نسخ رابط الدعوة!"), "success");
    updateProgress(p => ({ ...p, bonusShared: true }));
    checkAchievements();
  }

  function shareScore() {
    const link = AppChallenges.shareUrlForLastScore();
    if (!link) { toast(AppI18n.t("Play first.","العب أولًا."), "error"); return; }
    copyToClipboard(link);
    toast(AppI18n.t("Score link copied! Send it to friends.","تم نسخ رابط نتيجتك!"), "success");
  }

  function switchLb(btn, kind) {
    document.querySelectorAll(".tab[data-lb]").forEach(t => t.classList.toggle("active", t === btn));
    const c = document.getElementById("lb-container");
    if (c) c.innerHTML = kind === "typing" ? AppViews.renderTypingLb() : AppViews.renderQuizLb();
  }

  // ===== TYPING =====
  function mountTyping(opts) {
    const txt = opts && opts.text ? { text: opts.text, level: "B2" } : AppTyping.todaysText();
    AppTyping.start(txt.text);
    if (opts && opts.battleCode) {
      // Hijack the finish handler to record into battle
      const origFinish = AppTyping;
      AppTyping._battleCode = opts.battleCode;
    }
    const input = document.getElementById("t-input");
    if (input) {
      input.oninput = e => AppTyping.onInput(e.target.value);
      input.onpaste = e => e.preventDefault();
      input.focus();
    }
  }
  function startTyping() {
    const target = document.getElementById("view-challenges");
    target.innerHTML = AppViews.renderTypingRace();
    mountTyping();
  }
  function shareTyping() {
    const link = AppTyping.shareUrlForLastScore();
    if (!link) { toast(AppI18n.t("Finish a typing run first.","أكمل سباق كتابة أولًا."), "error"); return; }
    copyToClipboard(link);
    toast(AppI18n.t("Typing score link copied!","تم نسخ رابط النتيجة!"), "success");
  }

  // ===== BATTLES =====
  function createBattle(type) {
    const u = user();
    const b = AppBattles.create({ type, creatorName: u.name, creatorEmail: u.email });
    toast(AppI18n.t("Battle created! Code: " + b.code, "تم إنشاء المعركة! الكود: " + b.code), "success");
    AppSounds.chime();
    openBattleRoom(b.code);
  }

  function joinBattle() {
    const input = document.getElementById("battle-join-code");
    const code = (input.value || "").trim().toUpperCase();
    if (code.length < 4) { toast(AppI18n.t("Enter a valid code.","ادخل كود صحيح."), "error"); return; }
    let b = AppBattles.get(code);
    if (!b) {
      // Create empty room with this code (assume quiz default)
      b = AppBattles.recordResult(code, { name: "__placeholder__", type: "quiz" });
      // Remove the placeholder
      delete b.players["__placeholder__"];
    }
    openBattleRoom(code);
  }

  function openBattleRoom(code) {
    _currentView = "challenges";
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById("view-challenges");
    target.classList.add("active");
    target.innerHTML = AppViews.renderBattleRoom(code);
    setActiveNav("challenges");
  }

  function copyBattleInvite(code, type) {
    const url = AppBattles.shareInviteUrl(code, type);
    copyToClipboard(url);
    toast(AppI18n.t("Invite link copied! Send to your friend.","تم نسخ الرابط! ارسله لصاحبك."), "success");
    updateProgress(p => ({ ...p, bonusShared: true }));
    checkAchievements();
  }

  function copyBattleResult(code) {
    const b = AppBattles.get(code);
    const me = user().name;
    if (!b || !b.players[me]) { toast(AppI18n.t("Play your turn first.","العب دورك أولًا."), "error"); return; }
    const url = AppBattles.shareResultUrl(code, b.players[me]);
    copyToClipboard(url);
    toast(AppI18n.t("Result link copied! Send to your friend.","تم نسخ رابط نتيجتك!"), "success");
  }

  function playBattle(code, type) {
    const target = document.getElementById("view-challenges");
    if (type === "typing") {
      const txt = AppBattles.typingTextForCode(code);
      target.innerHTML = AppViews.renderTypingRace();
      AppTyping.start(txt.text);
      AppTyping._battleCode = code;
      const input = document.getElementById("t-input");
      if (input) {
        input.oninput = e => AppTyping.onInput(e.target.value);
        input.onpaste = e => e.preventDefault();
        input.focus();
      }
    } else {
      target.innerHTML = AppViews.renderChallengeQuiz();
      startChallenge({ questions: AppBattles.quizQuestionsForCode(code, 20), battleCode: code });
    }
  }

  // Called by typing.js when a run finishes
  function onTypingFinished(result) {
    updateProgress(p => {
      if (result.wpm > (p.bestWpm || 0)) p.bestWpm = result.wpm;
      return p;
    });
    addXP(Math.round(result.wpm / 2) + 10);
    markMission("do-typing");
    if (AppTyping._battleCode) {
      AppBattles.recordResult(AppTyping._battleCode, {
        name: user().name, type: "typing", wpm: result.wpm, acc: result.acc, time: result.time
      });
      // Determine battle outcome and award win
      const rs = AppBattles.rankings(AppTyping._battleCode);
      if (rs.length > 1 && rs[0].name === user().name) {
        updateProgress(p => ({ ...p, battlesWon: (p.battlesWon||0) + 1 }));
      }
    }
    if (result.wpm >= 60) { AppConfetti.fire({ count: 100 }); AppSounds.win(); }
    else AppSounds.chime();
    refreshHeader();
    checkAchievements();
  }

  // ===== HELPERS =====
  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  function addXP(n) {
    const today = new Date().toDateString();
    if (_dailyXpDay !== today) { _dailyXP = 0; _dailyXpDay = today; }
    _dailyXP += n;
    updateProgress(p => ({ ...p, xp: (p.xp || 0) + n }));
    if (_dailyXP >= 100) markMission("earn-100-xp");
  }

  function markMission(eventId) {
    updateProgress(p => {
      const { changed, list } = AppMissions.markIfMatches(p, eventId, _dailyXP);
      if (changed) {
        const day = AppMissions.todayKey();
        p.missions[day] = list;
        const xpFromMissions = list.filter(m => m.done && m._claimedXp == null).reduce((s, m) => {
          m._claimedXp = m.xp;
          return s + m.xp;
        }, 0);
        if (xpFromMissions > 0) p.xp = (p.xp || 0) + xpFromMissions;
        if (!p.bonusFirstMission) p.bonusFirstMission = true;
        if (list.every(m => m.done)) p.bonusAllMissions = true;
        // Defer toast slightly to avoid clobbering other toasts
        setTimeout(() => toast("🎯 " + AppI18n.t("Mission complete!","مهمة منجزة!") + (xpFromMissions ? ` (+${xpFromMissions} XP)` : ""), "success"), 600);
      }
      return p;
    });
  }

  function promoteLevelIfDue() {
    updateProgress(p => {
      const cnt = (lvl) => p.completedLessons.filter(id => {
        const l = AppData.lessons.find(x => x.id === id);
        return l && l.level === lvl;
      }).length;
      const c2 = cnt("C2"), c1 = cnt("C1"), b2 = cnt("B2"), b1 = cnt("B1"), a2 = cnt("A2");
      let newLevel = p.currentLevel;
      if (c2 >= 2) newLevel = "C2";
      else if (c1 >= 2) newLevel = "C1";
      else if (b2 >= 2) newLevel = "B2";
      else if (b1 >= 2) newLevel = "B1";
      else if (a2 >= 2) newLevel = "A2";
      if (newLevel !== p.currentLevel) {
        p.currentLevel = newLevel;
        setTimeout(() => {
          AppSounds.levelUp();
          AppConfetti.fire({ count: 150, duration: 3500 });
          toast(AppI18n.t(`🎉 Level up! You are now ${newLevel}.`, `🎉 ارتقيت! مستواك الحين ${newLevel}.`), "success");
        }, 400);
      }
      return p;
    });
  }

  function refreshStreak() {
    const today = new Date().toDateString();
    updateProgress(p => {
      if (p.lastActiveDay === today) return p;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      p.streak = (p.lastActiveDay === yesterday ? (p.streak || 0) + 1 : 1);
      p.lastActiveDay = today;
      return p;
    });
  }

  function checkAchievements() {
    const p = progress();
    const { newly } = AppAchievements.check(p);
    if (newly.length) {
      updateProgress(prog => {
        const all = new Set(prog.achievements || []);
        newly.forEach(n => all.add(n.id));
        prog.achievements = Array.from(all);
        return prog;
      });
      newly.forEach((n, i) => setTimeout(() => showAchievementPopup(n), i * 1200));
    }
  }

  function showAchievementPopup(def) {
    AppSounds.chime();
    AppConfetti.fire({ count: 50, duration: 2000 });
    const popup = document.createElement("div");
    popup.className = "ach-popup";
    popup.innerHTML = `
      <span class="ach-popup-icon">${def.icon}</span>
      <div class="ach-popup-text">
        <strong>${escHtml(AppI18n.t("Achievement unlocked!","فتحت إنجازًا!"))}</strong>
        ${escHtml(AppI18n.t(def.title, def.titleAr))}
      </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3600);
  }

  let toastTimer = null;
  function toast(msg, kind = "") {
    const el = document.getElementById("toast");
    el.className = "toast " + kind;
    el.textContent = msg;
    el.classList.remove("hidden");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 3200);
  }

  return {
    init, go, user, progress, toast,
    openLesson, submitQuiz,
    openExplanation,
    speak,
    toggleWord, openFlashcards, popWord, closeModal,
    openReading, submitReading,
    openWriting, gradeWriting, readWriting,
    playListening, toggleScript, submitListening,
    sendChat, clearChat,
    startChallenge, copyChallengeLink, shareScore, switchLb,
    startTyping, shareTyping, onTypingFinished,
    createBattle, joinBattle, openBattleRoom, copyBattleInvite, copyBattleResult, playBattle,
    confirmLogout
  };
})();

document.addEventListener("DOMContentLoaded", () => AppApp.init());
