// All view renderers
window.AppViews = (() => {
  const t = (...args) => AppI18n.t(...args);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const escAttr = s => JSON.stringify(String(s)).replace(/"/g, "&quot;");

  // ===== DASHBOARD =====
  function renderDashboard() {
    const u = AppApp.user();
    const p = AppApp.progress();
    const missions = AppMissions.ensureFresh(p);
    const lessonsTotal = AppData.lessons.length;

    return `
      <h2 style="margin:0 0 6px;font-size:22px;">${t("Welcome back","أهلًا بعودتك")}, ${esc(u.name)} 👋</h2>
      <p style="color:var(--text-dim);margin:0 0 22px;">${t("Small daily reps beat heroic weekly sprints. Let's go.","عشر دقايق يوميًا أحسن من ساعات أسبوعيًا. يلا نبدأ.")}</p>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-num">${p.xp || 0}</div><div class="stat-label">${t("Total XP","نقاط الخبرة")}</div></div>
        <div class="stat-card"><div class="stat-num">${p.streak || 0}🔥</div><div class="stat-label">${t("Day streak","الأيام المتتالية")}</div></div>
        <div class="stat-card"><div class="stat-num">${(p.completedLessons || []).length}/${lessonsTotal}</div><div class="stat-label">${t("Lessons","الدروس")}</div></div>
        <div class="stat-card"><div class="stat-num">${(p.knownWords || []).length}</div><div class="stat-label">${t("Words","الكلمات")}</div></div>
        <div class="stat-card"><div class="stat-num">${p.currentLevel || "B1"}</div><div class="stat-label">${t("Level","المستوى")}</div></div>
        <div class="stat-card"><div class="stat-num">${(p.achievements || []).length}</div><div class="stat-label">${t("Badges","الشارات")}</div></div>
      </div>

      <div class="section-title">
        <h2>🎯 ${t("Today's Missions","مهام اليوم")}</h2>
        <span style="color:var(--text-dim);font-size:13px;">${missions.filter(m=>m.done).length}/${missions.length} ${t("done","مكتمل")}</span>
      </div>
      <div class="missions-list">
        ${missions.map(m => `
          <div class="mission-row ${m.done?"done":""}">
            <div class="mission-icon">${m.done ? "✓" : m.icon}</div>
            <div class="mission-text">
              <div class="mission-title">${esc(t(m.title, m.titleAr))}</div>
              <div class="mission-xp">+${m.xp} XP</div>
            </div>
            <div class="mission-status">${m.done?"✅":"⏳"}</div>
          </div>
        `).join("")}
      </div>

      <div class="card" style="margin-top:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <strong>${t("Progress to C1","الطريق إلى C1")}</strong>
          <span style="color:var(--text-dim);font-size:13px;">${Math.round(progressToC1())}%</span>
        </div>
        <div class="progress"><div class="progress-fill" style="width:${progressToC1()}%"></div></div>
      </div>

      <div class="section-title"><h2>⚡ ${t("Quick start","ابدأ بسرعة")}</h2></div>
      <div class="cards-grid">
        <div class="lesson-card" onclick="AppApp.go('challenges')">
          <div style="font-size:30px;">⚔️</div>
          <h3>${t("Challenges","التحديات")}</h3>
          <p>${t("Quiz, typing race, or battle a friend.","أسئلة، سباق كتابة، أو معركة مع صاحبك.")}</p>
        </div>
        <div class="lesson-card" onclick="AppApp.go('ai-chat')">
          <div style="font-size:30px;">🤖</div>
          <h3>${t("AI Coach","مدرّب AI")}</h3>
          <p>${t("Chat in English with an AI coach. Get tips as you go.","تكلم إنجليزي مع مدرّب يصحّح لك ويرشدك.")}</p>
        </div>
        <div class="lesson-card" onclick="AppApp.go('lessons')">
          <div style="font-size:30px;">📚</div>
          <h3>${t("Lessons","الدروس")}</h3>
          <p>${t("Structured path: A1 → C2.","مسار منظم من A1 إلى C2.")}</p>
        </div>
        <div class="lesson-card" onclick="AppApp.go('explanations')">
          <div style="font-size:30px;">💡</div>
          <h3>${t("Explanations","شروحات")}</h3>
          <p>${t("Bilingual phrase packs with audio.","عبارات ثنائية اللغة مع الصوت.")}</p>
        </div>
      </div>
    `;
  }

  function progressToC1() {
    const p = AppApp.progress();
    const lessonW = ((p.completedLessons||[]).length / AppData.lessons.length) * 40;
    const wordW = ((p.knownWords||[]).length / AppData.vocabulary.length) * 30;
    const cxp = Math.min((p.xp || 0) / 2000, 1) * 30;
    return Math.min(100, lessonW + wordW + cxp);
  }

  // ===== LESSONS =====
  function lessonCardHTML(l, p) {
    const done = (p.completedLessons || []).includes(l.id);
    return `
      <div class="lesson-card ${done?"done":""}" onclick="AppApp.openLesson('${l.id}')">
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

  function renderLessons() {
    const p = AppApp.progress();
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    let html = `<h2 style="margin:0 0 6px;">${t("All Lessons","كل الدروس")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Structured path from A1 to C2. Each lesson has explanation, audio examples, and a quiz.","مسار منظم من A1 إلى C2. كل درس فيه شرح، أمثلة بالصوت، واختبار.")}</p>`;
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
    const done = (p.completedLessons || []).includes(id);

    const sectionsHTML = l.sections.map(s => `
      <div class="lesson-section">
        <h3><span>${esc(s.heading)}</span>${s.body ? `<button class="audio-btn audio-btn-sm" onclick="AppApp.speak(this, ${escAttr(s.body)})">🔊</button>` : ""}</h3>
        ${s.body ? `<p>${esc(s.body)}</p>` : ""}
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
          <button class="btn" onclick="AppApp.go('lessons')">${t("Back","عودة")}</button>
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

  // ===== EXPLANATIONS =====
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

  // ===== VOCAB =====
  function renderVocabulary() {
    const p = AppApp.progress();
    return `
      <h2 style="margin:0 0 6px;">${t("Vocabulary","المفردات")}</h2>
      <p style="color:var(--text-dim);margin:0 0 16px;">${t("Tap a word to hear it. Mark words you've mastered.","اضغط أي كلمة لتسمعها. علّم الكلمات التي أتقنتها.")}</p>
      <div class="vocab-toolbar">
        <div class="form-row" style="margin:0;"><input id="vocab-search" placeholder="${t('Search...','ابحث...')}" /></div>
        <div class="form-row" style="margin:0;">
          <select id="vocab-level">
            <option value="">${t("All levels","كل المستويات")}</option>
            <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option>
            <option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="AppApp.openFlashcards()">🎴 ${t("Flashcards","البطاقات")}</button>
      </div>
      <div style="margin:6px 0 14px;color:var(--text-dim);font-size:13px;">
        ${(p.knownWords||[]).length} / ${AppData.vocabulary.length} ${t("mastered","أتقنتها")}
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
            <button class="ghost-btn" style="width:32px;height:32px;" onclick="AppApp.toggleWord('${esc(w.word)}')">${known ? "✓" : "+"}</button>
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
    if (!list.length) return `<div class="empty-state">${t("No words match.","لا توجد نتائج.")}</div>`;
    return list.map(w => vocabCardHTML(w, (p.knownWords||[]).includes(w.word))).join("");
  }

  // ===== READING =====
  function renderReading() {
    return `
      <h2 style="margin:0 0 6px;">${t("Reading","القراءة")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Tap any word for a quick definition. Answer comprehension questions at the end.","اضغط أي كلمة لمعرفة معناها. جاوب على أسئلة الفهم في النهاية.")}</p>
      <div class="cards-grid">
        ${AppData.readings.map(r => `
          <div class="lesson-card" onclick="AppApp.openReading('${r.id}')">
            <span class="level-badge level-${r.level}">${r.level}</span>
            <h3>${esc(r.title)}</h3>
            <p>${esc(r.text.slice(0, 120))}…</p>
            <div class="lesson-meta"><span>⏱ ${r.minutes} ${t("min","دقيقة")}</span><span>${r.questions.length} ${t("questions","سؤال")}</span></div>
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
        <h2><span>${esc(r.title)}</span><button class="audio-btn audio-btn-sm" onclick="AppApp.speak(this, ${escAttr(r.text)})">🔊</button></h2>
        ${paragraphs}
      </div>
      <div class="card">
        <h3>${t("Comprehension","الفهم")}</h3>
        <div id="reading-quiz" data-id="${r.id}">
          ${r.questions.map((q,i) => `
            <div class="quiz-question" data-i="${i}">
              <div class="q-text">${i+1}. ${esc(q.q)}</div>
              <div class="quiz-options">${q.options.map((o,j) => `<button class="quiz-option" data-j="${j}">${esc(o)}</button>`).join("")}</div>
            </div>
          `).join("")}
        </div>
        <button class="btn btn-primary" style="margin-top:12px;" onclick="AppApp.submitReading('${r.id}')">${t("Submit","سلّم")}</button>
      </div>
    `;
  }

  // ===== WRITING =====
  function renderWriting() {
    return `
      <h2 style="margin:0 0 6px;">${t("Writing","الكتابة")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Pick a prompt, write, then get instant feedback.","اختر موضوعًا، اكتب، وستحصل على تقييم فوري.")}</p>
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

  // ===== PRONUNCIATION =====
  function renderPronunciation() {
    const supported = AppAudio.isRecognitionSupported();
    return `
      <h2 style="margin:0 0 6px;">${t("Pronunciation","النطق")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Listen, repeat, get a similarity score.","استمع، كرر، واحصل على نسبة تطابق.")}</p>
      ${!supported ? `<div class="card" style="border-color:var(--warn);"><strong>⚠️ ${t("Speech recognition needs Chrome (desktop or Android).","التعرف على الصوت يحتاج Chrome.")}</strong></div>` : ""}
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

  // ===== LISTENING =====
  function renderListening() {
    return `
      <h2 style="margin:0 0 6px;">${t("Listening","الاستماع")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Press play, listen, then answer. Change voice or speed if you want.","اضغط تشغيل، استمع، ثم أجب. غيّر الصوت أو السرعة لو حبيت.")}</p>
      <div class="card" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">
        <span style="color:var(--text-dim);font-size:13px;">${t("Voice","الصوت")}</span>
        <select id="voice-select" style="padding:8px 12px;background:var(--panel-2);border:1px solid var(--border);color:var(--text);border-radius:8px;"></select>
        <span style="color:var(--text-dim);font-size:13px;">${t("Speed","السرعة")}</span>
        <select id="rate-select" style="padding:8px 12px;background:var(--panel-2);border:1px solid var(--border);color:var(--text);border-radius:8px;">
          <option value="0.75">0.75x</option><option value="0.9">0.9x</option>
          <option value="1" selected>1x</option><option value="1.15">1.15x</option>
        </select>
      </div>
      <div>
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

  // ===== AI CHAT =====
  function renderAiChat() {
    const log = AppAiChat.loadLog();
    return `
      <h2 style="margin:0 0 6px;">${t("AI English Coach","مدرّب الإنجليزي")} 🤖</h2>
      <p style="color:var(--text-dim);margin:0 0 14px;">${t("Practice your English. The coach replies in English and gives you tips.","تمرّن إنجليزي. المدرّب يرد بالإنجليزي ويعطيك نصائح.")}</p>
      <div class="chat-container">
        <div id="chat-messages" class="chat-messages">
          ${log.length === 0 ? `
            <div class="chat-msg bot">${t("Hi! I'm your English coach. Type a message in English and let's start. 👋","أهلًا! أنا مدرّبك للإنجليزي. اكتب لي رسالة بالإنجليزي ونبدأ. 👋")}</div>
          ` : log.map(m => `
            <div class="chat-msg ${m.role}">${esc(m.text)}</div>
            ${m.tips && m.tips.length ? `<div class="chat-tips">💡 ${m.tips.map(esc).join(" · ")}</div>` : ""}
          `).join("")}
        </div>
        <div class="chat-input-row">
          <input id="chat-input" placeholder="${t('Type in English...','اكتب بالإنجليزي...')}" autocomplete="off" />
          <button onclick="AppApp.sendChat()">${t("Send","أرسل")}</button>
        </div>
      </div>
      <div style="margin-top:10px;display:flex;gap:8px;">
        <button class="btn btn-ghost" onclick="AppApp.clearChat()">🗑 ${t("Clear chat","مسح المحادثة")}</button>
      </div>
    `;
  }

  // ===== CHALLENGES =====
  function renderChallenges() {
    return `
      <h2 style="margin:0 0 6px;">${t("Challenges","التحديات")}</h2>
      <p style="color:var(--text-dim);margin:0 0 18px;">${t("Three modes: solo quiz, typing race, or a 1v1 battle with friends.","ثلاثة أوضاع: تحدّي فردي، سباق كتابة، أو معركة مع صاحبك.")}</p>

      <div class="challenge-pick">
        <div class="pick-card" onclick="AppApp.go('challenges', {sub:'quiz'})">
          <div class="pick-icon">🎯</div>
          <h3>${t("Daily Quiz","تحدي اليوم")}</h3>
          <p>${t("20 timed questions: grammar, vocab, listening, and more.","20 سؤال موقّت متنوع: قواعد، مفردات، استماع.")}</p>
          <div class="pick-meta">⏱ ~5 ${t("min","دقايق")} · 20 ${t("questions","سؤال")}</div>
          <button class="btn btn-primary" style="margin-top:8px;">${t("Start","ابدأ")}</button>
        </div>
        <div class="pick-card" onclick="AppApp.go('challenges', {sub:'typing'})">
          <div class="pick-icon">⌨️</div>
          <h3>${t("Typing Race","سباق الكتابة")}</h3>
          <p>${t("60-second speed-typing test. Highest WPM wins.","اختبار كتابة سريعة في 60 ثانية. الأسرع يفوز.")}</p>
          <div class="pick-meta">⏱ 60s · WPM + ${t("accuracy","دقة")}</div>
          <button class="btn btn-primary" style="margin-top:8px;">${t("Start","ابدأ")}</button>
        </div>
        <div class="pick-card" onclick="AppApp.go('challenges', {sub:'battle'})">
          <div class="pick-icon">⚔️</div>
          <h3>${t("Battle a Friend","عارك صاحبك")}</h3>
          <p>${t("Create a code, share it, both play the same questions, compare scores.","سوّ كود، شاركه، تلعبون نفس الأسئلة، وتقارنون النتائج.")}</p>
          <div class="pick-meta">🔗 ${t("Multi-player","متعدّد اللاعبين")}</div>
          <button class="btn btn-primary" style="margin-top:8px;">${t("Open","افتح")}</button>
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
    `;
  }

  function renderQuizLb() {
    const lb = AppChallenges.leaderboard();
    if (!lb.length) return `<div class="empty-state">${t("No quiz scores today. Be the first.","لا توجد نتائج اليوم. كن الأول.")}</div>`;
    return `<div class="leaderboard">${lb.map((row,i) => `
      <div class="lb-row ${row.you ? 'you':''}">
        <div class="rank rank-${i+1}">${i+1}</div>
        <div><div class="name">${esc(row.name)} ${row.you ? `<span style="color:var(--primary);font-size:11px;">(${t("you","أنت")})</span>` : ""}</div></div>
        <div class="score">${row.score}/${row.total} · ${row.timeSec}s</div>
      </div>
    `).join("")}</div>`;
  }

  function renderTypingLb() {
    const lb = AppTyping.leaderboard();
    if (!lb.length) return `<div class="empty-state">${t("No typing scores today. Be the first.","لا توجد نتائج اليوم. كن الأول.")}</div>`;
    return `<div class="leaderboard">${lb.map((row,i) => `
      <div class="lb-row ${row.you ? 'you':''}">
        <div class="rank rank-${i+1}">${i+1}</div>
        <div><div class="name">${esc(row.name)} ${row.you ? `<span style="color:var(--primary);font-size:11px;">(${t("you","أنت")})</span>` : ""}</div></div>
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
      <p style="color:var(--text-dim);margin:0 0 14px;font-size:13px;">${t("Start typing to begin the timer. 60 seconds.","ابدأ الكتابة عشان يشتغل الموقت. 60 ثانية.")}</p>
      <div id="typing-stage">
        <div class="typing-stats">
          <div class="stat"><div class="stat-v" id="t-time">${AppTyping.DURATION}s</div><div class="stat-l">${t("Time","الوقت")}</div></div>
          <div class="stat"><div class="stat-v" id="t-wpm">0</div><div class="stat-l">WPM</div></div>
          <div class="stat"><div class="stat-v" id="t-acc">100%</div><div class="stat-l">${t("Accuracy","الدقة")}</div></div>
          <div class="stat"><div class="stat-v" id="t-chars">0/${txt.text.length}</div><div class="stat-l">${t("Chars","الحروف")}</div></div>
        </div>
        <div class="typing-display" id="t-display"></div>
        <input type="text" class="typing-input" id="t-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${t('Type here…','اكتب هنا…')}" />
        <div class="typing-actions">
          <button class="btn" onclick="AppApp.startTyping()">🔄 ${t("Restart","إعادة")}</button>
          <button class="btn btn-ghost" onclick="AppApp.go('challenges')">${t("Cancel","إلغاء")}</button>
        </div>
      </div>
    `;
  }

  // ===== BATTLES =====
  function renderBattles() {
    const recent = AppBattles.recentBattles(5);
    return `
      <button class="btn btn-ghost" onclick="AppApp.go('challenges')">← ${t("Back","عودة")}</button>
      <h2 style="margin:12px 0 6px;">⚔️ ${t("Battle a Friend","عارك صاحبك")}</h2>
      <p style="color:var(--text-dim);margin:0 0 14px;font-size:13px;">${t("Create a battle, share the code, both play same questions, compare scores.","سوّ معركة، شارك الكود، تلعبون نفس الأسئلة، تقارنون النتائج.")}</p>

      <div class="challenge-pick">
        <div class="pick-card">
          <div class="pick-icon">🆕</div>
          <h3>${t("Create new battle","معركة جديدة")}</h3>
          <p>${t("Pick a type and get a 6-letter code to share.","اختر النوع وراح يطلع لك كود من 6 حروف.")}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
            <button class="btn btn-primary" onclick="AppApp.createBattle('quiz')">🎯 ${t("Quiz","أسئلة")}</button>
            <button class="btn btn-primary" onclick="AppApp.createBattle('typing')">⌨️ ${t("Typing","كتابة")}</button>
          </div>
        </div>
        <div class="pick-card">
          <div class="pick-icon">🔑</div>
          <h3>${t("Join with code","ادخل بالكود")}</h3>
          <p>${t("Got a code from a friend? Enter it here.","عندك كود من صاحبك؟ ادخله هنا.")}</p>
          <div class="battle-join-form">
            <input id="battle-join-code" placeholder="XXXXXX" maxlength="6" />
            <button class="btn btn-primary" onclick="AppApp.joinBattle()">${t("Join","ادخل")}</button>
          </div>
        </div>
      </div>

      ${recent.length ? `
      <div class="section-title"><h2>${t("Recent battles","المعارك الأخيرة")}</h2></div>
      <div class="cards-grid">
        ${recent.map(b => {
          const rs = AppBattles.rankings(b.code);
          return `
            <div class="lesson-card" onclick="AppApp.openBattleRoom('${b.code}')">
              <span class="level-badge level-${b.type === 'typing' ? 'C1' : 'B2'}">${b.type === 'typing' ? '⌨️ Typing' : '🎯 Quiz'}</span>
              <h3>${t("Code","كود")}: ${esc(b.code)}</h3>
              <p>${Object.keys(b.players).length} ${t("players","لاعبين")}</p>
              ${rs[0] ? `<div class="lesson-meta"><span>🥇 ${esc(rs[0].name)}</span></div>` : ""}
            </div>
          `;
        }).join("")}
      </div>` : ""}
    `;
  }

  function renderBattleRoom(code) {
    const b = AppBattles.get(code);
    if (!b) return `<button class="btn btn-ghost" onclick="AppApp.go('challenges')">← ${t("Back","عودة")}</button><div class="empty-state">${t("Battle not found.","المعركة غير موجودة.")}</div>`;
    const me = AppApp.user().name;
    const rankings = AppBattles.rankings(code);
    const myResult = b.players[me];

    return `
      <button class="btn btn-ghost" onclick="AppApp.go('challenges')">← ${t("Back","عودة")}</button>
      <div class="battle-room" style="margin-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
          <div>
            <h3>${b.type === 'typing' ? '⌨️ Typing Battle' : '🎯 Quiz Battle'}</h3>
            <div style="color:var(--text-dim);font-size:13px;">${t("Battle code","كود المعركة")}</div>
          </div>
          <div class="battle-code">${esc(b.code)}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
          ${!myResult ? `<button class="btn btn-primary" onclick="AppApp.playBattle('${b.code}', '${b.type}')">▶ ${t("Play my turn","العب دوري")}</button>` : ""}
          <button class="btn" onclick="AppApp.copyBattleInvite('${b.code}', '${b.type}')">🔗 ${t("Copy invite link","انسخ رابط الدعوة")}</button>
          ${myResult ? `<button class="btn" onclick="AppApp.copyBattleResult('${b.code}')">📤 ${t("Share my result","شارك نتيجتي")}</button>` : ""}
        </div>

        <div class="battle-players">
          <strong style="font-size:14px;">${t("Players & scores","اللاعبون والنتائج")}:</strong>
          ${rankings.length ? rankings.map((p, i) => `
            <div class="lb-row ${p.name === me ? 'you' : ''}">
              <div class="rank rank-${i+1}">${i+1}</div>
              <div><div class="name">${esc(p.name)} ${p.name === me ? `<span style="color:var(--primary);font-size:11px;">(${t("you","أنت")})</span>` : ""}</div></div>
              <div class="score">${b.type === 'typing' ? `${p.wpm} WPM · ${p.acc}%` : `${p.score}/${p.total} · ${p.timeSec}s`}</div>
            </div>
          `).join("") : `<div class="empty-state" style="padding:16px;">${t("No results yet. Be the first!","لا توجد نتائج بعد. كن الأول!")}</div>`}
        </div>

        <div style="margin-top:18px;padding:14px;background:var(--panel-2);border-radius:var(--radius-sm);font-size:13px;line-height:1.7;color:var(--text-dim);">
          <strong>📖 ${t("How it works","كيف تشتغل")}:</strong><br>
          1. ${t("Share the invite link with your friend.","شارك رابط الدعوة مع صاحبك.")}<br>
          2. ${t("They click it → they're in your battle room.","يضغط الرابط → يدخل في غرفة المعركة.")}<br>
          3. ${t("Each player runs their turn (same questions).","كل واحد يخوض دوره (نفس الأسئلة).")}<br>
          4. ${t("After playing, copy your 'result link' and send back.","بعد ما تخلص، انسخ رابط نتيجتك وأرسله.")}<br>
          5. ${t("Click their link → their score appears here too.","اضغط رابطهم → نتيجتهم تظهر هنا.")}
        </div>
      </div>
    `;
  }

  // ===== ACHIEVEMENTS =====
  function renderAchievements() {
    const earned = new Set((AppApp.progress().achievements) || []);
    return `
      <h2 style="margin:0 0 6px;">🏆 ${t("Achievements","الإنجازات")}</h2>
      <p style="color:var(--text-dim);margin:0 0 14px;">${earned.size} / ${AppAchievements.DEFS.length} ${t("unlocked","مفتوحة")}</p>
      <div class="ach-grid">
        ${AppAchievements.DEFS.map(d => `
          <div class="ach-card ${earned.has(d.id)?"earned":"locked"}">
            <span class="ach-icon">${d.icon}</span>
            <div class="ach-title">${esc(t(d.title, d.titleAr))}</div>
            <div class="ach-desc">${esc(t(d.desc, d.descAr))}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // ===== PROFILE =====
  function renderProfile() {
    const u = AppApp.user();
    const p = AppApp.progress();
    const accounts = AppAuth.listAccountsForLeaderboard().sort((a,b) => b.xp - a.xp);

    return `
      <h2 style="margin:0 0 6px;">👤 ${t("Profile","الملف الشخصي")}</h2>
      <div class="profile-hero">
        <div class="avatar avatar-lg">${esc(u.name[0].toUpperCase())}</div>
        <div class="info">
          <h2>${esc(u.name)}</h2>
          <div class="email">${esc(u.email)}</div>
          <span class="level-pill">${p.currentLevel || "B1"}</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-num">${p.xp || 0}</div><div class="stat-label">${t("Total XP","نقاط الخبرة")}</div></div>
        <div class="stat-card"><div class="stat-num">${p.streak || 0}🔥</div><div class="stat-label">${t("Streak","المتواصلة")}</div></div>
        <div class="stat-card"><div class="stat-num">${(p.completedLessons||[]).length}</div><div class="stat-label">${t("Lessons","الدروس")}</div></div>
        <div class="stat-card"><div class="stat-num">${(p.knownWords||[]).length}</div><div class="stat-label">${t("Words","الكلمات")}</div></div>
        <div class="stat-card"><div class="stat-num">${p.bestWpm || 0}</div><div class="stat-label">${t("Best WPM","أفضل سرعة")}</div></div>
        <div class="stat-card"><div class="stat-num">${p.bestQuiz || 0}</div><div class="stat-label">${t("Best quiz","أفضل تحدي")}</div></div>
        <div class="stat-card"><div class="stat-num">${(p.achievements||[]).length}</div><div class="stat-label">${t("Badges","الشارات")}</div></div>
        <div class="stat-card"><div class="stat-num">${p.battlesWon || 0}</div><div class="stat-label">${t("Battles won","معارك مكسوبة")}</div></div>
      </div>

      ${accounts.length > 1 ? `
        <div class="section-title"><h2>🌍 ${t("Local leaderboard","لوحة الجهاز")}</h2></div>
        <div class="leaderboard">
          ${accounts.slice(0,10).map((a,i) => `
            <div class="lb-row ${a.email === u.email ? 'you' : ''}">
              <div class="rank rank-${i+1}">${i+1}</div>
              <div><div class="name">${esc(a.name)} ${a.email === u.email ? `<span style="color:var(--primary);font-size:11px;">(${t("you","أنت")})</span>` : ""}</div><div class="when">${a.level} · ${a.streak}🔥</div></div>
              <div class="score">${a.xp} XP</div>
            </div>
          `).join("")}
        </div>
      ` : ""}

      <div class="section-title"><h2>🏆 ${t("Recent achievements","آخر الإنجازات")}</h2></div>
      ${(p.achievements || []).length ? `
        <div class="ach-grid">
          ${(p.achievements||[]).slice(-8).reverse().map(id => {
            const d = AppAchievements.find(id);
            return d ? `<div class="ach-card earned"><span class="ach-icon">${d.icon}</span><div class="ach-title">${esc(t(d.title, d.titleAr))}</div></div>` : "";
          }).join("")}
        </div>
        <button class="btn btn-ghost" style="margin-top:12px;" onclick="AppApp.go('achievements')">${t("See all achievements","شف كل الإنجازات")} →</button>
      ` : `<div class="empty-state">${t("No achievements yet. Keep going!","لا توجد إنجازات بعد. واصل!")}</div>`}

      <div class="section-title"><h2>⚙️ ${t("Account","الحساب")}</h2></div>
      <div class="card">
        <button class="btn btn-danger" onclick="AppApp.confirmLogout()">${t("Log out","تسجيل خروج")}</button>
      </div>
    `;
  }

  return {
    renderDashboard, progressToC1,
    renderLessons, renderLessonDetail,
    renderExplanations, renderExplanationDetail,
    renderVocabulary, vocabCardHTML, renderVocabGrid,
    renderReading, renderReadingDetail,
    renderWriting, renderWritingDetail,
    renderPronunciation, renderListening,
    renderAiChat,
    renderChallenges, renderChallengeQuiz, renderTypingRace,
    renderQuizLb, renderTypingLb,
    renderBattles, renderBattleRoom,
    renderAchievements, renderProfile
  };
})();
