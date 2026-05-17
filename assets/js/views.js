// View renderers.
window.AppViews = (() => {
  const t = (...args) => AppI18n.t(...args);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const escAttr = s => JSON.stringify(String(s)).replace(/"/g, "&quot;");

  // ====== DASHBOARD ======
  function renderDashboard() {
    const u = AppApp.user();
    const p = AppApp.progress();
    const lessonsTotal = AppData.lessons.length;
    const lessonsDone = p.completedLessons.length;
    const vocabKnown = p.knownWords.length;
    const streak = p.streak || 0;
    const xp = p.xp || 0;

    const nextLesson = AppData.lessons.find(l => !p.completedLessons.includes(l.id));

    return `
      <h2 style="margin:0 0 6px;font-size:22px;">${t("Welcome back","أهلًا بعودتك")}, ${esc(u.name)} 👋</h2>
      <p style="color:var(--text-dim);margin:0 0 22px;">${t("Keep going. Small daily reps beat heroic weekly sprints.","استمر. عشر دقايق يوميًا أحسن من ساعات أسبوعيًا.")}</p>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-num">${xp}</div><div class="stat-label">${t("Total XP","نقاط الخبرة")}</div></div>
        <div class="stat-card"><div class="stat-num">${streak}🔥</div><div class="stat-label">${t("Day streak","عداد الأيام")}</div></div>
        <div class="stat-card"><div class="stat-num">${lessonsDone}/${lessonsTotal}</div><div class="stat-label">${t("Lessons done","الدروس المكتملة")}</div></div>
        <div class="stat-card"><div class="stat-num">${vocabKnown}</div><div class="stat-label">${t("Words mastered","كلمات أتقنتها")}</div></div>
        <div class="stat-card"><div class="stat-num">${p.currentLevel || "B1"}</div><div class="stat-label">${t("Current level","المستوى الحالي")}</div></div>
      </div>

      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <strong>${t("Progress to C1","التقدّم نحو C1")}</strong>
          <span style="color:var(--text-dim);font-size:13px;">${Math.round(progressToC1())}%</span>
        </div>
        <div class="progress"><div class="progress-fill" style="width:${progressToC1()}%"></div></div>
        <p style="color:var(--text-dim);font-size:13px;margin:10px 0 0;">
          ${t("Progress = lessons completed + words mastered + challenge points.","التقدّم = الدروس المكتملة + الكلمات المتقنة + نقاط التحديات.")}
        </p>
      </div>

      <div class="section-title"><h2>${t("Continue learning","تابع التعلم")}</h2></div>
      <div class="cards-grid">
        ${nextLesson ? lessonCardHTML(nextLesson, p) : `<div class="empty-state"><div class="ico-big">🏆</div>${t("You completed all lessons. Try a challenge!","أكملت كل الدروس. جرّب التحديات!")}</div>`}
        <div class="lesson-card" onclick="AppApp.go('challenges')">
          <span class="level-badge level-B2">⚔️ ${t("Challenge","تحدي")}</span>
          <h3>${t("Daily Challenges","تحديات اليوم")}</h3>
          <p>${t("20 quiz questions or a speed-typing race. Beat your friends!","20 سؤال أو سباق كتابة سريع. اهزم أصحابك!")}</p>
          <div class="lesson-meta"><span>⏱ ~3 min</span><span>+100 XP</span></div>
        </div>
        <div class="lesson-card" onclick="AppApp.go('explanations')">
          <span class="level-badge level-B2">💡 ${t("Explanations","شروحات")}</span>
          <h3>${t("Bilingual phrases","عبارات ثنائية اللغة")}</h3>
          <p>${t("Daily English phrases with Arabic side-by-side. Quick and useful.","عبارات إنجليزية يومية مع ترجمتها العربية. سريعة ومفيدة.")}</p>
          <div class="lesson-meta"><span>${AppData.explanations.length} ${t("topics","مواضيع")}</span><span>🔊</span></div>
        </div>
        <div class="lesson-card" onclick="AppApp.go('vocabulary')">
          <span class="level-badge level-C1">🔤 ${t("Vocabulary","مفردات")}</span>
          <h3>${t("Flashcards","البطاقات")}</h3>
          <p>${t("Practice B2–C1 words with audio and IPA.","تمرّن على كلمات B2–C1 مع الصوت والنطق.")}</p>
          <div class="lesson-meta"><span>${AppData.vocabulary.length} ${t("words","كلمة")}</span><span>🔊</span></div>
        </div>
      </div>
    `;
  }

  function progressToC1() {
    const p = AppApp.progress();
    const lessonW = (p.completedLessons.length / AppData.lessons.length) * 40;
    const wordW = (p.knownWords.length / AppData.vocabulary.length) * 35;
    const cxp = Math.min((p.xp || 0) / 1500, 1) * 25;
    return Math.min(100, lessonW + wordW + cxp);
  }

  function lessonCardHTML(l, p) {
    const done = p.completedLessons.includes(l.id);
    return `
      <div class="lesson-card ${done ? "done":""}" onclick="AppApp.openLesson('${l.id}')">
        <span class="level-badge level-${l.level}">${l.level}</span>
        <h3>${esc(l.title)}</h3>
        <p>${esc(l.summary)}</p>
        <div class="lesson-meta">
          <span>⏱ ${l.duration} ${t("min","دقيقة")}</span>
          <span>${l.quiz?.length || 0} ${t("questions","سؤال")}</span>
        </div>
      </div>
    `;
  }

  // ====== LESSONS ======
  function renderLessons() {
    const p = AppApp.progress();
    const levels = ["B1", "B2", "C1"];
    let html = `<h2 style="margin:0 0 6px;">${t("All Lessons","كل الدروس")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("A structured path from B1 to C1. Each lesson has explanation, audio examples, and a quiz.","مسار منظم من B1 إلى C1. كل درس فيه شرح، أمثلة بالصوت، واختبار.")}</p>`;
    for (const lvl of levels) {
      const ls = AppData.lessons.filter(l => l.level === lvl);
      if (!ls.length) continue;
      html += `<div class="section-title"><h2>${lvl}</h2><span style="color:var(--text-dim);font-size:13px;">${ls.length} ${t("lessons","درس")}</span></div>`;
      html += `<div class="cards-grid">${ls.map(l => lessonCardHTML(l, p)).join("")}</div>`;
    }
    return html;
  }

  function renderLessonDetail(id) {
    const l = AppData.lessons.find(x => x.id === id);
    if (!l) return `<p>${t("Lesson not found.","الدرس غير موجود.")}</p>`;
    const p = AppApp.progress();
    const done = p.completedLessons.includes(id);

    const sectionsHTML = l.sections.map(s => `
      <div class="lesson-section">
        <h3>
          <span>${esc(s.heading)}</span>
          ${s.body ? `<button class="audio-btn audio-btn-sm" onclick="AppApp.speak(this, ${escAttr(s.body)})">🔊</button>` : ""}
        </h3>
        ${s.body ? `<p>${esc(s.body)}</p>` : ""}
        ${s.translation ? `<p style="color:var(--text-dim);font-size:13px;">${esc(s.translation)}</p>` : ""}
        ${(s.examples || []).map(ex => `
          <div class="example">
            <div class="ex-text">${esc(ex.en)}<span class="ex-translate">${esc(ex.ar || "")}</span></div>
            <button class="audio-btn audio-btn-sm" onclick="AppApp.speak(this, ${escAttr(ex.en)})">🔊</button>
          </div>
        `).join("")}
      </div>
    `).join("");

    const quizHTML = l.quiz && l.quiz.length ? `
      <div class="lesson-section">
        <h3>📝 ${t("Check yourself","اختبر نفسك")}</h3>
        <div id="lesson-quiz" data-id="${l.id}">
          ${l.quiz.map((q, i) => `
            <div class="quiz-question" data-i="${i}">
              <div class="q-text">${i+1}. ${esc(q.q)}</div>
              <div class="quiz-options">
                ${q.options.map((opt, j) => `<button class="quiz-option" data-j="${j}">${esc(opt)}</button>`).join("")}
              </div>
              <div class="q-explain" style="display:none;color:var(--text-dim);font-size:13px;margin-top:8px;"></div>
            </div>
          `).join("")}
        </div>
        <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="AppApp.submitQuiz('${l.id}')">${t("Submit","سلّم")}</button>
          <button class="btn" onclick="AppApp.go('lessons')">${t("Back to lessons","عودة للدروس")}</button>
        </div>
      </div>
    ` : "";

    return `
      <div class="lesson-detail">
        <span class="level-badge level-${l.level}">${l.level}</span>
        ${done ? `<span class="level-badge" style="background:rgba(52,211,153,.18);color:var(--success);margin-inline-start:8px;">✓ ${t("Completed","مكتمل")}</span>` : ""}
        <h1>${esc(l.title)}</h1>
        <p class="lead">${esc(l.summary)}</p>
        <button class="btn btn-ghost" onclick="AppApp.go('lessons')">← ${t("All lessons","كل الدروس")}</button>
        ${sectionsHTML}
        ${quizHTML}
      </div>
    `;
  }

  // ====== EXPLANATIONS ======
  function renderExplanations() {
    return `
      <h2 style="margin:0 0 6px;">${t("Bilingual Explanations","شروحات ثنائية اللغة")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Real-life English phrases with Arabic side-by-side. Tap any phrase to hear it.","عبارات إنجليزية واقعية مع ترجمتها العربية. اضغط أي عبارة لتسمعها.")}</p>
      <div class="cards-grid">
        ${AppData.explanations.map(ex => `
          <div class="lesson-card" onclick="AppApp.openExplanation('${ex.id}')">
            <div style="font-size:30px;">${ex.icon}</div>
            <span class="level-badge level-${ex.level}">${ex.level}</span>
            <h3>${esc(ex.title)}</h3>
            <p style="color:var(--text-dim);font-size:13px;font-family:'Cairo';">${esc(ex.titleAr)}</p>
            <div class="lesson-meta"><span>${ex.items.length} ${t("phrases","عبارات")}</span><span>🔊</span></div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderExplanationDetail(id) {
    const ex = AppData.explanations.find(x => x.id === id);
    if (!ex) return "";
    return `
      <button class="btn btn-ghost" onclick="AppApp.go('explanations')">← ${t("Back","عودة")}</button>
      <div style="display:flex;align-items:center;gap:14px;margin:14px 0 6px;">
        <span style="font-size:42px;">${ex.icon}</span>
        <div>
          <h2 style="margin:0;">${esc(ex.title)}</h2>
          <p style="margin:2px 0 0;color:var(--text-dim);font-family:'Cairo';">${esc(ex.titleAr)}</p>
        </div>
      </div>
      <div class="exp-card">
        ${ex.items.map(item => `
          <div class="exp-item">
            <div class="exp-row">
              <button class="audio-btn" onclick="AppApp.speak(this, ${escAttr(item.en)})">🔊</button>
              <div style="flex:1;min-width:0;">
                <div class="exp-en">${esc(item.en)}</div>
                <div class="exp-ar">${esc(item.ar)}</div>
                ${item.note ? `<div class="exp-note">💡 ${esc(item.note)}</div>` : ""}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // ====== VOCABULARY ======
  function renderVocabulary() {
    const p = AppApp.progress();
    const total = AppData.vocabulary.length;
    return `
      <h2 style="margin:0 0 6px;">${t("Vocabulary","المفردات")}</h2>
      <p style="color:var(--text-dim);margin:0 0 16px;">${t("Tap a word to hear it. Mark words you've mastered.","اضغط أي كلمة لتسمعها. علّم الكلمات التي أتقنتها.")}</p>

      <div class="vocab-toolbar">
        <div class="form-row" style="margin:0;">
          <input id="vocab-search" placeholder="${t('Search a word...','ابحث عن كلمة...')}" />
        </div>
        <div class="form-row" style="margin:0;">
          <select id="vocab-level">
            <option value="">${t("All levels","كل المستويات")}</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="AppApp.openFlashcards()">🎴 ${t("Flashcards","البطاقات")}</button>
      </div>

      <div style="margin:6px 0 14px;color:var(--text-dim);font-size:13px;">
        ${p.knownWords.length} / ${total} ${t("mastered","أتقنتها")}
      </div>
      <div id="vocab-grid" class="cards-grid"></div>
    `;
  }

  function vocabCardHTML(w, known) {
    return `
      <div class="vocab-card">
        <div class="word-head">
          <div style="min-width:0;flex:1;">
            <div class="word">${esc(w.word)}</div>
            <div class="pos">${esc(w.pos)} · <span class="level-badge level-${w.level}" style="padding:1px 6px;">${w.level}</span></div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button class="audio-btn audio-btn-sm" onclick="AppApp.speak(this, ${escAttr(w.word)})">🔊</button>
            <button class="ghost-btn" style="width:32px;height:32px;" title="${t('Mark mastered','أتقنتها')}" onclick="AppApp.toggleWord('${esc(w.word)}')">${known ? "✓" : "+"}</button>
          </div>
        </div>
        <div class="ipa">${esc(w.ipa)}</div>
        <div class="def">${esc(w.def)}</div>
        <div class="def-ar">${esc(w.defAr || "")}</div>
        <div class="ex">
          <span><em>${esc(w.ex)}</em></span>
          <button class="audio-btn audio-btn-sm" onclick="AppApp.speak(this, ${escAttr(w.ex)})">🔊</button>
        </div>
      </div>
    `;
  }

  function renderVocabGrid(filter = "", level = "") {
    const p = AppApp.progress();
    const f = filter.toLowerCase().trim();
    const list = AppData.vocabulary.filter(w =>
      (!level || w.level === level) &&
      (!f || w.word.toLowerCase().includes(f) || (w.def || "").toLowerCase().includes(f))
    );
    if (!list.length) return `<div class="empty-state">${t("No words match.","لا توجد كلمات مطابقة.")}</div>`;
    return list.map(w => vocabCardHTML(w, p.knownWords.includes(w.word))).join("");
  }

  // ====== READING ======
  function renderReading() {
    return `
      <h2 style="margin:0 0 6px;">${t("Reading","القراءة")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Tap any word for a quick definition. Answer the comprehension quiz at the end.","اضغط أي كلمة لمعرفة معناها. جاوب على أسئلة الفهم في النهاية.")}</p>
      <div class="cards-grid">
        ${AppData.readings.map(r => `
          <div class="lesson-card" onclick="AppApp.openReading('${r.id}')">
            <span class="level-badge level-${r.level}">${r.level}</span>
            <h3>${esc(r.title)}</h3>
            <p>${esc(r.text.slice(0, 120))}…</p>
            <div class="lesson-meta"><span>⏱ ${r.minutes} ${t("min","دقيقة")}</span><span>${r.questions.length} ${t("questions","أسئلة")}</span></div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderReadingDetail(id) {
    const r = AppData.readings.find(x => x.id === id);
    if (!r) return "";
    const paragraphs = r.text.split(/\n\s*\n/).map(p => {
      const html = p.split(/(\s+)/).map(token => {
        if (/^\s+$/.test(token)) return token;
        const clean = token.replace(/[^\w'-]/g, "");
        if (!clean) return esc(token);
        return `<span class="word-pop" onclick="AppApp.popWord(event, '${esc(clean)}')">${esc(token)}</span>`;
      }).join("");
      return `<p>${html}</p>`;
    }).join("");

    return `
      <button class="btn btn-ghost" onclick="AppApp.go('reading')">← ${t("Back","عودة")}</button>
      <div class="reading-passage">
        <h2>
          <span>${esc(r.title)}</span>
          <button class="audio-btn audio-btn-sm" onclick="AppApp.speak(this, ${escAttr(r.text)})">🔊</button>
        </h2>
        ${paragraphs}
      </div>
      <div class="card">
        <h3>${t("Comprehension","الفهم")}</h3>
        <div id="reading-quiz" data-id="${r.id}">
          ${r.questions.map((q,i) => `
            <div class="quiz-question" data-i="${i}">
              <div class="q-text">${i+1}. ${esc(q.q)}</div>
              <div class="quiz-options">
                ${q.options.map((o,j) => `<button class="quiz-option" data-j="${j}">${esc(o)}</button>`).join("")}
              </div>
              <div class="q-explain" style="display:none;color:var(--text-dim);font-size:13px;margin-top:8px;"></div>
            </div>
          `).join("")}
        </div>
        <button class="btn btn-primary" style="margin-top:12px;" onclick="AppApp.submitReading('${r.id}')">${t("Submit","سلّم")}</button>
      </div>
    `;
  }

  // ====== WRITING ======
  function renderWriting() {
    return `
      <h2 style="margin:0 0 6px;">${t("Writing","الكتابة")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Pick a prompt, write, then get instant feedback on length, range, and structure.","اختر موضوعًا، اكتب إجابتك، وستحصل على تقييم فوري للطول والثراء والتنظيم.")}</p>
      <div class="cards-grid">
        ${AppData.writingPrompts.map(p => `
          <div class="lesson-card" onclick="AppApp.openWriting('${p.id}')">
            <span class="level-badge level-${p.level}">${p.level}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.prompt.slice(0,140))}…</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderWritingDetail(id) {
    const p = AppData.writingPrompts.find(x => x.id === id);
    if (!p) return "";
    return `
      <button class="btn btn-ghost" onclick="AppApp.go('writing')">← ${t("Back","عودة")}</button>
      <h2 style="margin:8px 0 6px;">${esc(p.title)} <span class="level-badge level-${p.level}">${p.level}</span></h2>
      <div class="card"><p style="line-height:1.7;margin:0;">${esc(p.prompt)}</p></div>
      <div class="card writing-area">
        <div class="form-row">
          <label>${t("Your answer","إجابتك")}</label>
          <textarea id="writing-input" placeholder="${t('Start writing here...','ابدأ الكتابة هنا...')}"></textarea>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="AppApp.gradeWriting('${p.id}')">${t("Get feedback","احصل على تقييم")}</button>
          <button class="btn" onclick="AppApp.readWriting()">🔊 ${t("Read aloud","اقرأ بصوت")}</button>
        </div>
        <div id="writing-feedback"></div>
      </div>
    `;
  }

  // ====== PRONUNCIATION ======
  function renderPronunciation() {
    const supported = AppAudio.isRecognitionSupported();
    return `
      <h2 style="margin:0 0 6px;">${t("Pronunciation","النطق")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">
        ${t("Listen, repeat, get a similarity score. Best on Chrome (desktop or Android).","استمع، كرر، واحصل على نسبة تطابق. الأفضل استخدام Chrome.")}
      </p>
      ${!supported ? `<div class="card" style="border-color:var(--warn);"><strong>⚠️ ${t("Speech recognition unsupported in this browser.","التعرّف على الصوت غير مدعوم في هذا المتصفح.")}</strong> ${t("You can still listen and practise.","لا تزال تقدر تستمع وتتمرّن.")}</div>` : ""}
      <div class="cards-grid">
        ${AppData.pronunciation.map(p => `
          <div class="pron-target">
            <span class="level-badge level-${p.level}">${p.level}</span>
            <div class="target-text">${esc(p.text)}</div>
            <div style="color:var(--text-dim);font-size:13px;">${t("Focus","التركيز")}: ${esc(p.focus)}</div>
            <button class="btn btn-ghost" style="margin:8px 4px;" onclick="AppApp.speak(this, ${escAttr(p.text)})">🔊 ${t("Hear","استمع")}</button>
            <button class="btn btn-primary mic-trigger" style="margin:8px 4px;" data-text="${esc(p.text)}">🎤 ${t("Speak","تكلّم")}</button>
            <div class="pron-result" style="display:none;"></div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // ====== LISTENING ======
  function renderListening() {
    return `
      <h2 style="margin:0 0 6px;">${t("Listening","الاستماع")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Press play, listen carefully, then answer. Change the voice and speed if you want.","اضغط تشغيل، استمع بتركيز، ثم أجب. تقدر تغيّر الصوت والسرعة.")}</p>
      <div class="card" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">
        <span style="color:var(--text-dim);font-size:13px;">${t("Voice","الصوت")}</span>
        <select id="voice-select" style="padding:8px 12px;background:var(--panel-2);border:1px solid var(--border);color:var(--text);border-radius:8px;"></select>
        <span style="color:var(--text-dim);font-size:13px;">${t("Speed","السرعة")}</span>
        <select id="rate-select" style="padding:8px 12px;background:var(--panel-2);border:1px solid var(--border);color:var(--text);border-radius:8px;">
          <option value="0.75">0.75x</option>
          <option value="0.9">0.9x</option>
          <option value="1" selected>1x</option>
          <option value="1.15">1.15x</option>
        </select>
      </div>
      <div id="listening-list">
        ${AppData.listening.map(l => `
          <div class="listening-card">
            <span class="level-badge level-${l.level}">${l.level}</span>
            <h3 style="margin:6px 0;">${esc(l.title)}</h3>
            <div class="listening-controls">
              <button class="btn btn-primary" onclick="AppApp.playListening('${l.id}')">▶ ${t("Play","تشغيل")}</button>
              <button class="btn" onclick="AppAudio.stop()">⏹ ${t("Stop","إيقاف")}</button>
              <button class="btn btn-ghost" onclick="AppApp.toggleScript('${l.id}', this)">${t("Show script","إظهار النص")}</button>
            </div>
            <div id="script-${l.id}" style="display:none;font-style:italic;color:var(--text-dim);line-height:1.7;margin:10px 0;">${esc(l.script)}</div>
            <div data-listening="${l.id}">
              ${l.questions.map((q,i) => `
                <div class="quiz-question" data-i="${i}">
                  <div class="q-text">${i+1}. ${esc(q.q)}</div>
                  <div class="quiz-options">${q.options.map((o,j)=>`<button class="quiz-option" data-j="${j}">${esc(o)}</button>`).join("")}</div>
                </div>
              `).join("")}
            </div>
            <button class="btn btn-primary" style="margin-top:10px;" onclick="AppApp.submitListening('${l.id}')">${t("Submit","سلّم")}</button>
          </div>
        `).join("")}
      </div>
    `;
  }

  // ====== CHALLENGES — picker ======
  function renderChallenges() {
    return `
      <h2 style="margin:0 0 6px;">${t("Challenges","التحديات")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Pick a challenge type. Same questions/text every day — share the link, compete, and compare scores.","اختر نوع التحدي. نفس الأسئلة/النص يوميًا — شارك الرابط، نافس، وقارن النتائج.")}</p>

      <div class="challenge-pick">
        <div class="pick-card" onclick="AppApp.go('challenges', {sub:'quiz'})">
          <div class="pick-icon">🎯</div>
          <h3>${t("Quiz Challenge","تحدي الأسئلة")}</h3>
          <p>${t("20 timed multiple-choice questions: grammar, vocab, listening, and more.","20 سؤال موقّت متنوع: قواعد، مفردات، استماع، وغيرها.")}</p>
          <div class="pick-meta">⏱ ~5 ${t("min","دقايق")} · 20 ${t("questions","سؤال")}</div>
          <button class="btn btn-primary" style="margin-top:8px;">${t("Start","ابدأ")}</button>
        </div>
        <div class="pick-card" onclick="AppApp.go('challenges', {sub:'typing'})">
          <div class="pick-icon">⌨️</div>
          <h3>${t("Typing Race","سباق الكتابة")}</h3>
          <p>${t("60-second speed typing test. Highest WPM wins. Just like MonkeyType.","اختبار كتابة سريعة في 60 ثانية. الأسرع يفوز. مثل MonkeyType.")}</p>
          <div class="pick-meta">⏱ 60s · WPM + ${t("accuracy","دقة")}</div>
          <button class="btn btn-primary" style="margin-top:8px;">${t("Start","ابدأ")}</button>
        </div>
      </div>

      <div class="section-title">
        <h2>🏆 ${t("Today's Leaderboards","لوحات صدارة اليوم")}</h2>
        <button class="btn btn-ghost" onclick="AppApp.copyChallengeLink()">🔗 ${t("Invite friends","ادعُ أصحابك")}</button>
      </div>

      <div class="tabs">
        <button class="tab active" data-lb="quiz" onclick="AppApp.switchLb(this, 'quiz')">🎯 ${t("Quiz","الأسئلة")}</button>
        <button class="tab" data-lb="typing" onclick="AppApp.switchLb(this, 'typing')">⌨️ ${t("Typing","الكتابة")}</button>
      </div>
      <div id="lb-container">${renderQuizLb()}</div>

      <div class="card" style="line-height:1.8;margin-top:16px;">
        <strong>📖 ${t("How friends compete","كيف تتنافسون")}</strong>
        <ol style="margin:8px 0 0;padding-inline-start:18px;">
          <li>${t("Share the site link with friends.","شارك رابط الموقع مع أصحابك.")}</li>
          <li>${t("Each one opens it and picks a name.","كل واحد يفتحه ويختار اسمه.")}</li>
          <li>${t("Everyone plays today's challenges (same content for fairness).","كلكم تلعبون تحديات اليوم — نفس المحتوى للعدل.")}</li>
          <li>${t("After your run, tap 'Share my score' to send your result to the group.","بعد ما تنتهي، اضغط 'شارك نتيجتي' وأرسل النتيجة للمجموعة.")}</li>
        </ol>
      </div>
    `;
  }

  function renderQuizLb() {
    const lb = AppChallenges.leaderboard();
    if (!lb.length) return `<div class="empty-state">${t("No quiz scores today. Be the first.","لا توجد نتائج لتحدي اليوم. كن الأول.")}</div>`;
    return `<div class="leaderboard">${lb.map((row,i) => `
      <div class="lb-row ${row.you ? 'you':''}">
        <div class="rank rank-${i+1}">${i+1}</div>
        <div>
          <div class="name">${esc(row.name)} ${row.you ? `<span style="color:var(--primary);font-size:11px;">(${t("you","أنت")})</span>` : ""}</div>
          <div class="when">${esc(row.date || "")}</div>
        </div>
        <div class="score">${row.score}/${row.total} · ${row.timeSec}s</div>
      </div>
    `).join("")}</div>`;
  }

  function renderTypingLb() {
    const lb = AppTyping.leaderboard();
    if (!lb.length) return `<div class="empty-state">${t("No typing scores today. Be the first.","لا توجد نتائج لسباق الكتابة اليوم. كن الأول.")}</div>`;
    return `<div class="leaderboard">${lb.map((row,i) => `
      <div class="lb-row ${row.you ? 'you':''}">
        <div class="rank rank-${i+1}">${i+1}</div>
        <div>
          <div class="name">${esc(row.name)} ${row.you ? `<span style="color:var(--primary);font-size:11px;">(${t("you","أنت")})</span>` : ""}</div>
          <div class="when">${esc(row.date || "")}</div>
        </div>
        <div class="score">${row.wpm} WPM · ${row.acc}%</div>
      </div>
    `).join("")}</div>`;
  }

  function renderChallengeQuiz() {
    return `
      <button class="btn btn-ghost" onclick="AppApp.go('challenges')">← ${t("Back","عودة")}</button>
      <div class="challenge-quiz" id="challenge-quiz" style="margin-top:12px;">
        <div class="timer">
          <span>⏱</span>
          <div class="timer-bar"><div class="timer-bar-fill" id="timer-fill"></div></div>
          <span class="timer-text" id="timer-text">--</span>
        </div>
        <div id="challenge-stage"></div>
      </div>
    `;
  }

  function renderTypingRace() {
    const txt = AppTyping.todaysText();
    return `
      <button class="btn btn-ghost" onclick="AppApp.go('challenges')">← ${t("Back","عودة")}</button>
      <h2 style="margin:12px 0 6px;">⌨️ ${t("Typing Race","سباق الكتابة")} <span class="level-badge level-${txt.level}">${txt.level}</span></h2>
      <p style="color:var(--text-dim);margin:0 0 14px;font-size:13px;">${t("Start typing to begin the timer. You have 60 seconds.","ابدأ الكتابة عشان يشتغل الموقت. عندك 60 ثانية.")}</p>
      <div id="typing-stage">
        <div class="typing-stats">
          <div class="stat"><div class="stat-v" id="t-time">${AppTyping.DURATION}s</div><div class="stat-l">${t("Time","الوقت")}</div></div>
          <div class="stat"><div class="stat-v" id="t-wpm">0</div><div class="stat-l">WPM</div></div>
          <div class="stat"><div class="stat-v" id="t-acc">100%</div><div class="stat-l">${t("Accuracy","الدقة")}</div></div>
          <div class="stat"><div class="stat-v" id="t-chars">0/${txt.text.length}</div><div class="stat-l">${t("Chars","الحروف")}</div></div>
        </div>
        <div class="typing-display" id="t-display"></div>
        <input type="text" class="typing-input" id="t-input"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
               placeholder="${t('Type here…','اكتب هنا…')}" />
        <div class="typing-actions">
          <button class="btn" onclick="AppApp.startTyping()">🔄 ${t("Restart","إعادة")}</button>
          <button class="btn btn-ghost" onclick="AppApp.go('challenges')">${t("Cancel","إلغاء")}</button>
        </div>
      </div>
    `;
  }

  return {
    renderDashboard,
    renderLessons, renderLessonDetail,
    renderExplanations, renderExplanationDetail,
    renderVocabulary, vocabCardHTML, renderVocabGrid,
    renderReading, renderReadingDetail,
    renderWriting, renderWritingDetail,
    renderPronunciation,
    renderListening,
    renderChallenges, renderChallengeQuiz, renderTypingRace,
    renderQuizLb, renderTypingLb,
    progressToC1
  };
})();
